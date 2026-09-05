const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.resolve(__dirname,'../native/shared/scripts/provider.cjs'),'utf8');
function load(platform,env={}) {
  const calls=[];const sandbox={module:{exports:{}},process:{platform,env},require:name=>name==='./redact.cjs'?{redact:value=>value}:name==='node:child_process'?{spawnSync:(command,args,options)=>{calls.push({command,args,options});return {status:0,stdout:'123\n',stderr:''};}}:require(name)};
  vm.runInNewContext(source,sandbox);return {run:args=>sandbox.module.exports.main(args),calls};
}
for(const platform of ['win32','darwin','linux']) test(`${platform} login opens a separate terminal without returning auth output`,()=>{
  const f=load(platform,{DISPLAY:':0'});const result=f.run(['login','gh','github.com']);assert.equal(result.status,'login-started');assert.equal('stdout' in result,false);
  assert.ok(f.calls.some(call=>call.args.join(' ').includes('login')));
  for(const call of f.calls)assert.equal(call.options.shell,false);
});
test('headless Linux keeps login pending and invalid hosts never launch processes',()=>{
  const f=load('linux');assert.equal(f.run(['login','gh','github.com']).status,'interactive-terminal-required');assert.equal(f.run(['login','gh',"host'; echo secret"]).status,'invalid-host');assert.equal(f.calls.length,0);
});
test('debug runtime prevents terminal spawning on every platform',()=>{
  for(const platform of ['win32','darwin','linux']){const f=load(platform,{DISPLAY:':0',NODE_DEBUG:'child_process'});assert.equal(f.run(['login','gh','github.com']).status,'unsafe-runtime');assert.equal(f.calls.length,0);}
});
