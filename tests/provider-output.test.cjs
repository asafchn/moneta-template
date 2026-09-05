const test = require('node:test');
const assert = require('node:assert/strict');
const { redact } = require('../native/shared/scripts/redact.cjs');

test('credential values are removed from both literal and encoded text', () => {
  const secret = 'synthetic/credential+value-42';
  const variants = [secret, encodeURIComponent(secret), Buffer.from(secret).toString('base64')];
  for (const value of variants) assert.ok(!redact(`error: ${value}`, { API_KEY: secret }).includes(value));
});

test('recognizable provider tokens and private keys are removed', () => {
  const values = ['ghp_' + 'A'.repeat(36), 'glpat-' + 'b'.repeat(24), 'sk-proj-' + 'C'.repeat(40), '-----BEGIN PRIVATE KEY-----\nsynthetic-key-material'];
  for (const value of values) assert.ok(!redact(`output ${value}`, {}).includes(value));
});
const { runFiltered, inspectAccount } = require('../native/shared/scripts/provider.cjs');

test('child output is buffered across chunks and filtered before return', () => {
  const secret = 'ghp_' + 'B'.repeat(36);
  const code = `process.stdout.write(${JSON.stringify(secret.slice(0, 12))}); setTimeout(()=>{ process.stdout.write(${JSON.stringify(secret.slice(12))}); process.stderr.write('password="tiny-secret"'); },10)`;
  const result = runFiltered(process.execPath, ['-e', code], { env: {} });
  assert.equal(result.exitCode, 0);
  assert.ok(!JSON.stringify(result).includes(secret));
  assert.ok(!JSON.stringify(result).includes('tiny-secret'));
});

test('auth output never relays unrelated fields or raw errors', () => {
  const secret = 'UNRECOGNIZED_SECRET_VALUE';
  const result = inspectAccount({status:0,stdout:Buffer.from(JSON.stringify({login:'asafchn',token:secret})),stderr:Buffer.from(secret)},'gh',{});
  assert.deepEqual(result,{status:'authenticated',account:'asafchn',exitCode:0});
  const error = inspectAccount({status:1,stdout:Buffer.from(secret),stderr:Buffer.from('socket forbidden '+secret)},'gh',{});
  assert.equal(error.status,'network-blocked');
  assert.ok(!JSON.stringify(error).includes(secret));
});
const { main } = require('../native/shared/scripts/provider.cjs');
const {spawnSync} = require('node:child_process');
const path = require('node:path');

for (const [name,input,secret] of [
  ['mixed-case auth header','aUtHoRiZaTiOn: Bearer short-value','short-value'],
  ['URL password','https://alice:short-password@example.com/path','short-password'],
  ['generic short key','{"key":"short-key"}','short-key'],
  ['quoted multiline secret','password="first line\nsecond line"','second line'],
  ['ANSI-split prefix','ghp_\u001b[31m'+'D'.repeat(36),'D'.repeat(36)],
  ['JWT','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.signature','eyJhbGciOiJIUzI1NiJ9'],
  ['opaque random key','value=q7Lk8r2M9x0V3d5H1j6S4a8N2b7C0z9P','q7Lk8r2M9x0V3d5H1j6S4a8N2b7C0z9P'],
]) test(`redacts ${name}`,()=>assert.ok(!redact(input,{}).includes(secret)));

test('JSON Unicode encoding of an environment credential is removed',()=>{
 const value='synthetic-secr\u00e9t';
 assert.ok(!redact('value=synthetic-secr\\u00e9t',{API_KEY:value}).includes('synthetic-secr'));
});

test('known credential-shaped identity is withheld',()=>{
 const secret='glpat-'+'E'.repeat(24);
 assert.equal(inspectAccount({status:0,stdout:Buffer.from(JSON.stringify({username:secret}))},'glab',{}).status,'invalid-account-response');
 assert.equal(inspectAccount({status:0,stdout:Buffer.from('{"login":"asafchn"}')},'gh',{TOKEN:'asafchn'}).status,'invalid-account-response');
});

test('timeout, output limit and missing executable never return partial output',()=>{
 for (const result of [
  runFiltered(process.execPath,['-e',"process.stdout.write('unrecognized-sensitive-content'); setTimeout(()=>{},2000)"],{env:{},timeout:60}),
  runFiltered(process.execPath,['-e',"process.stdout.write('unrecognized-sensitive-content'.repeat(1000))"],{env:{},maxBuffer:64}),
  runFiltered('moneta-nonexistent-command',[],{env:{}})
 ]) {assert.ok(!JSON.stringify(result).includes('unrecognized-sensitive-content')); assert.ok(!('stdout' in result));}
});

test('Node child-process debug cannot expose inherited credentials',()=>{
 const result=spawnSync(process.execPath,[path.resolve(__dirname,'../native/shared/scripts/provider.cjs'),'probe','gh','github.com'],{env:{...process.env,NODE_DEBUG:'child_process',GH_TOKEN:'SYNTHETIC_DEBUG_SECRET'},encoding:'utf8'});
 assert.ok(!result.stdout.includes('SYNTHETIC_DEBUG_SECRET'));
 assert.ok(!result.stderr.includes('SYNTHETIC_DEBUG_SECRET'));
 assert.equal(JSON.parse(result.stdout).status,'unsafe-runtime');
});

test('credential commands and argument secrets are blocked',()=>{
 assert.equal(main(['run','gh','auth','token']).status,'command-blocked');
 assert.equal(main(['run','gh','api','user','--show-token']).status,'command-blocked');
 assert.equal(main(['run','gh','repo','view','https://name:password@example.com/repo']).status,'command-blocked');
});

test('auth failures are categorized without raw provider output',()=>{
 for(const [error,status] of [['bad (HTTP 401)','credentials-rejected'],['denied (HTTP 403)','access-denied'],['please run gh auth login','login-required'],['unknown-value','provider-error']]) {
  assert.deepEqual(inspectAccount({status:1,stderr:Buffer.from(error)},'gh',{}),{status,exitCode:1});
 }
 assert.equal(inspectAccount({status:0,stdout:Buffer.from('malformed-secret-json')},'gh',{}).status,'invalid-account-response');
});


test('mixed-case percent escapes and form encoding of known credentials are removed',()=>{
 const value='a/b+c=p?[] space';
 for (const encoded of [encodeURIComponent(value).replace(/%[A-F0-9]{2}/g,x=>x.toLowerCase()),new URLSearchParams({v:value}).toString().slice(2)]) {
  assert.equal(redact(encoded,{TEST_SECRET:value}),'[REDACTED]');
 }
});

test('generic account API spellings cannot bypass fixed-output probe',()=>{
 for (const args of [['api','user'],['api','--hostname','github.com','user'],['api','/user']]) {
  assert.equal(main(['run','gh',...args]).status,'use-probe-mode');
 }
});
