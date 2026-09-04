# Agent-evolve implementation specification

Source: user decisions through 5 September 2026. Implementation now authorized. The latest user decisions override the earlier exploratory proposal. Material departures require user decision and are tracked in DECISIONS.md.

## Product outcome

Native Claude Code/Codex plugins help agents fulfill user requests and agent-role instructions by retrieving relevant procedural knowledge and proposing improvements from human corrections and other supported run evidence. No new agent application or model training.

## Knowledge contract

- Every knowledge node is Markdown with YAML frontmatter and an in-depth body. Metadata includes a summarizing description and direct relationships.
- Preserve seven user node types: tool-calls, coding-guidelines, agent-responsibility, skills, guard-rails, agentic-flow context, schemas. Each type has its own schema.
- Named typed edges have schemas and explicit meaning in both directions. Edges are always bidirectional, including same-type and cross-type links.
- schema-definition explains schema fields, node types and edge semantics.
- node-index lists each searchable node slug beside its description.
- Before acting, a native hook asks the agent to inspect the index and generate a query from the task/intended action and anticipated knowledge needs. Strict enforcement versus guidance is pending D01.
- Tokenize query -> find reads frontmatter metadata/descriptions only -> agent selects candidates -> walk returns direct relationships and candidate metadata -> agent selects relevant nodes -> read returns selected full bodies.
- Query generation and relevance decisions belong to the native agent. Fixed tools provide validated deterministic storage/retrieval operations; no keyword heuristic claims to be a learned relevance model.
- Domain knowledge stays in an outside source. Configure its locator/access instructions; do not mirror its facts into searchable domain nodes.
- Evaluation criteria/results are outside ordinary index/find/walk/read and accessed through a separate skill. This is an access workflow boundary, not a sandbox claim.

## Evolution contract

- /evolve is desired UX for current/selected native runs. Report native invocation incompatibilities before adopting substitutes.
- evolve-agent analyzes captured user telemetry, including a plain .txt file from a run that did not use the plugin.
- Preserve the request, available instructions, corrections and supporting evidence. Imported text is not proof that a tool ran or that a result is authentic; incomplete evidence supports qualified proposals.
- eval-agent assesses what improvement can be distilled. Distinguish proposal judgment from observed downstream performance. No invented score/calibration/measurement.
- Changes may revise existing guidance, skills, schemas or relationships; every correction does not require a new node. No-op is valid when evidence does not support a reusable change.
- Prepare a reviewable diff with rationale, scope, evidence references and evaluation assessment, then open a human-reviewed MR/PR against the user's configured knowledge repository.
- hosting: auto | gitlab | github; determine provider from supplied URL when unambiguous, allow explicit override for self-hosted domains. Use glab for GitLab and gh for GitHub. Never guess ambiguous hosting.
- Managed AGENTS.md/CLAUDE.md/role-file integration explicitly invokes the relevant skill. Preserve unmanaged content. The knowledge repository may differ from the coding repository.
- Do not commit raw captured transcripts to the knowledge repository by default. Human merge controls activation; no automatic merge.

## Evidence and course limits

The supplied lectures motivate external memory, selective retrieval, feedback and outcome evaluation. They do not prescribe this graph or a universal memory admission threshold. Stored knowledge changes context, not model weights. A favorable evaluator score or merged MR does not itself demonstrate better future task performance.

## Implementation boundary

Build configuration, schema/graph primitives, separated evaluation records/access, session/transcript evidence and proposal workflow, hosted review adapters, native skills/agent integration/hooks and documentation. Retain material open decisions explicitly. Paid model experiments and publishing against a real repository require supplied configuration and existing authorization; do not invent successful live checks.
