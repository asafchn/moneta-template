---
slug: retrieve-before-work
node-type: agentic-flow context
description: Orient on the local graph and retrieve guidance before acting or when
  new knowledge needs appear.
tags:
- flow
- retrieval
- planning
scope:
- knowledge-retrieval
data:
  trigger: A new task, or a new information need during the task.
  steps:
  - Read the graph schema definition and node index.
  - Form a query from the task and expected information needs.
  - Find candidate headers, walk relevant direct relations, then read selected bodies.
  - Apply the relevant guidance; repeat retrieval when new needs emerge.
relations:
- type: uses
  target: retrieve-relevant-guidance
- type: guided-by
  target: follow-applicable-guidance
- type: related-to
  target: follow-applicable-guidance
---

The agent follows this flow through skill invocation. It is guidance, not an executable gate that blocks tools.
