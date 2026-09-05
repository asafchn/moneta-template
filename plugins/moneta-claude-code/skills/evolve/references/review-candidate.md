# Evaluate and publish a candidate

1. Invoke a separate `eval-agent` with [its role](../../evolve-evaluate/references/role.md) and `evolve-evaluate`. Pass the exact candidate diff/revision, base, selected memory-scope and actor (preserving the caller's routing, not the reviewer name), original request, evidence and `source-mode`. Completion: a retained assessment separates actual deterministic checks, task-fulfillment judgments and limits.
2. Resolve supported findings and rerun affected checks. Candidate changes invalidate the old assessment. Raise material changes to user intent, node meanings or access boundaries. Completion: the assessment names the actual final candidate, or the result is no-change/deferred.
3. Follow [hosted review](hosted-review.md). Include source scope, checks actually run, metric definitions/results, judgments and limitations. Keep raw evidence private. Completion: MR/PR URL and assessed revision, or a concrete publication limitation with local work retained.

Human merge controls shared activation. A favorable assessment or merged change does not establish improved future performance.
