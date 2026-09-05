# Graph format

The graph is a local Git checkout. Agents use existing file, search, validation and Git tools to work with it. Skills define the procedure.

## Read order

Read this file and [node-index.md](node-index.md). Form a query from the current task and the descriptions. `find` inspects node frontmatter; `walk` inspects direct relations and connected headers; `read` loads selected bodies. Repeat when the task reveals new needs.

Only `nodes/*.md` belongs to ordinary search. Evaluation criteria/results, source transcripts, skills, schemas and supporting documents are reached explicitly by their respective procedures. Domain knowledge stays in the configured outside source.

## Node frontmatter

Each node has an opening `---` YAML block, a closing `---`, and a nonempty Markdown body. Use UTF-8; LF and CRLF are both valid. Duplicate YAML keys are invalid. Parse the frontmatter as an object and validate it against [schemas/node.schema.json](schemas/node.schema.json).

| Field | Meaning |
|---|---|
| slug | Unique lowercase identifier; filename is `nodes/<slug>.md`. |
| node-type | One of the seven types in [node-types.json](schemas/node-types.json). |
| description | Short summary: what the node covers and when to retrieve it. |
| tags | Discovery terms. |
| scope | Tasks or contexts where the node applies. |
| data | Type-specific structured fields. |
| relations | Named direct edges: `type` and target `slug`. |
| sources | Optional source locations and notes. External facts remain in their authoritative source. |

The body contains detailed guidance, conditions and examples. A description supports discovery; it does not replace reading selected details. Keep contextual limitations when summarizing.

## Node types

The exact type names and schema paths are in [node-types.json](schemas/node-types.json). Each has a separate JSON Schema. `tool-calls` holds reusable invocation guidance; a historical call remains source evidence. `agentic-flow context` holds reusable flow context, not a raw session log. `schemas` describes reusable contracts; this file explains the graph's own format.

Adding a type is a reviewed schema change: update its schema, the type registry, the node selector and relevant edge endpoint definitions together. `task-cases` and `feedback` remain unadopted type proposals. Evaluation records are not operational node types.

## Edges

[edge-types.json](schemas/edge-types.json) defines each edge's name, inverse name, directional meaning, allowed source/target types and JSON Schema. This is the authority for relationship meaning.

Every edge is bidirectional. Store both directions in frontmatter. For `A --guides--> B`, store `B --guided-by--> A`. For symmetric `related-to`, both nodes store `related-to`. Same-type and cross-type relationships are supported where the edge definition allows them. Related context does not imply authority or dependency.

Agents check these cross-file invariants separately from JSON Schema:

- Every target exists, filenames match unique slugs, and endpoint types are allowed.
- Every edge has exactly one matching inverse; there are no duplicate edge entries.
- Every inverse definition points back and reverses the allowed endpoint types.
- A rename or deletion updates every affected incoming/outgoing relation and index entry.
- Paths stay in the intended checkout; linked files do not redirect outside it.

JSON Schema validates record shape. It does not prove these graph-wide invariants or determine whether a rule is useful.

All definitions use JSON Schema Draft 2020-12. Their `https://agent-evolve.invalid/schemas/` identifiers are offline identifiers, not a server. Supply the local schema files to the existing validator as a registry keyed by `$id`; resolve `$ref` from that registry without network access.

## Index

[node-index.md](node-index.md) contains each operational node's slug beside its exact description. Update it in the same change as node creation, removal, rename or description edits. The agent maintains it using existing tools; there is no index server or bundled generator.

## Separate evaluation

The `evolve-evaluate` skill accesses the configured evaluation directory directly. Its Markdown frontmatter follows [evaluation-criterion.schema.json](schemas/evaluation-criterion.schema.json) and [evaluation-result.schema.json](schemas/evaluation-result.schema.json). Results distinguish executed deterministic checks, scored judgments and reported outcomes. Those records never enter `node-index.md` or ordinary `find`/`walk`.
