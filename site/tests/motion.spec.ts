import { test, expect } from '@playwright/test';

test('main nodes stay fixed while background nodes float and motion can be paused', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    const state = window as unknown as { mainPoints: number[][]; backgroundPoint: number[] };
    const clear = CanvasRenderingContext2D.prototype.clearRect;
    const arc = CanvasRenderingContext2D.prototype.arc;
    let firstArc = true;
    CanvasRenderingContext2D.prototype.clearRect = function (...args: Parameters<typeof clear>) {
      state.mainPoints = []; firstArc = true;
      return clear.apply(this, args);
    };
    CanvasRenderingContext2D.prototype.arc = function (...args: Parameters<typeof arc>) {
      if (firstArc) { state.backgroundPoint = [args[0], args[1]]; firstArc = false; }
      if (args[2] === 21 || args[2] === 12) state.mainPoints.push([args[0], args[1], args[2]]);
      return arc.apply(this, args);
    };
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const frame = () => page.evaluate(() => {
    const state = window as unknown as { mainPoints: number[][]; backgroundPoint: number[] };
    return { main: state.mainPoints, background: state.backgroundPoint };
  });
  const initial = await frame();
  expect(initial.main).toHaveLength(8);
  await expect.poll(async () => {
    const current = await frame();
    return Math.hypot(current.background[0] - initial.background[0], current.background[1] - initial.background[1]);
  }, { timeout: 3500 }).toBeGreaterThan(2);
  expect((await frame()).main).toEqual(initial.main);
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
