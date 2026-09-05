# Requirements and decisions

Current authority: the user's conversation, including the corrections to deliver JSON schemas, Markdown structure and skills, local cloning, agent review with existing deterministic tools, followed by init, shared domains, and two full native plugins with hooks. Earlier runtime plans are superseded. This checklist tracks implementation, not demonstrated effectiveness.

| ID | Requirement / decision | Delivery |
|---|---|---|
| R01 | Native Claude Code/Codex; no Pi | Both plugin manifests; native skills and Markdown roles. |
| R02 | Graph remains schemas/Markdown with existing tools | Native hook glue and package materialization added by the later full-plugin request; no graph server/runtime. |
| R03 | Work against a local clone | `evolve-init`, `.moneta.md` connection, existing Git/file tools. |
| R04 | Evolve a current session or captured `.txt`, including outside runs | `evolve` captures available evidence and marks coverage; `evolve-agent` reads the supplied source. |
| R05 | Dedicated analysis and evaluation agents | Claude named Markdown agents; Codex project TOML registration through init, with explicit role delegation fallback. |
| R06 | Skill invocation in each relevant agent instruction file | Setup plus AGENTS/CLAUDE/role templates; preserve unrelated instructions. |
| R07 | Hosting flag; user supplies GitLab/GitHub URL; create MR/PR | `auto/gitlab/github`; local clone; `glab`/`gh`; human merge. Hosted role files follow their own repository's review flow. |
| R08 | Exact seven node types | `tool-calls`, `coding-guidelines`, `agent-responsibility`, `skills`, `guard-rails`, `agentic-flow context`, `schemas`. |
| R09 | Markdown nodes; YAML metadata + summary description + body | Common schema, seven per-type schemas and eight starter nodes illustrating two agents. |
| R10 | Named, typed, bidirectional edges; same/cross type | Eleven directional edge schemas, inverse/endpoint registry, mirrored frontmatter. Cross-file checks are agent work. |
| R11 | Schema definition and slug-description index | Per-domain `indexes/schema-definition.md`, `node-index.md`, `agent-index.md`; updated with node changes. |
| R12 | Index-informed query, tokenize, find headers, walk direct relations, read selected bodies | `knowledge-search`; repeat when new needs emerge. |
| R13 | Hook before action | Native session/prompt/subagent/tool context hooks request retrieval; they do not certify completion or block a pending tool. |
| R14 | Domain knowledge external | Connection source pointer; no domain-knowledge node type. |
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
- No deployment repository choice has been supplied; init now creates a new GitHub repository or reuses an existing one. Cloning a real knowledge repository, adding its hosted role block and opening its MR/PR remain unexercised integration steps.
- Native manifest validation does not establish runtime skill discovery or successful delegated runs.
- No paired agent experiment has measured future performance gains. Structural validation cannot substitute for that evidence.

Historical runtime files were preserved in `C:/Users/asafu/Downloads/excluded/agent-evolve-runtime-archive-20260905`. The active source is this repository.

## Review corrections

Ordinary retrieval now verifies and refreshes the configured reviewed `base-branch`. Candidates use a separate worktree/checkout; explicit evaluation of candidate retrieval is labeled experimental. An empty remote receives only an empty base commit before the seed knowledge is proposed through MR/PR. Protected initialization is reported as unavailable. Native plugin skill/role changes require their host's update/reload process; a graph refresh alone does not activate installed plugin changes.

## Latest user additions

| ID | Requirement | Delivery |
|---|---|---|
| R23 | Init asks new GitHub repository vs existing | `evolve-init`, provider branches, retry-safe destination, enrollment review and workspace connection. |
| R24 | Domain -> indexes, node-type folders, schemas -> Markdown nodes | Bundled engineering domain, eight nodes illustrating two agents; exact folder mapping in each domain's type registry. |
| R25 | Multiple agents in one repository/domain | Agent index, explicit bindings, domain-local slugs/edges, shared guidance and separate role responsibilities. |
| R26 | One Codex plugin and one Claude Code plugin with hooks/components | Self-contained `plugins/moneta-codex` and `plugins/moneta-claude-code`; native adapters plus shared source. Supersedes the intermediate skills.sh proposal. |
| R27 | Apply writing-for-agents | Short init steps with completion criteria; new/existing/enrollment/connection details disclosed by branch; shared definitions have one authoring source. |

The native-plugin request supersedes the earlier omission of executable hooks. The new runtime code only emits native lifecycle context; the packaging tool copies source into installable artifacts. No custom graph search, evaluation engine or provider service was reintroduced. Domain grouping is organizational; external domain knowledge remains external. Cross-domain edges remain outside the current schema.

## Single-message feedback

| ID | Requirement | Delivery |
|---|---|---|
| R28 | Decide quickly whether user feedback merits evolution | UserPromptSubmit local bounded candidate screen, followed by no-tool contextual triage. Corrections, code-review changes, guidelines and tool explanations are candidate signals. |
| R29 | Evolve only one user message | `evolve-message`, bounded evidence and analysis scope; existing-knowledge/deduplication check before drafting; shared independent review and human merge. |

The fast gate is deliberately heuristic, not a Stanford-trained verifier or a universal admission score. Its language/scan limits are explicit. Full-session evolve remains available separately. The selected message may need its referenced artifact/current role to be interpreted, but this mode does not sweep the session for other lessons.

## Project identity

The project is Moneta. Native plugin names are `moneta`, distributed through `moneta-native` from `asafchn/Moneta`. Authoring sources generate `plugins/moneta-codex` and `plugins/moneta-claude-code`. Connections use `.moneta.md`; local graph/evidence defaults use `.moneta-local/`. The user-facing evolution workflow retains the `evolve` name.
