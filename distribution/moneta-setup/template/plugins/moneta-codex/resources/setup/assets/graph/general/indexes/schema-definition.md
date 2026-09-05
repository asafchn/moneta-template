# Graph format

The graph is a local Git checkout. Agents use existing file, search, validation and Git tools to work with it. Skills define the procedure.

## Read order

Retain the already selected memory-scope: general when agent-slug was omitted, otherwise only the explicitly supplied slug. Actor attribution is optional and never changes selection. Read this file, [agent-index.md](agent-index.md) and [node-index.md](node-index.md). Form a query from the current task and the descriptions. `find` inspects node frontmatter; `walk` inspects direct relations and connected headers; `read` loads selected bodies. Repeat when the task reveals new needs.

Only Markdown nodes directly inside the directories listed in `schemas/node-types.json` belong to ordinary search. Evaluation criteria/results, source transcripts, native SKILL.md procedures, JSON schema definitions and supporting documents are reached explicitly by their respective procedures. Operational Markdown nodes of type `skills` or `schemas` remain searchable. Sourced `domain-knowledge` nodes participate in ordinary search; configured outside sources remain available for verification.

## Node frontmatter

Each node has an opening `---` YAML block, a closing `---`, and a nonempty Markdown body. Use UTF-8; LF and CRLF are both valid. Duplicate YAML keys are invalid. Parse the frontmatter as an object and validate it against [schemas/node.schema.json](../schemas/node.schema.json).

| Field | Meaning |
|---|---|
| slug | Unique lowercase identifier; filename is `<type-directory>/<slug>.md` within this memory area. |
| node-type | A type registered in [node-types.json](../schemas/node-types.json). |
| description | Short summary: what the node covers and when to retrieve it. |
| tags | Discovery terms. |
| scope | Tasks or contexts where the node applies. |
| data | Type-specific structured fields. |
| related | Mapping from quoted `"[[edge-type]]"` keys to a target slug, or a nonempty list of distinct target slugs. Use `{}` for no edges. |
| sources | Optional source locations and notes. Domain-knowledge requires at least one source; retain authority and freshness caveats. |

The body contains detailed guidance, conditions and examples. A description supports discovery; it does not replace reading selected details. Keep contextual limitations when summarizing.

## Node types

The exact type names and schema paths are in [node-types.json](../schemas/node-types.json). Each has a separate JSON Schema. `tool-calls` holds reusable invocation guidance; a historical call remains source evidence. `agentic-flow context` holds reusable flow context, not a raw session log. `domain-knowledge` stores domain facts, concepts and terminology in its body, with structured subject/applicability and at least one cited source. Check freshness for time-sensitive facts; a source citation is not proof of truth. `schemas` describes reusable contracts; this file explains the graph's own format.

Adding a type is a reviewed schema change: use the installed extend skill to update its schema, the type registry, the node-base discriminator enum, the node selector and relevant edge endpoint definitions together. `task-cases` and `feedback` remain unadopted type proposals. Evaluation records are not operational node types.

## Edges

[edge-types.json](../schemas/edge-types.json) defines each edge's name, inverse name, directional meaning, allowed source/target types and JSON Schema. This is the authority for relationship meaning.

Every edge is bidirectional. Store both directions in `related`. For `A --guides--> B`, store `B --guided-by--> A`. The starter pairs are guides/guided-by, owns/owned-by, uses/used-by, constrains/constrained-by and conforms-to/schema-for. Every edge states a concrete meaning; generic related-to is not supported. Same-type and cross-type relationships are supported where the edge definition allows them. Leave a node isolated when no registered meaning fits, or use extend to propose a specific relationship.

```yaml
related:
  "[[uses]]": inspect-node-frontmatter
  "[[constrained-by]]":
    - keep-evidence-attributed
    - protect-credentials
```

The brackets are part of the edge key; YAML quotes keep it a string. Keys refer to edge-types.json entries, not Markdown node files. Target slugs are area-local. Group multiple targets under one key; duplicate YAML keys are invalid. Walk resolves the edge name inside the brackets, reads its directional definition, then inspects the selected target headers.

This replaces the former relations list of type/target objects. Existing repositories retain their own schema until a reviewed migration updates definitions and affected nodes together. Preserve specific edges and inverse links; review generic related-to instances individually, removing them or selecting a justified specific edge. Do not silently infer new meanings or rewrite other memory areas.

Agents check these cross-file invariants separately from JSON Schema:

- Every target exists in this memory area, filenames match area-unique slugs, and endpoint types are allowed.
- Every edge has exactly one matching inverse; there are no duplicate edge entries.
- Every inverse definition points back and reverses the allowed endpoint types.
- A rename or deletion updates every affected incoming/outgoing relation and index entry.
- Paths stay in the intended checkout; linked files do not redirect outside it.

JSON Schema validates record shape. It does not prove these graph-wide invariants or determine whether a rule is useful.

All definitions use JSON Schema Draft 2020-12. Their `https://moneta.invalid/schemas/` identifiers are offline identifiers, not a server. Supply the local schema files to the existing validator as a registry keyed by `$id`; resolve `$ref` from that registry without network access.

## Index

[node-index.md](node-index.md) contains each operational node's slug beside its exact description. Update it in the same change as node creation, removal, rename or description edits. The agent maintains it using existing tools; there is no index server or bundled generator.

## Separate evaluation

The `evolve-evaluate` skill accesses the configured evaluation directory directly. Its Markdown frontmatter follows [evaluation-criterion.schema.json](../schemas/evaluation-criterion.schema.json) and [evaluation-result.schema.json](../schemas/evaluation-result.schema.json). Results distinguish executed deterministic checks, scored judgments and reported outcomes. Those records never enter `node-index.md` or ordinary `find`/`walk`.

## Memory areas and agents

Moneta is the bootstrap; the user's personal repository holds `memory/general/` and any `memory/<agent-slug>/` areas. Each area has its own indexes, registered node-type directories and JSON schemas. The registry's directory field controls placement; only direct Markdown nodes participate in find/walk.

No agent-slug means general for both reads and writes. A supplied slug selects only its area, with no general fallback and no cross-agent reads. The current role, a mentioned name in evidence, and the evolve-agent/eval-agent worker identities never override selection. Missing areas are initialized through init and review; missing knowledge remains a reported gap.

The agent index lists actual responsibility nodes with exact descriptions; it may be empty for general. The node index lists all operational nodes. An agent-specific area enrolls only its selected agent; general can hold explicitly shared knowledge. Role bindings record enrollment and applicable instructions, not a default routing override.

Slugs and relation targets are local to the selected area. Every relation and inverse must resolve there; cross-area edges are invalid. Preserve other areas without reading their node contents. Validate against the selected area's own local schema registry, including the optional routing argument contract in [memory-request.schema.json](../schemas/memory-request.schema.json). JSON Schema default annotations do not execute routing; the skills apply it.

Evaluation records retain memory-scope plus the actual actor (or unassigned) and use their separate skill. A source citation preserves provenance; it is not evidence by itself that a factual claim is current or correct.
