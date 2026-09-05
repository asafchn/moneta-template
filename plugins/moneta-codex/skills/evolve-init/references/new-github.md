# Personal Moneta repository

Reach this branch after the user selects new and supplies owner/name and visibility. Moneta is the bootstrap; learned memories belong in the user's repository.

1. Check GitHub authentication and local `gh repo create --help`. Verify access to the bootstrap `asafchn/Moneta` and its template status. Prepare the selected memory-area and optional role edits locally before remote creation. Preserve the destination across retries.
2. Check whether that exact destination exists. If it does, verify ownership/destination and resume through [existing repository](existing-repository.md). Never replace a repository on a name collision.
3. Create the personal template copy with `gh repo create <owner/name> --private --template asafchn/Moneta`. Use the user's chosen visibility. This copies the bootstrap's plugin/skill/schema structure and establishes a base; it is a GitHub template copy, not a linked GitHub fork. If the user specifically requests a linked fork, inspect `gh repo fork --help` and use that workflow with the selected destination. If access, template status or hosting policy blocks either operation, retain the prepared work and report the concrete limit; do not silently publish an empty substitute.
4. Read the created URL/default branch with `gh repo view <owner/name> --json url,defaultBranchRef`, then clone into the ignored local area. Set the personal remote as origin. If a linked fork retains the bootstrap as upstream, verify every future push/PR targets the personal repository. Completion: personal remote identity and reviewed base exist; memory enrollment proceeds through its own PR.

The user can commit and push their own repository normally. Moneta's proposed memories still follow evaluation and human review before ordinary retrieval. If creation succeeds but cloning/enrollment fails, return the created URL and resume there. Keep telemetry private and preserve the bootstrap's shared authoring/generated package structure.
