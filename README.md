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

Init asks only unresolved choices: provider, new/existing destination, owner and visibility when new, repository/group URLs to connect, and optional purpose. That purpose shapes your README. Omit agent-slug for general memory; supply it to select only that agent's area.

It generates a personalized runtime, publishes it to your repository, prepares one graph setup PR/MR, then installs and enables the runtime for your active host. Start a fresh chat to load it; merge the graph setup review before ordinary retrieval. Host-required hook trust remains a human action.

With read-only credentials, init still prepares and validates the files locally. It reports the exact blocked write, prepared artifacts and manual steps, then resumes later without starting over. A locally installed runtime is clearly marked unpublished when remote access is pending.

**Connect an organization once**

Supply a GitLab group URL or repository URLs. Each generated plugin stores these matching rules. When you open a codebase, the hook checks only its local Git origin. Group rules include subgroups and future repositories. No organization inventory, repository enumeration or source-code scan is performed. No per-codebase init is required. Teammates and CI install your generated plugin on their own hosts.

**Use your generated plugin**

- `evolve`: learn from a correction, current run or saved transcript; context chooses the flow or asks a focused question.
- `extend`: decide whether a missing concept fits an existing node/type/relation, then design and review a schema extension when needed.
- `knowledge-search`: index -> query -> frontmatter find -> direct-relation walk -> selected bodies.
- `moneta-show`: open a read-only localhost canvas of the selected memory area, with node details and named edges. The generated plugin includes the viewer; Node.js is sufficient, and knowledge stays local.

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
