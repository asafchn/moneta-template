const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const source = path.resolve(__dirname, '../native/shared');
// Node resolves script paths through macOS /var -> /private/var before setting __dirname.
const temporary = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'moneta-organization-')));
test.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
let sequence = 0;
const profile = { 'repository-url':'https://gitlab.example/me/memory', hosting:'gitlab', 'base-branch':'main', targets:[{kind:'organization',host:'gitlab.example',namespace:'engineering/platform'}] };
function git(cwd, ...args) {
  const result = spawnSync('git', ['-c', `safe.directory=${cwd.replaceAll('\\','/')}`, ...args], {cwd,encoding:'utf8',windowsHide:true});
  assert.equal(result.status,0,result.stderr);
  return result.stdout.trim();
}
function repo(url, parent=temporary) {
  const directory = path.join(parent, `repo-${++sequence}`);
  fs.mkdirSync(directory);
  git(directory,'init','--quiet');
  if (url) git(directory,'remote','add','origin',url);
  return directory;
}
function runtime(data=profile,name='my-memory') {
  const root=path.join(temporary,`runtime-${++sequence}`);
  fs.mkdirSync(root);
  fs.cpSync(path.join(source,'hooks'),path.join(root,'hooks'),{recursive:true});
  fs.cpSync(path.join(source,'scripts'),path.join(root,'scripts'),{recursive:true});
  fs.mkdirSync(path.join(root,'.codex-plugin'));
  fs.writeFileSync(path.join(root,'.codex-plugin','plugin.json'),JSON.stringify({name}));
  fs.writeFileSync(path.join(root,'moneta.json'),JSON.stringify(data));
  return root;
}
function run(root,cwd,extra={}) {
  const result=spawnSync(process.execPath,[path.join(root,'hooks','context.cjs')],{input:JSON.stringify({hook_event_name:'UserPromptSubmit',cwd,prompt:'You used the wrong API.',...extra}),encoding:'utf8',timeout:10000});
  assert.equal(result.status,0,result.stderr);
  assert.equal(result.stderr,'');
  return result.stdout;
}
test('one group profile matches existing, future, and nested-group repositories with scoped skills',()=>{
  const root=runtime();
  for (const remote of ['https://gitlab.example/engineering/platform/existing.git','git@gitlab.example:engineering/platform/new-repo.git','ssh://git@gitlab.example/engineering/platform/subgroup/project.git']) {
    const directory=repo(remote);
    const output=run(root,directory);
    assert.match(output,/my-memory:knowledge-search/);
    assert.match(output,/my-memory:evolve-message/);
    assert.match(output,/my-memory:evolve-evaluate/);
    const context=JSON.parse(output).hookSpecificOutput.additionalContext;
    assert.ok(context.includes(JSON.stringify(path.join(root,'moneta.json'))));
    assert.match(context,/engineering\/platform/);
    assert.match(context,/omitted agent-slug selects general; an explicit agent-slug selects only that area/);
  }
});
test('host and namespace boundaries, missing origin, and conflicting origins fail silently',()=>{
  const root=runtime();
  for (const remote of ['https://evil.example/engineering/platform/repo','https://gitlab.example.evil/engineering/platform/repo','https://gitlab.example/engineering/platform-other/repo','https://gitlab.example/engineering/other/repo','https://gitlab.example/engineering/platform','file:///engineering/platform/repo',null]) assert.equal(run(root,repo(remote)),'');
  const directory=repo('https://gitlab.example/engineering/platform/repo');
  git(directory,'config','--add','remote.origin.url','https://other.example/team/repo');
  assert.equal(run(root,directory),'');
});
test('nearest nested repository and worktree git files determine origin',()=>{
  const root=runtime();
  const outer=repo('https://gitlab.example/engineering/platform/repo');
  assert.equal(run(root,repo('https://other.example/group/repo',outer)),'');
  git(outer,'-c','user.email=test@example.com','-c','user.name=Test','commit','--allow-empty','-m','test');
  const worktree=path.join(temporary,`worktree-${++sequence}`);
  git(outer,'worktree','add','--quiet','-b',`test-${sequence}`,worktree);
  fs.mkdirSync(path.join(worktree,'subdir'));
  assert.match(run(root,path.join(worktree,'subdir')),/my-memory:knowledge-search/);
});
test('repository targets match exactly across supported transports',()=>{
  const root=runtime({...profile,targets:[{kind:'repository',url:'https://gitlab.example/team/project.git'}]});
  assert.match(run(root,repo('git@gitlab.example:team/project.git')),/my-memory:knowledge-search/);
  assert.equal(run(root,repo('https://gitlab.example/team/project-more')),'');
});
test('legacy overrides suppress unrelated or ambiguous personal memory profiles',()=>{
  const root=runtime();
  const directory=repo('https://gitlab.example/engineering/platform/repo');
  for (const body of ['---\nrepository-url: https://other.example/me/memory\n---\n','---\nbindings: []\n---\n','---\nrepository-url: https://gitlab.example/me/memory\nrepository-url: https://evil.example/repo\n---\n']) {
    fs.writeFileSync(path.join(directory,'.moneta.md'),body);
    assert.equal(run(root,directory),'');
  }
  fs.writeFileSync(path.join(directory,'.moneta.md'),'---\nrepository-url: git@gitlab.example:me/memory.git\n---\n');
  assert.match(run(root,directory),/\.moneta\.md/);
});
test('installed profiles select only their own target and plugin skills',()=>{
  const first=runtime(profile,'alice-memory');
  const second=runtime({...profile,targets:[{kind:'organization',host:'gitlab.example',namespace:'other'}]},'bob-memory');
  const directory=repo('https://gitlab.example/engineering/platform/repo');
  assert.match(run(first,directory),/alice-memory:knowledge-search/);
  assert.equal(run(second,directory),'');
});
test('remote credentials and token-bearing invalid profile data never appear in output',()=>{
  const root=runtime();
  const directory=repo('https://user:SYNTHETIC_SECRET_92517@gitlab.example/engineering/platform/project.git');
  const output=run(root,directory);
  assert.match(output,/knowledge-search/);
  assert.ok(!output.includes('SYNTHETIC_SECRET_92517'));
  assert.equal(run(runtime({...profile,'repository-url':'https://user:SYNTHETIC_SECRET_92517@gitlab.example/me/memory'}),directory),'');
});
test('explicit invocation returns the same portable profile binding without exposing origin',()=>{
  const root=runtime();
  const directory=repo('https://user:SYNTHETIC_SECRET_92517@gitlab.example/engineering/platform/project.git');
  const result=spawnSync(process.execPath,[path.join(root,'scripts','connection.cjs'),directory],{encoding:'utf8',timeout:10000});
  assert.equal(result.status,0);
  assert.equal(result.stderr,'');
  const value=JSON.parse(result.stdout);
  assert.equal(value.status,'matched');
  assert.equal(value.profilePath,path.join(root,'moneta.json'));
  assert.equal(value.repositoryRoot,directory);
  assert.deepEqual(value.target,profile.targets[0]);
  assert.ok(!result.stdout.includes('SYNTHETIC_SECRET_92517'));
});
test('origin lookup is one bounded local config command with no discovery or network operation',()=>{
  const vm=require('node:vm');
  const filename=path.join(source,'scripts','connection.cjs');
  let calls=0;
  const env={PATH:process.env.PATH,GIT_DIR:'unrelated',GIT_CONFIG_COUNT:'1',GIT_TRACE:'SYNTHETIC_SECRET',TOKEN:'SYNTHETIC_SECRET'};
  const module={exports:{}};
  vm.runInNewContext(fs.readFileSync(filename,'utf8'),{module,process:{env},require(name){
    if(name==='node:child_process') return {spawnSync(command,args,options){
      calls++;
      assert.equal(command,'git');
      assert.deepEqual(Array.from(args),['-c','safe.directory=C:/safe/repo','config','--local','--no-includes','--null','--get-all','remote.origin.url']);
      assert.equal(options.shell,false);
      assert.equal(options.windowsHide,true);
      assert.equal(options.timeout,1500);
      assert.equal(options.maxBuffer,16384);
      assert.equal(options.cwd,'C:\\safe\\repo');
      assert.ok(!Object.keys(options.env).some(key=>key.startsWith('GIT_')));
      return {status:0,stdout:Buffer.from('https://gitlab.example/engineering/platform/project.git\0'),stderr:Buffer.from('SYNTHETIC_SECRET')};
    }};
    return require(name);
  },URL});
  assert.equal(module.exports.origin('C:\\safe\\repo').host,'gitlab.example');
  assert.equal(calls,1);
});
test('debug runtime is rejected before loading child_process and spawn errors expose nothing',()=>{
  const vm=require('node:vm');
  for(const debug of ['NODE_DEBUG','NODE_DEBUG_NATIVE','NODE_OPTIONS']) {
    let loaded=false;
    const module={exports:{}};
    vm.runInNewContext(fs.readFileSync(path.join(source,'scripts','connection.cjs'),'utf8'),{module,process:{env:{[debug]:'SYNTHETIC_SECRET'}},require(name){if(name==='node:child_process'){loaded=true;throw new Error('SYNTHETIC_SECRET');}return require(name);},URL});
    assert.equal(module.exports.origin('C:\\safe\\repo'),null);
    assert.equal(loaded,false);
  }
  const module={exports:{}};
  vm.runInNewContext(fs.readFileSync(path.join(source,'scripts','connection.cjs'),'utf8'),{module,process:{env:{}},require(name){if(name==='node:child_process')return {spawnSync(){throw new Error('SYNTHETIC_SECRET');}};return require(name);},URL});
  assert.equal(module.exports.origin('C:\\safe\\repo'),null);
});
test('malformed and ambiguous profile or URL structures fail silently',()=>{
  const {repository,validProfile}=require('../native/shared/scripts/connection.cjs');
  for(const url of ['https://gitlab.example/engineering/platform/../other/repo','https://gitlab.example/engineering%2fplatform/repo','https://gitlab.example/engineering/platform/repo?secret=92517','ssh://git@gitlab.example:99999/engineering/platform/repo','https://gitlab.example/engineering/platform//repo']) assert.equal(repository(url),null);
  assert.equal(validProfile({...profile,checkout:'C:\\private\\memory'}),false);
  assert.equal(validProfile({...profile,availability:'restricted',targets:[]}),false);
  const directory=repo('https://gitlab.example/engineering/platform/repo');
  const root=runtime();
  fs.writeFileSync(path.join(root,'moneta.json'),'{SYNTHETIC_SECRET');
  assert.equal(run(root,directory),'');
});

test('global memory works in ordinary folders, unrelated repositories and repositories without origin',()=>{
  const root=runtime({...profile,availability:'global',targets:[]});
  const folder=path.join(temporary,`plain-chat-${++sequence}`);
  fs.mkdirSync(folder);
  for (const cwd of [folder, repo(null), repo('https://unrelated.example/team/project')]) {
    const output=run(root,cwd);
    assert.match(output,/my-memory:knowledge-search/);
    assert.match(output,/my-memory:evolve-message/);
    assert.match(output,/all projects and chats/);
    assert.match(output,/explicit agent-slug selects only that area/);
    assert.doesNotMatch(output,/Selected target:/);
  }
});

test('omitting binding configuration defaults to global and skips Git origin entirely',()=>{
  const vm=require('node:vm');
  const globalProfile={...profile}; delete globalProfile.targets;
  const root=runtime(globalProfile);
  const module={exports:{}};
  let loaded=false;
  vm.runInNewContext(fs.readFileSync(path.join(source,'scripts','connection.cjs'),'utf8'),{module,process:{env:{}},require(name){
    if(name==='node:child_process'){loaded=true;throw new Error('Git must not run');}
    return require(name);
  },URL});
  const result=module.exports.resolveConnection(temporary,root);
  assert.equal(result.availability,'global');
  assert.equal(result.profilePath,path.join(root,'moneta.json'));
  assert.equal(loaded,false);
});

test('global mode preserves conflicting local overrides and rejects contradictory or placeholder profiles',()=>{
  const {validProfile}=require('../native/shared/scripts/connection.cjs');
  assert.equal(validProfile({...profile,availability:'global'}),false);
  assert.equal(validProfile({...profile,availability:'unknown',targets:[]}),false);
  const root=runtime({...profile,availability:'global',targets:[]});
  const directory=repo(null);
  fs.writeFileSync(path.join(directory,'.moneta.md'),'---\nrepository-url: https://other.example/me/memory\n---\n');
  assert.equal(run(root,directory),'');
  const placeholder=runtime({...profile,'repository-url':'https://example.invalid/owner/knowledge',availability:'global',targets:[]});
  assert.equal(run(placeholder,temporary),'');
});
