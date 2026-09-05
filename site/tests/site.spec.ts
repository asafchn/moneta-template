import { test, expect } from '@playwright/test';

test('graph, learning loop and extension are usable without live services', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Lasting memory');
  const canvas = page.locator('canvas');
  const box = (await canvas.boundingBox())!;
  await canvas.click({ position: { x: 25 + .78 * (box.width - 50), y: 28 + .22 * (box.height - 70) } });
  await expect(page.locator('.node-inspector h3')).toHaveText('Call the client correctly');
  const guards = page.getByRole('group', { name: 'Select a graph node' }).getByRole('button', { name: 'Guard rails' });
  await guards.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('.node-inspector h3')).toHaveText('Keep credentials private');
  await expect(guards).toHaveAttribute('aria-pressed', 'true');
  for (const name of ['Distill', 'Evaluate', 'Review', 'Retrieve']) {
    await page.getByRole('tab', { name: new RegExp(name) }).click();
    await expect(page.getByRole('tabpanel')).toBeVisible();
  }
  await expect(page.getByRole('tabpanel')).toContainText('Index → query → find → walk → read');
  await page.getByLabel('A concept your team wants to remember').fill('Architecture decisions');
  await page.getByRole('button', { name: 'Define the shape' }).click();
  await expect(page.locator('.extension-preview')).toContainText('architecture-decisions');
  await page.getByRole('button', { name: 'Name the connection' }).click();
  await expect(page.locator('.edge-preview')).toContainText('informed by');
  await page.screenshot({ path: 'test-results/desktop.png', fullPage: true });
  expect(errors).toEqual([]);
});

test('installation host, route and copy match the selected instructions', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/#install');
  await expect(page.getByTestId('install-command')).toContainText('codex plugin add moneta-setup@moneta-setup');
  await page.getByRole('tab', { name: 'Claude Code', exact: true }).click();
  await expect(page.getByTestId('install-command')).toContainText('claude plugin install');
  await expect(page.locator('.invoke-note')).toContainText('/moneta-setup:init');
  await page.getByRole('button', { name: 'Via skills.sh' }).click();
  await expect(page.getByTestId('install-command')).toContainText('--agent claude-code');
  await page.getByRole('button', { name: 'Copy command' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('--agent claude-code');
  await page.getByRole('tab', { name: 'Codex', exact: true }).click();
  await expect(page.locator('.invoke-note')).toContainText('$moneta-setup');
});

test('small screens retain all sections without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const id of ['how-it-works', 'node-types', 'extend', 'install']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.getByRole('group', { name: 'Select a graph node' }).getByRole('button', { name: 'Domain knowledge' }).click();
  await expect(page.locator('.node-inspector h3')).toHaveText('What a workspace means');
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
});
