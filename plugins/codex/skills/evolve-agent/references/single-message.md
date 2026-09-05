# Single-message analysis

Use this scope when the parent passes `source-mode: single-message`.

Read the bounded evidence packet completely: one exact user message, labeled task context, applicable role and referenced artifacts. Find only the additional local evidence needed to assess that message. Return supported lessons, limitations and an exact candidate diff or no-change conclusion. A session transcript path is a locator, not a request to scan the whole session.

Distinguish the user's stated guideline from an observation that the prior code/tool use was wrong. Verify API/tool claims against the cited implementation or authoritative source before generalizing. Keep conditions such as repository, tool version and task scope. Prefer correcting discovery/applicability when the guidance already exists.

Use the shared analysis role's evidence and domain boundaries. Return to the parent for independent evaluation; do not recursively invoke session-wide `evolve` or the message hook.
