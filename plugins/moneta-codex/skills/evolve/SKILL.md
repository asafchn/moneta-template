---
name: evolve
description: Improve agent guidance from a current run or captured transcript, using a dedicated analysis agent, evidence-based evaluation and a Git MR or PR.
---

1. Read `.moneta.md`. Invoke `evolve-init` if no connection exists. Resolve and retain the active domain/agent binding; ask when ambiguous. Verify and refresh the reviewed `base-branch` using [reviewed state](../knowledge-search/references/reviewed-state.md). Create the candidate branch in a separate local Git worktree/checkout from that reviewed revision, normally under `.moneta-local/candidates/`. Keep the configured retrieval checkout on reviewed state and preserve unrelated work.
2. Identify the source. For a file, use the supplied path, including plain `.txt` from a run without this plugin. For the current run, use an available native transcript export or capture the visible request, relevant role instructions, actions, artifacts and human corrections into a private source file. Explicitly mark incomplete capture. Preserve original files and exact evidence locators; do not reconstruct missing history or hidden reasoning.
3. Invoke `evolve-agent` to analyze that source in a dedicated native child. Pass `source-mode: session`, the source path, coverage limits, active domain/agent, reviewed graph path/base revision, separate candidate checkout path, applicable role-file paths/revisions and expected outcome. The child follows [the analysis role](../evolve-agent/references/role.md). A child does not automatically inherit the whole source session.
4. Receive the analysis, proposed graph changes and evidence references. Inspect the original request and applicable instructions before deciding what generalizes. Supported changes may update an existing node, description, skill, relationship or schema. A supported no-change result is valid.
5. Follow [candidate review](references/review-candidate.md) with `source-mode: session`. Completion: an assessed review request, supported no-change result or explicit publication limitation.


Completion: either a supported no-change analysis, or a review request for a specific assessed diff. Human merge controls shared knowledge activation. A merge or a favorable proposal score does not itself demonstrate improved future agent performance.
