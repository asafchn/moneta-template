# Validation record

2026-09-05. Source package validation, not a measured improvement in agent performance.

| Check | Actual result |
|---|---|
| Existing Python `jsonschema` Draft 2020-12 validator; local `$id` registry | 24 schema definitions valid; references resolved offline. |
| Existing YAML parser plus graph consistency checks | Seven nodes valid, one per type; 16 mirrored relation entries; eleven edge definitions with compatible inverses/endpoints. |
| Index and local Markdown links | Seven exact slug/description entries; 50 local links resolved before adding this report link. |
| Workspace, criterion and result templates | All three frontmatters validated. |
| Invalid-record probes | Seven rejected: missing summary, evaluation type in operational search, extra field, empty typed payload, unknown edge, score without criterion, unrun check with successful exit code. |
| Codex plugin validator, skill quick validator, `claude plugin validate` | Both manifests and all five skills passed. |
| Local Git clone retrieval smoke | Schema/index read; task query; headers inspected; direct edge definitions followed; four selected bodies read. No evaluation records retrieved. |
| Narrow HTML | Seven sections, unique IDs, local link and JavaScript syntax passed. Earlier desktop/mobile visual checks covered all steps; this revision changes text only. |

Validation used existing installed tools and temporary local scripts; no validator, server or runtime was added to the package.

## Standards review

One documented-standard violation found: ordinary retrieval could consume an unmerged candidate left in the configured checkout. Fixed with verified reviewed-base retrieval, safe refresh, separate candidate worktrees and explicitly experimental candidate evaluation. Focused rereview confirmed resolution; no residual standards finding.

## Spec review

Two findings found: the same unmerged-candidate activation gap, and initialization instructions that attempted an MR without any base commit. Both fixed. An empty base precedes the seed proposal, and protected initialization remains a reported limitation. Focused rereview found no new workflow contradiction. No additional scope creep found.

Final review totals: Standards 0 unresolved; Spec 0 unresolved. The original findings were one Standards P1 and two Spec findings (P1/P2).

## Unexercised integration

No plugin installation, hosted graph connection, real session delegation, remote MR/PR, executable hook or paired agent-performance experiment was exercised. Manifest validity and this agent's file-access smoke do not establish those outcomes. Remaining host/scope limits are tracked in [REQUIREMENTS.md](REQUIREMENTS.md).
