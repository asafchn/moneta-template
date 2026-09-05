const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { spawnSync } = require('node:child_process');
const { readGraph, createViewer } = require('../skills/moneta-show/scripts/server.cjs');
const source = path.resolve(__dirname, '../skills/init/assets/graph/general');
const assets = path.resolve(__dirname, '../skills/moneta-show/assets/viewer');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'moneta-show-test-'));
  fs.cpSync(source, path.join(root, 'general'), { recursive: true });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, area: path.join(root, 'general') };
}

test('viewer reads registered direct nodes and named edges, excluding private and other-agent data', t => {
  const { root, area } = fixture(t);
  fs.mkdirSync(path.join(root, 'another-agent'));
  fs.writeFileSync(path.join(root, 'another-agent', 'secret.md'), 'OTHER_AGENT_CONTENT');
  fs.mkdirSync(path.join(area, 'evaluation'));
  fs.writeFileSync(path.join(area, 'evaluation', 'result.md'), 'PRIVATE_EVALUATION');
  fs.mkdirSync(path.join(area, 'skills', 'nested'));
  fs.writeFileSync(path.join(area, 'skills', 'nested', 'SKILL.md'), 'NATIVE_INSTRUCTIONS');
  const graph = readGraph(area);
  assert.equal(graph.nodes.length, 7);
  assert.equal(graph.edges.length, 8);
  assert.deepEqual(graph.warnings, []);
  assert.doesNotMatch(JSON.stringify(graph), /OTHER_AGENT_CONTENT|PRIVATE_EVALUATION|NATIVE_INSTRUCTIONS/);
  assert.equal(graph.edges.find(e => e.type === 'guides').inverse, 'guided-by');
});

test('malformed YAML, duplicate keys and unknown edge keys are rejected without changing files', t => {
  const { area } = fixture(t);
  const file = path.join(area, 'coding-guidelines/follow-applicable-guidance.md');
  const original = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, original.replace('slug: follow-applicable-guidance', 'slug: follow-applicable-guidance\nslug: duplicate'));
  assert.throws(() => readGraph(area));
  fs.writeFileSync(file, original.replace('[[guides]]', '[[related-to]]'));
  assert.throws(() => readGraph(area), /registered meaning/);
  assert.match(fs.readFileSync(file, 'utf8'), /related-to/);
});

test('custom types are discovered from the area catalog and content is redacted', t => {
  const { area } = fixture(t);
  const catalogPath = path.join(area, 'schemas/node-types.json');
  const catalog = JSON.parse(fs.readFileSync(catalogPath));
  catalog.types.decisions = { directory: 'decisions' };
  fs.writeFileSync(catalogPath, JSON.stringify(catalog));
  fs.mkdirSync(path.join(area, 'decisions'));
  fs.writeFileSync(path.join(area, 'decisions/client-choice.md'), '---\nslug: client-choice\nnode-type: decisions\ndescription: Client choice\nrelated: {}\n---\nUse the shared client.\nAuthorization: Bearer synthetic-secret-for-test-only');
  const graph = readGraph(area);
  assert.equal(graph.nodes.length, 8);
  assert.doesNotMatch(JSON.stringify(graph), /synthetic-secret-for-test-only/);
});

test('directory escape in a custom registry is rejected', t => {
  const { area } = fixture(t);
  const file = path.join(area, 'schemas/node-types.json');
  const catalog = JSON.parse(fs.readFileSync(file));
  catalog.types.outside = { directory: '../another-agent' };
  fs.writeFileSync(file, JSON.stringify(catalog));
  assert.throws(() => readGraph(area), /area-local/);
});

test('legacy relations are visible with a migration notice and remain untouched', t => {
  const { area } = fixture(t);
  const file = path.join(area, 'guard-rails/keep-evidence-attributed.md');
  const legacy = fs.readFileSync(file, 'utf8').replace('related: {}', 'relations: []');
  fs.writeFileSync(file, legacy);
  assert.match(readGraph(area).warnings.join(' '), /Legacy relations/);
  assert.equal(fs.readFileSync(file, 'utf8'), legacy);
});

test('debug runtime stops before browser spawning can reveal inherited credentials', () => {
  const result = spawnSync(process.execPath, [path.resolve(__dirname, '../skills/moneta-show/scripts/server.cjs'), '--area', source], {
    encoding: 'utf8', env: { ...process.env, NODE_DEBUG: 'child_process', MONETA_TEST_SECRET: 'synthetic-debug-secret-only' }, timeout: 5000,
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /without debug/);
  assert.doesNotMatch(result.stdout + result.stderr, /synthetic-debug-secret-only/);
});

test('localhost server serves the viewer, rejects foreign origins and writes, and hides parser details', async t => {
  const { area } = fixture(t);
  const server = createViewer(area, assets);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => { server.closeAllConnections(); server.close(); });
  const url = `http://127.0.0.1:${server.address().port}`;
  assert.equal((await fetch(url + '/health')).status, 200);
  assert.match(await (await fetch(url)).text(), /Moneta/);
  const response = await fetch(url + '/graph.json');
  assert.equal((await response.json()).nodes.length, 7);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal((await fetch(url + '/graph.json', { headers: { origin: 'https://attacker.invalid' } })).status, 403);
  const foreignHost = await new Promise((resolve, reject) => {
    http.get(url + '/graph.json', { headers: { host: 'attacker.invalid' } }, response => { response.resume(); resolve(response.statusCode); }).on('error', reject);
  });
  assert.equal(foreignHost, 403);
  assert.equal((await fetch(url + '/graph.json', { method: 'POST' })).status, 405);
  assert.equal((await fetch(url + '/schemas/node-types.json')).status, 404);
  fs.writeFileSync(path.join(area, 'skills/retrieve-relevant-guidance.md'), 'private-sensitive-parser-content');
  const failed = await fetch(url + '/graph.json');
  assert.equal(failed.status, 422);
  assert.doesNotMatch(await failed.text(), /private-sensitive-parser-content/);
});
test('viewer refuses graph reads when freshness fails and retries on refresh', async t => {
  const { area } = fixture(t); let fresh=false,calls=0;
  const server=createViewer(area,assets,()=>{calls++;return {status:fresh?'current':'pull-failed'};});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>{server.closeAllConnections();server.close();});
  const url=`http://127.0.0.1:${server.address().port}/graph.json`;
  const blocked=await fetch(url);assert.equal(blocked.status,409);assert.equal((await blocked.json()).nodes,undefined);
  fresh=true;assert.equal((await fetch(url)).status,200);assert.equal(calls,2);
});
