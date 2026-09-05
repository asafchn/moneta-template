"""Profile schema keeps global availability separate from memory-area selection."""
import json
from pathlib import Path
import unittest
from jsonschema import Draft202012Validator, ValidationError

ROOT = Path(__file__).resolve().parents[1]

class RuntimeProfileTests(unittest.TestCase):
    def setUp(self):
        self.validate = Draft202012Validator(json.loads((ROOT/'native/shared/moneta.schema.json').read_text()))
        self.profile = {'repository-url':'https://github.com/example/memory','hosting':'github','base-branch':'main'}
        self.targets = [{'kind':'repository','url':'https://github.com/example/project'}]

    def test_global_defaults_and_legacy_restrictions_remain_valid(self):
        for profile in [self.profile, dict(self.profile, availability='global'),
                        dict(self.profile, availability='global', targets=[]),
                        dict(self.profile, targets=self.targets),
                        dict(self.profile, availability='restricted', targets=self.targets)]:
            with self.subTest(profile=profile): self.validate.validate(profile)

    def test_conflicting_or_missing_restrictions_are_rejected(self):
        for profile in [dict(self.profile, availability='global', targets=self.targets),
                        dict(self.profile, availability='restricted'),
                        dict(self.profile, availability='restricted', targets=[]),
                        dict(self.profile, availability='unknown'), dict(self.profile, targets=None)]:
            with self.subTest(profile=profile), self.assertRaises(ValidationError): self.validate.validate(profile)

if __name__ == '__main__': unittest.main()
