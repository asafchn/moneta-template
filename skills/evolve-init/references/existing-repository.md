# Existing repository

1. Resolve `hosting: auto | github | gitlab` from the supplied URL; an ambiguous self-hosted domain needs an explicit flag. Inspect an existing checkout's remote and state before reuse, otherwise clone with existing Git authentication.
2. Discover the reviewed default/base branch. Refresh a clean checkout safely. Preserve dirty/off-base work using a separate checkout. Ordinary retrieval follows [reviewed state](../../knowledge-search/references/reviewed-state.md).
3. A remote without commits needs an empty base commit on its intended default branch before opening the enrollment review. Publish only that empty commit before the proposal. Report protected/unauthorized initialization as pending repository setup; preserve the candidate locally.
4. Inspect domain directories and their `indexes/schema-definition.md`. Reuse compatible domains. For the former flat layout, prepare an explicit move map into the selected domain, preserving node content, slugs and relations and updating every index/path. This requested layout migration uses a review branch. A different semantic schema or conflicting node identity needs the user's decision before migration.

Completion: the URL, hosting, reviewed branch/revision and existing domain state are known. Continue with enrollment; no existing agent or unrelated repository file has been replaced.
