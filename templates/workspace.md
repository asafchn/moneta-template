---
repository-url: https://github.com/example/knowledge-graph
hosting: auto
checkout: .evolve-local/graph
graph-root: .evolve-local/graph
evaluation-root: .evolve-local/evaluation
domain-source: null
---

# Agent Evolve connection template

Copy to `.agent-evolve.md` in the consuming workspace. Replace the example repository URL with the user's actual URL. Resolve relative paths from that connection file's directory. Set hosting explicitly for an ambiguous self-hosted domain.

The agent clones/fetches with existing Git tools. The checkout is ordinary local files. Domain sources are optional until supplied; when present use `location` and `access` fields describing their existing access method. Validate this frontmatter against `schemas/workspace.schema.json` in the plugin package.
