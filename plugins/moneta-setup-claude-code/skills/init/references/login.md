# Wizard-managed login

Reach this flow after [provider verification](authentication.md) establishes missing/rejected credentials, not a transport-only error. Resolve the helper through [provider output handling](provider-output.md).

1. Preserve the selected host, wizard answers and any existing Git protocol. A credential supplied by the environment can override stored login; identify that configuration source without printing its value. Browser login may not replace such an override.
2. Start exactly one login with `node <plugin-root>/scripts/provider.cjs login gh <host>` or the glab equivalent. On Windows this opens a user-controlled provider console and returns login-started plus a process ID. No raw login output or device code is returned to chat. The user's wizard/provider choice authorizes initiating this normal login flow.
3. Retain that process ID and tell the user to complete account selection, browser/device approval and any provider prompts in the opened window. Passwords, MFA, consent and device codes stay in the provider UI/terminal. Do not relay or capture them in chat, screenshots, logs or Moneta evidence.
4. After the user finishes, repeat the fixed-output account probe from the repository-operation environment and resume only on authenticated. If the console closes without successful verification, report the pending/cancelled state; do not start another login automatically. For interactive-terminal-required, use a native user-controlled terminal outside captured tool output if available, otherwise explain the host limitation and provide the manual command as a last resort.
5. A verified account allows the wizard to continue. It does not establish permission to create projects in a selected organization/group; retain that separate check.

Provider web/device capabilities are documented in [GitLab login](https://docs.gitlab.com/cli/auth/login/); inspect installed CLI help through a trusted user terminal when compatibility needs investigation. Completed login is verified by the account probe, not by merely launching a window.
