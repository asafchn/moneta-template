# Install and enable the generated runtime

Use [provider output handling](provider-output.md), including its host mode for native plugin commands. Resolve the generated identity from its validated marketplace metadata. Install from the exact published knowledge repository and verified base, never from a memory candidate. If publication is blocked, follow [limited permissions](blocked-write.md) for an explicitly reported stable local-runtime installation. This step is authorized as part of init.

Codex:

```text
node <installer-root>/scripts/provider.cjs host codex plugin marketplace add <knowledge-repository-url> --json
node <installer-root>/scripts/provider.cjs host codex plugin add <plugin>@<marketplace> --json
node <installer-root>/scripts/provider.cjs host codex plugin list --json
```

Check marketplace identity before reusing a registration. On repeat init, refresh that exact Git marketplace with plugin marketplace upgrade <marketplace> --json before add. Verify installed path, version and enabled: true in list output. The inspected Codex CLI has no plugin enable command: add enables the installed plugin. If host policy or prior disabled state prevents that, use the supported host control and report the specific remaining action; never invent an enable command or overwrite config files.

Claude Code:

```text
node <installer-root>/scripts/provider.cjs host claude plugin marketplace add <knowledge-repository-url>
node <installer-root>/scripts/provider.cjs host claude plugin install <plugin>@<marketplace> --scope user
node <installer-root>/scripts/provider.cjs host claude plugin enable <plugin>@<marketplace> --scope user
node <installer-root>/scripts/provider.cjs host claude plugin list --json
```

Check the installed CLI help when a flag is unsupported. User scope makes the global runtime available across all projects and chats on this machine; explicit restrictions remain optional. Use marketplace update then plugin update for an existing Claude runtime as supported by the local CLI. Preserve other installed plugins. Never bypass hook trust; if the host needs human trust approval, report it as pending. Other employees and CI must install this generated plugin on their own hosts or through organization-managed distribution; no remote machine is configured by init.

Create or reuse the mandatory local clone and config.json, record a successful sync, and resolve this machine through [runtime connection](../../knowledge-search/references/connection.md). Global availability requires no per-codebase file or Git repository. Register a Codex custom role only if explicitly requested: preserve conflicting project files; the runtime can otherwise delegate with its bundled role text. Claude discovers its bundled agents.

Verify the installed profile matches the chosen memory repository and availability. Run its connection helper from the current folder; global mode must work even outside Git. For restricted mode only, use an explicitly supplied local checkout if available, otherwise report matching untested; never scan for one. Return installed/enabled separately from hook trust, fresh-chat reload and graph-review activation.
