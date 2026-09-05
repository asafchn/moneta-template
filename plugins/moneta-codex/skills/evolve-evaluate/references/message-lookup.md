# Prior-message assessment lookup

Use this branch for `mode: lookup`, with the active domain/agent, source occurrence locator and candidate lesson/scope.

1. Inspect only that agent's configured evaluation records for this occurrence or lesson. Compare retained occurrence IDs/locators and scope; repeated wording in a later turn is not automatically a duplicate.
2. Return `no-match` or a bounded summary: matching assessment path, source occurrence, recommendation, assessed revision and pending review reference when recorded. Keep unrelated records and raw messages outside the response. A caller can inspect the returned PR/MR through existing provider tools to confirm its current state.
3. Completion: the caller has enough provenance to reuse pending work or continue the new message. This branch creates no candidate, changes no assessment and runs no new evaluation. Existing records are prior evidence, not proof that a changed candidate or new occurrence is already assessed.
