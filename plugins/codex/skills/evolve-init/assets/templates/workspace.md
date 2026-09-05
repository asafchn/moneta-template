---
repository-url: https://github.com/example/knowledge-graph
hosting: auto
base-branch: main
checkout: .evolve-local/graph
graph-root: .evolve-local/graph
evaluation-root: .evolve-local/evaluation
domain-source: null
bindings:
  - agent: coding-agent
    domain: engineering
    role-file: AGENTS.md
  - agent: review-agent
    domain: engineering
    role-file: review-agent.md
---

# Agent Evolve connection template

Copy to `.agent-evolve.md` in the consuming workspace. Replace the example repository URL with the user's actual URL. Resolve relative paths from that connection file's directory. Set hosting explicitly for an ambiguous self-hosted domain.

The agent clones/fetches with existing Git tools. The checkout is ordinary local files. Domain sources are optional until supplied; when present use `location` and `access` fields describing their existing access method. Validate this frontmatter against the selected domain's `schemas/workspace.schema.json`.

Set `base-branch` from the repository's actual reviewed default/base branch; `main` above is an example. Ordinary retrieval must verify this branch and its remote-tracking revision. Keep candidate work in a separate checkout.

`graph-root` is the graph repository root. Each binding maps an actual role file to a domain and responsibility-node slug. Resolve the current agent from its role file or explicit input; ask when ambiguous. These two bindings are examples: init records only agents actually enrolled.
