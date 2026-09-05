# Init telemetry findings

Reviewed local session 01a072b1-90bf-7dc3-a733-2230953bb9c3 (2026-09-05). User invocation to final status: 17:50:39 to 18:05:59 UTC, about 15 minutes 20 seconds. Telemetry stays private; this record contains only relevant findings.

Authentication succeeded after approved access. Subsequent failures were independent:

- A GraphQL repository lookup saying "Could not resolve to a Repository" was incorrectly categorized as network-blocked. The classifier now distinguishes not-found-or-inaccessible; a new regression first failed, then passed.
- Instructions explicitly requested a GitHub copy of the entire Moneta source repository. The final design instead generates a personalized runtime distribution from installed assets, without the development tree.
- Directory transfer tried git diff against /dev/null/NUL, parsed errors as patches, hit patch-format errors, then consumed truncated output. A long patch call was terminated; one tool-call node was missing and recovered later. Init now copies files directly and checks names/hashes before customization.
- A relative output path tried writing into the installed plugin directory. Instructions now require resolved source/destination paths and candidate working directory.
- Nested PowerShell/python quoting failed. Later legacy RefResolver validation attempted network resolution against offline IDs, then generated edges/edges paths. The same resolver failure was reproduced locally with network forbidden. The Registry/Resource recipe resolves declared IDs locally; no fabricated aliases.
- One check excluded schemas/ Markdown nodes and falsely reported a missing relation target. Validation enumerates registered node-type directories, including schemas/.
- Handwritten YAML evidence containing colon-space became mappings or invalid syntax. Saved records now use a serializer and parse/schema validation.
- Chained shell commands sometimes returned success after an earlier validation failure. Each check's own exit status is required.

The ready general graph no longer requires deleting illustrative agent enrollments on every init. Actual role enrollment remains explicit. Purpose/README, local organization matching, installation/enablement, and limited-permission resume are now explicit wizard branches. User-owned runtime generation supersedes the intermediate graph-only repository proposal.
