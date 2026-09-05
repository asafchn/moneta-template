---
name: init
description: Set up a personal or organization memory repository, then install and enable its generated Codex or Claude Code plugin through a short wizard.
---

For denied writes, follow [limited permissions](references/blocked-write.md) and finish independent local work. This is the installer. Its root contains scripts/ and template/. For a standalone moneta-setup installation, use the root supplied by its entry skill. Runtime skills live in the generated repository, not in this installer's discovered skill list.

1. **Choose.** Follow [the wizard](references/wizard.md). Reuse supplied answers; ask one unresolved choice at a time. Completion: provider, verified account, destination, visibility when new, availability (global by default), optional purpose and selected memory area are known. Collect codebase targets only for explicitly requested restrictions.
2. **Create or connect.** For start-from-scratch, follow [GitHub](references/new-github.md) or [GitLab](references/new-gitlab.md), generating from [the bundled template](references/generate-plugin.md). To join a teammate, follow [existing repository](references/existing-repository.md): clone and reuse its existing runtime and memory without generating, publishing or opening a setup review. Completion: a new published runtime base OR an existing reviewed runtime available locally.
3. **Use or initialize memory.** A connected existing area is used unchanged. Only new or explicitly requested missing areas follow [area enrollment](references/enroll-agent.md), using the generated runtime's evaluation procedure directly if not yet discovered. Completion: a verified existing area OR one assessed setup PR/MR; new graph activation awaits human merge.
4. **Install and enable.** Follow [native installation](references/install-generated.md). Install the generated plugin for the active host and verify enabled status. Completion: exact plugin identity/version is installed and enabled, or the concrete host/trust blocker is reported. Do not end at commands for the user to run.

Return the shared repository URL, installed plugin name, local-clone/config readiness and remaining host steps. Report a review URL only if one was needed. A teammate can retrieve existing reviewed memory after installation/reload; a newly proposed area awaits merge. Keep private config, telemetry and local checkout paths out of the published repository.
