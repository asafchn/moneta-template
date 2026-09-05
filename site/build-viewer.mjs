import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
await mkdir(`${root}/skills/moneta-show/scripts`, { recursive: true });
await build({
  entryPoints: [`${root}/tools/moneta-show-server.cjs`],
  outfile: `${root}/skills/moneta-show/scripts/server.cjs`,
  bundle: true,
  platform: 'node',
  target: 'node18',
  nodePaths: [fileURLToPath(new URL('./node_modules', import.meta.url))],
  legalComments: 'eof',
});
const yamlLicense = await readFile(new URL('./node_modules/yaml/LICENSE', import.meta.url), 'utf8');
await writeFile(`${root}/skills/moneta-show/scripts/YAML-LICENSE.txt`, yamlLicense);
console.log('Bundled standalone local viewer server.');
const libraries = ['@fontsource/dm-sans', '@fontsource/newsreader', 'react', 'react-dom', '@mui/material', '@emotion/react', '@emotion/styled'];
const notices = await Promise.all(libraries.map(async name => `${name}\n${await readFile(new URL(`./node_modules/${name}/LICENSE`, import.meta.url), 'utf8')}`));
await writeFile(`${root}/skills/moneta-show/assets/viewer/THIRD-PARTY-NOTICES.txt`, notices.join('\n\n---\n\n'));
