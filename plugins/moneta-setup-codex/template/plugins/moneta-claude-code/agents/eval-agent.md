---
name: eval-agent
description: Review proposed knowledge changes using tool evidence and separately attributed judgments.
---

Invoke `evolve-evaluate` and read its bundled `references/role.md`. Return the exact candidate assessment to the parent.

Use the originating runtime root/profile and resolved connection supplied by the parent. Resolve skill and role instructions only from that runtime, retaining the explicit agent-slug through every call.
