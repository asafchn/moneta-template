import { test, expect } from '@playwright/test';

test('graph nodes visibly move and motion can be paused', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    const arc = CanvasRenderingContext2D.prototype.arc;
    CanvasRenderingContext2D.prototype.arc = function (...args: Parameters<typeof arc>) {
      if (args[2] === 21) (window as unknown as { activePoint: number[] }).activePoint = [args[0], args[1]];
      return arc.apply(this, args);
    };
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const point = () => page.evaluate(() => (window as unknown as { activePoint: number[] }).activePoint);
  const initial = await point();
  await expect.poll(async () => { const current = await point(); return Math.hypot(current[0] - initial[0], current[1] - initial[1]); }, { timeout: 3500 }).toBeGreaterThan(2);
  await page.getByRole('button', { name: 'Pause motion', exact: true }).click();
  const canvas = page.locator('canvas');
  const paused = await canvas.evaluate(c => (c as HTMLCanvasElement).toDataURL());
  await page.waitForTimeout(200);
  expect(await canvas.evaluate(c => (c as HTMLCanvasElement).toDataURL())).toBe(paused);
});

test('reduced motion defaults to still, with an explicit play control', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const canvas = page.locator('canvas');
  const initial = await canvas.evaluate(c => (c as HTMLCanvasElement).toDataURL());
  await page.waitForTimeout(200);
  expect(await canvas.evaluate(c => (c as HTMLCanvasElement).toDataURL())).toBe(initial);
  await page.getByRole('button', { name: 'Play motion', exact: true }).click();
  await expect.poll(() => canvas.evaluate(c => (c as HTMLCanvasElement).toDataURL())).not.toBe(initial);
  await expect(page.getByRole('button', { name: 'Pause motion', exact: true })).toBeVisible();
});
