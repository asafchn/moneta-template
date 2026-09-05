# Schema implementation

The [narrow walkthrough](schema-proposal.html) reflects the current domain graph and native packages. The machine-readable definitions live in [schemas](../skills/evolve-init/assets/graph/engineering/schemas/node.schema.json), and [schema-definition.md](../schema-definition.md) explains their use.

- Seven user-defined node types; Markdown nodes grouped by type inside each domain. Multiple agents share a domain.
- Common frontmatter plus type-specific `data`.
- Eleven directional edge definitions, each with a schema and inverse; both endpoints store the relationship.
- Agent-maintained slug/description index; local file access only.
- Separate evaluation criteria/results schemas and skill; domain knowledge external.

Reusable meanings and mirrored storage are implementation defaults. Their provenance and remaining host/hook gaps are in [the requirements ledger](REQUIREMENTS.md). No universal scoring threshold or additional operational node type was inferred from the lectures.
