---
slug: moneta-knowledge-model
node-type: domain-knowledge
description: Moneta terminology for knowledge nodes, discovery metadata and reviewed activation.
tags: [moneta, knowledge, terminology]
scope: [moneta]
data:
  subject: Moneta knowledge model
  applies-when: Explaining or maintaining a Moneta knowledge graph.
relations:
  - type: related-to
    target: knowledge-node-format
sources:
  - location: ../indexes/schema-definition.md
    note: Local graph format and activation rules; verify against the reviewed revision in use.
---

# Moneta knowledge model

A knowledge node is a Markdown file with typed YAML frontmatter and a detailed body. Descriptions support discovery; named relations connect nodes in both directions. JSON definitions specify valid record shapes, while separate checks establish graph consistency.

Human review controls shared activation: ordinary retrieval consumes a verified reviewed revision. Evaluation records have their own access skill and stay outside the ordinary node index.

This starter describes Moneta itself. Enroll it only where that subject is relevant; use sourced facts from the actual domain for other knowledge.
