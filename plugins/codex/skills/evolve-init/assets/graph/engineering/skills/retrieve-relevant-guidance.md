---
slug: retrieve-relevant-guidance
node-type: skills
description: Retrieve task-relevant operational guidance using the knowledge-search
  skill.
tags:
- search
- retrieval
- context
scope:
- knowledge-retrieval
data:
  invocation: knowledge-search
  purpose: Choose relevant guidance through index, find, walk and read.
relations:
- type: owned-by
  target: coding-agent
- type: uses
  target: inspect-node-frontmatter
- type: used-by
  target: retrieve-before-work
- type: owned-by
  target: review-agent
---

Invoke the installed knowledge-search skill. It guides query creation and staged reads using the host's existing tools. Evaluation material uses evolve-evaluate; domain facts remain in their outside source.
