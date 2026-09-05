---
name: knowledge-search
description: Retrieve task-relevant agent guidance from a locally cloned Markdown graph before acting or when new information needs emerge.
---

Use existing host file/search tools. The graph is a local Git checkout.

1. Read the workspace's `.agent-evolve.md` connection file. If absent, invoke `evolve-setup`. Resolve relative locations against that file. Before ordinary retrieval, verify the remote matches `repository-url`, and `graph-root` is clean on the configured `base-branch`, matching its remote-tracking revision. Fetch and fast-forward that reviewed branch when safe; never include local-only commits or modified/untracked knowledge. Preserve an off-base or dirty checkout and use a separate clean checkout of the reviewed remote-tracking revision, or report retrieval unavailable. If fetching fails, explicitly identify the previously reviewed cached revision and its freshness limit; an unknown/unverified revision is not approved knowledge. Record the exact revision read. Candidate retrieval is permitted only when explicitly requested for evaluation: use its separate path, label it experimental, and never persist it as the ordinary connection.
2. Read `schema-definition.md` and `node-index.md` in that graph. Use the index's descriptions and the current request/intended action to write a short query. Name what you expect to need; the index informs the query rather than limiting it to a guessed node.
3. **find:** break the query into normalized words. Inspect only YAML frontmatter in `nodes/*.md`: description, tags, scope and other metadata. Select candidates by relevance. A shell/search tool may help locate headers, but body matches are not find evidence. Read through each header's closing delimiter; account for missing context or uncertain matches.
4. **walk:** inspect selected candidates' direct relations, using the edge definitions in `schema-definition.md` and its linked registry. Read connected nodes' headers and select relevant neighbors. Another hop is another explicit walk, justified by a remaining query need. Avoid cycling through visited nodes.
5. **read:** read the complete bodies of selected nodes. Preserve scope, source caveats and conflicts. Identify which guidance applies to the task; return the selected slugs and their relevant points.
6. Continue the task. Repeat retrieval if new needs emerge or the graph changes; a previous query is not proof of complete coverage.

Ordinary search is restricted to operational `nodes/*.md`. Access evaluation criteria/results through `evolve-evaluate`. Reach domain facts through the configured outside source's existing access method. Missing knowledge is a gap to report, not a reason to invent a node's contents.
