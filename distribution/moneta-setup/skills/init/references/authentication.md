# Verify access before diagnosing credentials

Follow [provider output handling](provider-output.md) for every check. Keep the selected host/account and wizard answers. Use the installed helper's fixed-output account probe; do not run raw auth status or print provider diagnostics into chat.

```text
node <plugin-root>/scripts/provider.cjs probe gh <host>
node <plugin-root>/scripts/provider.cjs probe glab <host>
```

| Probe status | Action |
|---|---|
| authenticated | Retain the returned account and continue. A previous auth-status error does not override this result. |
| network-blocked | Retry this same read-only helper command through approved network/escalation access when available. If unavailable or denied, retain setup progress and report the access blocker; credentials remain unverified. |
| login-required or credentials-rejected | First retry this same read-only helper through approved access to the user credential store/network if the initial tool is isolated. An invisible credential store can report login-required despite a valid user login. If that context is unavailable, retain progress and report the access blocker. Only a repeated result in the intended user context proceeds to [wizard login](login.md), after resolving any known environment override. Credentials-rejected requires an actual HTTP 401 response, not auth-status wording. |
| access-denied | Diagnose the stated operation's access/scope/SSO/policy requirement. Permission failure is not proof of an invalid token. |
| Other status | Preserve progress and report the fixed category. Do not request raw diagnostics, bypass filtering or prescribe logout. |

Successful account lookup must occur in the environment that will run repository operations. If an isolated tool cannot see the user's existing credential store, use the host's approved execution context first; a separately authenticated terminal is evidence, not automatic access for the agent. Missing CLI/runtime support is a setup prerequisite, not a reason to expose secrets.

Completion: a verified active account, or the exact safe access/authentication category and pending action. Never replace working credentials to fix a sandbox network restriction.
