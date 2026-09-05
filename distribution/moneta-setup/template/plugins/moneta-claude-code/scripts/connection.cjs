'use strict';
const fs = require('node:fs');
const path = require('node:path');

// Local configuration only. Never enumerate a group, contact a server, or read a graph.
function readSmall(file) {
  const stat = fs.statSync(file);
  if (!stat.isFile() || stat.size > 65536) throw new Error('invalid-config');
  return fs.readFileSync(file, 'utf8');
}
function namespace(value) {
  return typeof value === 'string' && value.length <= 2048 && value.split('/').every(part => /^[A-Za-z0-9_][A-Za-z0-9_.-]*$/.test(part) && !['.','..'].includes(part));
}
function host(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?(?::[0-9]{1,5})?$/.test(value)) return null;
  const [name,port] = value.toLowerCase().split(':');
  if (name.length > 253 || name.split('.').some(label => !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label))) return null;
  if (port && (+port < 1 || +port > 65535)) return null;
  return name + (port ? `:${+port}` : '');
}
function repository(value, allowCredentials = false) {
  if (typeof value !== 'string' || value.length > 4096 || /[\s\\?#%]/.test(value)) return null;
  let authority, location;
  if (/^(https?|ssh):\/\//.test(value)) {
    const raw = /^(https?|ssh):\/\/([^/]+)\/(.+)$/.exec(value);
    if (!raw) return null;
    let url;
    try { url = new URL(value); } catch { return null; }
    if ((!allowCredentials && url.password) || (!allowCredentials && url.username && (url.protocol !== 'ssh:' || url.username !== 'git'))) return null;
    authority = host(url.host);
    // Parse the raw path so URL normalization cannot turn dot segments into a match.
    location = raw[3];
  } else {
    const scp = /^git@([^:]+):(.+)$/.exec(value);
    if (!scp) return null;
    authority = host(scp[1]);
    location = scp[2];
  }
  location = location.replace(/\.git$/, '');
  if (!authority || !namespace(location) || !location.includes('/')) return null;
  return { host:authority, namespace:location };
}
function sameRepository(a,b) { return Boolean(a && b && a.host === b.host && a.namespace === b.namespace); }
function availability(value) {
  return value.availability || (Array.isArray(value.targets) && value.targets.length ? 'restricted' : 'global');
}
function validProfile(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  if (Object.keys(value).some(key => !['$schema','repository-url','hosting','base-branch','targets','availability'].includes(key))) return false;
  if ('$schema' in value && typeof value.$schema !== 'string') return false;
  if (!repository(value['repository-url']) || !['auto','github','gitlab'].includes(value.hosting)) return false;
  if (typeof value['base-branch'] !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_./-]{0,254}$/.test(value['base-branch']) || /\.\.|\/\/|\/$|\.$|\.lock(?:\/|$)/.test(value['base-branch'])) return false;
  if ('availability' in value && !['global','restricted'].includes(value.availability)) return false;
  const targets = value.targets === undefined ? [] : value.targets;
  if (!Array.isArray(targets) || targets.length > 100) return false;
  if (availability(value) === 'restricted' ? !targets.length : targets.length > 0) return false;
  return targets.every(target => {
    if (!target || typeof target !== 'object' || Array.isArray(target)) return false;
    if (target.kind === 'organization') return Object.keys(target).every(key => ['kind','host','namespace'].includes(key)) && Boolean(host(target.host)) && namespace(target.namespace);
    return target.kind === 'repository' && Object.keys(target).every(key => ['kind','url'].includes(key)) && Boolean(repository(target.url));
  });
}
function origin(directory) {
  // Refuse before loading child_process: Node debug can print spawn environments.
  if (Object.keys(process.env).some(key => /^(NODE_DEBUG|NODE_DEBUG_NATIVE|NODE_OPTIONS)$/i.test(key) && process.env[key])) return null;
  const env = {...process.env};
  for (const key of Object.keys(env)) if (/^(?:GIT_.*|NODE_DEBUG|NODE_DEBUG_NATIVE|NODE_OPTIONS|GH_DEBUG|GLAB_DEBUG|DEBUG)$/i.test(key)) delete env[key];
  try {
    const {spawnSync} = require('node:child_process');
    const result = spawnSync('git', ['-c', `safe.directory=${directory.replaceAll('\\','/')}`, 'config', '--local', '--no-includes', '--null', '--get-all', 'remote.origin.url'], {cwd:directory,env,shell:false,windowsHide:true,stdio:['ignore','pipe','pipe'],timeout:1500,maxBuffer:16384});
    if (result.error || result.signal || result.status !== 0) return null;
    const values = String(result.stdout).split('\0');
    if (values.length !== 2 || values[1] !== '') return null;
    return repository(values[0],true);
  } catch { return null; }
}
function locate(cwd) {
  let directory = path.resolve(cwd), legacy;
  for (let depth = 0; depth < 128; depth++) {
    const candidate = path.join(directory,'.moneta.md');
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return {legacy:candidate};
    if (fs.existsSync(path.join(directory,'.git'))) return {directory,legacy};
    const parent = path.dirname(directory);
    if (parent === directory) return {legacy};
    directory = parent;
  }
  return {legacy};
}
function legacyRepository(file) {
  const raw = readSmall(file);
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(raw);
  if (!frontmatter || /(?:^|\n)\s*<<\s*:/.test(frontmatter[1])) return null;
  const fields = frontmatter[1].split(/\r?\n/).filter(line => /^(?:repository-url|["']repository-url["'])\s*:/.test(line));
  if (fields.length !== 1 || !/^repository-url:/.test(fields[0])) return null;
  let value = fields[0].slice('repository-url:'.length).trim();
  if (/^"[^"]*"$|^'[^']*'$/.test(value)) value = value.slice(1,-1);
  return repository(value);
}
function resolveConnection(cwd, root) {
  try {
    const local = locate(cwd);
    const profilePath = path.join(root,'moneta.json');
    if (!fs.existsSync(profilePath)) return local.legacy ? {path:local.legacy,skillPrefix:''} : null;
    const profile = JSON.parse(readSmall(profilePath));
    if (!validProfile(profile)) return null;
    // Bundled template profiles are inert until personalized by init.
    if (/\.invalid(?::\d+)?$/.test(repository(profile['repository-url']).host)) return null;
    const names = ['.codex-plugin','.claude-plugin'].map(folder => path.join(root,folder,'plugin.json')).filter(file => fs.existsSync(file)).map(file => JSON.parse(readSmall(file)).name);
    if (!names.length || names.some(name => typeof name !== 'string' || !/^[a-z][a-z0-9-]{0,63}$/.test(name) || name !== names[0])) return null;
    const skillPrefix = `${names[0]}:`;
    if (local.legacy) {
      if (!sameRepository(legacyRepository(local.legacy),repository(profile['repository-url']))) return null;
      return {path:local.legacy,profilePath,skillPrefix};
    }
    if (availability(profile) === 'global') return {path:profilePath,profilePath,skillPrefix,availability:'global'};
    if (!local.directory) return null;
    const remote = origin(local.directory);
    if (!remote) return null;
    const target = profile.targets.find(item => item.kind === 'organization'
      ? host(item.host) === remote.host && remote.namespace.startsWith(`${item.namespace}/`)
      : sameRepository(repository(item.url),remote));
    if (!target) return null;
    return {path:profilePath,profilePath,target,skillPrefix,repositoryRoot:local.directory};
  } catch { return null; }
}
module.exports = {resolveConnection, repository, validProfile, origin};
if (require.main === module) {
  try {
    const cwd = process.argv[2];
    const connection = process.argv.length === 3 && typeof cwd === 'string' && path.isAbsolute(cwd) ? resolveConnection(cwd,path.resolve(__dirname,'..')) : null;
    const result = connection ? {status:'matched',...connection} : {status:'unmatched'};
    const {redact} = require('./redact.cjs');
    process.stdout.write(redact(JSON.stringify(result),process.env,{localPaths:[connection?.path,connection?.profilePath,connection?.repositoryRoot]})+'\n');
  } catch { process.stdout.write('{"status":"unmatched"}\n'); }
}
