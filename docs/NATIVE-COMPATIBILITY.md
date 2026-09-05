# Native integration boundaries

| Host | Delivered | Boundary |
|---|---|---|
| Claude Code | `.claude-plugin/plugin.json`, `skills/*/SKILL.md`, `agents/*.md` | Qualified skill name `/agent-evolve:evolve`; verify discovery in the installed host. |
| Codex | `.codex-plugin/plugin.json`, `skills/*/SKILL.md` | Invoke discovered skills, normally `$evolve`. Spawn native children with role Markdown explicitly; Markdown does not register a Codex custom-agent type. |

There is no executable hook, MCP server, bundled provider client or custom graph engine. Pre-action retrieval is a role instruction. Exact bare `/evolve` and enforced retrieval before every action remain integration gaps; neither is implied by manifest validity.

The plugin's roles and supporting files resolve relative to the installed plugin, while graph/configuration paths resolve from the consuming workspace. Setup must write an actual discoverable invocation or installed role path into each target instruction file; never leave an ambiguous `agents/eval-agent.md` pointing at the consuming project.

An absent native delegation capability is a reported limitation. Do not claim a separate evaluator was used when analysis happened in the same agent.

References: [Codex plugins](https://developers.openai.com/plugins/build/plugins), [Codex skills](https://learn.chatgpt.com/docs/build-skills), [Codex subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Claude plugin reference](https://code.claude.com/docs/en/plugins-reference), [Claude skills](https://code.claude.com/docs/en/skills), [Claude subagents](https://code.claude.com/docs/en/sub-agents). Local versions inspected during implementation: Codex 0.153.2; Claude Code 2.1.168. Source delivery does not install or enable plugins.
