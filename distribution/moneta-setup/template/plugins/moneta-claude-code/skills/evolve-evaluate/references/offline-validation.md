# Validate locally

Use an installed Draft 2020-12 validator with a registry keyed by each local schema's $id. Schema IDs are identifiers, never network locations. With Python jsonschema and referencing already available, use this recipe from an explicit selected-area path. Run multiline code from a temporary file or a literal shell heredoc/here-string; never nest it inside an interpolated python -c string.

```python
import json
from pathlib import Path
import yaml
from jsonschema import Draft202012Validator
from referencing import Registry, Resource

root = Path(SELECTED_AREA).resolve()  # supplied absolute selected-area path
schema_root = root / "schemas"
def deny_remote(uri):
    raise RuntimeError("Schema reference missing from local registry")
registry = Registry(retrieve=deny_remote)
for path in schema_root.rglob("*.json"):
    definition = json.loads(path.read_text(encoding="utf-8-sig"))
    if "$id" in definition and "$schema" in definition:
        Draft202012Validator.check_schema(definition)
        registry = registry.with_resource(definition["$id"], Resource.from_contents(definition))
schema = json.loads((schema_root / "node.schema.json").read_text(encoding="utf-8-sig"))
validator = Draft202012Validator(schema, registry=registry)
catalog = json.loads((schema_root / "node-types.json").read_text(encoding="utf-8-sig"))
for item in catalog["types"].values():
    directory = (root / item["directory"]).resolve()
    assert directory.is_relative_to(root)
    for path in directory.glob("*.md"):
        assert path.resolve().is_relative_to(root)
        text = path.read_text(encoding="utf-8-sig")
        assert text.startswith("---\n")
        header, body = text[4:].split("\n---", 1)
        document = yaml.safe_load(header)
        assert body.strip()
        validator.validate(document)
print("Node schema validation passed")
```

This validates node schemas only. Separately reject duplicate YAML keys, compare unique slugs/filenames and exact index descriptions, then check every edge against edge-types.json: endpoint types, existing target, exactly one inverse and reciprocal type definitions. Include Markdown schema nodes; exclude only indexes and non-node JSON/support files. Never exclude the entire schemas/ node directory. A failed command stops that check; a later successful shell command cannot turn its result into a pass.

For record writing, use yaml.safe_dump with sort_keys=False and allow_unicode=True (or another available serializer), then parse and validate the saved frontmatter. This quotes colon-containing evidence correctly. Schema resolution uses Registry/Resource, not the legacy RefResolver or fabricated edges/edges aliases. If dependencies are unavailable, record the specific missing check without installing new packages silently or claiming full validation. Keep raw records and diagnostic output private; report concise, redacted findings.
