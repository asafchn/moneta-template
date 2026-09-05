# Provider output boundary

Resolve `scripts/provider.cjs` from the installed plugin root. Run provider operations through this helper so raw stdout/stderr is captured and filtered before the tool result reaches chat. Treat commands shown in provider references as arguments to this wrapper, not direct shell invocations.

```text
node <plugin-root>/scripts/provider.cjs probe gh github.com
node <plugin-root>/scripts/provider.cjs probe glab <gitlab-host>
node <plugin-root>/scripts/provider.cjs run gh repo view <owner/name> --json url,defaultBranchRef
node <plugin-root>/scripts/provider.cjs run glab repo create <destination-url> --private --skipGitInit
node <plugin-root>/scripts/provider.cjs login gh github.com
```

Use native path spelling and host-appropriate quoting for script paths and arguments. On Windows retain backslashes. Prefer repository URLs for marketplace registration and short relative body-file paths from a verified working directory. Provide credentials only through the provider's credential store or inherited environment, never arguments, inline shell assignments or chat. Command inputs are recorded before the wrapper runs; redaction cannot retroactively protect them.

Probe mode emits only a fixed diagnostic category and a validated account on success; raw auth output never enters chat. Run mode supports repo/pr/mr operations; arbitrary API calls must not bypass the fixed account probe. It blocks obvious credential commands/arguments, buffers bounded output and redacts known environment secrets, common token/key patterns, credential headers/URLs, private-key blocks and suspicious opaque strings. It may mask legitimate identifiers and is not a complete secret detector. If output is withheld or redacted, report that limitation; never rerun directly, turn on debug output, dump environment/config files or read tokens to recover missing text.

Login mode on Windows opens a separate user-visible provider console and returns only its process ID. Browser/device codes stay in that console and provider UI. Keep its handle and verify account access after the user finishes. Other hosts return interactive-terminal-required; use a user-controlled terminal outside captured tool output, or report that capability limit. Never capture that terminal's credentials or device code into chat.

Timeout, output-limit, launch failure and unsafe-runtime results suppress partial output. A runtime with NODE_DEBUG/NODE_DEBUG_NATIVE/NODE_OPTIONS is rejected before spawning. Start in a trusted runtime without debug/preload injection; code executed before the wrapper starts is outside its protection. This wrapper protects its own output, not arbitrary shell commands or other tools.

Host mode accepts native plugin management commands for codex or claude and applies the same buffered redaction. Use it for generated plugin installation/status. Successful account probes remain fixed-output; neither provider nor host commands may receive secrets as arguments.
