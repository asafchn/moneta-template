---
name: evolve-setup
description: Connect an agent workspace to a GitHub or GitLab knowledge graph by cloning it locally and adding explicit skill-invocation guidance.
---

The user supplies the graph repository URL. Reuse a previously supplied URL and connection. Use existing Git/file tools throughout.

1. Identify the URL and `hosting: auto | gitlab | github`. `github.com` and `gitlab.com` resolve automatically. For an ambiguous self-hosted domain, obtain the hosting flag. Use existing authentication; keep credentials out of stored URLs and Markdown.
2. Choose a local checkout under the workspace's `.evolve-local/graph`. If a connection already names a checkout, inspect its remote and worktree state first. Clone the supplied repository if needed. Fetch updates with existing Git tools; fast-forward only a clean checkout on its intended base branch. Preserve unrelated local changes.
3. Find its `schema-definition.md`, `node-index.md`, `schemas/` and `nodes/`. If the repository is empty, prepare the starter graph from this plugin's root in a branch and open an initialization MR/PR. If it has another format, raise the schema difference before migrating it. Never overwrite existing knowledge to fit this package.
4. Create `.agent-evolve.md` in the consuming workspace using [the connection template](../../templates/workspace.md). Point `graph-root` to the local checkout and `evaluation-root` to a separate local directory, normally `.evolve-local/evaluation`. Set `domain-source` only when the user supplies a source; otherwise use null.
5. Add explicit invocation guidance to the relevant `AGENTS.md`, `CLAUDE.md` or role file using [Codex](../../templates/AGENTS-addition.md), [Claude](../../templates/CLAUDE-addition.md) or [role-file](../../templates/role-agent-addition.md) guidance. Preserve all unrelated content; maintain one marked block. If the role file is hosted, propose its edit through that repository's review flow.
6. Keep `.evolve-local/` ignored in the consuming workspace so captured telemetry and local clones are not committed. Preserve existing ignore rules.
7. Invoke `knowledge-search` on a representative task. Verify the agent can read the schema/index, find headers, follow a mirrored relation and read selected bodies. Report the actual invocation names discovered by the native host.

Claude plugin agents are in `agents/`. In Codex, use a native child agent with the matching Markdown role instructions; this package does not register TOML custom-agent definitions. Exact bare `/evolve` support is host-dependent; do not present `$evolve` or a qualified plugin command as a verified bare alias.

The pre-action behavior is explicit agent guidance. This declarative package contains no executable hook that blocks tool calls.
