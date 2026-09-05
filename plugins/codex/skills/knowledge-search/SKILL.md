---
name: knowledge-search
description: Retrieve task-relevant agent guidance from a locally cloned Markdown graph before acting or when new information needs emerge.
---

Use existing host file/search tools. The graph is a local Git checkout.

1. Read `.agent-evolve.md`; invoke `evolve-init` if absent. Resolve the active `(domain, agent)` binding from its role file or explicit input; ask if ambiguous. Verify the selected responsibility node through `indexes/agent-index.md`. Use [reviewed state](references/reviewed-state.md) before reading knowledge. Completion: one active identity, clean reviewed revision and domain path under `graph-root` are known.
2. Read `indexes/schema-definition.md` and `indexes/node-index.md` in that domain. Use the index's descriptions and the current request/intended action to write a short query. Name what you expect to need; the index informs the query rather than limiting it to a guessed node.
3. **find:** break the query into normalized words. Inspect only YAML frontmatter in direct Markdown files of the type directories from that domain's `schemas/node-types.json`: description, tags, scope and other metadata. Select candidates by relevance. A shell/search tool may help locate headers, but body matches are not find evidence. Read through each header's closing delimiter; account for missing context or uncertain matches.
4. **walk:** inspect selected candidates' direct relations, using the edge definitions in `indexes/schema-definition.md` and its linked registry. Read connected nodes' headers and select relevant neighbors. Another hop is another explicit walk, justified by a remaining query need. Avoid cycling through visited nodes.
5. **read:** read the complete bodies of selected nodes. Preserve scope, source caveats and conflicts. Identify which guidance applies to the task; return the selected slugs and their relevant points.
6. Continue the task. Repeat retrieval if new needs emerge or the graph changes; a previous query is not proof of complete coverage.

Ordinary search stays in the selected domain's registered node-type directories; JSON definitions, indexes and subdirectories are not nodes. Access evaluation criteria/results through `evolve-evaluate`. Reach domain facts through the configured outside source's existing access method. Missing knowledge is a gap to report, not a reason to invent a node's contents.
