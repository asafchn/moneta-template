# New GitLab repository

Use [provider output handling](provider-output.md). Retain verified host/account, exact namespace/name and chosen visibility. Follow [limited permissions](blocked-write.md) at any denied write. All distribution assets are already installed.

1. Inspect only the exact destination with the selected host's `glab repo view <destination-url>`. Existing destinations continue through [existing repository](existing-repository.md). Never list groups or their repositories to find a destination or test permissions.
2. Prepare [the generated runtime](generate-plugin.md) and README locally. Inspect `glab repo create --help` once if flags have not been verified. Create the project with explicit host/namespace/visibility: `glab repo create https://<host>/<namespace>/<name> --private --skipGitInit --defaultBranch main`. Honor an explicitly selected branch/visibility; never substitute owner or create a group.
3. Verify the returned URL. In an isolated local Git repository, commit the personalized runtime/marketplaces and README base, set origin to the exact destination and push without force. If the remote acquired commits, preserve them and use existing-repository setup. For sandbox ownership differences, use per-command exact safe.directory.
4. Continue with the selected area's setup MR and runtime installation. Retain the created URL and local stage on failure rather than recreating the project.

Flags follow the [GitLab CLI reference](https://docs.gitlab.com/cli/repo/create/). Creation success, runtime installation and graph-review activation are separate states; report each accurately.
