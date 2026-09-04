# Native Agent-evolve Implementation Plan

> For agentic workers: use the implement skill with task-by-task implementation and review. User decisions on material drift override autonomous rulings in other skills. Check docs/DECISIONS.md before each task. Test boundaries require the pending user answer before test implementation.

**Goal:** Deliver native plugins that retrieve the user's typed Markdown guidance and propose reviewed improvements from native runs or imported transcripts.

**Architecture:** Shared TypeScript filesystem/process core exposed as local MCP tools. Native skills make contextual judgments; host adapters provide hooks and dedicated agent registration. Operational retrieval, external domain sources, and evaluation access are distinct.

**Tech Stack:** Node 22+, TypeScript, yaml, zod, MCP TypeScript SDK; exact versions in package-lock.json. Node test runner. No provider client or training framework.

**Spec:** ../../SPEC.md. Schema draft: ../../SCHEMA-PROPOSAL.md. Native capability findings: ../../NATIVE-COMPATIBILITY.md.

## Global constraints

Preserve the seven user node-type names. Metadata plus description supports discovery. Edges are named, typed and bidirectional. schema-definition explains the format; node-index lists slugs/descriptions. Agent generates the query. find reads frontmatter, walk explores direct relations, read loads selected bodies. Domain knowledge stays external. Criteria/results use a different skill. Both current sessions and plain captured TXT are supported. hosting is auto/gitlab/github; glab/gh create human-reviewed MR/PR. Preserve unmanaged instructions. Never claim a proposal score is measured improvement. No automatic merge. No silent substitute for native UX.

## Task 1: Validated graph and retrieval

**Files:** src/graph/{contracts,frontmatter,store,search,index}.ts; tests/graph.test.ts; schemas/defaults; docs/schema-definition.md.

**Consumes:** configured operational graph root and schema-definition. Per-type meaning follows D05; task-cases/feedback are excluded from built-ins pending D06.

**Produces:** GraphStore.open(root), index(), find(query), walk(slugs), read(slugs), validate(). Results expose stable slugs, descriptions, typed relations and validation issues; only read returns bodies. Duplicate slug, invalid typed payload, missing target, invalid inverse and cross-store access produce explicit errors.

- [ ] Resolve only the schema decisions needed for built-in examples; record interpretation before code.
- [ ] Write one public scenario: a query finds a guideline through its description, walk exposes a linked invocation, and read returns only selected bodies.
- [ ] Run the focused test and observe failure before implementation.
- [ ] Implement frontmatter parsing and schema validation, then the scenario's index/find/walk/read operations.
- [ ] Add cases one at a time: body-only term is not a find match; evaluation files never enter the operational index or traversal; invalid inverse edge is rejected; edits make an index stale and regenerate it.
- [ ] Typecheck and run focused tests; task review and commit.

## Task 2: Captured source and assessed proposals

**Files:** src/evolution/{sources,proposals}.ts; tests/evolution.test.ts; plugin references for evidence handling.

**Consumes:** TXT/available native source, current graph revision, agent-authored candidate and evidence locators.

**Produces:** importSource(path), inspectSource(id), prepareProposal(input). Proposal includes base revision, bounded graph changes, rationale, scope, evidence references and assessment reference. Incomplete import remains usable and explicitly incomplete.

- [ ] Write an import scenario from a reviewed coding run: record request, correction and source offsets without asserting that text proves execution.
- [ ] Observe failure, implement source handling, and verify it.
- [ ] Add a supported proposal changing an existing guideline; preserve source provenance and reject invalid/stale bases.
- [ ] Add a no-change result when no reusable improvement is supported, and an incomplete-source result with explicit missing evidence.
- [ ] Ensure raw transcript content stays outside published graph changes by default.
- [ ] Typecheck, focused tests, task review and commit.

## Task 3: Separate evaluation access

**Files:** src/evaluation/{contracts,store}.ts; tests/evaluation.test.ts; skills/evaluate/SKILL.md.

**Consumes:** explicitly configured criteria/result root and selected proposal/source references.

**Produces:** listCriteria(), readCriterion(id), recordAssessment(input), readAssessment(id). Assessment kind distinguishes proposal judgment from observed outcome. Unknown measurements are absent/unknown, never zero or success.

- [ ] Write a case where a proposal assessment is saved and read through evaluation operations while graph find/walk/read cannot access it.
- [ ] Observe failure, implement the isolated access interface, then verify.
- [ ] Add revision/criterion association and reject attempts to label unsupported claims as recorded execution.
- [ ] Document eval-agent's evidence review, scope/generalization judgment and reasons for abstention. Numeric scoring is only under explicitly supplied criteria; do not invent a universal admission threshold.
- [ ] Typecheck, focused tests, task review and commit.

## Task 4: Hosted review and managed instructions

**Files:** src/hosting/{config,repository,review}.ts; src/instructions.ts; tests/hosting.test.ts; tests/instructions.test.ts.

**Consumes:** configured user repository URL, hosting selection, validated proposal and assessment, existing local instructions.

**Produces:** resolveHosting(url, override), prepareReview(proposal), publishReview(prepared), updateManagedInstructions(path, invocation). Process arguments are arrays and review bodies are exact files.

- [ ] Write URL-selection tests covering GitHub, GitLab, SSH forms, subgroup paths and ambiguous self-hosting requiring override.
- [ ] Observe failure, implement provider resolution, then validate exact gh/glab argument construction without publishing.
- [ ] Implement a temporary Git repository scenario: candidate branch contains only intended node/index changes; source branch and unrelated bytes remain untouched; stale bases fail.
- [ ] Add repeat/idempotency behavior and invalid graph rejection before any push.
- [ ] Verify managed instruction replacement preserves unrelated bytes and explicitly invokes the installed skill.
- [ ] Typecheck, focused tests, task review and commit. Live publication requires a real user-supplied repository; report local checks separately.

## Task 5: Native adapters and complete local workflow

**Files:** src/mcp.ts; src/hosts/{hooks,session}.ts; hooks/hooks.json; skills/{search,evolve,evaluate}/SKILL.md; agents/{evolve-agent,eval-agent}.md; Codex project-agent templates; scripts/build-distributions.mjs.

**Consumes:** Tasks 1-4, D01 hook choice, D03/D04 host integration decision, confirmed event contracts.

**Produces:** native Claude/Codex distributions exposing graph, evolution, evaluation and review operations; hook context and selected gate behavior; explicit current-session evidence handoff; imported-file evolve-agent workflow.

- [ ] Write a stdio client scenario using initialize, tools/list and a real graph lookup through the MCP boundary.
- [ ] Observe failure, implement the server, and verify tool-level input validation.
- [ ] Test selected hook behavior with native event fixtures, including recursion prevention and separate agent/session state. Do not treat additionalContext as proof the current operation waited.
- [ ] Implement source handoff that keeps live context available to dedicated agents. Missing transcript paths remain explicit gaps.
- [ ] Implement native skills and agent instructions, with schema/index discovery and separate evaluation access.
- [ ] Validate both distributions, including paths containing spaces and plugin-cache path resolution. Validate discoverable hooks at hooks/hooks.json without stale-validator manifest fields.
- [ ] Typecheck, focused tests, task review and commit.

## Task 6: End-to-end checks and review

**Files:** tests/workflow.test.ts; docs/{INSTALLATION,VERIFICATION}.md; README.md; current decision ledger.

**Consumes:** all implemented interfaces and both packaged distributions.

**Produces:** tested local workflow, documented installation and measured verification status, final code review and implementation commit.

- [ ] Run a fixture-backed workflow: retrieve relevant guideline, import reviewed run, propose supported revision, access evaluation separately, prepare a Git review diff.
- [ ] Exercise native discovery/manifest checks without paid generation. Record exactly which checks used a real host and which used event fixtures.
- [ ] Run full typecheck/build/test suite once after focused checks have passed; repeat only for fixes or unresolved concerns.
- [ ] Run code-review on standards and spec axes against the initial scaffold baseline; fix material findings and rerun affected checks.
- [ ] Commit reviewed work. Report unresolved live checks and material user decisions; do not call fixture success demonstrated agent learning.

## Progress

- [x] Dedicated source repository and feature branch created.
- [x] Current spec and concrete schema proposal written.
- [x] Dependencies pinned and installed; lockfile generated.
- [x] Native compatibility researched from official sources.
- [ ] User test-boundary agreement received.
- [ ] Material hook/host/schema decisions received.
- [ ] Task 1 through Task 6 implemented, reviewed and verified.
