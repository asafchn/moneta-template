# Refresh shared knowledge before use

Apply before each Moneta operation that reads knowledge, evaluates a candidate, proposes a change or opens the local viewer. Tool-free routing and relevance triage may finish without a pull. Every delegated worker retains the originating runtime and the same private receipt; it does not create a receipt per codebase or agent slug.

After resolving the runtime and its private checkout, run:

```text
node <runtime-root>/scripts/sync.cjs <absolute-reviewed-checkout> <absolute-private-directory>/config.json
```

The private directory is ~/.moneta/<plugin-id>/ on this machine, outside the knowledge repository. The machine-local config records repository identity, checkout, graph-root, branch, revision and last-successful-pull-at in UTC. Init creates the local clone and config before memory use. The clone is reused across projects; all retrieval reads local files. It follows the runtime's sync-state.schema.json. Never commit it or infer freshness from file modification time, host plugin-cache updates, another machine's receipt, or an unsuccessful pull.

The helper verifies local identity and clean base state every time. A matching receipt younger than one hour returns current without network access. Missing, corrupt, future-dated, different-revision or hour-old receipts require git pull --ff-only. Only a successful pull with a verified reviewed revision advances the receipt, including an already-up-to-date pull. Explicit restrictions and agent-area selection remain separate from freshness.

- current / pulled: continue with the recorded reviewed revision. Recheck before later Moneta operations; a long session is not an exemption.
- checkout-needs-preservation: keep dirty/off-base work and use a separate clean reviewed checkout. Never stash, reset, rebase or discard user/candidate work automatically.
- sync-in-progress: wait for the originating sync. Only remove its lock after verifying that process has ended; never run concurrent pulls on this checkout.
- pull-failed / sync-unavailable: retain the prior timestamp. Retry in the approved user/network context if the sandbox hid credentials or networking. If still blocked, report why freshness is unavailable and keep independent work moving. Stale memory requires an explicit user choice; label its revision/age and avoid claiming it is current.

After a base update, keep any candidate's frozen baseline and evaluation subject intact. Reconcile and re-evaluate a changed proposal deliberately; a background refresh cannot silently change what an assessment claims to have tested. Graph pulls do not install updated native skills or hooks; report a separate host plugin update when relevant.

For an older connected runtime without sync.cjs, apply the same checks using existing Git tools through the installed redacting provider-output wrapper: verify exact origin, clean base branch and current revision; compare config.json's matching identity/revision and UTC time; when missing/stale run git pull --ff-only origin <base-branch>; verify HEAD equals the remote-tracking base and the checkout remains clean. Then atomically write the private config with the actual completion time. Keep raw command output private and use the wrapper's filtered status. Record the runtime helper upgrade as separate work; joining a teammate does not authorize rewriting their plugin.
