---
name: evolve-agent
description: Start a dedicated native agent to analyze captured run telemetry, including a plain text file, and distill supported guidance improvements.
---

Use the native host's agent delegation facility and [the evolve-agent role](references/role.md). In Claude, use the plugin's discovered agent identifier. In Codex, use the registered evolve-agent when discovered; otherwise spawn a native child with that Markdown role explicitly.

Apply [memory selection](../knowledge-search/references/memory-scope.md) when invoked directly. When delegated, retain the parent's explicit selection. Pass `source-mode: session | single-message`, selected memory-scope and actor, source file, reviewed graph checkout/base revision and separate candidate path, relevant agent instructions, expected user outcome and any known capture gaps. Keep source evidence distinct from the child's instructions. If the native host cannot start a child, report that capability gap; do not label same-session analysis a dedicated agent run.

The child must read the supplied source completely, using sequential chunks as necessary, and return supported findings, exact source locators, proposed scope, affected node slugs and an optional proposed diff. Continue the parent evolution workflow through separate evaluation and hosted review.
