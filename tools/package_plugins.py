"""Build init-only installers and their self-contained personal-runtime templates."""
import argparse
import json
import os
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
HOSTS = ("codex", "claude-code")
PERSONAL_NAME = "moneta-personal"
RUNTIME_VERSION = "0.3.0"
LINK = re.compile(r"\]\((?:<(?P<angle>[^>]+)>|(?P<plain>[^\s)]+))(?:\s+\"[^\"]*\")?\)")


def files(directory):
    return sorted(path for path in directory.rglob("*")
                  if path.is_file() and "__pycache__" not in path.parts and path.suffix != ".pyc")


def add_tree(mapping, directory, prefix=Path(), exclude=()):
    for source in files(directory):
        relative = source.relative_to(directory)
        if relative.parts[0] not in exclude:
            destination = prefix / relative
            if destination in mapping.values():
                raise ValueError(f"Duplicate package destination: {destination}")
            mapping[source.resolve()] = destination


def rewrite_links(content, source, destination, mapping):
    """Relocate actual Markdown links; leave examples and invocation text alone."""
    if source.suffix.lower() != ".md":
        return content

    def replace(match):
        group = "angle" if match.group("angle") is not None else "plain"
        link = match.group(group)
        parsed = urlsplit(link)
        if parsed.scheme or not parsed.path or parsed.path.startswith("/"):
            return match.group()
        target = mapping.get((source.parent / unquote(parsed.path)).resolve())
        if target is None:
            return match.group()
        relative = Path(os.path.relpath(target, destination.parent)).as_posix()
        suffix = link[len(parsed.path):]
        start, end = match.span(group)
        offset = match.start()
        return match.group()[:start - offset] + relative + suffix + match.group()[end - offset:]

    return LINK.sub(replace, content.decode("utf-8")).encode("utf-8")


def materialize(mapping, link_mapping=None):
    return {destination: rewrite_links(source.read_bytes(), source, destination,
                                       link_mapping or mapping)
            for source, destination in mapping.items()}


def json_bytes(value):
    return (json.dumps(value, indent=2, ensure_ascii=False) + "\n").encode("utf-8")


def runtime(host):
    mapping = {}
    add_tree(mapping, ROOT / "skills", Path("skills"), exclude=("init",))
    add_tree(mapping, ROOT / "skills/init", Path("resources/setup"), exclude=("SKILL.md",))
    add_tree(mapping, ROOT / "native/shared")
    add_tree(mapping, ROOT / "native" / host)
    expected = materialize(mapping)
    metadata = Path(".codex-plugin" if host == "codex" else ".claude-plugin") / "plugin.json"
    manifest = json.loads(expected[metadata])
    manifest.update(name=PERSONAL_NAME, version=RUNTIME_VERSION)
    expected[metadata] = json_bytes(manifest)
    return expected, mapping


def repository_template(runtimes):
    expected = {}
    for host, (contents, _) in runtimes.items():
        expected.update({Path("plugins") / f"moneta-{host}" / path: data for path, data in contents.items()})
    expected[Path(".agents/plugins/marketplace.json")] = json_bytes({
        "name": PERSONAL_NAME,
        "plugins": [{"name": PERSONAL_NAME,
                     "source": {"source": "local", "path": "./plugins/moneta-codex"},
                     "policy": {"installation": "AVAILABLE", "authentication": "ON_INSTALL"},
                     "category": "Productivity"}],
    })
    expected[Path(".claude-plugin/marketplace.json")] = json_bytes({
        "name": PERSONAL_NAME, "owner": {"name": PERSONAL_NAME},
        "plugins": [{"name": PERSONAL_NAME, "source": "./plugins/moneta-claude-code", "version": RUNTIME_VERSION,
                     "description": "Personal agent guidance and reviewed learning."}],
    })
    return expected


def installer(host, runtimes, template):
    mapping = {}
    add_tree(mapping, ROOT / "skills/init", Path("skills/init"))
    add_tree(mapping, ROOT / "native/installer" / host)
    for name in ("provider.cjs", "redact.cjs"):
        mapping[(ROOT / "native/shared/scripts" / name).resolve()] = Path("scripts") / name
    links = {source: Path("template/plugins") / f"moneta-{host}" / destination
             for source, destination in runtimes[host][1].items()}
    links.update(mapping)
    expected = materialize(mapping, links)
    expected.update({Path("template") / path: data for path, data in template.items()})
    return expected


def check_path(path, target):
    if not path.resolve().is_relative_to(target.resolve()):
        raise ValueError(f"Package path escapes target: {path}")
    for current in (path, *path.parents):
        if current.is_symlink() or (hasattr(current, "is_junction") and current.is_junction()):
            raise ValueError(f"Refusing linked package path: {current}")
        if current == ROOT:
            break


def reconcile(target, expected, check, remove_extras):
    check_path(target, ROOT)
    for relative in expected:
        check_path(target / relative, target)
    actual = set()
    directories = []
    if target.exists():
        for directory, names, names_files in os.walk(target, followlinks=False):
            for name in names + names_files:
                path = Path(directory) / name
                check_path(path, target)
                if path.is_file():
                    actual.add(path.relative_to(target))
                elif path.is_dir():
                    directories.append(path)
    extras = actual - expected.keys()
    if extras and (check or not remove_extras):
        raise ValueError(f"Unexpected package files; inspect and use --reconcile to remove: {target}: "
                         f"{sorted(map(str, extras))}")
    if check:
        for relative, content in expected.items():
            output = target / relative
            if not output.is_file() or output.read_bytes() != content:
                raise ValueError(f"Package drift: {output}")
    else:
        # All paths are checked before mutation. Delete individual files only;
        # never recursively delete a computed package directory.
        for relative in sorted(extras):
            (target / relative).unlink()
        for directory in sorted(directories, key=lambda path: len(path.parts), reverse=True):
            if not any(directory.iterdir()):
                directory.rmdir()
        for relative, content in expected.items():
            output = target / relative
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_bytes(content)
    print(f"{target.relative_to(ROOT)}: {len(expected)} files " + ("match sources" if check else "packaged"))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Check byte parity without writing.")
    parser.add_argument("--reconcile", action="store_true",
                        help="Remove obsolete files individually inside checked generated package roots.")
    args = parser.parse_args()
    if args.check and args.reconcile:
        parser.error("--check and --reconcile cannot be combined")
    runtimes = {host: runtime(host) for host in HOSTS}
    template = repository_template(runtimes)
    installers = {host: installer(host, runtimes, template) for host in HOSTS}
    for host, contents in installers.items():
        reconcile(ROOT / "plugins" / f"moneta-setup-{host}", contents, args.check, args.reconcile)
    standalone = dict(installers["codex"])
    standalone[Path("SKILL.md")] = (
        "---\nname: moneta-setup\ndescription: Install your personal Moneta plugin through the setup wizard.\n---\n\n"
        "Treat this directory as the installer root. Read [the init wizard](skills/init/SKILL.md) and run it. "
        "Select the generated runtime for the user's native host through init. "
        "All required assets, scripts and both runtime templates are bundled here.\n"
    ).encode("utf-8")
    reconcile(ROOT / "distribution/moneta-setup", standalone, args.check, args.reconcile)


if __name__ == "__main__":
    try:
        main()
    except ValueError as error:
        raise SystemExit(str(error)) from error
