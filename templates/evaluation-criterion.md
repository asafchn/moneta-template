---
id: task-fulfillment-review
description: Example criterion for checking a coding request and the support for a proposed guidance change.
status: draft
dimensions:
  - id: artifact-correctness
    description: The delivered behavior satisfies the stated acceptance conditions.
    method: deterministic-check
    measure: Use the project's existing applicable tests; record which conditions they cover and actual outcomes.
  - id: request-fulfillment
    description: The artifact fulfills the original request and applicable role instructions beyond executable coverage.
    method: agent-judgment
    measure: Compare every requested outcome with the artifact and source instructions; report supported gaps.
  - id: guidance-support
    description: Evidence supports the proposed guidance within its stated scope.
    method: agent-judgment
    measure: Trace the proposed change to review evidence and verify that the alleged problem exists.
---

# Criterion template

This is a draft example, not an active universal rubric. Adapt it to the actual task before assessment and record its revision. Define explicit score values and meanings only if scoring is needed. The lectures do not supply a universal numeric threshold for admitting a Markdown memory.

Store adopted criteria under the configured evaluation root's `criteria/` directory, outside operational graph search. Exact command, project revision and evidence locations belong in each result.
