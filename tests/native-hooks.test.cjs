const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const hook = path.resolve(__dirname, '../native/shared/hooks/context.cjs');
const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'evolve-hook-'));
fs.writeFileSync(path.join(workspace, '.agent-evolve.md'), '---\nbindings: []\n---\n');
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
    assert.match(output.hookSpecificOutput.additionalContext,/domain/);
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
