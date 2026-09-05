# Adding retrieval and evolution to a role file

Use the host-specific marked block in [AGENTS-addition.md](AGENTS-addition.md) or [CLAUDE-addition.md](CLAUDE-addition.md) in each participating role file, such as `coding-agent.md`. Preserve the role's existing responsibilities and all text outside that block. Keep one block; update it rather than appending duplicates.

Bind the invocation to the actual installed skill identifier. A named skill invocation is required; a vague instruction to remember or improve is insufficient. Confirm that the native host loads this role file. If hosted separately from the graph, propose the role-file change through its own repository's review process.

This is an instruction addition, not an executable pre-tool hook. The package cannot guarantee that a host blocks actions until retrieval completes.
