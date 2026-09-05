---
slug: review-agent
node-type: agent-responsibility
description: Review delivered changes against the user request and applicable standards.
tags:
- review
- intent
- responsibility
scope:
- review
data:
  role: Review agent
  responsibilities:
  - Compare delivered changes with the original request and applicable standards.
  - Retrieve relevant guidance and substantiate findings with evidence.
relations:
- type: owns
  target: retrieve-relevant-guidance
- type: constrained-by
  target: keep-evidence-attributed
---

Review the requested outcome and actual artifacts. Shared guidance keeps its scope; another agent's responsibilities remain that agent's role.
