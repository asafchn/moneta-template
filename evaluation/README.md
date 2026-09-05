# Separate evaluation store

`evolve-evaluate` reads `evaluation-root/<memory-scope>/<agent>/criteria/`, `results/` and private `sources/`. Init can pass this location before a connection exists. [Criterion](../skills/init/assets/templates/evaluation-criterion.md) and [result](../skills/init/assets/templates/evaluation-result.md) templates are formats, not measured outcomes. Evaluation stays outside operational memory indexes.
