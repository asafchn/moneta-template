# Agent Evolve

Native Claude Code/Codex plugin content: JSON schemas, a Markdown knowledge graph, skills and agent roles. Agents clone the graph locally and use their existing tools. No server, custom runtime or executable hooks.

The improvement target is fulfilling the user's request and the agent's responsibilities, including human review corrections about APIs and coding standards. A failed tool call is only one possible signal.

## Use

Load this directory through your host's native plugin mechanism. Run `evolve-setup` and supply the graph repository URL; use `hosting: auto`, `gitlab` or `github`. Setup clones the graph and adds explicit skill invocations to the relevant workspace/role instructions. This source package has not been installed into your hosts.

Claude uses `/agent-evolve:evolve`; Codex uses its discovered `evolve` skill, normally `$evolve`. Pass a current run or a captured `.txt` transcript. Dedicated `evolve-agent` analysis leads to separate `eval-agent` review, using `evolve-evaluate`, then a human-reviewed MR/PR through `glab`/`gh`. Exact bare `/evolve` availability is host-dependent. See [compatibility](docs/NATIVE-COMPATIBILITY.md).

## Storage and learning

| Location | Contents / access |
|---|---|
| `schema-definition.md`, `node-index.md` | Format and discovery catalog. Read before querying. |
| `nodes/*.md` | Seven operational types. Find frontmatter, walk direct relations, read selected bodies. |
| `schemas/` | JSON Schema per node/edge type; registries explain meanings and inverse names. |
| `skills/`, `agents/`, `templates/` | Native procedures, delegated roles and workspace/evaluation templates. |
| Configured `evaluation-root` | Separate criteria/results and private evidence; accessed by `evolve-evaluate`. |
| Configured `domain-source` | External domain facts, accessed using that source's own method. |

Learning means reviewed external knowledge changes, retrieved in later runs. It does not train model weights. Merge controls shared activation; agents refresh the reviewed base branch safely. A proposal assessment is distinct from measured improvement on later tasks.

Start with [the narrow walkthrough](docs/schema-proposal.html), [graph format](schema-definition.md), [requirements and remaining gaps](docs/REQUIREMENTS.md), and [course grounding](docs/course-grounding.md). The seven starter nodes describe this plugin's procedures; they are not company knowledge.

[Validation and review record](docs/VALIDATION.md).
