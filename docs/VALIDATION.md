# Validation record

2026-09-05, native packages 0.7.0. This records source checks, not measured agent improvement.

| Check | Result |
|---|---|
| Draft 2020-12 schemas and local registry | 26 valid definitions; references resolved offline. |
| Memory template and indexes | Nine starter nodes across eight types; two illustrative role formats; 22 mirrored relation entries; exact node/agent catalogs. Init retains only actual enrollments. |
| Templates and negative probes | Workspace/criterion/result valid; 19 malformed records rejected across graph, routing, sources and legacy identity probes. Three routing examples and two enrollment examples validated; empty general bindings are valid. |
| Local links | 272 Markdown links resolved across source and both packages. |
| Native packaging | Two self-contained packages, 83 files each, match authoring sources byte-for-byte. |
| Native manifests and skills | Codex plugin validator, six skill validators, Claude plugin and marketplace validators passed. Both Codex agent TOML definitions parse. |
| Hook tests | 36 tests passed: feedback routing, routine/explicit/opt-out cases, mixed messages, bounded scan, four lifecycle contexts, prompt-content isolation and workspace boundaries. New gate tests first failed before implementation; regression cases failed before fixes. |
| Packaged hook commands | Both host commands emitted structured context through PowerShell and cmd, including package paths containing spaces. |
| Init bootstrap | Earlier local empty-base/candidate experiment remains historical evidence. Current personal template-copy and existing-repository import procedures have not been exercised end to end. |
| TOML role guidance | Marked guidance serialized and parsed inside developer_instructions; unrelated fields preserved. |

Run `node --test tests/message-gate.test.cjs tests/native-hooks.test.cjs tests/provider-output.test.cjs` and `python tools/package_plugins.py --check` for the committed executable checks. Graph/template/link checks used existing Python jsonschema, YAML and TOML tools through temporary local validation scripts; no graph validator/runtime is distributed.

## Single-message timing

Local measurement: 10,000 gate decisions averaged 0.0006 ms on the tested review message. Twenty complete Node hook runs, including startup and connection lookup, measured median 43.69 ms and p95 47.38 ms. Host shell and agent work are excluded. These are local measurements, not a production latency or semantic-recall guarantee.

## Review

Standards found two instruction inconsistencies: ambiguous exclusion of searchable skills/schema nodes, and reading the agent index before reviewed-state verification. Both corrected; focused rereview confirmed resolution.

Spec found one native-role issue: Markdown guidance could have been appended at TOML top level. Init now branches on role format, updates the TOML instruction string and verifies parsing/field preservation. Focused rereview confirmed resolution.

The 0.3.0 review found two instruction gaps: prior-assessment lookup bypassed the evaluation skill, and full-session analysis omitted its explicit source mode. Both were fixed and rereviewed. Spec review found no concrete violation in the one-message flow.

Current unresolved review findings: Standards 0; Spec 0.

## Limits and prior evidence

No complete initialization of a hosted knowledge repository, remote PR/MR, native delegated evolution run or paired performance experiment was exercised. The 0.7.0 installation and bounded live init test are recorded below. Creating the Moneta source repository does not validate those workflows. Command-level hook tests do not establish live hook trust/enablement or host event coverage. Those boundaries remain in [REQUIREMENTS.md](REQUIREMENTS.md).

Earlier 0.1.0 validation covered the flat seven-node graph, separate evaluation, local-clone retrieval and the narrow HTML on desktop/mobile. Earlier review fixed candidate activation and empty-base initialization. The current isolated memory-area layout supersedes that flat layout; native hooks supersede their earlier omission. See Git history for that validation record.

## Moneta branding validation

Version 0.4.0 renames both native plugins to `moneta`, the marketplace to `moneta-native`, generated package directories to `plugins/moneta-codex` and `plugins/moneta-claude-code`, and workspace connections to `.moneta.md`. Existing workflow names, including `evolve`, are retained. The 36 hook tests, seven skill validators, both plugin validators and Claude marketplace validation passed after the rename. Both 71-file packages match their authoring sources.

## Personal memory revision

Version 0.5.0 adds the init entry point, personal bootstrap workflow, general/agent routing contract and sourced domain-knowledge. Scope selection is an agent procedure; JSON Schema validates arguments but does not enforce file access. Cross-agent read isolation requires actual access evidence and remains unverified in live delegated runs. Git checks establish changed-file scope only.

Review found an obsolete agent/domain instruction and an overclaim that Git could verify reads. Both were corrected and focused Standards/Spec rereviews reported zero remaining actionable findings. Existing-repository init now proposes missing bootstrap files through review with collision preservation.

## Getting started, flow selection and setup wizard

Version 0.6.0 makes evolve select setup, one-message learning or run/transcript analysis from explicit intent and context, with a focused question for ambiguity. Init asks provider preference and checks the chosen CLI authentication, then collects a new/existing destination and separates ownership from visibility. New GitLab creation uses documented glab flags; GitLab access to the memory destination does not replace Git access to the private bootstrap.

Skill, plugin, marketplace, package-parity and local schema/link checks passed. The executable hook runtime is unchanged from the 36-test validation above. Router decisions and wizard conversations are agent instructions, not a tested deterministic classifier. Neither provider's end-to-end wizard nor a live personal repository creation was exercised in this revision; glab is absent locally. GitLab CLI semantics were checked against official documentation linked in the provider reference.

Standards and Spec review identified a deferred-source gap. Evolve now freezes evidence and saves a private pending receipt before setup; resume verifies and consumes that source rather than capturing a later run. Focused rereviews found no remaining actionable issue.

## Authentication and output protection

Version 0.7.0 consolidates setup under init and adds a bounded provider-output wrapper. All 55 tests passed: 36 hook tests and 19 security tests. Security cases cover split output, encoded known credentials (including mixed-case percent escapes and form encoding), token/key patterns, strict account fields, runtime debug rejection, bounded failure output and API-probe bypass attempts. Regression cases failed before their fixes.

The live GitHub helper probe returned login-required in the isolated context and authenticated asafchn with approved user/network access. Init now retries in that context before deciding login is needed. No credentials were replaced. Browser login launch and GitLab remain untested; glab is absent. Source/package, schema/link, skill and both host manifest validators passed.

Security review found lowercase URL escapes and alternate API argument order bypasses. Both were corrected with failing-then-passing regression tests. Generic API output is now withheld; repository/PR/MR operations remain supported. Protection limits and research sources are recorded in [SECURITY.md](SECURITY.md).


Installed Moneta 0.7.0 through the Codex marketplace CLI and verified enabled status. A fresh ephemeral Codex conversation loaded the installed init skill, received network-blocked from its first account probe, retried through approved access, verified asafchn, then asked new versus existing repository. It neither invoked raw auth status nor requested reauthentication. This validates the reported authentication failure path and wizard continuation, not repository creation or full enrollment. Native SessionStart/UserPromptSubmit/PreToolUse hooks completed during this bounded run.
