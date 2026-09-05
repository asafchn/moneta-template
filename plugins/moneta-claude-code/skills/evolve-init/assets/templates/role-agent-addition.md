# Adding retrieval and evolution to a role file

For Markdown role files, use the host-specific marked block in [AGENTS-addition.md](AGENTS-addition.md) or [CLAUDE-addition.md](CLAUDE-addition.md) in each participating role file, such as `coding-agent.md`. Preserve the role's existing responsibilities and all text outside that block. Keep one block; update it rather than appending duplicates.

Bind the invocation to the actual installed skill identifier. A named skill invocation is required; a vague instruction to remember or improve is insufficient. Confirm that the native host loads this role file. If hosted separately from the graph, propose the role-file change through its own repository's review process.

The marked block complements the native context hooks. Hook reminders request retrieval; they do not prove retrieval completed before a pending tool executes.


For a Codex `.toml` role, parse the existing TOML and merge the guidance into its `developer_instructions` string, with one marker-delimited block inside that string. Preserve the role's existing instructions and every other field. Serialize valid TOML with correct string quoting; validate it with an existing TOML parser and compare all fields except the intended instruction update. HTML markers and Markdown belong inside the instruction string, never at TOML top level. Completion: the role still parses, retains its name/configuration, and its loaded instructions explicitly invoke the relevant skills.

Init must instantiate routing in the block: omit agent-slug for general, or include the user-selected `agent-slug: <slug>` in both retrieval and evolution calls. Retain that value through analysis/evaluation delegation. Never derive a new storage area from the loaded worker role name.
