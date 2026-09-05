'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {repository, validProfile} = require('./connection.cjs');
const HOUR = 60 * 60 * 1000;

function git(checkout, args) {
  if (Object.keys(process.env).some(key => /^(NODE_DEBUG|NODE_DEBUG_NATIVE|NODE_OPTIONS)$/i.test(key) && process.env[key])) return {ok:false};
  const env={...process.env,GIT_TERMINAL_PROMPT:'0'};
  for(const key of Object.keys(env)) if(/^(?:GIT_CONFIG.*|GIT_DIR|GIT_WORK_TREE|GIT_TRACE.*|GIT_CURL_VERBOSE|NODE_DEBUG|NODE_DEBUG_NATIVE|NODE_OPTIONS|DEBUG)$/i.test(key)) delete env[key];
  try {
    const result=require('node:child_process').spawnSync('git',['-c',`safe.directory=${checkout.replaceAll('\\','/')}`,...args],{cwd:checkout,env,shell:false,windowsHide:true,encoding:'utf8',timeout:45000,maxBuffer:1024*1024});
    return {ok:!result.error && !result.signal && result.status===0,output:result.status===0?result.stdout:''};
  } catch { return {ok:false}; }
}

function sync({profile,checkout,stateFile,clock=Date.now,runGit=git}) {
  let lock, locked=false;
  try {
    if(!validProfile(profile) || !path.isAbsolute(checkout) || !path.isAbsolute(stateFile) || path.basename(stateFile)!=='config.json') return {status:'invalid-connection'};
    const identity=repository(profile['repository-url']);
    if(/\.invalid(?::\d+)?$/.test(identity.host)) return {status:'unpersonalized'};
    checkout=fs.realpathSync(checkout);
    const stateParent=path.dirname(stateFile);
    fs.mkdirSync(stateParent,{recursive:true});
    const relative=path.relative(checkout,fs.realpathSync(stateParent));
    if(relative==='' || (!relative.startsWith('..') && !path.isAbsolute(relative))) return {status:'state-must-be-private'};
    if(fs.existsSync(stateFile) && fs.lstatSync(stateFile).isSymbolicLink()) return {status:'invalid-state-path'};
    lock=stateFile+'.lock';
    try { fs.writeFileSync(lock,String(process.pid),{flag:'wx',mode:0o600}); locked=true; }
    catch { return {status:'sync-in-progress',action:'Wait for the other operation; if it exited, remove only its abandoned config.json.lock.'}; }
    const command=args=>runGit(checkout,args);
    const origin=command(['config','--local','--no-includes','--get-all','remote.origin.url']);
    const remote=origin.ok && repository(String(origin.output).trim(),true);
    if(!remote || remote.host!==identity.host || remote.namespace!==identity.namespace) return {status:'repository-mismatch'};
    const branch=command(['symbolic-ref','--quiet','--short','HEAD']);
    const clean=command(['status','--porcelain','--untracked-files=all']);
    if(!branch.ok || String(branch.output).trim()!==profile['base-branch'] || !clean.ok || String(clean.output).trim()) return {status:'checkout-needs-preservation',action:'Use a separate clean checkout of the reviewed base; preserve this work.'};
    const current=command(['rev-parse','--verify','HEAD']);
    const revision=current.ok && String(current.output).trim();
    if(!revision || !/^[a-f0-9]{40,64}$/.test(revision)) return {status:'invalid-revision'};
    let state;
    try { if(fs.statSync(stateFile).size<=16384) state=JSON.parse(fs.readFileSync(stateFile,'utf8')); } catch { /* Missing/invalid receipt requires a real pull. */ }
    const age=clock()-Date.parse(state?.['last-successful-pull-at']);
    const tracking=command(['rev-parse','--verify',`refs/remotes/origin/${profile['base-branch']}`]);
    const same=tracking.ok && String(tracking.output).trim()===revision && state?.version===1 && state.checkout===checkout && state['graph-root']===path.join(checkout,'memory') && state.branch===profile['base-branch'] && state.revision===revision && state.repository?.host===identity.host && state.repository?.namespace===identity.namespace;
    if(same && age>=0 && age<HOUR) return {status:'current',lastSuccessfulPullAt:state['last-successful-pull-at']};
    const pull=command(['-c','pull.rebase=false','-c','pull.ff=only','pull','--ff-only','origin',profile['base-branch']]);
    if(!pull.ok) return {status:'pull-failed',action:'Retry with approved network/credential access. Do not use stale memory unless the user explicitly chooses offline use.'};
    const head=command(['rev-parse','--verify','HEAD']);
    const remoteHead=command(['rev-parse','--verify',`refs/remotes/origin/${profile['base-branch']}`]);
    const after=command(['status','--porcelain','--untracked-files=all']);
    const updated=head.ok && String(head.output).trim();
    if(!updated || !/^[a-f0-9]{40,64}$/.test(updated) || !remoteHead.ok || updated!==String(remoteHead.output).trim() || !after.ok || String(after.output).trim()) return {status:'reviewed-state-unverified'};
    state={version:1,repository:identity,checkout,'graph-root':path.join(checkout,'memory'),branch:profile['base-branch'],revision:updated,'last-successful-pull-at':new Date(clock()).toISOString()};
    const temporary=stateFile+`.${process.pid}.tmp`;
    let created=false;
    try { fs.writeFileSync(temporary,JSON.stringify(state,null,2)+'\n',{flag:'wx',mode:0o600}); created=true; fs.renameSync(temporary,stateFile); }
    finally { if(created && fs.existsSync(temporary)) fs.unlinkSync(temporary); }
    return {status:'pulled',lastSuccessfulPullAt:state['last-successful-pull-at']};
  } catch { return {status:'sync-unavailable',action:'Inspect the local checkout and private sync record; raw diagnostics are withheld.'}; }
  finally { if(locked) { try { fs.unlinkSync(lock); } catch { /* A later operation reports the remaining lock. */ } } }
}

module.exports={sync,HOUR};
if(require.main===module) {
  let result;
  try {
    const [checkout,stateFile]=process.argv.slice(2);
    const profile=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../moneta.json'),'utf8'));
    result=process.argv.length===4?sync({profile,checkout,stateFile}):{status:'invalid-arguments'};
  } catch { result={status:'invalid-connection'}; }
  process.stdout.write(JSON.stringify(result)+'\n');
  process.exitCode=['current','pulled'].includes(result.status)?0:1;
}
