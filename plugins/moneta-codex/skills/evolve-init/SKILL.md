---
name: evolve-init
description: Guide a setup wizard for GitHub or GitLab, personal or organization/group ownership, repository visibility, and general or one agent's memory area.
---

1. **Run the wizard.** Follow [init conversation](references/wizard.md): provider preference, authenticated gh/glab, new/existing destination, personal or organization/group ownership, name and visibility. Ask one unanswered question at a time and retain existing answers. Apply [memory selection](../knowledge-search/references/memory-scope.md); no agent-slug means general. Completion: exact destination, selected provider/host, required authentication, new-repository visibility and one memory area are known.
2. **Prepare repository.** Follow [new GitHub repository](references/new-github.md), [new GitLab repository](references/new-gitlab.md), or [existing repository](references/existing-repository.md), according to the wizard answers. Completion: the user's remote and reviewed base are verified in a local clone, separate from the Moneta bootstrap source.
3. **Initialize the area.** Follow [area enrollment](references/enroll-agent.md). Completion: a review candidate contains the selected area's layout, applicable nodes and consistent indexes/edges, preserving every other area; return its PR/MR and revision.
4. **Connect workspace.** Follow [workspace connection](references/connect-workspace.md). Completion: the connection points to the personal repository; any enrolled role explicitly invokes the installed skills with the chosen routing argument, and retrieval passes after merge or is marked pending.

Return repository URL, memory-scope, enrolled role if any, local checkout, review URL and activation state. Retries reuse the same area and review. Use existing Git/provider/file tools; bundled starter content lives under `assets/` beside this skill.
