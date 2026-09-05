# Apply the agreed graph extension

Use the selected area's current registries as authority; extensions may already exist. Capture the reviewed base and exact proposal before editing. Additive changes are preferred when they preserve valid existing nodes. Renames, deletions, new required fields and changed edge meanings require an explicit migration decision with affected nodes identified.

For a new node type, update these together:

- schemas/node-types.json: exact type name, description, safe area-local directory and schema path.
- schemas/nodes/<type>.schema.json: Draft 2020-12, unique $id, common node-base reference, exact node-type const and agreed data fields. Match existing closure conventions.
- schemas/node-base.schema.json: add its discriminator to node-type.enum.
- schemas/node.schema.json: add its selector reference; verify exactly one branch accepts the example.
- indexes/schema-definition.md: purpose, discovery cues and differences from related types. Add actual node instances to node-index.md only when authored; a type definition alone is not a node. Agent index changes only for actual responsibility nodes.

For a new edge, add target-value schemas under schemas/edges/ (one slug or a nonempty unique slug list) and register the quoted [[edge-type]] property reference in schemas/edge.schema.json. That object rejects unregistered keys. Add both entries to schemas/edge-types.json with directional meanings, inverse names and exact source/target sets. The inverse reverses the sets and points back. A symmetric edge needs a specific meaning, one type whose inverse is itself and compatible endpoint sets. Extend existing endpoint allowances only when their meanings fit; never silently make every edge accept a new type.

For an existing type/edge, update only the agreed fields or endpoint allowances. Write edges in each endpoint's related mapping using the respective quoted [[edge-type]] key. A rename/delete updates every affected incoming/outgoing relation and index within this area. Preserve unaffected memories. All paths, schema references, slugs and relation targets must remain local; no cross-agent links. Follow the selected area's own format; migrate legacy relations only in an explicitly reviewed change.

Evaluation uses the existing deterministic tools via evolve-evaluate and its offline validation reference: schema syntax/resolution, valid and invalid examples, unknown-field behavior, selector uniqueness, all preexisting nodes still valid, index consistency, endpoint compatibility and inverse symmetry. A schema-only extension has no invented live nodes; examples stay in private validation evidence or the review description. Keep unchanged criteria fixed. If a migration is required, assess the migrated graph, not just the new definition.

Publish definitions, affected nodes and indexes in one reviewed change. Record scope and compatibility impact in the PR/MR. The installed plugin reads local catalogs, so approved extensions need no plugin copy in the knowledge repository.
