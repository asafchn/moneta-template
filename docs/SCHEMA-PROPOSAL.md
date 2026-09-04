# Schema proposal for review

This is a concrete serialization proposal, not a claim to reproduce the private Company Brain files. User approval is required for material semantic choices below. Ordinary file/field names can be adjusted without changing the agreed retrieval model.

## Common node fields

```yaml
---
slug: follow-pagination-tokens
node-type: coding-guidelines
description: Apply continuation tokens correctly when implementing paginated API clients.
tags: [pagination, api, client]
scope: [coding]
data:
  rule: Follow the API's returned continuation token.
  applies-when: Implementing a paginated client.
relations:
  - type: guides
    target: fetch-next-page
---
Read the configured external API documentation to confirm the current token contract.
Pass its returned token unchanged, where that is the documented API behavior.
```

The body is illustrative, not a universal API rule. A real node needs a source and specific scope.

`slug` is unique and maps to a Markdown filename. `node-type` preserves the user's names, including agentic-flow context. `description`, tags, scope and relations are discovery metadata. `data` holds type-specific fields. find returns metadata only; it does not search the body. read is a separate operation.

## Per-type data schemas: proposed boundaries

| Type | Candidate data fields | Meaning |
|---|---|---|
| tool-calls | tool, purpose, input-schema, preconditions | Reusable invocation guidance, if the user chooses this meaning. If this means historical events instead, use call identity/arguments/outcome/source fields. Do not conflate both. |
| coding-guidelines | rule, applies-when | Scoped coding practice. |
| agent-responsibility | role, responsibilities | What the agent is accountable for. |
| skills | invocation, purpose | Discover and invoke a skill. |
| guard-rails | constraint, applies-when | A behavioral constraint; storage alone is not runtime enforcement. |
| agentic-flow context | trigger, steps | Context and flow for coordinated work; confirm whether this also includes task-instance state. |
| schemas | schema-id, definition | A reusable data/interface contract. schema-definition describes the graph's own format and links these definitions when needed. |

Schema-definition can declare per-type field constraints so repositories can extend their schemas without editing plugin code. The seven names are built-in; extension registration must be explicit. task-cases and feedback are not enabled by default because their addition remains unconfirmed.

## Bidirectional relationships

Proposed definition: every relation type declares its inverse name, forward/inverse descriptions, and allowed source/target node types. Every stored relation has a mirrored counterpart in the target node's frontmatter. Validation rejects missing or conflicting mirrors; proposal application updates both files together.

Example:

- coding-guidelines `follow-pagination-tokens` --guides--> tool-calls `fetch-next-page`.
- tool-calls `fetch-next-page` --guided-by--> coding-guidelines `follow-pagination-tokens`.
- guides: the guideline governs use of the target invocation.
- guided-by: this invocation's use is governed by the target guideline.

This stores both directions in frontmatter, matching direct traversal from either node. It introduces a consistency obligation. Alternative: store one canonical relationship and derive inverse adjacency; that must still make inverse relations available to frontmatter-based walk. No representation is selected silently.

## Supporting documents

schema-definition.md: explains the common fields, each type's schema, edge schemas, both directional meanings, and validation rules. A machine-readable frontmatter definition can drive the validator and prevent prose/code divergence.

node-index.md: generated from validated searchable frontmatter, showing slug beside description. It excludes outside domain knowledge and evaluation criteria/results. The agent uses it to form the query; fixed tools do not fabricate the agent's judgment.

## Separate access

The evaluation skill reads its configured criteria/results store through dedicated operations. find/walk/read operate only on the operational graph. Domain knowledge is reached through the configured external source's normal access method. Neither source is copied into node-index.
