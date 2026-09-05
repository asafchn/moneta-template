# Requirements and decisions

Current authority (the final installer revision below supersedes earlier distribution details): the user's conversation, including the corrections to deliver JSON schemas, Markdown structure and skills, local cloning, agent review with existing deterministic tools, followed by native plugins, personal bootstrap repositories, sourced domain knowledge and isolated general/agent memory areas. Earlier runtime plans are superseded. This checklist tracks implementation, not demonstrated effectiveness.

| ID | Requirement / decision | Delivery |
|---|---|---|
| R01 | Native Claude Code/Codex; no Pi | Both plugin manifests; native skills and Markdown roles. |
| R02 | Graph remains schemas/Markdown with existing tools | Native hook glue and package materialization added by the later full-plugin request; no graph server/runtime. |
| R03 | Work against a local clone | `moneta-setup` initializer; generated profile and private local connection/cache; existing Git/file tools. |
| R04 | Evolve a current session or captured `.txt`, including outside runs | `evolve` captures available evidence and marks coverage; `evolve-agent` reads the supplied source. |
| R05 | Dedicated analysis and evaluation agents | Claude named Markdown agents; Codex project TOML registration through init, with explicit role delegation fallback. |
| R06 | Skill invocation in each relevant agent instruction file | Setup plus AGENTS/CLAUDE/role templates; preserve unrelated instructions. |
| R07 | Hosting flag; user supplies GitLab/GitHub URL; create MR/PR | `auto/gitlab/github`; local clone; `glab`/`gh`; human merge. Hosted role files follow their own repository's review flow. |
| R08 | Original seven node types, extended by the user | `tool-calls`, `coding-guidelines`, `agent-responsibility`, `skills`, `guard-rails`, `agentic-flow context`, `schemas`, plus `domain-knowledge`. |
| R09 | Markdown nodes; YAML metadata + summary description + body | Common schema, eight initial per-type schemas and seven ready general nodes; actual role enrollments are added explicitly. |
| R10 | Named, typed, bidirectional edges; same/cross type | Eleven directional edge schemas, inverse/endpoint registry, mirrored frontmatter. Cross-file checks are agent work. |
| R11 | Schema definition and slug-description index | Per-area `indexes/schema-definition.md`, `node-index.md`, `agent-index.md`; updated with node changes. |
| R12 | Index-informed query, tokenize, find headers, walk direct relations, read selected bodies | `knowledge-search`; repeat when new needs emerge. |
| R13 | Hook before action | Native session/prompt/subagent/tool context hooks request retrieval; they do not certify completion or block a pending tool. |
| R14 | Revised: domain-knowledge is a searchable node type | Sourced facts, structured subject/applicability and normal find/walk/read. Supersedes the earlier outside-only requirement; external authoritative sources remain available. |
| R15 | Evaluation criteria/results outside ordinary search; separate skill | `evolve-evaluate`, separate schemas, templates and configured directory. |
| R16 | Improve request/role fulfillment, API usage and coding standards | Analysis and evaluation prioritize those outcomes; tool errors are secondary evidence. |
| R17 | Agent review with deterministic tools/metrics | Existing validators, tests, linters, calculators; record command, revision, exit status and evidence. Separate agent/human judgments. |
| R18 | Score distilled improvements without claiming proof | Criterion-bound scores when a scale exists; unmeasured values remain absent/null. Proposal assessment differs from observed outcome. |
| R19 | Follow lecture evidence and raise contradictions | `course-grounding.md`; no claim that Stanford prescribes this graph or a universal admission threshold. |
| R20 | Consider further lecture-supported node types | No supplied passage establishes another required operational type. `task-cases`/`feedback` remain unadopted proposals; evaluation stays separate. |
| R21 | Narrow, quiet HTML; no system-atlas | Standalone seven-step `schema-proposal.html`. |
| R22 | Track drift, let user decide material changes | This ledger; skills raise changes to intent, schema meaning or access boundaries. |

## Implementation defaults

The user's instruction to implement followed the schema proposal. The package uses its mirrored edge representation and reusable meanings: `tool-calls` describes invocation guidance; `agentic-flow context` describes reusable flow context. Individual calls and task state remain evidence. These are implementation choices, not lecture prescriptions or separately confirmed company conventions. Changing these meanings requires user review.

No automatic promotion from criticism to permanent instruction. First distinguish missing knowledge, failed discovery, misapplication and a task-specific correction. Prefer updating applicable guidance over duplication. Keep source scope and contrary evidence.

## Remaining integration evidence

- Exact bare `/evolve` alias is not guaranteed across hosts; use host-discovered invocation names.
- Codex Markdown role files require explicit native delegation; init registers project TOML definitions.
- The reported internal-agent initialization exercised creation/clone/PR and exposed the failures recorded in INIT-TELEMETRY.md. New installer/runtime generation needs its own integration evidence.
- Native manifest validation does not establish runtime skill discovery or successful delegated runs.
- No paired agent experiment has measured future performance gains. Structural validation cannot substitute for that evidence.

Historical runtime files were preserved in `C:/Users/asafu/Downloads/excluded/agent-evolve-runtime-archive-20260905`. The active source is this repository.

## Review corrections

Ordinary retrieval now verifies and refreshes the configured reviewed `base-branch`. Candidates use a separate worktree/checkout; explicit evaluation of candidate retrieval is labeled experimental. An empty remote receives the personalized runtime/README base before seed knowledge is proposed through MR/PR. Protected initialization is reported as unavailable. Native plugin skill/role changes require their host's update/reload process; a graph refresh alone does not activate installed plugin changes.

## Latest user additions

| ID | Requirement | Delivery |
|---|---|---|
| R23 | Init asks new GitHub/GitLab repository vs existing | `init`, provider branches, retry-safe destination, enrollment review and workspace connection. |
| R24 | Revised: memory area -> indexes, node-type folders, schemas -> nodes | Bundled general template; personal `memory/general/` or `memory/<agent-slug>/`. Type registry controls placement. |
| R25 | Revised: multiple isolated agent areas in one personal repository | No slug selects general; an explicit slug selects only its area. No cross-agent reads, general fallback or cross-area edges. |
| R26 | One Codex plugin and one Claude Code plugin with hooks/components | Self-contained `plugins/moneta-codex` and `plugins/moneta-claude-code`; native adapters plus shared source. Supersedes the intermediate skills.sh proposal. |
| R27 | Apply writing-for-agents | Short init steps with completion criteria; new/existing/enrollment/connection details disclosed by branch; shared definitions have one authoring source. |

The native-plugin request supersedes the earlier omission of executable hooks. The new runtime code only emits native lifecycle context; the packaging tool copies source into installable artifacts. No custom graph search, evaluation engine or provider service was reintroduced. The later user clarification replaces shared-domain retrieval with general/agent isolation. Domain-knowledge nodes are now explicitly adopted. Cross-area edges remain invalid.

## Single-message feedback

| ID | Requirement | Delivery |
|---|---|---|
| R28 | Decide quickly whether user feedback merits evolution | UserPromptSubmit local bounded candidate screen, followed by no-tool contextual triage. Corrections, code-review changes, guidelines and tool explanations are candidate signals. |
| R29 | Evolve only one user message | `evolve-message`, bounded evidence and analysis scope; existing-knowledge/deduplication check before drafting; shared independent review and human merge. |

The fast gate is deliberately heuristic, not a Stanford-trained verifier or a universal admission score. Its language/scan limits are explicit. Full-session evolve remains available separately. The selected message may need its referenced artifact/current role to be interpreted, but this mode does not sweep the session for other lessons.

## Project identity

The project is Moneta. The template repository is `asafchn/moneta-template`; the installer is `moneta-setup`. Generated runtimes have stable destination-specific identities. Private connection/evidence paths live under the user Moneta directory; legacy `.moneta.md` overrides remain supported. The user-facing evolution workflow retains the `evolve` name.

## Personal bootstrap and isolated memory

| ID | Requirement | Delivery |
|---|---|---|
| R30 | Moneta bootstraps a user-owned repository | `init` runs the setup wizard; new repositories contain a personalized native runtime distribution and reviewed memory areas, generated from installed assets. Existing repositories remain supported. Memory PRs target the personal remote. |
| R31 | General when agent-slug is omitted | Routing contract and shared selection reference; role names, bindings and child names never infer storage. General works without an enrolled actor. |
| R32 | Explicit agent-slug isolates reads and writes | Exactly one memory area, parent selection propagated through search/analysis/evaluation, local indexes/edges, no fallback or cross-agent memory. |
| R33 | Add domain-knowledge | Eighth type with required sources, subject/applicability, mirrored permitted edges and a sourced starter example. |

These are user-approved revisions to R14/R24/R25, not lecture-prescribed storage rules. The user's repository keeps generated runtime packages and memory areas, without the template development tree. Shared native instruction changes require separate scope because they affect all agents. Existing shared graphs require explicit ownership mapping before migration; nodes are not silently copied between agents.

## One entry point for learning

| ID | Requirement | Delivery |
|---|---|---|
| R34 | Evolve chooses the flow from context or asks | The evolve skill routes setup, one selected message, current-run analysis or a supplied transcript. Ambiguous intent/source gets one focused question before capture or edits. Missing setup retains the intended learning source through initialization. |
| R35 | Getting started is easy to follow | README gives clone/install steps, one evolve entry point, plain-language examples and the human-merge activation step. Specialist skills remain available internally. |

Workflow inference does not change memory routing: absent agent-slug still means general. Automatic message hooks stay bounded and cannot bootstrap repositories. The router is an agent procedure, not a deterministic classifier or new runtime.

## Guided initialization

| ID | Requirement | Delivery |
|---|---|---|
| R36 | Init is a wizard with gh/glab preference and authentication | One unanswered question at a time; explicit provider/host, selected CLI auth verification, retry state retained. Missing authentication pauses dependent creation. |
| R37 | Choose personal or organization/group repository and privacy | New-repository owner/namespace, name and visibility are distinct choices. Private is suggested for either owner type. Existing repositories retain their owner/visibility. GitHub and GitLab creation have provider-specific references. |

New GitLab creation supersedes the earlier new-GitHub-only branch. It copies a verified bootstrap into the user's new project, then proposes memory enrollment in an MR. It requires glab plus Git access to the bootstrap, not both provider CLIs. No shell wizard, graph server or deterministic workflow classifier is introduced.

## Authentication diagnosis

| ID | Requirement | Delivery |
|---|---|---|
| R38 | Existing gh authentication must not be misdiagnosed from sandbox failures | Init checks the actual authenticated account endpoint, distinguishes transport failure from HTTP credential rejection, retries via approved network access where available, and retains wizard state. Auth-status text alone cannot trigger an invalid-token claim or logout instruction. |

| R39 | Wizard starts authentication when needed | After verified diagnosis, init launches gh/glab browser login through an interactive session, retains its handle, waits for user browser/device approval, verifies the account and resumes. Working credentials are reused; transport errors do not initiate login. |

## One setup skill

The canonical setup workflow lives at skills/init/SKILL.md. The former evolve-init and evolve-setup aliases are removed to avoid duplicate setup commands. Evolve invokes init when setup is needed; direct user commands are $init or /moneta:init. Existing plugin installations need an update and fresh session to replace cached skills.

## Active output protection

The user's security requirement authorizes a small deterministic provider-output wrapper and redactor. Authentication uses fixed-output probing; provider operations filter output before chat; browser/device codes remain in a separate user terminal. Research-backed token/key patterns and known environment values support filtering, with explicit limits in [SECURITY.md](SECURITY.md). This is not a graph or evaluation engine.


## Final installer and organization revision

This is the current distribution authority. It supersedes the earlier full-source template-copy, intermediate graph-only repository, per-codebase-init requirement and rejection of skills.sh as an installer channel.

| ID | Requirement | Delivery |
|---|---|---|
| R40 | Template repository named moneta-template; installer moneta-setup | Separate source identity and generated destination-specific plugin names. |
| R41 | Installer exposes only init; generates and installs/enables runtime | Native installers and self-contained skills.sh entry; runtime packages have evolve, extend, knowledge-search and analysis/evaluation skills plus hooks/scripts. |
| R42 | Setup once for all codebases under a chosen organization | User-supplied group/repository matching rules in runtime moneta.json; only local Git origin is inspected, including subgroups/future repositories. No remote enumeration or code scan. |
| R43 | Multiple/repeated init | Destination-specific plugin identities; preserve bindings and reuse pending reviews. Conflicting/overlapping bindings require a user decision. |
| R44 | Optional repository purpose | Wizard asks once, accepts skip, and writes purpose-aligned README without inventing policy or inferring access. |
| R45 | Extend node/edge types through a wizard | First assess existing representations; define typed fields, endpoints and both directions; validate compatibility and propose scoped schema/node/index changes through review. |
| R46 | Read-only provider credentials are acceptable | Complete independent local preparation/validation/installation, retain receipts, report exact blocked write and manual commands; resume without duplicate creation or forced reauthentication. |
| R47 | Shorter, calmer init; recover real telemetry failures | Direct verified filesystem copy, ready general seed, offline Registry validation, serialized YAML, per-command exit checks; concise progress. No measured latency guarantee. |
| R48 | Native activation and reviewed memory are distinct | Init installs/enables the generated runtime; host trust/new-chat reload and graph merge are reported separately. No silent hook trust bypass or automatic human-merge substitute. |

One machine's init does not configure teammates or CI remotely. They install the generated plugin through their host or managed distribution. Runtime changes affect connected agents and require separate scope/review from memory changes. Raw transcripts/evaluation remain private; purpose text does not authorize organization browsing or cross-agent memory.
