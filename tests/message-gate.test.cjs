const test = require('node:test');
const assert = require('node:assert/strict');
const { decide } = require('../native/shared/hooks/message-gate.cjs');

const candidates = [
  ['Please change the error handling to return a typed Result.', 'review-change'],
  ['You used the wrong API. Use client.responses.create instead.', 'correction'],
  ['I reviewed your PR. Please change the error handling to our Result pattern.', 'review-change'],
  ['Coding guideline: validate API input at the boundary.', 'guideline'],
  ['When using gh, pass multiline PR text with --body-file.', 'tool-guidance'],
  ['Do not concatenate SQL input; use parameterized queries.', 'guideline'],
  ['Never store credentials in source files.', 'guideline'],
  ['Please review this PR. Coding guideline: use the shared client.', 'guideline'],
  ['How do I use gh? Always pass --body-file for multiline text.', 'guideline'],
  ['For this tool, call inspect before update; update requires the revision.', 'tool-guidance'],
  ['That is incorrect: this API expects milliseconds, not seconds.', 'correction'],
];
for (const [message,reason] of candidates) test(`routes ${reason}: ${message}`,()=>{
  assert.deepEqual(decide(message),{route:'inspect',reason});
});
for (const message of ['', 'thanks', 'continue implementing', 'What is the status?', 'Add a settings page.', 'Please review this PR.', 'How do I use gh?', 'Change the button to blue for this demo.', '/agent-evolve:evolve', '$evolve-message this correction', 'Do not evolve this message. Always validate input.', "Don't remember this: always validate input."]) {
  test(`skips routine/explicit/opt-out: ${message}`,()=>assert.equal(decide(message).route,'skip'));
}
test('non-string payload stays out of message evolution',()=>assert.equal(decide({prompt:'guideline'}).route,'skip'));
test('bounded scan does not inspect hidden transcript or tail content',()=>assert.equal(decide('x'.repeat(20000)+' Coding guideline: validate input.').route,'skip'));
