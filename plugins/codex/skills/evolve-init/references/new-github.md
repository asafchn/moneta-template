# New GitHub repository

Reach this branch after the user selects new and supplies owner/name and visibility.

1. Check `gh auth status` and inspect `gh repo create --help`. Prepare the intended domain and role edits locally before creating the remote. Preserve the selected destination across retries.
2. Check whether that exact repository already exists. If it does, verify ownership/destination and continue through [existing repository](existing-repository.md); a name collision is not permission to overwrite it.
3. Create with existing `gh`, using the selected visibility and `--add-readme` to establish a base commit. Argument template: `gh repo create <owner/name> --private --add-readme --description <description>`. Replace `--private` only with the user's selected visibility. Keep company guidance and telemetry out of the initial README.
4. Read the created URL and default branch using `gh repo view <owner/name> --json url,defaultBranchRef`. Clone that URL into the workspace's ignored local area. Completion: remote identity and a base commit exist; enrollment knowledge goes through its own PR.

If creation succeeds but cloning or enrollment fails, report the created URL and resume from it. Publish only the intended repository; retain prepared files locally if authentication or organization policy blocks progress. CLI flags: [GitHub repo create](https://cli.github.com/manual/gh_repo_create), [repo view](https://cli.github.com/manual/gh_repo_view).
