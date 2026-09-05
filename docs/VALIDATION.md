# Validation record

2026-09-05, native packages 0.2.0. This records source checks, not measured agent improvement.

| Check | Result |
|---|---|
| Draft 2020-12 schemas and local registry | 24 valid definitions; references resolved offline. |
| Domain nodes and indexes | Eight nodes across seven types; two agent roles; 20 mirrored relation entries; exact node/agent catalogs. |
| Templates and negative probes | Workspace/criterion/result valid; ten malformed records rejected, including missing binding/domain/agent identity. |
| Local links | 165 Markdown links resolved across source and both packages. |
| Native packaging | Two self-contained packages, 65 files each, match authoring sources byte-for-byte. |
| Native manifests and skills | Codex plugin validator, six skill validators, Claude plugin and marketplace validators passed. Both Codex agent TOML definitions parse. |
| Hook tests | Eight tests passed: four lifecycle contexts, malformed/unsupported input, unconfigured workspace and nested-repository isolation. Tests first failed with the missing hook implementation. |
| Packaged hook commands | Both host commands emitted structured context through PowerShell and cmd, including package paths containing spaces. |
| Init bootstrap | Real local Git empty-base and candidate commits produced a reviewable enrollment diff; no hosted mutation. |
| TOML role guidance | Marked guidance serialized and parsed inside developer_instructions; unrelated fields preserved. |

Run `node --test tests/native-hooks.test.cjs` and `python tools/package_plugins.py --check` for the committed executable checks. Graph/template/link checks used existing Python jsonschema, YAML and TOML tools through temporary local validation scripts; no graph validator/runtime is distributed.

## Review

Standards found two instruction inconsistencies: ambiguous exclusion of searchable skills/schema nodes, and reading the agent index before reviewed-state verification. Both corrected; focused rereview confirmed resolution.

Spec found one native-role issue: Markdown guidance could have been appended at TOML top level. Init now branches on role format, updates the TOML instruction string and verifies parsing/field preservation. Focused rereview confirmed resolution.

Current unresolved review findings: Standards 0; Spec 0.

## Limits and prior evidence

No plugin installation, real GitHub repository creation, remote PR/MR, native delegated model run or paired performance experiment was exercised. Command-level hook tests do not establish live hook trust/enablement or host event coverage. Those boundaries remain in [REQUIREMENTS.md](REQUIREMENTS.md).

Earlier 0.1.0 validation covered the flat seven-node graph, separate evaluation, local-clone retrieval and the narrow HTML on desktop/mobile. Earlier review fixed candidate activation and empty-base initialization. The current domain layout supersedes that flat layout; native hooks supersede their earlier omission. See Git history for that validation record.
