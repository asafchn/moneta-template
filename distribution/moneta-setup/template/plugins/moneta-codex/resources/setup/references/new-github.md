# New GitHub repository

Use [provider output handling](provider-output.md). Retain verified authentication, exact owner/name and chosen visibility; reuse approved access. Follow [limited permissions](blocked-write.md) at any denied write.

1. Inspect only the exact destination with `gh repo view <owner/name> --json url,defaultBranchRef`. If it exists, continue with [existing repository](existing-repository.md). A not-found-or-inaccessible response is not proof of availability; creation resolves it without replacing an existing repository.
2. Prepare [the generated runtime](generate-plugin.md) and purpose README locally before remote writes. Create an empty repository with `gh repo create <owner/name> --private`, substituting only the explicitly chosen visibility. Use the bundled template rather than GitHub's full-source template/fork operation.
3. Verify the returned URL. Initialize a local Git repository containing only the personalized runtime/marketplaces and README base, set origin to that exact URL and push the selected default branch without force. If another writer initialized the remote, preserve their work and resume existing-repository setup. For sandbox ownership differences, use per-command `git -c safe.directory=<verified-absolute-checkout>`, never wildcard/global trust.
4. Use that published base for the selected area's setup PR and runtime installation. Retain the URL and local stage on failure; a retry reuses this repository.

Completion: verified destination and generated runtime base published, or locally prepared artifacts plus exact blocked/manual steps. Graph activation still follows human merge.
