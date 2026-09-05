---
name: evolve
description: Improve agent guidance from a current run or captured transcript, using a dedicated analysis agent, evidence-based evaluation and a Git MR or PR.
---

1. Read `.agent-evolve.md`. Invoke `evolve-setup` if no connection exists. Inspect the local graph's base branch, revision and working state. Work in a new change branch or separate checkout; preserve unrelated work.
2. Identify the source. For a file, use the supplied path, including plain `.txt` from a run without this plugin. For the current run, use an available native transcript export or capture the visible request, relevant role instructions, actions, artifacts and human corrections into a private source file. Explicitly mark incomplete capture. Preserve original files and exact evidence locators; do not reconstruct missing history or hidden reasoning.
3. Invoke `evolve-agent` to analyze that source in a dedicated native child. Pass the source path, coverage limits, local graph path/base revision, applicable role-file paths/revisions and expected outcome. The child follows [the analysis role](../../agents/evolve-agent.md). A child does not automatically inherit the whole source session.
4. Receive the analysis, proposed graph changes and evidence references. Inspect the original request and applicable instructions before deciding what generalizes. Supported changes may update an existing node, description, skill, relationship or schema. A supported no-change result is valid.
5. Invoke a separate `eval-agent` with [the evaluation role](../../agents/eval-agent.md) and `evolve-evaluate`. Pass the exact proposed diff/revision and original evidence. The evaluator runs available deterministic checks and assesses task fulfillment under the applicable criteria. Keep its result outside ordinary search.
6. Resolve supported findings and rerun affected checks. A changed candidate invalidates assessment of the old candidate. Raise any material change to the user's intent, node meanings or access boundaries before making it.
7. Follow [hosted review](references/hosted-review.md) to prepare the diff and open an MR/PR with `glab` or `gh`. Include checks actually run, metric definitions/results, judgment provenance and unresolved limitations. Publish evidence references and reviewable summaries; retain raw telemetry privately by default.

Completion: either a supported no-change analysis, or a review request for a specific assessed diff. Human merge controls shared knowledge activation. A merge or a favorable proposal score does not itself demonstrate improved future agent performance.
