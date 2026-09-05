---
slug: knowledge-node-format
node-type: schemas
description: The JSON Schema contract for operational Markdown node frontmatter.
tags:
- schema
- yaml
- node
- format
scope:
- graph-maintenance
data:
  schema-id: operational-node
  definition:
    $ref: node.schema.json
relations:
- type: schema-for
  target: inspect-node-frontmatter
---

Read schema-definition.md for field and relationship meaning. Validate YAML frontmatter against schemas/node.schema.json. Check cross-file mirrors and index consistency separately; JSON Schema alone cannot verify them.
