const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'evolve-hook-'));
const runtime = fs.mkdtempSync(path.join(os.tmpdir(), 'evolve-unprofiled-runtime-'));
const shared = path.resolve(__dirname, '../native/shared');
fs.cpSync(path.join(shared,'hooks'),path.join(runtime,'hooks'),{recursive:true});
fs.cpSync(path.join(shared,'scripts'),path.join(runtime,'scripts'),{recursive:true});
const hook = path.join(runtime,'hooks','context.cjs');
test.after(() => {
  fs.rmSync(workspace,{recursive:true,force:true});
  fs.rmSync(runtime,{recursive:true,force:true});
});
fs.writeFileSync(path.join(workspace, '.moneta.md'), '---\nbindings: []\n---\n');
fs.mkdirSync(path.join(workspace, 'nested'));
function run(input) {
  const result = spawnSync(process.execPath, [hook], { input: typeof input === 'string' ? input : JSON.stringify(input), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}
for (const event of ['SessionStart','UserPromptSubmit','SubagentStart','PreToolUse']) {
  test(`${event} supplies retrieval context without a permission decision`, () => {
    const output = JSON.parse(run({hook_event_name:event,cwd:path.join(workspace,'nested'),tool_input:{command:'SECRET_MARKER'}}));
    assert.equal(output.hookSpecificOutput.hookEventName,event);
    assert.match(output.hookSpecificOutput.additionalContext,/knowledge-search/);
    assert.match(output.hookSpecificOutput.additionalContext,/Memory-scope/);
    assert.ok(!JSON.stringify(output).includes('SECRET_MARKER'));
    assert.ok(!('permissionDecision' in output.hookSpecificOutput));
  });
}
test('unsupported event stays silent',()=>assert.equal(run({hook_event_name:'Stop',cwd:workspace}),''));
test('malformed payload fails open without exposing input',()=>assert.equal(run('SECRET_MARKER{'),''));
test('unconfigured workspace stays silent',()=>assert.equal(run({hook_event_name:'PreToolUse',cwd:fs.mkdtempSync(path.join(os.tmpdir(),'evolve-unconfigured-'))}),''));
test('nested repository does not inherit another repository connection',()=>{
  const inner=path.join(workspace,'inner');fs.mkdirSync(inner);fs.mkdirSync(path.join(inner,'.git'));
  assert.equal(run({hook_event_name:'UserPromptSubmit',cwd:inner}),'');
});

test('user correction routes one-message triage without echoing the message',()=>{
  const output=JSON.parse(run({hook_event_name:'UserPromptSubmit',cwd:workspace,prompt:'You used the wrong API. SECRET_CORRECTION_TEXT'}));
  assert.match(output.hookSpecificOutput.additionalContext,/evolve-message/);
  assert.ok(!JSON.stringify(output).includes('SECRET_CORRECTION_TEXT'));
});
test('ordinary prompt keeps retrieval context without an evolution trigger',()=>{
  const output=JSON.parse(run({hook_event_name:'UserPromptSubmit',cwd:workspace,prompt:'What is the status?'}));
  assert.ok(!output.hookSpecificOutput.additionalContext.includes('evolve-message'));
});
test('other lifecycle events do not route message evolution',()=>{
  const output=JSON.parse(run({hook_event_name:'PreToolUse',cwd:workspace,prompt:'Coding guideline: validate input.'}));
  assert.ok(!output.hookSpecificOutput.additionalContext.includes('evolve-message'));
});
