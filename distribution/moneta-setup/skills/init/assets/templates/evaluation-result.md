---
id: pending-review
memory-scope: general
agent: coding-agent
kind: proposal-assessment
subject: Replace with the candidate commit or an exact retained diff locator.
base-revision: Replace with the baseline Git revision.
criterion: null
criterion-revision: null
assessor: Replace with the actual reviewer identity and method.
scores: []
recommendation: insufficient-evidence
evidence: []
limitations:
  - Template only; no evaluation has run.
checks: []
metrics: []
---

# Evaluation result template

Replace this template's identity/subject fields with real values. Store the completed record under the configured evaluation root's `<memory-scope>/<agent>/results/` directory. Use `schemas/evaluation-result.schema.json` for frontmatter fields.

## Findings

Describe each supported defect or improvement with the requested outcome, applicable instruction, artifact/source locator and scope. Distinguish source claims from verified observations and inferred explanations.

## Deterministic checks

For each actual check, record criterion, command/tool invocation, working directory, revision, execution state, exit status and evidence path in `checks`. An unrun or unavailable check has a null exit status. Retain the tool output locally; do not replace it with an assertion that it passed.

## Metrics and judgments

For each metric, record name, baseline/candidate/single-run condition, value or null, unit, evidence source and method in `metrics`. State denominators and task counts. Scores follow an explicit criterion scale and are separate from measured performance.

## Limits and recommendation

Explain missing inputs, unknown measurements, task-specific scope, comparison limits and whether evidence supports proposing, revising, doing nothing or further investigation. A draft MR can be useful without a demonstrated general performance gain; label that limit.
