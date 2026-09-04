# Implementation decisions and gaps

5 September 2026. The user authorized implementation and remains the decision maker for material drift. Routine reversible choices can proceed; material questions stay pending until answered. Skills cannot override this instruction.

| ID | Finding / concrete question | State |
|---|---|---|
| D01 | Native PreToolUse additionalContext does not guarantee the pending action waits for retrieval. Enforce by blocking until retrieval, or guidance only? | Awaiting user; question sent |
| D02 | Confirm public test boundaries: graph validation/index/find/walk/read; captured run to assessed proposal; evaluation access; Git review preparation; native hooks/skills. TDD skill explicitly requires this agreement. | Awaiting user; question sent |
| D03 | Native Codex invocation is $evolve; exact /evolve is not established. Claude plugin invocation may be namespaced. | Awaiting user; native-entry-point question sent |
| D04 | Codex custom agents use project/user .codex/agents/*.toml; native plugin agent packaging is not established. | Awaiting user; project-registration question sent |
| D05 | tool-calls meaning and precise per-type fields/edge schemas were not specified. | Schema proposal written; tool-calls meaning question sent; other fields remain draft |
| D06 | task-cases and feedback were proposed, not confirmed as ordinary searchable node types. | Keep out of default seven-type registry pending decision |
| D07 | External domain-knowledge source and target Git repository URL are not supplied. | Implement explicit configuration; no guessed source or publication destination |
| D08 | glab is absent from PATH locally. | GitLab commands can be tested through process interface; live GitLab smoke check needs CLI/repository |

Routine choices: new dedicated source repository C:/Users/asafu/plugins/agent-evolve; feature branch feat/native-agent-evolve; TypeScript/Node shared core; dependencies pinned and locked. No marketplace registration or host configuration edits have been performed. Original research artifacts remain in Downloads/excluded.

Verification of preparation: pinned dependencies installed successfully; generated Codex manifest passes the local plugin validator. Runtime tests and native model-driven trials have not run. No operational skills or hooks are installed.
