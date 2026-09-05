export const nodes = [
  { id: 'guidelines', type: 'coding-guidelines', label: 'Coding guidelines', example: 'Use the shared API client', description: 'The conventions that make code feel like it belongs in your codebase.', body: 'Use the shared client for service requests. It handles authentication, retries and typed errors. Avoid introducing a second request wrapper.', color: '#ae4b2e', x: .47, y: .43 },
  { id: 'tools', type: 'tool-calls', label: 'Tool calls', example: 'Call the client correctly', description: 'Reusable guidance for choosing and invoking a tool.', body: 'Use client.projects.list({ cursor }) to fetch a page. Pass the returned cursor into the next call; do not construct pagination URLs manually.', color: '#536c84', x: .78, y: .22 },
  { id: 'responsibility', type: 'agent-responsibility', label: 'Agent responsibility', example: 'Own the change end to end', description: 'What an agent is responsible for delivering and checking.', body: 'The coding agent owns implementation and relevant verification. Present the patch and evidence for human review before merge.', color: '#73744d', x: .2, y: .15 },
  { id: 'skills', type: 'skills', label: 'Skills', example: 'Review an API change', description: 'When a skill is useful and how the agent should invoke it.', body: 'Invoke the API review skill when a change affects a service contract. Read its instructions and bring the changed contract into the review.', color: '#77678b', x: .17, y: .57 },
  { id: 'guards', type: 'guard-rails', label: 'Guard rails', example: 'Keep credentials private', description: 'Boundaries that constrain actions and protect sensitive information.', body: 'Never place credentials in logs, graph nodes or review descriptions. Use the approved redacting wrapper when checking provider authentication.', color: '#947044', x: .81, y: .64 },
  { id: 'flow', type: 'agentic-flow context', label: 'Agentic flow context', example: 'Review before merge', description: 'The sequence, handoffs and context of a recurring agent workflow.', body: 'Implement the change, run relevant checks, then request human review. A proposed memory becomes active only after its review is merged.', color: '#63715e', x: .32, y: .83 },
  { id: 'schemas', type: 'schemas', label: 'Schemas', example: 'The project response', description: 'Searchable explanations of contracts, shapes and their intended use.', body: 'A project page contains items and a nextCursor. The nextCursor is null when the final page has been reached. JSON definitions live in the schemas folder.', color: '#536c84', x: .53, y: .09 },
  { id: 'domain', type: 'domain-knowledge', label: 'Domain knowledge', example: 'What a workspace means', description: 'Sourced concepts and facts, with their context and applicability.', body: 'In this example product, a workspace is the billing boundary for projects. Attach the authoritative source and state where this definition applies.', color: '#73744d', x: .63, y: .87 },
] as const;

// Illustrative instances using the registered directional types and endpoints.
export const edges = [
  { from: 'guidelines', to: 'tools', forward: 'guides', inverse: 'guided-by' },
  { from: 'responsibility', to: 'skills', forward: 'owns', inverse: 'owned-by' },
  { from: 'guidelines', to: 'skills', forward: 'guides', inverse: 'guided-by' },
  { from: 'guidelines', to: 'guards', forward: 'constrained-by', inverse: 'constrains' },
  { from: 'tools', to: 'schemas', forward: 'conforms-to', inverse: 'schema-for' },
  { from: 'flow', to: 'skills', forward: 'uses', inverse: 'used-by' },
  { from: 'flow', to: 'schemas', forward: 'uses', inverse: 'used-by' },
  { from: 'guards', to: 'domain', forward: 'constrains', inverse: 'constrained-by' },
];
export const edgePairs = [
  ['guides', 'guided-by', 'A guideline governs a capability or flow.'],
  ['owns', 'owned-by', 'An agent is responsible for a capability or flow.'],
  ['uses', 'used-by', 'A skill or flow uses a capability or schema.'],
  ['constrains', 'constrained-by', 'A guardrail limits the target’s behavior.'],
  ['conforms-to', 'schema-for', 'A node follows the target schema’s contract.'],
];
export type NodeId = typeof nodes[number]['id'];

export function relatedPreview(id: NodeId) {
  const related: Record<string, string[]> = {};
  for (const edge of edges) {
    if (edge.from !== id && edge.to !== id) continue;
    const key = edge.from === id ? edge.forward : edge.inverse;
    (related[key] ||= []).push(edge.from === id ? edge.to : edge.from);
  }
  return Object.entries(related).map(([key, targets]) => targets.length === 1
    ? `  "[[${key}]]": ${targets[0]}`
    : `  "[[${key}]]":\n${targets.map(target => `    - ${target}`).join('\n')}`).join('\n');
}

export const learningSteps = [
  { name: 'Correct', title: 'Start with the work.', text: 'A review comment, a guideline, a current session or a saved transcript can carry a reusable lesson.', tag: 'Human feedback', content: '“Use our shared API client here. It already handles retries and authentication.”' },
  { name: 'Distill', title: 'Keep the reusable part.', text: 'A quick feedback hook flags possible lessons. The agent checks relevance, existing guidance and scope before evolving a candidate.', tag: 'Candidate · not active', content: 'For service requests, reuse the shared client. Avoid a second wrapper that duplicates auth and retry behavior.' },
  { name: 'Evaluate', title: 'Check the evidence.', text: 'An independent agent reviews the proposed guidance using available deterministic checks and attributed judgments. Assessments stay outside normal search.', tag: 'Illustrative review', content: 'Evidence: human review + existing client contract. Checks: schema valid, relations consistent, no duplicate guidance. Future gains: not yet measured.' },
  { name: 'Review', title: 'You decide what stays.', text: 'Moneta opens a PR or MR in your knowledge repository. Human merge activates the improvement; the proposal alone does not.', tag: 'Knowledge repository · PR / MR', content: '+ coding-guidelines/use-shared-client.md\n+ indexes/node-index.md\n\nReview → approve → merge' },
  { name: 'Retrieve', title: 'Bring it into the next task.', text: 'The agent reads the index, forms a query, finds frontmatter matches, walks relevant direct edges and reads only the selected bodies.', tag: 'Future task · selected scope', content: 'Index → query → find → walk → read\n\n“Add project pagination”\n↳ shared client + pagination contract' },
];
