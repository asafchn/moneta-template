"""Materialize the two native packages from shared authoring sources."""
from pathlib import Path
import argparse

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--check', action='store_true', help='Check committed packages match sources without writing.')
args = parser.parse_args()
for host in ('codex', 'claude-code'):
    target = ROOT / 'plugins' / f'moneta-{host}'
    expected = {}
    for source, prefix in ((ROOT / 'skills', Path('skills')), (ROOT / 'native' / 'shared', Path()), (ROOT / 'native' / host, Path())):
        for file in source.rglob('*'):
            if file.is_file():
                relative = prefix / file.relative_to(source)
                if relative in expected:
                    raise SystemExit(f'Duplicate package source: {relative}')
                expected[relative] = file.read_bytes()
    actual = {file.relative_to(target) for file in target.rglob('*') if file.is_file()} if target.exists() else set()
    extras = actual - expected.keys()
    if extras:
        raise SystemExit(f'Unexpected package files; reconcile explicitly: {host}: {sorted(map(str, extras))}')
    for relative, content in expected.items():
        output = target / relative
        if not output.resolve().is_relative_to(target.resolve()):
            raise SystemExit(f'Package path escapes target: {output}')
        if args.check:
            if not output.exists() or output.read_bytes() != content:
                raise SystemExit(f'Package drift: {output}')
        else:
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_bytes(content)
    print(f'{host}: {len(expected)} files ' + ('match sources' if args.check else 'packaged'))
