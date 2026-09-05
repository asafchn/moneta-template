# Schema proposal: implemented structure

The [narrow walkthrough](schema-proposal.html) explains the current personal memory model. [Machine-readable definitions](../skills/evolve-init/assets/graph/general/schemas/node.schema.json) and [schema-definition.md](../schema-definition.md) are the agent-facing contract.

- Moneta bootstraps a personal repository; `memory/general/` is selected when no agent-slug is supplied.
- An explicit agent-slug selects only `memory/<agent-slug>/`. Reads and writes never fall back or cross agent areas.
- Eight types: the original seven plus sourced domain-knowledge. Markdown frontmatter supports discovery; bodies hold details.
- Each area has schema-definition, node and agent indexes. Named edges have schema-defined meanings in both directions and stay within the area.
- Evaluation criteria/results use their separate skill and store. Domain-knowledge uses ordinary search with authoritative source pointers.

The personal-area and domain-knowledge decisions revise the earlier shared-domain/outside-only proposal. Schema validity establishes shape; existing tools check graph consistency, and an evaluator judges relevance and support before a human-reviewed PR/MR.
