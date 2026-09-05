"""Verify installer/runtime boundaries using independently built packages."""
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
HOSTS = ("codex", "claude-code")
RUNTIME_SKILLS = {"evolve", "evolve-agent", "evolve-evaluate", "evolve-message", "extend", "knowledge-search", "moneta-show"}
LINK = re.compile(r"\]\((?:<([^>]+)>|([^\s)]+))(?:\s+\"[^\"]*\")?\)")


class PackagingTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temporary = tempfile.TemporaryDirectory()
        cls.addClassCleanup(cls.temporary.cleanup)
        cls.root = Path(cls.temporary.name)
        for directory in ("tools", "skills", "native"):
            shutil.copytree(ROOT / directory, cls.root / directory,
                            ignore=shutil.ignore_patterns("__pycache__", "*.pyc"))
        cls.build()

    @classmethod
    def build(cls, *arguments):
        result = subprocess.run([sys.executable, str(cls.root / "tools/package_plugins.py"), *arguments],
                                capture_output=True, text=True)
        if result.returncode:
            raise AssertionError(result.stdout + result.stderr)
        return result

    def test_installer_exposes_only_init_and_has_no_runtime_hooks(self):
        for host in HOSTS:
            installer = self.root / "plugins" / f"moneta-setup-{host}"
            self.assertEqual({p.parent.name for p in (installer / "skills").rglob("SKILL.md")}, {"init"})
            self.assertFalse((installer / "hooks").exists())
            self.assertTrue((installer / "scripts/provider.cjs").is_file())
            self.assertTrue((installer / "scripts/redact.cjs").is_file())
            metadata = installer / (".codex-plugin" if host == "codex" else ".claude-plugin") / "plugin.json"
            manifest = json.loads(metadata.read_text(encoding="utf-8"))
            self.assertEqual(manifest["name"], "moneta-setup")
            self.assertEqual(manifest["version"], "0.10.0")
            self.assertNotIn("hooks", manifest)

    def test_each_template_contains_both_independent_runtime_packages(self):
        for installer_host in HOSTS:
            template = self.root / "plugins" / f"moneta-setup-{installer_host}" / "template"
            for host in HOSTS:
                runtime = template / "plugins" / f"moneta-{host}"
                self.assertEqual({p.parent.name for p in (runtime / "skills").rglob("SKILL.md")}, RUNTIME_SKILLS)
                self.assertTrue((runtime / "hooks/hooks.json").is_file())
                self.assertTrue((runtime / "hooks/context.cjs").is_file())
                self.assertTrue((runtime / "scripts/provider.cjs").is_file())
                self.assertTrue((runtime / "skills/moneta-show/scripts/server.cjs").is_file())
                self.assertTrue((runtime / "skills/moneta-show/assets/viewer/graph.html").is_file())
                self.assertTrue((runtime / "resources/setup/assets/graph/general/indexes/node-index.md").is_file())
                self.assertFalse((runtime / "resources/setup/SKILL.md").exists())
                metadata = runtime / (".codex-plugin" if host == "codex" else ".claude-plugin") / "plugin.json"
                self.assertEqual(json.loads(metadata.read_text(encoding="utf-8"))["name"], "moneta-personal")
                self.assertFalse(any(path.is_symlink() for path in runtime.rglob("*")))
            for relative in (".agents/plugins/marketplace.json", ".claude-plugin/marketplace.json"):
                marketplace = json.loads((template / relative).read_text(encoding="utf-8"))
                self.assertEqual(marketplace["name"], "moneta-personal")
                self.assertEqual(marketplace["plugins"][0]["name"], "moneta-personal")

    def test_relative_markdown_links_resolve_inside_each_installer(self):
        installers = [self.root / "plugins" / f"moneta-setup-{host}" for host in HOSTS]
        installers.append(self.root / "distribution/moneta-setup")
        for installer in installers:
            for document in installer.rglob("*.md"):
                for match in LINK.finditer(document.read_text(encoding="utf-8")):
                    destination = match.group(1) or match.group(2)
                    parsed = urlsplit(destination)
                    if parsed.scheme or not parsed.path or parsed.path.startswith("/"):
                        continue
                    target = (document.parent / unquote(parsed.path)).resolve()
                    self.assertTrue(target.is_relative_to(installer.resolve()), f"Escaping link: {document}: {destination}")
                    self.assertTrue(target.exists(), f"Broken link: {document}: {destination}")

    def test_standalone_skill_contains_the_complete_installer(self):
        standalone = self.root / "distribution/moneta-setup"
        loader = (standalone / "SKILL.md").read_text(encoding="utf-8")
        self.assertIn("name: moneta-setup\n", loader)
        self.assertIn("skills/init/SKILL.md", loader)
        codex = self.root / "plugins/moneta-setup-codex"
        for source in codex.rglob("*"):
            if source.is_file():
                copy = standalone / source.relative_to(codex)
                self.assertTrue(copy.is_file(), str(copy))
                self.assertEqual(copy.read_bytes(), source.read_bytes())

    def test_check_detects_byte_drift_without_overwriting(self):
        self.build("--check")
        file = self.root / "plugins/moneta-setup-codex/scripts/provider.cjs"
        original = file.read_bytes()
        try:
            file.write_bytes(original + b"\n// local modification\n")
            result = subprocess.run([sys.executable, str(self.root / "tools/package_plugins.py"), "--check"],
                                    capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("Package drift", result.stderr)
            self.assertEqual(file.read_bytes(), original + b"\n// local modification\n")
        finally:
            file.write_bytes(original)


if __name__ == "__main__":
    unittest.main()
