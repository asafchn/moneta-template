# Moneta Template

**Give your agents a memory you own.**

A correction today can become scoped guidance in tomorrow's work. Moneta turns useful feedback into reviewed Markdown knowledge, then retrieves it when relevant. Model weights stay untouched.

**Start with moneta-setup**

You need Git, Node.js, Codex or Claude Code, and gh or glab for your chosen knowledge repository. Existing login is reused; write restrictions are respected.

Install the setup skill through skills.sh (choose your host):

```sh
npx skills add https://github.com/asafchn/moneta-template/tree/main/distribution/moneta-setup --global --agent codex
```

For Claude Code, use `--agent claude-code`. Run `$moneta-setup` in a fresh Codex chat, or `/moneta-setup` in Claude. This installs the setup skill; the wizard installs your generated native plugin and its hooks.

Alternatively, install the native setup plugin:

```sh
codex plugin marketplace add asafchn/moneta-template
codex plugin add moneta-setup@moneta-setup
```

Claude: `claude plugin marketplace add asafchn/moneta-template`, then `claude plugin install moneta-setup@moneta-setup`. Open a fresh chat and invoke `$init` in Codex or `/moneta-setup:init` in Claude. The native installer exposes only init.

The source repository is private; installation uses your existing GitHub access. The [skills CLI](https://github.com/vercel-labs/skills) supports private repositories. Its [telemetry can be disabled](https://www.skills.sh/docs/cli) by setting DISABLE_TELEMETRY=1 in your terminal environment before running it. Moneta's hooks send no telemetry.

**One wizard, your own repository**

Init asks only unresolved choices: provider, new/existing destination, owner and visibility when new, and optional purpose. Availability is global by default. Codebase targets are asked only when you request restrictions. That purpose shapes your README. Omit agent-slug for general memory; supply it to select only that agent's area.

For a new knowledge base, it generates a personalized runtime, publishes it to your repository, prepares one graph setup PR/MR, then installs and enables the runtime for your active host. Start a fresh chat to load it; merge the graph setup review before ordinary retrieval. Host-required hook trust remains a human action.

Choose connect to reuse a teammate's exact repository: init clones it locally, reuses its existing plugin and graph, and installs that plugin. Joining an existing area needs no new repository, bootstrap copy, commit or setup review.

Each installed brain uses a private machine-local ~/.moneta/<plugin-id>/config.json with the local checkout, graph path, repository identity and last successful pull. Reads always use that clone. Before operations, Moneta pulls when the last successful pull is at least one hour old; failed pulls never mark stale data fresh. Work in progress is preserved. SessionStart reminds the agent that memory exists; relevant prompts trigger selective retrieval.

With read-only credentials, init still prepares and validates the files locally. It reports the exact blocked write, prepared artifacts and manual steps, then resumes later without starting over. A locally installed runtime is clearly marked unpublished when remote access is pending.

**Use it across projects**

Your generated plugin works in every project and ordinary chat by default, including folders outside Git. No codebase URL, Git origin or per-repository init is required. The chosen knowledge repository is storage for your memory, not a restriction on where you can use it.

For optional restrictions, supply exact repository or organization/group URLs. Restricted mode reads only the current codebase's local Git origin; group rules include subgroups and future repositories without inventory, enumeration or source scans. Existing profiles with targets remain restricted until you request their removal. Say "make this Moneta runtime unbound" during init to reuse its destination and switch it to global.

Multiple installed memories stay separate: choose a runtime when ambiguous. General and explicit agent-slug isolation apply everywhere. Teammates and CI install the generated plugin on their own hosts.

**Use your generated plugin**

- `evolve`: learn from a correction, current run or saved transcript; context chooses the flow or asks a focused question.
- `extend`: decide whether a missing concept fits an existing node/type/relation, then design and review a schema extension when needed.
- `knowledge-search`: index -> query -> frontmatter find -> direct-relation walk -> selected bodies.
- `moneta-show`: open a read-only localhost canvas of the selected memory area, with node details and named edges. The generated plugin includes the viewer; Node.js and Git are sufficient, and knowledge stays local.

Use the generated plugin's qualified skill name when more than one runtime is installed. Feedback hooks screen a single user message and can suggest one-message evolution; relevance is assessed by the agent. Useful improvements receive independent evaluation with available deterministic checks, then a PR/MR. Human merge activates learned guidance. Scores alone do not prove future performance gains.

**What you own**

```text
your-knowledge-repository/
  README.md                   # your purpose and usage
  .agents/plugins/            # Codex marketplace
  .claude-plugin/             # Claude marketplace
  plugins/
    moneta-codex/             # your runtime skills, hooks, scripts and profile
    moneta-claude-code/
  memory/
    general/
      indexes/
      schemas/
      <node-type>/            # Markdown knowledge
    <explicit-agent-slug>/    # isolated area, same layout
```

Every node has discovery metadata, typed data and a detailed body. Named edges define both directions. Evaluation and raw evidence remain private and outside ordinary search. General is selected only without an agent-slug; an agent-specific read never falls back to another area's memories.

Runtime changes affect every connected agent and receive separate review from memory updates. Updating moneta-setup does not overwrite your generated plugin or knowledge.

**Develop the template**

The [interactive landing page](site/README.md) is a standalone React + MUI app in `site/`. Run `npm ci` and `npm run dev` there. For Vercel, select `site` as the project root.

Author skills in skills/ and adapters in native/. Build installers and their self-contained runtime templates with `python tools/package_plugins.py`; verify with `--check`. The standalone skills.sh entry is generated in distribution/moneta-setup/. Agent retrieval uses local files and existing tools. The optional moneta-show viewer runs a read-only localhost server for the browser.

[Requirements](docs/REQUIREMENTS.md) | [Validation](docs/VALIDATION.md) | [Secret handling](docs/SECURITY.md) | [Course grounding](docs/course-grounding.md)

## License

Moneta is source-available under [PolyForm Shield 1.0.0](LICENSE). Use, customization and sharing are permitted under its terms; using Moneta to provide a competing product or service is restricted. Independently created user knowledge retains its owners' rights. See [ownership and third-party notices](NOTICE.md).
