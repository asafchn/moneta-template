---
name: evolve-init
description: Create a personal Moneta repository from the bootstrap template or initialize general or one agent's memory area in an existing repository.
---

1. **Choose destination.** Ask new personal GitHub repository or existing GitHub/GitLab repository; reuse a choice already supplied. For new, collect owner/name and visibility (suggest private); for existing, collect its URL. Apply [memory selection](../knowledge-search/references/memory-scope.md): omitted `agent-slug` means general. Identify a role file if enrolling an agent; a general area can be initialized without one. Completion: destination and one selected memory area are known; no repository is created from guessed values.
2. **Prepare repository.** Follow [new GitHub repository](references/new-github.md) or [existing repository](references/existing-repository.md). Completion: the user's remote and reviewed base are verified in a local clone, separate from the Moneta bootstrap source.
3. **Initialize the area.** Follow [area enrollment](references/enroll-agent.md). Completion: a review candidate contains the selected area's layout, applicable nodes and consistent indexes/edges, preserving every other area; return its PR/MR and revision.
4. **Connect workspace.** Follow [workspace connection](references/connect-workspace.md). Completion: the connection points to the personal repository; any enrolled role explicitly invokes the installed skills with the chosen routing argument, and retrieval passes after merge or is marked pending.

Return repository URL, memory-scope, enrolled role if any, local checkout, review URL and activation state. Retries reuse the same area and review. Use existing Git/provider/file tools; bundled starter content lives under `assets/` beside this skill.
