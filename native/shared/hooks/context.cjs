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
  const binding = connection.profilePath ? ` Installed profile: ${JSON.stringify(connection.profilePath)}.${connection.availability === 'global' ? ' Available in all projects and chats; no codebase binding or Git origin is required.' : connection.target ? ` Selected target: ${JSON.stringify(connection.target)}. This match uses only local Git origin configuration; never enumerate the organization or query its repositories.` : ' The local connection is the explicit override for the same memory repository.'} Keep this connection source bound through retrieval, evolution and evaluation; do not substitute another installed profile. If multiple memory runtimes are available, retain the user-selected one or ask which to use before reading; never combine their graphs.` : '';
  const retrieval = event === 'SessionStart'
    ? `Your Moneta brain exists in a local clone. Its machine-local config records the library path and last successful pull. On relevant user prompts, invoke ${connection.skillPrefix}knowledge-search; do not preload the graph.`
    : event === 'UserPromptSubmit'
      ? `Use the user's prompt and the node index to form a relevant query via ${connection.skillPrefix}knowledge-search. Use index -> metadata find -> typed-edge walk -> selected bodies. Walk discovers relevant connected knowledge find missed; only selected bodies enter context. Reuse already relevant context; avoid reading every Markdown file.`
      : `Retain retrieved guidance for this step. If a new knowledge need arises, invoke ${connection.skillPrefix}knowledge-search and read only the additional relevant nodes.`;
  let additionalContext = `Moneta connection: ${JSON.stringify(connection.path)}.${binding} Memory-scope: omitted agent-slug selects general; an explicit agent-slug selects only that area. Never infer storage from a worker or role name, search another agent, or fall back to general. ${retrieval} Before Moneta operations, check local config.json freshness and pull the reviewed clone when at least an hour old. An assigned eval-agent uses ${connection.skillPrefix}evolve-evaluate for evaluation records. This reminder is not proof of retrieval completion.`;
  if (event === 'UserPromptSubmit') {
    const gate = decide(input.prompt);
    if (gate.route === 'inspect') additionalContext += ` Message gate: ${gate.reason}. Invoke ${connection.skillPrefix}evolve-message for this submitted user message only, starting with its brief no-tool triage. Keep fulfilling the current request; a candidate signal is not approval to add a permanent rule.`;
  }
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: event, additionalContext: redact(additionalContext) } }));
} catch {
  // Optional guidance cannot interrupt the user's work or expose captured input.
}
