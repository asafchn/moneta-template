# Validation record

2026-09-05, native packages 0.3.0. This records source checks, not measured agent improvement.

| Check | Result |
|---|---|
| Draft 2020-12 schemas and local registry | 24 valid definitions; references resolved offline. |
| Domain nodes and indexes | Eight nodes across seven types; two agent roles; 20 mirrored relation entries; exact node/agent catalogs. |
| Templates and negative probes | Workspace/criterion/result valid; ten malformed records rejected, including missing binding/domain/agent identity. |
| Local links | 183 Markdown links resolved across source and both packages. |
| Native packaging | Two self-contained packages, 71 files each, match authoring sources byte-for-byte. |
| Native manifests and skills | Codex plugin validator, seven skill validators, Claude plugin and marketplace validators passed. Both Codex agent TOML definitions parse. |
| Hook tests | 36 tests passed: feedback routing, routine/explicit/opt-out cases, mixed messages, bounded scan, four lifecycle contexts, prompt-content isolation and workspace boundaries. New gate tests first failed before implementation; regression cases failed before fixes. |
| Packaged hook commands | Both host commands emitted structured context through PowerShell and cmd, including package paths containing spaces. |
| Init bootstrap | Real local Git empty-base and candidate commits produced a reviewable enrollment diff; no hosted mutation. |
| TOML role guidance | Marked guidance serialized and parsed inside developer_instructions; unrelated fields preserved. |

Run `node --test tests/message-gate.test.cjs tests/native-hooks.test.cjs` and `python tools/package_plugins.py --check` for the committed executable checks. Graph/template/link checks used existing Python jsonschema, YAML and TOML tools through temporary local validation scripts; no graph validator/runtime is distributed.

## Single-message timing

Local measurement: 10,000 gate decisions averaged 0.0006 ms on the tested review message. Twenty complete Node hook runs, including startup and connection lookup, measured median 43.69 ms and p95 47.38 ms. Host shell and agent work are excluded. These are local measurements, not a production latency or semantic-recall guarantee.

## Review

Standards found two instruction inconsistencies: ambiguous exclusion of searchable skills/schema nodes, and reading the agent index before reviewed-state verification. Both corrected; focused rereview confirmed resolution.

Spec found one native-role issue: Markdown guidance could have been appended at TOML top level. Init now branches on role format, updates the TOML instruction string and verifies parsing/field preservation. Focused rereview confirmed resolution.

The 0.3.0 review found two instruction gaps: prior-assessment lookup bypassed the evaluation skill, and full-session analysis omitted its explicit source mode. Both were fixed and rereviewed. Spec review found no concrete violation in the one-message flow.

Current unresolved review findings: Standards 0; Spec 0.

## Limits and prior evidence

No plugin installation, real GitHub repository creation, remote PR/MR, native delegated model run or paired performance experiment was exercised. Command-level hook tests do not establish live hook trust/enablement or host event coverage. Those boundaries remain in [REQUIREMENTS.md](REQUIREMENTS.md).

Earlier 0.1.0 validation covered the flat seven-node graph, separate evaluation, local-clone retrieval and the narrow HTML on desktop/mobile. Earlier review fixed candidate activation and empty-base initialization. The current domain layout supersedes that flat layout; native hooks supersede their earlier omission. See Git history for that validation record.
