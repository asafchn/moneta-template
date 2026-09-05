// Authoring source. site/build-viewer.mjs bundles YAML and redaction for the skill.
if (Object.keys(process.env).some(key => /^(NODE_DEBUG|NODE_DEBUG_NATIVE|NODE_OPTIONS)$/i.test(key) && process.env[key])) {
  if (require.main === module) {
    process.stderr.write('Moneta viewer requires a Node runtime without debug or preload options.\n');
    process.exit(1);
  }
  throw new Error('Moneta viewer requires a Node runtime without debug or preload options.');
}
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { execFile } = require('node:child_process');
const YAML = require('yaml');
const { redact } = require('../native/shared/scripts/redact.cjs');
const { sync } = require('../native/shared/scripts/sync.cjs');

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function inside(root, target) {
  const real = fs.realpathSync(target);
  const relative = path.relative(root, real);
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Path outside selected area.');
  return real;
}
function boundedRead(root, relative) {
  const target = inside(root, path.join(root, relative));
  const stat = fs.statSync(target);
  if (!stat.isFile() || stat.size > 1024 * 1024) throw new Error('Graph file is unavailable or exceeds the 1 MiB viewer limit.');
  return fs.readFileSync(target, 'utf8').replace(/^\uFEFF/, '');
}
function object(value) { return value && typeof value === 'object' && !Array.isArray(value); }
function readGraph(area) {
  const root = fs.realpathSync(area);
  const types = JSON.parse(boundedRead(root, 'schemas/node-types.json')).types;
  const catalog = JSON.parse(boundedRead(root, 'schemas/edge-types.json')).edges;
  if (!object(types) || !object(catalog)) throw new Error('Invalid graph catalogs.');
  const nodes = [], edges = [], warnings = new Set(), byId = new Map();
  for (const [type, definition] of Object.entries(types)) {
    if (!slugPattern.test(definition.directory)) throw new Error('Type directory must be a direct area-local folder.');
    const expected = path.join(root, definition.directory);
    if (!fs.existsSync(expected)) continue; // Empty type folders may not be tracked by Git.
    const directory = inside(root, expected);
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (!entry.name.endsWith('.md')) continue;
      if (!entry.isFile()) throw new Error('Linked or non-file graph node rejected.');
      if (nodes.length >= 2000) throw new Error('The local viewer supports up to 2000 nodes per area. Narrow the area before viewing.');
      const text = boundedRead(root, path.join(definition.directory, entry.name));
      const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/.exec(text);
      if (!match) throw new Error('A node has invalid Markdown frontmatter.');
      const document = YAML.parseDocument(match[1], { uniqueKeys: true });
      if (document.errors.length || document.warnings.length) throw new Error('A node has invalid or unsupported YAML frontmatter.');
      const data = document.toJS({ maxAliasCount: 0 });
      if (!object(data) || !slugPattern.test(data.slug) || data.slug !== path.basename(entry.name, '.md') || data['node-type'] !== type || typeof data.description !== 'string' || !match[2].trim()) throw new Error('A node identity, description, type or body is invalid.');
      if (byId.has(data.slug)) throw new Error('Duplicate node slug in selected area.');
      let related = data.related;
      if (Array.isArray(data.relations) && related === undefined) {
        warnings.add('Legacy relations format shown read-only. Use extend for a reviewed migration to related.');
        related = Object.create(null);
        for (const edge of data.relations) {
          if (!object(edge) || typeof edge.type !== 'string') throw new Error('Invalid legacy edge.');
          (related[`[[${edge.type}]]`] ||= []).push(edge.target);
        }
      }
      if (!object(related)) throw new Error('A node needs a related mapping.');
      const node = { id: data.slug, type, description: data.description, body: match[2].trim() };
      nodes.push(node); byId.set(node.id, node);
      for (const [key, value] of Object.entries(related)) {
        const edgeName = /^\[\[([a-z0-9]+(?:-[a-z0-9]+)*)\]\]$/.exec(key)?.[1];
        const edge = edgeName && Object.hasOwn(catalog, edgeName) ? catalog[edgeName] : null;
        if (!edge || typeof edge.inverse !== 'string' || typeof edge.description !== 'string') throw new Error('An edge key has no registered meaning.');
        const targets = Array.isArray(value) ? value : [value];
        if (!targets.length || new Set(targets).size !== targets.length) throw new Error('Empty or duplicate edge targets.');
        for (const target of targets) {
          if (typeof target !== 'string' || !slugPattern.test(target)) throw new Error('Invalid area-local edge target.');
          edges.push({ from: node.id, to: target, type: edgeName, inverse: edge.inverse, description: edge.description });
        }
      }
    }
  }
  const edgeKeys = new Set(edges.map(e => `${e.from}\0${e.type}\0${e.to}`));
  for (const edge of edges) {
    const target = byId.get(edge.to), source = byId.get(edge.from), definition = catalog[edge.type];
    if (!target) throw new Error('An edge target is missing from the selected area.');
    if (!definition['source-types']?.includes(source.type) || !definition['target-types']?.includes(target.type)) throw new Error('An edge has incompatible endpoint types.');
    if (!edgeKeys.has(`${edge.to}\0${edge.inverse}\0${edge.from}`)) warnings.add('Some edges lack a matching inverse. Display is not a graph-validation pass.');
    if (edge.type === 'related-to') warnings.add('Legacy related-to edges lack a specific meaning. Review them before migrating.');
  }
  const clean = value => typeof value === 'string' ? redact(value) : Array.isArray(value) ? value.map(clean) : object(value) ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clean(item)])) : value;
  const result = clean({ scope: path.basename(root), nodes, edges, warnings: [...warnings], loadedAt: new Date().toISOString() });
  if (new Set(result.nodes.map(n => n.id)).size !== result.nodes.length) throw new Error('Redaction obscures distinct node identities; inspect the selected files privately.');
  return result;
}

function createViewer(area, assets, beforeRead = () => ({status:'current'})) {
  // Resolve the sole permitted area once; production supplies a reviewed-clone freshness check.
  const root = fs.realpathSync(area), staticRoot = fs.realpathSync(assets);
  const server = http.createServer((request, response) => {
    const origin = `http://127.0.0.1:${server.address().port}`;
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
    if (request.headers.host !== origin.slice(7) || request.headers.origin && request.headers.origin !== origin || request.headers['sec-fetch-site'] === 'cross-site') {
      response.writeHead(403); response.end('Local viewer access only.'); return;
    }
    if (request.method !== 'GET') { response.writeHead(405); response.end('Read only.'); return; }
    let url;
    try { url = new URL(request.url, origin); }
    catch { response.writeHead(400); response.end('Invalid request.'); return; }
    if (url.pathname === '/health') { response.setHeader('Content-Type', 'application/json'); response.end('{"ok":true}'); return; }
    if (url.pathname === '/graph.json') {
      response.setHeader('Content-Type', 'application/json');
      try {
        if (!['current','pulled'].includes(beforeRead().status)) throw new Error('Freshness unavailable');
      } catch { response.writeHead(409); response.end('{"error":"Memory refresh is blocked. Check the local checkout and connection before retrying."}'); return; }
      try { response.end(JSON.stringify(readGraph(root))); }
      catch { response.writeHead(422); response.end('{"error":"Unable to read selected graph. Check local schemas, node frontmatter, target paths and viewer limits."}'); }
      return;
    }
    try {
      const relative = url.pathname === '/' ? 'graph.html' : decodeURIComponent(url.pathname).slice(1);
      if (!(relative === 'graph.html' || relative === 'favicon.svg' || /^assets\/[a-zA-Z0-9_.-]+$/.test(relative))) throw new Error('Not a viewer asset.');
      const file = inside(staticRoot, path.join(staticRoot, relative));
      const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.woff':'font/woff' };
      response.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
      response.end(fs.readFileSync(file));
    } catch { response.writeHead(404); response.end('Not found.'); }
  });
  return server;
}

function main() {
  const args = process.argv.slice(2), areaAt = args.indexOf('--area');
  if (areaAt < 0 || !args[areaAt + 1] || !path.isAbsolute(args[areaAt + 1])) throw new Error('Provide --area with an absolute selected-area path.');
  const area = args[areaAt + 1];
  const checkout = args[args.indexOf('--checkout') + 1], stateFile = args[args.indexOf('--config') + 1];
  if (!args.includes('--checkout') || !args.includes('--config') || !path.isAbsolute(checkout) || !path.isAbsolute(stateFile)) throw new Error('Provide the reviewed checkout and private config paths.');
  const profile = JSON.parse(fs.readFileSync(path.resolve(__dirname,'../../../moneta.json'),'utf8'));
  const beforeRead = () => sync({profile,checkout,stateFile});
  if (!['current','pulled'].includes(beforeRead().status)) throw new Error('Reviewed checkout refresh is blocked.');
  // An explicitly requested candidate view may live elsewhere; only the reviewed checkout is pulled.
  if (!args.includes('--candidate')) inside(path.join(checkout,'memory'),area);
  readGraph(area);
  const server = createViewer(area, path.join(__dirname, '../assets/viewer'),beforeRead);
  server.listen(0, '127.0.0.1', () => {
    const url = `http://127.0.0.1:${server.address().port}/`;
    console.log(`Moneta viewer: ${url}\nRead only. Stop this process to close the viewer. Expires after 8 hours.`);
    if (!args.includes('--no-open')) {
      const command = process.platform === 'win32' ? 'powershell.exe' : process.platform === 'darwin' ? 'open' : 'xdg-open';
      const openArgs = process.platform === 'win32' ? ['-NoProfile', '-NonInteractive', '-Command', `Start-Process -FilePath '${url}'`] : [url];
      execFile(command, openArgs, { windowsHide: true }, error => { if (error) console.log('Open the localhost URL above in your browser.'); });
    }
    setTimeout(() => { server.closeAllConnections(); server.close(); }, 8 * 60 * 60 * 1000).unref();
  });
  server.on('error', () => { console.error('Could not start the localhost viewer.'); process.exitCode = 1; });
}
if (require.main === module) {
  try { main(); } catch { console.error('Moneta viewer could not read the selected area. Check its catalogs, frontmatter, paths and node limits locally.'); process.exitCode = 1; }
}
module.exports = { readGraph, createViewer };
