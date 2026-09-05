# Schema implementation

The [narrow walkthrough](schema-proposal.html) reflects the current declarative package. The machine-readable definitions live in [schemas](../schemas/node.schema.json), and [schema-definition.md](../schema-definition.md) explains their use.

- Seven user-defined node types; one Markdown file per node.
- Common frontmatter plus type-specific `data`.
- Eleven directional edge definitions, each with a schema and inverse; both endpoints store the relationship.
- Agent-maintained slug/description index; local file access only.
- Separate evaluation criteria/results schemas and skill; domain knowledge external.

Reusable meanings and mirrored storage are implementation defaults. Their provenance and remaining host/hook gaps are in [the requirements ledger](REQUIREMENTS.md). No universal scoring threshold or additional operational node type was inferred from the lectures.
