# Agent Evolve

Native Claude Code/Codex plugin under implementation. Retrieves scoped guidance from a typed Markdown graph and proposes reviewed improvements from sessions or captured transcripts.

Current state: source scaffold and pinned dependencies are present. Runtime features are not implemented yet. Material hook, native invocation, agent registration and schema decisions are recorded for user review.

- [Current specification](docs/SPEC.md)
- [Schema proposal](docs/SCHEMA-PROPOSAL.md)
- [Material decisions](docs/DECISIONS.md)
- [Native compatibility](docs/NATIVE-COMPATIBILITY.md)
- [Implementation plan](docs/superpowers/plans/2026-09-05-native-agent-evolve.md)

Operational search follows schema-definition + node-index -> agent query -> find -> walk -> read. Domain knowledge stays external; evaluation criteria/results use a separate skill.
