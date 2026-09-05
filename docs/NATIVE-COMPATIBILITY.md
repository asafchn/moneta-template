# Native installation

The repository provides two complete, self-contained package directories. Their shared skills/assets are generated from one authoring source.

| Host | Package | Components |
|---|---|---|
| Codex | `plugins/moneta-codex` | Codex manifest, skills/assets, hooks, custom-agent TOML definitions registered into the project by init. |
| Claude Code | `plugins/moneta-claude-code` | Claude manifest, skills/assets, hooks and automatically discovered Markdown agents. |

The repository includes each host's marketplace metadata. Add this repository's local path as a marketplace using the host CLI, then install `moneta` from `moneta-native`. For Claude development, `claude --plugin-dir <absolute-path-to-plugins/moneta-claude-code>` loads the package directly. Invoke discovered skills: normally `$evolve-init` / `$evolve` in Codex, `/moneta:evolve-init` / `/moneta:evolve` in Claude. Exact bare `/evolve` remains host-dependent.

## Hooks

Both packages register `SessionStart`, `UserPromptSubmit`, `SubagentStart` and `PreToolUse`. The Node.js command emits structured context only when a connection exists in the current workspace. It finds a connection from nested working directories, respects nested repository boundaries, and emits no transcript/tool-input contents. It stores no telemetry and performs no Git/network operation.

Session/prompt/subagent hooks orient the agent before work; the tool hook reminds it when work is underway. Context is consumed on the host's next model request. This is a retrieval prompt, not an enforced proof that retrieval finished before a pending tool runs. Coverage, enablement and hook trust remain host controls. These hooks serve the requested workflow; unrelated event handlers, MCP services and permission overrides are not bundled.

Node.js must be available on PATH. Hook commands resolve the exported plugin-root environment variable inside Node, keeping paths with spaces out of shell interpolation. Local versions inspected: Codex 0.153.2 and Claude 2.1.168. Validate and inspect hook trust in the installed host before claiming live delivery.

## Agent registration and activation

Claude loads `agents/*.md`. Codex loads project `.codex/agents/*.toml`; init copies its bundled role definitions there, preserves conflicting files and verifies discovery. Until that registration is available, explicit native-child delegation uses the bundled role Markdown. Plugin installation alone is not claimed to register Codex custom agents.

Graph-node edits activate after human merge and safe refresh. Native skill/hook edits require updating/reloading the owning plugin. A graph clone refresh does not update installed plugin files. A fresh install still needs the user's repository choice and memory-area initialization.

The request to use Vercel skills.sh was superseded by the request for two full native plugins. Its skill installer does not establish native hooks/agent registration. Live plugin installation and an end-to-end initialization PR/MR have not been validated. The plugin source is hosted at [asafchn/Moneta](https://github.com/asafchn/Moneta); each user chooses a separate knowledge repository during init.

Sources: [Codex packaging](https://developers.openai.com/plugins/build/plugins), [Codex hooks](https://learn.chatgpt.com/docs/hooks), [Codex agents](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Claude plugin reference](https://code.claude.com/docs/en/plugins-reference), [Claude hooks](https://code.claude.com/docs/en/hooks).

## Single-message trigger

`UserPromptSubmit` screens only its `prompt` field: up to 16,384 characters, with local English phrase patterns for corrections, review changes, guidelines and tool instructions. It adds an `evolve-message` pointer for candidates. Other lifecycle events retain retrieval guidance only. The hook performs no model call, transcript/graph scan, network request or evidence write, and never echoes the source message.

This is a cheap routing heuristic, not a semantic relevance score. It can miss paraphrases, other languages or feedback beyond the scan bound, and can nominate quoted or task-specific instructions. The skill's initial no-tool triage uses visible context to reject those before graph work. Explicit invocation bypasses missed routing; current and prior applicable user opt-outs still govern execution. The existing 5-second hook timeout is a fail-open ceiling, not the intended processing latency.

One-message mode retains one source occurrence plus necessary local context, preserves the primary task, deduplicates pending proposals by occurrence/lesson, and uses the same independent evaluation and human merge process as full-session evolution. It never turns a hook candidate signal directly into approved memory.
