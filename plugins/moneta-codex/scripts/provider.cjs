'use strict';
const { redact } = require('./redact.cjs');
const providers = new Set(['gh', 'glab']);
const hostPattern = /^(?=.{1,253}$)[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?(?::[0-9]{1,5})?$/;

function runtimeUnsafe(env) { return ['NODE_DEBUG','NODE_DEBUG_NATIVE','NODE_OPTIONS'].some(key => Boolean(env[key])); }
function cleanEnv(env) {
  const clean = {...env};
  for (const key of Object.keys(clean)) if (/^(?:NODE_DEBUG|NODE_DEBUG_NATIVE|NODE_OPTIONS|GH_DEBUG|GLAB_DEBUG|DEBUG|GIT_TRACE.*|GIT_CURL_VERBOSE)$/i.test(key)) delete clean[key];
  clean.NO_COLOR = '1';
  return clean;
}
function collect(command, args, options = {}) {
  const env = options.env || process.env;
  if (runtimeUnsafe(process.env) || runtimeUnsafe(env)) return {failure:'unsafe-runtime'};
  try {
    const {spawnSync} = require('node:child_process');
    const result = spawnSync(command,args,{shell:false,windowsHide:true,stdio:['ignore','pipe','pipe'],env:cleanEnv(env),cwd:options.cwd,timeout:options.timeout || 20000,maxBuffer:options.maxBuffer || 1024*1024});
    if (result.error) return {failure:result.error.code === 'ETIMEDOUT' ? 'timeout' : result.error.code === 'ENOBUFS' ? 'output-limit' : 'process-unavailable'};
    if (result.signal || result.status === null) return {failure:'process-interrupted'};
    return result;
  } catch { return {failure:'process-unavailable'}; }
}
function classify(stderr) {
  if (/socket|connectex|ENETUNREACH|ECONNREFUSED|ENOTFOUND|EAI_AGAIN|could not resolve|dial tcp|timed? out|TLS|certificate|proxy connect/i.test(stderr)) return 'network-blocked';
  if (/HTTP\s*401\b|\b401 Unauthorized\b/i.test(stderr)) return 'credentials-rejected';
  if (/HTTP\s*403\b|\b403 Forbidden\b/i.test(stderr)) return 'access-denied';
  if (/not logged|no credentials|please run.*auth login|authenticate.*auth login/i.test(stderr)) return 'login-required';
  return 'provider-error';
}
function inspectAccount(result, provider, env = process.env) {
  if (result.failure) return {status:result.failure,exitCode:null};
  if (result.status !== 0) return {status:classify(String(result.stderr || '')),exitCode:result.status};
  try {
    const data = JSON.parse(String(result.stdout));
    const account = provider === 'gh' ? data.login : data.username;
    const valid = provider === 'gh' ? /^[A-Za-z0-9][A-Za-z0-9-]{0,38}$/ : /^[A-Za-z0-9][A-Za-z0-9_.-]{0,254}$/;
    if (typeof account !== 'string' || !valid.test(account) || redact(account,env) !== account) return {status:'invalid-account-response',exitCode:0};
    return {status:'authenticated',account,exitCode:0};
  } catch { return {status:'invalid-account-response',exitCode:0}; }
}
function runFiltered(command,args,options={}) {
  const result = collect(command,args,options);
  if (result.failure) return {status:result.failure,exitCode:null};
  try {
    return {status:result.status === 0 ? 'completed' : classify(String(result.stderr || '')),exitCode:result.status,stdout:redact(String(result.stdout || ''),options.env || process.env),stderr:redact(String(result.stderr || ''),options.env || process.env)};
  } catch { return {status:'output-withheld',exitCode:result.status}; }
}
function allowedCommand(args) {
  if (!['repo','pr','mr','api'].includes(args[0])) return false;
  if (args.some(arg => /(?:token|secret|password|credential|private.key)|^--(?:debug|verbose|include|with-token|show-token|insecure-storage)$/i.test(arg))) return false;
  if (args.some(arg => redact(arg) !== arg)) return false;
  return true;
}
function main(args) {
  const [mode,provider,...rest] = args;
  if (!providers.has(provider)) return {status:'invalid-provider',exitCode:null};
  if (mode === 'probe') {
    if (rest.length !== 1 || !hostPattern.test(rest[0])) return {status:'invalid-host',exitCode:null};
    return inspectAccount(collect(provider,['api','user','--hostname',rest[0]]),provider);
  }
  if (mode === 'run') {
    if (!allowedCommand(rest)) return {status:'command-blocked',exitCode:null};
    // Arbitrary API output has no safe field contract. Account calls use probe only.
    if (rest[0] === 'api') return {status:'use-probe-mode',exitCode:null};
    return runFiltered(provider,rest);
  }
  if (mode === 'login') {
    if (rest.length !== 1 || !hostPattern.test(rest[0])) return {status:'invalid-host',exitCode:null};
    if (process.platform !== 'win32') return {status:'interactive-terminal-required',exitCode:null};
    // Output goes to a separate user-visible console, never to this captured tool call.
    const script = `$p = Start-Process -FilePath '${provider}' -ArgumentList @('auth','login','--hostname','${rest[0]}','--web') -WindowStyle Normal -PassThru; $p.Id`;
    const result = collect('powershell.exe',['-NoProfile','-NonInteractive','-Command',script]);
    if (result.failure) return {status:result.failure,exitCode:null};
    const pid = String(result.stdout || '').trim();
    if (result.status !== 0 || !/^[1-9][0-9]{0,9}$/.test(pid)) return {status:'login-launch-failed',exitCode:result.status};
    return {status:'login-started',processId:Number(pid),exitCode:0};
  }
  return {status:'invalid-mode',exitCode:null};
}
if (require.main === module) {
  try {
    const result = main(process.argv.slice(2));
    process.stdout.write(JSON.stringify(result)+'\n');
    process.exitCode = ['authenticated','completed','login-started'].includes(result.status) ? 0 : 1;
  } catch { process.stdout.write('{"status":"output-withheld","exitCode":null}\n'); process.exitCode = 1; }
}
module.exports = {runFiltered,inspectAccount,main};
