// Cheap routing only. Reusability and correctness are agent/evaluator judgments.
const LIMIT = 16384;
const rules = [
  ['review-change', /\b(?:(?:reviewed|review feedback|review comments?)\b[\s\S]{0,240}\b(?:change|replace|use|fix|should|must)|(?:change|replace|fix)\b[\s\S]{0,120}\b(?:api|code|call|function|method|error handling|validation|schema|tests?))\b/i],
  ['correction', /\b(?:you (?:used|called|missed|ignored|forgot)|that(?:'s| is) (?:wrong|incorrect)|wrong api|instead of|i (?:asked|meant)|not what i asked)\b/i],
  ['tool-guidance', /\b(?:when (?:using|calling)|for this tool|to (?:use|invoke|call) (?:this|the) tool)\b[\s\S]{0,240}\b(?:use|pass|call|invoke|requires?|first|before|after)\b/i],
  ['guideline', /\b(?:guidelines?|coding standards?|our convention|from now on|always|never|must use|should use|do not)\b/i],
];
function decide(prompt) {
  if (typeof prompt !== 'string') return { route: 'skip', reason: 'missing-message' };
  let text = prompt.slice(0, LIMIT).trim();
  if (!text) return { route: 'skip', reason: 'empty-message' };
  if (/^(?:\/[^\s:]+:|\/|\$)evolve(?:-[\w-]+)?\b/i.test(text)) return { route: 'skip', reason: 'explicit-workflow' };
  if (/\b(?:do not|don't|dont|never)\s+(?:auto[- ]?)?(?:evolve\b|(?:remember|store|save)\s+(?:this|that|these|my feedback|the feedback)\b)/i.test(text)) return { route: 'skip', reason: 'user-opt-out' };
  if (/^(?:how (?:do|can|should)|can you explain)\b/i.test(text)) {
    const end = text.indexOf('?');
    if (end < 0 || !text.slice(end + 1).trim()) return { route: 'skip', reason: 'request-not-feedback' };
    text = text.slice(end + 1);
  }
  for (const [reason, pattern] of rules) if (pattern.test(text)) return { route: 'inspect', reason };
  return { route: 'skip', reason: 'no-signal' };
}
module.exports = { decide };
