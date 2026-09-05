---
slug: inspect-node-frontmatter
node-type: tool-calls
description: Inspect Markdown frontmatter for metadata, descriptions and direct relations before reading
  node bodies.
tags:
- frontmatter
- find
- walk
- files
scope:
- knowledge-retrieval
data:
  tool: Existing host file-reading tools
  purpose: Inspect a local graph node header.
  input-schema:
    type: object
    properties:
      path:
        type: string
    required:
    - path
  preconditions:
  - The graph repository is cloned locally.
  - Read schema-definition.md and node-index.md.
relations:
- type: used-by
  target: retrieve-relevant-guidance
- type: conforms-to
  target: knowledge-node-format
---

Read the opening YAML block through its closing delimiter. Use metadata and descriptions for find; inspect relations for walk. Read the body only after selecting the node. The exact tool arguments depend on the native host.
