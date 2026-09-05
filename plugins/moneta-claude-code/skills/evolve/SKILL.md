---
name: evolve
description: Choose the Moneta workflow from the request and context to initialize personal memory, learn from one correction, or analyze a current run or saved transcript.
---

1. **Choose the flow from visible context.** Honor explicit intent first. Use the table below; no source capture, transcript sweep or candidate edits are needed to choose. Respect user opt-outs. If multiple flows or source occurrences remain plausible, ask one short question naming the unresolved choice and wait for the answer. Example: "Should I learn from your last correction or review the whole run?" Reuse information already provided.

| User intent / available context | Flow |
|---|---|
| Set up or connect Moneta; no learning source requested | Invoke [evolve-init](../evolve-init/SKILL.md), then return its setup/activation status. |
| One selected correction, review comment, guideline, tool explanation or sourced fact; inline or unambiguously identified in recent context | Invoke [evolve-message](../evolve-message/SKILL.md) with that exact message/occurrence and its necessary context. |
| Learn from the current run as a whole | Follow [run analysis](references/analyze-run.md) with the current session as source. |
| Analyze a supplied saved run/transcript | Follow [run analysis](references/analyze-run.md) with the supplied file and any explicit coverage limit. |

A `.txt` extension alone does not identify a whole run: an explicitly selected single message stays one-message mode. With bare evolve and one unambiguous recent correction, choose that correction; without a clear source/intent, ask. Do not silently expand a correction into a whole-session review. Routine or unsupported feedback can end as no change through message triage.

2. **Keep routing separate from memory selection.** Apply [memory selection](../knowledge-search/references/memory-scope.md): no explicit agent-slug means general. Context chooses a workflow, never another agent's memory area. Retain the source occurrence/path and selected area; pass `agent-slug: <selected-slug>` to every nested skill and worker. State the selected flow briefly before substantive work.
3. **Set up when necessary, then dispatch.** For a learning request, inspect the connection and selected area's availability before dispatch. Before entering missing setup, follow [pending learning](references/pending-setup.md) to freeze the selected evidence and save a private pending record. Then invoke evolve-init with the retained area and user-supplied destination details. If setup awaits merge, return its PR/MR and pending-record path; resume only after reviewed retrieval is available. Setup does not authorize analysis of additional sources. Once ready, run the chosen flow without asking the user to learn another command. A setup-only request stops after setup.

Completion: report setup status, a supported no-change result, an assessed PR/MR, or the concrete pending step. Analysis and independent evaluation remain inside the selected workflow; human merge controls memory activation. Hooks keep their bounded evolve-message path and never use missing setup as permission to create a repository automatically.
