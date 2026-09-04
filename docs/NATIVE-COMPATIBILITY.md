# Native compatibility audit for agent-evolve

Verified 5 September 2026. Audit only: no plugin installed, configuration changed, model called, or paid trial run. Current design authority: [current specification](SPEC.md).

## Findings that affect implementation

Both hosts have native plugins, skills, MCP and lifecycle hooks. The material unresolved items are exact command spelling, how Codex registers named custom agents, and what **before an action** means. A hook that adds instructions while allowing an already-selected tool call does not establish that retrieval happened before that call.

The local plugin-creator material is stale about Codex hooks. Its validator rejects a manifest `hooks` field, but current official documentation supports that field and automatic discovery at `hooks/hooks.json`. Omit the manifest field and use the default location: that satisfies the local validator without discarding hook functionality. This is a resolved compatibility discrepancy, not a reason to replace hooks with prompts.

## Local observations

Read-only commands produced:

| Check | Observed |
|---|---|
| `codex --version` | `codex-cli 0.153.2` |
| `claude --version` | `2.1.168 (Claude Code)` |
| `codex features list` | `hooks stable true`, `plugins stable true`, `multi_agent stable true`; `plugin_hooks removed false` |
| `codex plugin --help` | Marketplace, add, list, remove commands |
| `claude plugin --help` | Native init, validation, install, details and marketplace commands |
| `claude --help` | `--agent`, `--agents`, `--plugin-dir`, `--mcp-config` |

The removed `plugin_hooks` feature is not evidence that plugin hooks are unavailable. Current documentation uses `hooks` as the canonical feature.

Local source inspected: [plugin validator](C:/Users/asafu/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py:106), [skill instruction](C:/Users/asafu/.codex/skills/.system/plugin-creator/SKILL.md:195), and [conflicting bundled reference](C:/Users/asafu/.codex/skills/.system/plugin-creator/references/plugin-json-spec.md:18). The validator's allowed top-level fields omit `hooks`; the bundled reference shows it. The native application is not that Python validator.

These checks establish installed versions and exposed configuration surfaces, not an end-to-end plugin test. Current Claude documentation explicitly describes features introduced after local 2.1.168; version-sensitive behavior must be tested against this binary.

## Packaging contracts

### Codex

Entry point: `.codex-plugin/plugin.json`. Components live at the plugin root. `skills` and `mcpServers` can point to component paths. `hooks/hooks.json` is discovered automatically. Explicit `hooks` can instead select paths or inline definitions. Bundled hooks require review/trust even after plugin installation. Hook commands receive `PLUGIN_ROOT` / `PLUGIN_DATA` and Claude-compatible aliases. The official packaging page accepts direct or `mcp_servers`-wrapped server maps. [Official packaging](https://developers.openai.com/plugins/build/plugins)

Illustrative manifest, before publisher metadata required by the local scaffold validator:

```json
{
  "name": "agent-evolve",
  "version": "0.1.0",
  "description": "Retrieve operational knowledge and propose evidence-backed improvements.",
  "skills": "./skills/",
  "mcpServers": "./.mcp.codex.json"
}
```

### Claude Code

Entry point: `.claude-plugin/plugin.json`. Native components include root `skills/`, `agents/`, `hooks/hooks.json`, and `.mcp.json`. Its MCP wrapper is `mcpServers`. `${CLAUDE_PLUGIN_ROOT}` resolves bundled paths. Plugin agents are Markdown with frontmatter; register `evolve-agent` and `eval-agent` there. Do not place hook definitions inside plugin agent frontmatter: current documentation excludes `hooks`, `mcpServers` and `permissionMode` for plugin-shipped agents. [Official plugin reference](https://code.claude.com/docs/en/plugins-reference)

Illustrative Claude stdio configuration; the server filename is an example, not a runtime-language decision:

```json
{
  "mcpServers": {
    "agent-evolve": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/dist/mcp.js"]
    }
  }
}
```

Use separate adapter config files where host field names differ. Do not assume identical JSON wrappers. Codex supports local STDIO with command, args, env and cwd; its local configuration is shared by CLI, desktop and IDE. [Official Codex MCP](https://learn.chatgpt.com/docs/extend/mcp?surface=cli)

Codex plugin-root substitution **inside MCP args** still needs a parser/launch smoke test: the fetched packaging page explicitly establishes root variables for hooks, but does not fully specify MCP argument expansion. Do not substitute the current developer checkout's absolute path into a distributable plugin and call portability complete.

## Native entry paths and named agents

Codex's documented explicit skill interface is `$skill` or `/skills`; `agents/openai.yaml` supplies optional appearance, invocation policy and dependencies. It is not a custom-agent definition. Use `$evolve` / `$evolve-agent` only as native invocation candidates until the installed plugin's qualified names are inspected. An exact custom `/evolve` command is not established by the fetched documentation. [Official skills](https://learn.chatgpt.com/docs/build-skills)

Codex custom agents are standalone `.codex/agents/*.toml` or `~/.codex/agents/*.toml`, each containing `name`, `description`, and `developer_instructions`. These configure spawned sessions. The official plugin manifest documentation does not establish automatic registration of plugin `agents/*.toml`. [Official subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)

Illustrative project agent:

```toml
name = "evolve-agent"
description = "Analyze a supplied run transcript and propose supported knowledge changes."
developer_instructions = """
Invoke the installed evolve workflow skill. Preserve the supplied source evidence.
Use eval-agent for assessment through the separate evaluation skill.
"""
```

Claude plugin skills have a qualified name such as `/agent-evolve:evolve`. Current docs also describe a bare name when unambiguous; its behavior on local 2.1.168 is not verified. `context: fork` can execute a skill using an agent, but that fork does not inherit conversation history. Therefore the live-session path must hand over a captured source path/context explicitly; adding `context: fork` alone cannot satisfy analysis of the current run. [Official skills](https://code.claude.com/docs/en/skills)

Claude agents can preload skills with a frontmatter `skills` list. These skill instructions become agent context. Plugin agent identifiers are scoped by plugin; use the observed scoped identifier during dispatch. The local CLI exposes `--agent` for selecting an agent for a session. [Official subagents](https://code.claude.com/docs/en/sub-agents)

**Decision to raise:** are native `$evolve` on Codex and qualified Claude names acceptable while keeping the product workflow called `/evolve`? For Codex, is project registration of the two TOML agents acceptable, or should the plugin skill direct native children with explicit instructions? Do not silently call a same-session skill a dedicated agent.

## Hook input and output contracts

Codex `PreToolUse` accepts JSON context or a deny decision. Inputs include `session_id`, nullable `transcript_path`, `cwd`, event, and tool name/input/id; tool events also have `turn_id`. Shell/unified-exec match `Bash`; patch calls match `apply_patch`, `Edit`, or `Write`. MCP and most local functions are covered; hosted tools are excluded and some specialized paths opt out. Transcript format is explicitly unstable. Plain stdout is ignored for this event. `UserPromptSubmit` and `SubagentStart` support context injection. Commands and MCP-tool hooks are supported; prompt/agent hook handlers are skipped. [Official Codex hooks](https://learn.chatgpt.com/docs/hooks)

Claude also supports `PreToolUse` additional context and deny decisions. Its additional context is consumed on the next model request. Hook inputs include session, transcript, working directory, event and tool information. `UserPromptSubmit` can provide guidance before the model processes the request. [Official Claude hooks](https://code.claude.com/docs/en/hooks)

Example input subset consumed by our adapter:

```json
{
  "session_id": "example-session",
  "cwd": "C:/work/product",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_use_id": "example-call",
  "tool_input": {"command": "git diff"}
}
```

Example context response, using our instruction wording:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "Invoke the knowledge retrieval skill before acting. Read schema-definition and node-index. Form your own query for this task; run find, then walk, then read selected bodies. Evaluation material uses its separate skill; domain facts stay in their outside source."
  }
}
```

Example deny response if the user selects strict retrieval ordering:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Retrieve relevant knowledge first, then retry this action."
  }
}
```

These are contract examples, not an installed hook. A `PreToolUse` context response permits the pending operation; it does not itself run another model step before execution. That creates the central ordering gap with an index-led, agent-generated query.

## Material choices to raise before fixing behavior

| ID | Choice | Consequence |
|---|---|---|
| N01 | Prompt/subagent-start reminder, or strict deny/retrieve/retry before covered operations? | Reminder is simpler but cannot guarantee order. Blocking introduces retry/state behavior the user has not explicitly selected. |
| N02 | What invalidates a retrieval pass: new user turn, changed task, new action class, graph revision? | A single session boolean would silently permit unrelated later actions; every tool gate can cause loops and excessive retrieval. |
| N03 | Exact invocation spelling and Codex named-agent registration | Documented native interfaces differ between hosts; no silent wrapper replacing native packaging. |
| N04 | Unsupported hook paths | A universal promise covering every possible action exceeds documented Codex coverage. |
| N05 | Live-session source handoff | Imported TXT is explicit; native transcript capture needs adapters, source completeness checks and provenance. Missing transcript cannot become invented telemetry. |

These are product decisions inferred from the user's ordering and native-host requirements, not Stanford prescriptions.

## Implementation checks justified by this audit

1. Validate both manifests and inspect discovered skills/agents/hooks with no model generation first. Default Codex hook discovery resolves the local validator discrepancy.
2. Exercise hook adapters using event fixtures; verify event-specific JSON, Windows paths containing spaces, and no accidental shell interpolation of transcript text.
3. Exercise stdio initialization, tools/list and retrieval calls in both packaging layouts. Confirm plugin-root expansion and installation-cache paths explicitly.
4. Keep ordinary graph retrieval and evaluation access distinct at tool/skill boundaries. Source references alone must not pull evaluation bodies into normal walk/read.
5. Once ordering is chosen, test retrieval's own tools never recursively block, separate agents do not accidentally reuse another agent's retrieval state, and graph changes invalidate stale receipts according to the chosen policy.
6. Report native model-driven trials separately from fixture/schema tests. This audit performed none and does not prove that an agent followed the instructions.

The official docs substantiate available host mechanisms. Whether retrieval selects useful guidance, whether eval-agent's assessments are useful, and whether later work improves remain separate evaluations of our implementation.
