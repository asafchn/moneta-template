const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {sync,HOUR} = require('../native/shared/scripts/sync.cjs');
function fixture(t) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'moneta-sync-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const checkout=path.join(root,'brain with spaces'); fs.mkdirSync(checkout);
  const stateFile=path.join(root,'private','config.json');
  const profile={'repository-url':'https://github.com/team/brain',hosting:'github','base-branch':'main',availability:'global'};
  const mock={now:Date.parse('2026-09-05T00:00:00Z'),head:'a'.repeat(40),remote:'a'.repeat(40),origin:profile['repository-url'],dirty:'',branch:'main',fail:false,pulls:0};
  function runGit(_,args) {
    if(args.includes('pull')) {mock.pulls++; return {ok:!mock.fail,output:mock.fail?'synthetic-secret-never-output':''};}
    if(args[0]==='config') return {ok:true,output:mock.origin};
    if(args[0]==='symbolic-ref') return {ok:true,output:mock.branch};
    if(args[0]==='status') return {ok:true,output:mock.dirty};
    return {ok:true,output:args.at(-1)==='HEAD'?mock.head:mock.remote};
  }
  return {mock,stateFile,checkout,call:extra=>sync({profile,checkout,stateFile,clock:()=>mock.now,runGit,...extra}),read:()=>JSON.parse(fs.readFileSync(stateFile))};
}
test('first pull stores private local paths; a fresh receipt avoids network; exactly one hour pulls',t=>{
  const f=fixture(t); assert.equal(f.call().status,'pulled');
  assert.equal(f.read().checkout,fs.realpathSync(f.checkout)); assert.equal(f.read()['graph-root'],path.join(fs.realpathSync(f.checkout),'memory'));
  f.mock.now+=HOUR-1; assert.equal(f.call().status,'current'); assert.equal(f.mock.pulls,1);
  f.mock.now++; assert.equal(f.call().status,'pulled'); assert.equal(f.mock.pulls,2);
  assert.equal(f.read()['last-successful-pull-at'],new Date(f.mock.now).toISOString());
});
test('failed pulls retain the previous timestamp and withhold raw diagnostics',t=>{
  const f=fixture(t);f.call();const original=fs.readFileSync(f.stateFile,'utf8');f.mock.now+=HOUR;f.mock.fail=true;
  const result=f.call(); assert.equal(result.status,'pull-failed');assert.doesNotMatch(JSON.stringify(result),/synthetic-secret/);assert.equal(fs.readFileSync(f.stateFile,'utf8'),original);
});
for(const change of ['dirty','branch','origin']) test(`preserve checkout when ${change} differs`,t=>{
  const f=fixture(t);f.mock[change]=change==='origin'?'https://github.com/other/brain':'unexpected';
  assert.ok(['checkout-needs-preservation','repository-mismatch'].includes(f.call().status));assert.equal(f.mock.pulls,0);
});
for(const kind of ['corrupt','future','different-checkout','different-revision']) test(`refresh a ${kind} receipt`,t=>{
  const f=fixture(t);f.call();const state=f.read();
  if(kind==='future')state['last-successful-pull-at']=new Date(f.mock.now+HOUR).toISOString();
  if(kind==='different-checkout')state.checkout=path.dirname(f.checkout);
  if(kind==='different-revision')state.revision='b'.repeat(40);
  fs.writeFileSync(f.stateFile,kind==='corrupt'?'invalid':JSON.stringify(state));assert.equal(f.call().status,'pulled');assert.equal(f.mock.pulls,2);
});
test('unmerged local commits cannot become reviewed merely because pull succeeds',t=>{
  const f=fixture(t); f.mock.head='b'.repeat(40); assert.equal(f.call().status,'reviewed-state-unverified');assert.equal(fs.existsSync(f.stateFile),false);
});
test('local config cannot enter the knowledge checkout and concurrent operations leave locks intact',t=>{
  const f=fixture(t);assert.equal(f.call({stateFile:path.join(f.checkout,'config.json')}).status,'state-must-be-private');
  fs.mkdirSync(path.dirname(f.stateFile));fs.writeFileSync(f.stateFile+'.lock','other-process');assert.equal(f.call().status,'sync-in-progress');assert.equal(fs.readFileSync(f.stateFile+'.lock','utf8'),'other-process');assert.equal(f.mock.pulls,0);
});
test('actual Git fast-forwards the reviewed clone and stores successful pull time',t=>{
  const {spawnSync}=require('node:child_process');const {pathToFileURL}=require('node:url');
  const f=fixture(t);const root=path.dirname(f.checkout);const source=path.join(root,'source');fs.mkdirSync(source);
  const git=(cwd,...args)=>{const result=spawnSync('git',['-c',`safe.directory=${cwd.replaceAll('\\','/')}`,'-c','user.name=Moneta Test','-c','user.email=test@example.invalid',...args],{cwd,encoding:'utf8',windowsHide:true});assert.equal(result.status,0,result.stderr);return result.stdout.trim();};
  git(source,'init','-b','main');fs.writeFileSync(path.join(source,'lesson.md'),'first');git(source,'add','.');git(source,'commit','-m','first');
  git(f.checkout,'clone','--no-local',source,'.');git(f.checkout,'remote','set-url','origin','https://github.com/team/brain');git(f.checkout,'config',`url.${pathToFileURL(source).href}.insteadOf`,'https://github.com/team/brain');
  assert.equal(f.call({runGit:undefined}).status,'pulled');const before=f.read()['last-successful-pull-at'];
  fs.writeFileSync(path.join(source,'lesson.md'),'second');git(source,'add','.');git(source,'commit','-m','second');
  assert.equal(f.call({runGit:undefined}).status,'current');assert.equal(fs.readFileSync(path.join(f.checkout,'lesson.md'),'utf8'),'first');
  f.mock.now+=HOUR;assert.equal(f.call({runGit:undefined}).status,'pulled');assert.equal(fs.readFileSync(path.join(f.checkout,'lesson.md'),'utf8'),'second');assert.notEqual(f.read()['last-successful-pull-at'],before);
});
