const fs = require('node:fs');
const path = require('node:path');
const { decide } = require('./message-gate.cjs');

// Lifecycle glue only: emit context; the agent performs retrieval with its tools.
try {
  const raw = fs.readFileSync(0, 'utf8');
  if (raw.length > 1024 * 1024) process.exit(0);
  const input = JSON.parse(raw);
  const event = input?.hook_event_name;
  if (!['SessionStart', 'UserPromptSubmit', 'SubagentStart', 'PreToolUse'].includes(event)) process.exit(0);
  if (typeof input.cwd !== 'string' || !path.isAbsolute(input.cwd)) process.exit(0);
  let directory = path.resolve(input.cwd);
  let connection;
  while (true) {
    const candidate = path.join(directory, '.moneta.md');
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) { connection = candidate; break; }
    if (fs.existsSync(path.join(directory, '.git'))) break;
    const parent = path.dirname(directory);
    if (parent === directory) break;
    directory = parent;
  }
  if (!connection) process.exit(0);
  let additionalContext = `Moneta connection: ${JSON.stringify(connection)}. Memory-scope: omitted agent-slug selects general; an explicit agent-slug selects only that area. Never infer storage from a worker or role name, search another agent, or fall back to general. Retain the same selection through evolution and evaluation. Before task work, invoke knowledge-search: selected-area indexes -> task query -> frontmatter find -> direct walk -> selected bodies. Re-query for new needs; apply each node within its scope. An assigned eval-agent uses evolve-evaluate for evaluation records. This reminder supplies context, not a retrieval-completion check.`;
  if (event === 'UserPromptSubmit') {
    const gate = decide(input.prompt);
    if (gate.route === 'inspect') additionalContext += ` Message gate: ${gate.reason}. Invoke evolve-message for this submitted user message only, starting with its brief no-tool triage. Keep fulfilling the current request; a candidate signal is not approval to add a permanent rule.`;
  }
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: event, additionalContext } }));
} catch {
  // Optional guidance cannot interrupt the user's work or expose captured input.
}
