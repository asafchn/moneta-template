'use strict';

const MASK = '[REDACTED]';
const credentialName = /token|secret|passw(?:or)?d|credential|key|authorization/i;
// Conservative independently written rules informed by Gitleaks; see docs/SECURITY.md.
const patterns = [
  /\bgh[pousr]_[A-Za-z0-9_]{12,}\b/g,
  /\bgithub_pat_[A-Za-z0-9_]{12,}\b/g,
  /\b(?:glpat|gloas|gldt|glrt|glcbt|glptt|glft|glimt|glsoat|glagent|glffct)-[A-Za-z0-9_.-]{10,}\b/g,
  /\bGR1348941[A-Za-z0-9_-]{12,}\b/g,
  /\b(?:sk|rk)-(?:proj-|svcacct-|ant-(?:api\d+|admin\d+)-)?[A-Za-z0-9_-]{16,}\b/g,
  /\b(?:sk|rk|pk)_(?:live|test)_[A-Za-z0-9]{12,}\b/g,
  /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g,
  /\b(?:AKIA|ASIA|AIDA|AROA)[A-Z0-9]{16}\b/g,
  /\bAIza[A-Za-z0-9_-]{20,}\b/g,
  /\b(?:npm_|pypi-|hf_|dop_v1_)[A-Za-z0-9_-]{16,}\b/g,
  /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)?\b/g,
];

function entropy(value) {
  const counts = new Map();
  for (const ch of value) counts.set(ch, (counts.get(ch) || 0) + 1);
  let bits = 0;
  for (const count of counts.values()) { const p = count / value.length; bits -= p * Math.log2(p); }
  return bits;
}

function redact(input, env = process.env) {
  let text = String(input).replace(/\\u([0-9a-f]{4})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  // Strip display controls before matching to prevent escape-split credentials.
  text = text.replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, '').replace(/[\u200b-\u200f\u202a-\u202e\u2060\ufeff]/g, '');
  const normalizePercent = value => value.replace(/%[a-f0-9]{2}/gi, part => part.toUpperCase());
  text = normalizePercent(text);
  const values = new Set();
  for (const [name, value] of Object.entries(env)) {
    if (!credentialName.test(name) || typeof value !== 'string' || !value) continue;
    for (const variant of [value, encodeURIComponent(value), new URLSearchParams({v:value}).toString().slice(2), JSON.stringify(value).slice(1, -1), Buffer.from(value).toString('base64'), Buffer.from(value).toString('base64url')]) values.add(normalizePercent(variant));
  }
  for (const value of [...values].sort((a, b) => b.length - a.length)) text = text.split(value).join(MASK);
  text = text.replace(/-----BEGIN[ A-Z0-9_-]{0,100}PRIVATE KEY(?: BLOCK)?-----[\s\S]*?(?:-----END[ A-Z0-9_-]{0,100}PRIVATE KEY(?: BLOCK)?-----|$)/gi, MASK);
  text = text.replace(/\b(?:proxy-authorization|authorization|set-cookie|cookie)\s*:[^\r\n]*/gi, MASK);
  text = text.replace(/\b(?:Bearer|Basic)\s+[A-Za-z0-9+\/._=-]+/gi, MASK);
  text = text.replace(/(\b[a-z][a-z0-9+.-]*:\/\/)[^\s\/@]+@/gi, '$1' + MASK + '@');
  // Drop complete labeled values, including quoted and multiline values.
  text = text.replace(/(["']?[\w.-]*(?:token|secret|password|passwd|credential|key|device[_-]?code|verification[_-]?code)[\w.-]*["']?\s*[:=]\s*)(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^\s,;]+)/gi, '$1' + MASK);
  for (const pattern of patterns) text = text.replace(pattern, MASK);
  // Prefer false positives for opaque output; this can also hide hashes/identifiers.
  text = text.replace(/[A-Za-z0-9+\/_=-]{24,}/g, value => {
    // Our bounded generated identity is metadata, after all known-secret rules.
    if (/^moneta-[a-z0-9-]{1,48}-[a-f0-9]{8}$/.test(value)) return value;
    return entropy(value) >= 4 || (/^[a-f0-9]{32,}$/i.test(value) && entropy(value) >= 3) ? MASK : value;
  });
  return text;
}

module.exports = { redact };
