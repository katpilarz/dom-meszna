import { test, expect } from '@playwright/test';
import { settle } from './helpers';

test('header controls are not clipped at 320px (1.4.10)', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  await settle(page);
  const info = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const els = Array.from(document.querySelectorAll('header *')).map((e) => {
      const r = e.getBoundingClientRect();
      return { tag: e.tagName, cls: (e as HTMLElement).className.toString().slice(0, 50), left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width) };
    }).filter((x) => x.w > 0 && x.right > vw);
    return { vw, els };
  });
  test.info().annotations.push({ type: 'header-clip-320', description: JSON.stringify(info, null, 2) });
  await page.screenshot({ path: 'tests/screenshots/2026-08-25/header-320.png', clip: { x: 0, y: 0, width: 320, height: 110 } });
  expect.soft(info.els, 'no header control extends past the 320px viewport').toEqual([]);
});
