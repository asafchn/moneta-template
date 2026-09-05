---
name: evolve-init
description: Initialize evolution for an agent by creating a GitHub graph repository or enrolling it in an existing shared repository and domain.
---

1. **Choose repository.** Ask whether the user wants a new GitHub repository or an existing repository. Reuse an explicit choice already supplied in this invocation. For new, collect owner/name and visibility (suggest private); for existing, collect its URL. Identify the target agent's actual role file and desired domain. Completion: repository choice, destination and agent/domain are explicit; repo creation has not started from guessed values.
2. **Prepare repository.** For new GitHub creation, follow [new GitHub repository](references/new-github.md). For existing GitHub/GitLab or retries, follow [existing repository](references/existing-repository.md). Completion: the intended remote and reviewed base are verified in a local clone.
3. **Enroll agent.** Follow [domain enrollment](references/enroll-agent.md). Completion: a reviewed candidate contains the domain layout, the target responsibility node, consistent indexes/edges, and preserved existing agents; return the MR/PR URL and revision.
4. **Connect workspace.** Follow [workspace connection](references/connect-workspace.md). Completion: the connection and explicit skill-invocation block identify the enrolled agent/domain, and retrieval either passes against merged knowledge or is clearly pending the enrollment merge.

Return repository URL, domain, agent slug, local checkout, review URL and activation state. A repeated init updates the same enrollment and review; it does not duplicate them. Use existing Git/provider/file tools; the distributed graph and templates are under `assets/` beside this skill.
