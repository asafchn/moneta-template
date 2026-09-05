# Agent Evolve

Two native plugins: [Codex](plugins/codex) and [Claude Code](plugins/claude-code). Each includes initialization, six skills, agent roles, graph/schema templates and lifecycle hooks. Agents operate on locally cloned knowledge with existing tools.

Run `evolve-init` on the target agent. It asks **new GitHub repository or existing repository**, then enrolls the agent in a domain, opens the initialization review and connects its role instructions. New repository creation uses the selected owner/name and visibility; GitLab remains supported for existing repositories.

```text
knowledge-repository/
  engineering/
    indexes/                  # schema-definition, node-index, agent-index
    agent-responsibility/     # coding-agent.md, review-agent.md, ...
    coding-guidelines/        # Markdown nodes
    tool-calls/
    skills/
    guard-rails/
    agentic-flow-context/
    schemas/                  # JSON definitions + schema-node Markdown
  another-domain/             # same structure, independent identities
```

Each agent has a responsibility node and an explicit domain/role-file binding. Guidance can be shared within the domain. Retrieval: indexes, task query, frontmatter find, direct walk, selected bodies. External domain facts and separate evaluation records retain their own access paths.

Run `evolve` on a current session or captured `.txt`. Analysis and a separate evaluator compare the request, responsibilities, actual artifacts and human corrections. Existing deterministic tools supply check evidence; judgments remain attributed. Proposed knowledge changes go through a GitHub PR or GitLab MR. Ordinary retrieval uses reviewed state; candidates stay in separate worktrees.

[Installation and native limits](docs/NATIVE-COMPATIBILITY.md) ? [Narrow walkthrough](docs/schema-proposal.html) ? [Requirements](docs/REQUIREMENTS.md) ? [Course grounding](docs/course-grounding.md) ? [Validation](docs/VALIDATION.md)

For maintenance, edit `skills/` and `native/`, then run `python tools/package_plugins.py`. Committed `plugins/` are generated installable packages; `python tools/package_plugins.py --check` detects drift. The only runtime glue is the small native context hook (Node.js); graph search and review remain agent procedures.
