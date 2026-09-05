---
name: evolve-agent
description: Start a dedicated native agent to analyze captured run telemetry, including a plain text file, and distill supported guidance improvements.
---

Use the native host's agent delegation facility and [the evolve-agent role](../../agents/evolve-agent.md). In Claude, use the plugin's discovered agent identifier. In Codex, spawn a child and explicitly supply that Markdown role's instructions.

Pass the source file, local graph checkout/base revision, relevant agent instructions, expected user outcome and any known capture gaps. Keep source evidence distinct from the child's instructions. If the native host cannot start a child, report that capability gap; do not label same-session analysis a dedicated agent run.

The child must read the supplied source completely, using sequential chunks as necessary, and return supported findings, exact source locators, proposed scope, affected node slugs and an optional proposed diff. Continue the parent `evolve` workflow through separate evaluation and hosted review.
