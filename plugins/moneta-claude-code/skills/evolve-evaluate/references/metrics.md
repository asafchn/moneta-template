# Choosing evidence and metrics

Measure the delivered outcome against the task. Tool failures, node counts and confident prose are not substitutes for fulfillment.

| Question | Evidence or measure | Interpretation |
|---|---|---|
| Did the artifact meet the request? | Task-specific acceptance checks plus attributed review of uncovered requirements. | Record covered, failed and unresolved requirements separately. Passing an incomplete test suite is not full task success. |
| Did it follow applicable standards? | Existing linters/typechecks/tests, plus review against actual role instructions and API contracts. | Some standards and intent remain judgments. Label the source/method. |
| Is the stored graph structurally valid? | JSON Schema validation, target/inverse checks, index agreement, scoped Git diff. | Deterministic structural evidence, not proof of useful guidance. |
| Did retrieval find useful knowledge? | Relevant selected nodes / selected nodes; required relevant nodes found / known required nodes. | Precision/coverage require a defined relevance reference set. Without one, record attributed judgments rather than inventing ground truth. |
| Does the cited evidence support the claim? | Supported cited claims / checked cited claims; supported claims / claims requiring support. | Keep precision and coverage distinct. Source relevance alone does not establish claim support. |
| Did the change improve future work? | Baseline/candidate task outcomes under unchanged criteria, tools and effort. | Record case set, attempts, selected outputs, source-case exposure and limits. Report sample counts; one corrected case is not a general performance estimate. |
| What did it cost? | Available elapsed time, tool calls, tokens and cost from actual host/tool records. | Report separately from quality. Missing usage is unknown, not zero. |

For a task-success fraction, show numerator, denominator and unassessed cases. If multiple candidates were generated, report correctness of the selected result separately from whether any generated candidate was correct. Do not rename one as the other. When averaging human/agent judgments, preserve the rubric and evaluator identity.

Freeze the comparison definition before judging the candidate. A before/after graph-validation result measures structural validity; a before/after coding-task result measures that task. Avoid mixing them into an unexplained overall score.

## Lecture grounding

The supplied lecture sources are mapped in [course-grounding.md](course-grounding.md). L3 discusses rubrics, tool-assisted verification and selection errors; L4 execution feedback and distinct public/private tests; L8 task quality, retrieval, synthesis and citation support; L9 verification of critiques. Exact file schemas, coding rubrics and Git review procedures are our adaptations.
