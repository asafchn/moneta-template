# Review a local graph change through Git

Apply [provider output handling](../../../resources/setup/references/provider-output.md) to every provider CLI command below. Use existing Git and provider CLI tools from the configured local clone. The user supplies the repository URL; preserve the selected `hosting` flag.

1. Confirm the checkout's remote identifies the personal repository. Inspect status, current branch and base revision. Apply [local clone freshness](../../knowledge-search/references/freshness.md) to the ordinary reviewed checkout before preparing the proposal; retain the candidate baseline and report any explicit offline choice. Preserve unrelated work. Create the change branch in a separate local worktree/checkout from the configured reviewed base; leave the ordinary retrieval checkout unchanged.
2. Apply supported node/schema changes only inside the selected memory area, including skills-type Markdown nodes. Shared native plugin edits require a separate user-scoped request. Maintain both edge directions and update affected index descriptions. Inspect every changed file. Schema/edge meaning changes are material and must be raised to the user.
3. Have eval-agent review the exact candidate. Resolve supported findings. Confirm source/base/candidate revisions still match the recorded assessment. Stage only intended files; captured telemetry and local clones stay untracked/ignored.
4. Prepare a body file outside the published tree. Explain the problem, changed behavior, scope, evidence locators, checks actually run, metrics and judgment limits. Include no raw transcript by default. Inspect the staged diff, then commit with the user's configured Git identity.
5. Check whether an MR/PR already exists for this branch. Reuse the existing review rather than creating a duplicate. Push only the intended branch to the configured repository, without force or automatic merging.
6. Use the detected provider's native CLI to create the review. Pass values as arguments and the multiline body as a file; never interpolate transcript content into shell syntax.

GitHub:

```text
gh pr create --repo <repository-url> --head <change-branch> --base <base-branch> --title <title> --body-file <body-file>
```

GitLab:

```text
glab mr create --repo <repository-url> --source-branch <change-branch> --target-branch <base-branch> --title <title> --description-file <body-file> --yes
```

These are argument templates, not commands to paste with literal placeholders. Use platform-appropriate quoting. If a CLI/version lacks the stated flag, inspect its help and raise the compatibility gap; do not fabricate a successful publication. [GitHub CLI](https://cli.github.com/manual/gh_pr_create), [GitLab CLI](https://docs.gitlab.com/cli/mr/create/).

Return the review URL, committed revision and remaining limitations. Human merge is the activation decision. Later agent runs use the reviewed base branch of their local clone, fast-forwarding only when safe; an unmerged candidate branch is not shared approved knowledge.

Graph-node guidance is used after retrieval. Editing a native `SKILL.md` or plugin agent file in a repository does not update an already installed plugin: identify its owning plugin repository and host reload/reinstall path, and report activation pending until that native update is exercised. Do not imply that refreshing the graph installs a skill change. A hosted role-file change similarly takes effect when its consuming checkout and host load the merged file.
