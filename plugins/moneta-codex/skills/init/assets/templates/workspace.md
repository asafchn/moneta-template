---
repository-url: https://github.com/example/my-moneta
hosting: auto
base-branch: main
checkout: .moneta-local/repository
graph-root: .moneta-local/repository/memory
evaluation-root: .moneta-local/evaluation
domain-source: null
bindings: []
---

# Personal Moneta connection

Copy to `.moneta.md` in the consuming workspace and use the user's actual repository URL, reviewed branch and local paths. Resolve relative paths from this connection file. Validate against the selected area's `schemas/workspace.schema.json`.

The default is always general when the invocation omits agent-slug. A supplied slug selects only its memory area. Bindings record enrollment; they do not override invocation defaults. Example enrollment entry: `{agent: coding-agent, memory-scope: coding-agent, role-file: AGENTS.md}`. Add only real roles. General can have no bindings.

The graph-root is the personal repository's `memory/` directory, containing `general/` and any explicit agent-slug directories. Keep candidates separate from the reviewed checkout. Optional domain-source specifies `{location, access}` for an authoritative external source; sourced domain-knowledge nodes are searched normally.
