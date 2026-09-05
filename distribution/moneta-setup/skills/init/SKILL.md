---
name: init
description: Set up a personal or organization memory repository, then install and enable its generated Codex or Claude Code plugin through a short wizard.
---

For denied writes, follow [limited permissions](references/blocked-write.md) and finish independent local work. This is the installer. Its root contains scripts/ and template/. For a standalone moneta-setup installation, use the root supplied by its entry skill. Runtime skills live in the generated repository, not in this installer's discovered skill list.

1. **Choose.** Follow [the wizard](references/wizard.md). Reuse supplied answers; ask one unresolved choice at a time. Completion: provider, verified account, destination, visibility when new, local matching targets, optional purpose and selected memory area are known.
2. **Create or resume.** Follow [GitHub](references/new-github.md), [GitLab](references/new-gitlab.md) or [existing repository](references/existing-repository.md). Generate from [the bundled template](references/generate-plugin.md), preserving destination on retries. Completion: personalized runtime base is published in the user's repository.
3. **Initialize memory.** Follow [area enrollment](references/enroll-agent.md), using the generated runtime's evaluation procedure directly if its skill is not discovered yet. Completion: one assessed setup PR/MR or a verified unchanged area; graph activation awaits human merge.
4. **Install and enable.** Follow [native installation](references/install-generated.md). Install the generated plugin for the active host and verify enabled status. Completion: exact plugin identity/version is installed and enabled, or the concrete host/trust blocker is reported. Do not end at commands for the user to run.

Return repository and setup review URLs, installed plugin name and any remaining merge/reload step. A new chat loads the installed runtime; approved graph retrieval becomes available after the setup review merges. Keep private telemetry and local checkout paths out of the published repository.
