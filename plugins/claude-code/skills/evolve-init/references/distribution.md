# Native distribution

Install the package for the active host: `plugins/codex` or `plugins/claude-code` in the source repository. Each package includes this skill's assets, all sibling skills, agent roles and native hooks. Resolve relative pointers inside the installed package.

Claude plugin commands are qualified, such as `/agent-evolve:evolve-init`. Codex uses discovered skills, normally `$evolve-init`. Verify actual native discovery during init. Codex's bundled custom-agent TOML files need project registration through init; Claude loads `agents/*.md` directly. Hook trust/enablement follows the host's native controls.

Vercel skills.sh was considered, then superseded by the user's request for two full native plugins. A skills-only installation does not establish native hook or agent registration.
