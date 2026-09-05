# Repository purpose and README

During the wizard, ask once if not already answered: "Would you like to share what this knowledge repository should help your agents do? You can skip."

Retain the user's purpose, intended audience and named codebases without expanding them into invented policies. Accept skip without follow-up. Purpose describes intent; it does not enroll roles, choose agent-slug, grant access or configure organization-wide discovery.

Write a short README.md (roughly 100-200 words): repository name; purpose in the user's language; knowledge expected here; a compact memory/ and plugins/ layout; how existing Moneta skills retrieve and propose changes; human-merge activation. Link to the selected area's indexes after they exist. Before the setup review merges, state that graph initialization is pending. On an existing repository preserve its README unless a purpose update is requested, then propose the focused edit through review.

For skip, describe a shared agent knowledge repository with Markdown nodes, indexes and JSON schemas. Explain that omission of agent-slug selects general and an explicit slug selects only that area's memories. Include the generated plugin installation command for teammates when relevant; no Moneta development source tree or product pitch, fabricated company facts or example roles presented as actual agents. The skills/ directory inside a memory area holds knowledge nodes about skills, not installed SKILL.md packages.

Completion: the README describes this user's repository, with accurate current setup/connection state. Raw telemetry, local connection paths and secrets stay outside the repository.
