"""Development checks for the copied graph and documented offline schema recipe."""
import copy
import json
from pathlib import Path
import re
import unittest
import yaml
from jsonschema import Draft202012Validator, ValidationError
from referencing import Registry, Resource

ROOT = Path(__file__).resolve().parents[1]
AREA = ROOT / 'skills/init/assets/graph/general'

def schemas():
    return {d['$id']: d for p in (AREA / 'schemas').rglob('*.json')
            if '$id' in (d := json.loads(p.read_text(encoding='utf-8')))}

def validator(definitions):
    def deny(uri):
        raise AssertionError('Unexpected remote schema resolution')
    registry = Registry(retrieve=deny)
    for identifier, definition in definitions.items():
        Draft202012Validator.check_schema(definition)
        registry = registry.with_resource(identifier, Resource.from_contents(definition))
    return Draft202012Validator(definitions['https://moneta.invalid/schemas/node.schema.json'], registry=registry)

class GraphContractTests(unittest.TestCase):
    def test_documented_recipe_validates_actual_seed_offline(self):
        text = (ROOT / 'skills/evolve-evaluate/references/offline-validation.md').read_text()
        recipe = re.search(r'```python\n(.*?)\n```', text, re.S).group(1)
        exec(compile(recipe, '<offline-validation recipe>', 'exec'), {'SELECTED_AREA':str(AREA)})

    def test_complete_copy_has_exact_indexes_and_mirrored_edges(self):
        catalog = json.loads((AREA/'schemas/node-types.json').read_text())['types']
        edges = json.loads((AREA/'schemas/edge-types.json').read_text())['edges']
        nodes = {}
        validate = validator(schemas())
        for item in catalog.values():
            for path in (AREA/item['directory']).glob('*.md'):
                document = yaml.safe_load(path.read_text().split('---',2)[1])
                validate.validate(document)
                self.assertNotIn(document['slug'], nodes)
                self.assertEqual(path.stem, document['slug'])
                nodes[document['slug']] = (path, document)
        self.assertEqual(len(nodes), 7)
        self.assertEqual(sum(len(v) if isinstance(v, list) else 1 for _,d in nodes.values() for v in d['related'].values()), 8)
        for slug, (_,d) in nodes.items():
            for key, value in d['related'].items():
                edge = edges[key[2:-2]]
                for target_slug in value if isinstance(value, list) else [value]:
                    target = nodes[target_slug][1]
                    self.assertIn(d['node-type'],edge['source-types'])
                    self.assertIn(target['node-type'],edge['target-types'])
                    inverse = target['related'][f"[[{edge['inverse']}]]"]
                    self.assertEqual((inverse if isinstance(inverse, list) else [inverse]).count(slug),1)
        expected = sorted(f"| [{slug}](../{path.relative_to(AREA).as_posix()}) | {d['description']} |" for slug,(path,d) in nodes.items())
        actual = sorted(line for line in (AREA/'indexes/node-index.md').read_text().splitlines() if line.startswith('| ['))
        self.assertEqual(actual,expected)
        self.assertNotIn('| [',(AREA/'indexes/agent-index.md').read_text())

    def test_extend_selector_requires_discriminator_and_preserves_old_nodes(self):
        definitions = schemas()
        base = 'https://moneta.invalid/schemas/'
        name = 'decision-record'
        definition = {'$schema':'https://json-schema.org/draft/2020-12/schema','$id':base+'nodes/'+name+'.schema.json',
            'allOf':[{'$ref':'../node-base.schema.json'},{'properties':{'node-type':{'const':name},'data':{'type':'object','properties':{'outcome':{'type':'string','minLength':1}},'required':['outcome'],'additionalProperties':False}}}], 'unevaluatedProperties':False}
        definitions[definition['$id']] = definition
        definitions[base+'node.schema.json']['oneOf'].append({'$ref':'nodes/'+name+'.schema.json'})
        node = {'slug':'choose-client','node-type':name,'description':'Decision and applicability','tags':[],'scope':[],'data':{'outcome':'Reuse the shared client'},'related':{}}
        with self.assertRaises(ValidationError): validator(definitions).validate(node)
        definitions[base+'node-base.schema.json']['properties']['node-type']['enum'].append(name)
        validate = validator(definitions)
        validate.validate(node)
        for malformed in [dict(node,data={}),dict(node,data={'outcome':'yes','unexpected':True}),dict(node,unexpected=True)]:
            with self.assertRaises(ValidationError):validate.validate(malformed)
        for path in AREA.rglob('*.md'):
            text=path.read_text()
            if text.startswith('---'):validate.validate(yaml.safe_load(text.split('---',2)[1]))

    def test_related_keys_require_registered_meaning_and_valid_targets(self):
        validate = validator(schemas())
        path = AREA/'coding-guidelines/follow-applicable-guidance.md'
        node = yaml.safe_load(path.read_text().split('---',2)[1])
        for related in [{}, {'[[guides]]':'retrieve-before-work'}, {'[[guides]]':['retrieve-before-work','retrieve-relevant-guidance']}]:
            validate.validate(dict(node, related=related))
        for related in [[], {'guides':'retrieve-before-work'}, {'[[related-to]]':'retrieve-before-work'},
                        {'[[unknown]]':'retrieve-before-work'}, {'[[guides]]':[]}, {'[[guides]]':None},
                        {'[[guides]]':'../other-area'}, {'[[guides]]':['same-node','same-node']},
                        {'[[guides]]':{'target':'retrieve-before-work'}}]:
            with self.subTest(related=related), self.assertRaises(ValidationError):
                validate.validate(dict(node, related=related))
        legacy = dict(node)
        legacy['relations'] = [{'type':'guides','target':'retrieve-before-work'}]
        del legacy['related']
        with self.assertRaises(ValidationError): validate.validate(legacy)

    def test_edge_registry_and_property_schemas_agree(self):
        definitions = schemas()
        registry = json.loads((AREA/'schemas/edge-types.json').read_text())['edges']
        properties = definitions['https://moneta.invalid/schemas/edge.schema.json']['properties']
        self.assertEqual(set(properties), {f'[[{name}]]' for name in registry})
        self.assertNotIn('related-to', registry)
        for name, edge in registry.items():
            inverse = registry[edge['inverse']]
            self.assertEqual(inverse['inverse'], name)
            self.assertEqual(set(edge['source-types']), set(inverse['target-types']))
            self.assertEqual(set(edge['target-types']), set(inverse['source-types']))
            self.assertEqual(properties[f'[[{name}]]']['$ref'], edge['schema'])

if __name__ == '__main__': unittest.main()
