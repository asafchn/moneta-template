import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import type { Server } from 'node:http';

const require = createRequire(import.meta.url);
const { createViewer } = require('../../skills/moneta-show/scripts/server.cjs');
let server: Server;
let url: string;

test.beforeAll(async () => {
  server = createViewer(fileURLToPath(new URL('../../skills/init/assets/graph/general', import.meta.url)), fileURLToPath(new URL('../../skills/moneta-show/assets/viewer', import.meta.url)));
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  url = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
});
test.afterAll(() => { server.closeAllConnections(); server.close(); });

test('bundled local viewer displays real graph data and supports selection, search and refresh', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const externalRequests: string[] = [];
  page.on('request', request => { if (!request.url().startsWith(url)) externalRequests.push(request.url()); });
  await page.goto(url);
  await expect(page.getByText('7 of 7 nodes')).toBeVisible();
  await page.getByRole('button', { name: 'retrieve-relevant-guidance skills' }).click();
  await expect(page.locator('.viewer-detail h1')).toHaveText('retrieve-relevant-guidance');
  await expect(page.locator('.viewer-relations')).toContainText('[[uses]]');
  await page.getByRole('button', { name: '[[uses]] : inspect-node-frontmatter' }).click();
  await expect(page.locator('.viewer-detail h1')).toHaveText('inspect-node-frontmatter');
  await page.getByLabel('Find a node').fill('domain-knowledge');
  await expect(page.getByText('1 of 7 nodes')).toBeVisible();
  await page.getByRole('button', { name: 'moneta-knowledge-model domain-knowledge' }).click();
  await expect(page.locator('.viewer-detail')).toContainText('Human review controls shared activation');
  await page.getByLabel('Find a node').fill('');
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Refresh', exact: true })).toBeEnabled();
  await page.screenshot({ path: 'test-results/local-viewer.png', fullPage: true });
  expect(errors).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test('local viewer stays usable on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(url);
  await expect(page.getByText('7 of 7 nodes')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/local-viewer-mobile.png', fullPage: true });
});
