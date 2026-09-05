# Requirements and decisions

Current authority: the user's conversation, including the corrections to deliver JSON schemas, Markdown structure and skills, local cloning, and agent review with existing deterministic tools. Earlier runtime plans are superseded. This checklist tracks implementation, not demonstrated effectiveness.

| ID | Requirement / decision | Delivery |
|---|---|---|
| R01 | Native Claude Code/Codex; no Pi | Both plugin manifests; native skills and Markdown roles. |
| R02 | Declarative package; no custom deterministic runtime/server | JSON schemas and Markdown content. Prior runtime work archived outside this repository. |
| R03 | Work against a local clone | `evolve-setup`, `.agent-evolve.md` connection, existing Git/file tools. |
| R04 | Evolve a current session or captured `.txt`, including outside runs | `evolve` captures available evidence and marks coverage; `evolve-agent` reads the supplied source. |
| R05 | Dedicated analysis and evaluation agents | Claude named Markdown agents; Codex native child agents receive the role Markdown explicitly. |
| R06 | Skill invocation in each relevant agent instruction file | Setup plus AGENTS/CLAUDE/role templates; preserve unrelated instructions. |
| R07 | Hosting flag; user supplies GitLab/GitHub URL; create MR/PR | `auto/gitlab/github`; local clone; `glab`/`gh`; human merge. Hosted role files follow their own repository's review flow. |
| R08 | Exact seven node types | `tool-calls`, `coding-guidelines`, `agent-responsibility`, `skills`, `guard-rails`, `agentic-flow context`, `schemas`. |
| R09 | Markdown nodes; YAML metadata + summary description + body | Common schema, seven per-type schemas and seven starter nodes. |
| R10 | Named, typed, bidirectional edges; same/cross type | Eleven directional edge schemas, inverse/endpoint registry, mirrored frontmatter. Cross-file checks are agent work. |
| R11 | Schema definition and slug-description index | Root `schema-definition.md`, `node-index.md`; updated with node changes. |
| R12 | Index-informed query, tokenize, find headers, walk direct relations, read selected bodies | `knowledge-search`; repeat when new needs emerge. |
| R13 | Hook before action | **Partial:** role guidance invokes retrieval. No executable hook after the declarative-only correction. Guidance does not enforce a tool gate. |
| R14 | Domain knowledge external | Connection source pointer; no domain nodes. |
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
- Codex Markdown role files require explicit native delegation; this package does not auto-register TOML agents.
- No graph URL has been supplied for deployment. Cloning a real knowledge repository, adding its hosted role block and opening its MR/PR remain unexercised integration steps.
- Native manifest validation does not establish runtime skill discovery or successful delegated runs.
- No paired agent experiment has measured future performance gains. Structural validation cannot substitute for that evidence.

Historical runtime files were preserved in `C:/Users/asafu/Downloads/excluded/agent-evolve-runtime-archive-20260905`. The active source is this repository.

## Review corrections

Ordinary retrieval now verifies and refreshes the configured reviewed `base-branch`. Candidates use a separate worktree/checkout; explicit evaluation of candidate retrieval is labeled experimental. An empty remote receives only an empty base commit before the seed knowledge is proposed through MR/PR. Protected initialization is reported as unavailable. Native plugin skill/role changes require their host's update/reload process; a graph refresh alone does not activate installed plugin changes.
