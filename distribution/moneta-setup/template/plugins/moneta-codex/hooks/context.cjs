const fs = require('node:fs');
const path = require('node:path');
const { decide } = require('./message-gate.cjs');
const { redact } = require('../scripts/redact.cjs');
const { resolveConnection } = require('../scripts/connection.cjs');

// Lifecycle glue only: emit context; the agent performs retrieval with its tools.
try {
  const raw = fs.readFileSync(0, 'utf8');
  if (raw.length > 1024 * 1024) process.exit(0);
  const input = JSON.parse(raw);
  const event = input?.hook_event_name;
  if (!['SessionStart', 'UserPromptSubmit', 'SubagentStart', 'PreToolUse'].includes(event)) process.exit(0);
  if (typeof input.cwd !== 'string' || !path.isAbsolute(input.cwd)) process.exit(0);
  const connection = resolveConnection(input.cwd, path.resolve(__dirname,'..'));
  if (!connection) process.exit(0);
  const binding = connection.profilePath ? ` Installed profile: ${JSON.stringify(connection.profilePath)}.${connection.target ? ` Selected target: ${JSON.stringify(connection.target)}. This match uses only local Git origin configuration; never enumerate the organization or query its repositories.` : ' The local connection is the explicit override for the same memory repository.'} Keep this connection source bound through retrieval, evolution and evaluation; do not substitute another installed profile.` : '';
  let additionalContext = `Moneta connection: ${JSON.stringify(connection.path)}.${binding} Memory-scope: omitted agent-slug selects general; an explicit agent-slug selects only that area. Never infer storage from a worker or role name, search another agent, or fall back to general. Retain the same selection through evolution and evaluation. Before task work, invoke ${connection.skillPrefix}knowledge-search: selected-area indexes -> task query -> frontmatter find -> direct walk -> selected bodies. Re-query for new needs; apply each node within its scope. An assigned eval-agent uses ${connection.skillPrefix}evolve-evaluate for evaluation records. This reminder supplies context, not a retrieval-completion check.`;
  if (event === 'UserPromptSubmit') {
    const gate = decide(input.prompt);
    if (gate.route === 'inspect') additionalContext += ` Message gate: ${gate.reason}. Invoke ${connection.skillPrefix}evolve-message for this submitted user message only, starting with its brief no-tool triage. Keep fulfilling the current request; a candidate signal is not approval to add a permanent rule.`;
  }
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: event, additionalContext: redact(additionalContext) } }));
} catch {
  // Optional guidance cannot interrupt the user's work or expose captured input.
}
