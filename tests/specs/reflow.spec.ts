import { test, expect } from '@playwright/test';
import { ROUTES, VIEWPORTS, settle } from './helpers';

test.describe('Reflow, zoom & text spacing', () => {
  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      test(`${route.name} · ${vp.name} — no horizontal scroll (1.4.10)`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(route.path);
        await settle(page);
        const m = await page.evaluate(() => ({
          scrollW: document.documentElement.scrollWidth,
          clientW: document.documentElement.clientWidth,
          bodyScrollW: document.body.scrollWidth,
        }));
        test.info().annotations.push({ type: 'widths', description: JSON.stringify(m) });
        expect.soft(m.scrollW, `${route.name} @ ${vp.name}: no horizontal overflow`).toBeLessThanOrEqual(m.clientW + 1);

        const overflowing = await page.$$eval('*', (els) =>
          els
            .filter((e) => {
              const r = e.getBoundingClientRect();
              return r.width > 0 && r.right > document.documentElement.clientWidth + 2;
            })
            .slice(0, 10)
            .map((e) => ({ tag: e.tagName, cls: e.className.toString().slice(0, 60), right: Math.round(e.getBoundingClientRect().right) })),
        );
        test.info().annotations.push({ type: `overflow-${route.name}-${vp.name}`, description: JSON.stringify(overflowing, null, 2) });
      });
    }

    test(`${route.name} — text spacing override causes no clipping (1.4.12)`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(route.path);
      await settle(page);
      await page.addStyleTag({
        content: `* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
                  p { margin-bottom: 2em !important; }`,
      });
      await page.waitForTimeout(1200);
      const m = await page.evaluate(() => ({
        scrollW: document.documentElement.scrollWidth,
        clientW: document.documentElement.clientWidth,
      }));
      test.info().annotations.push({ type: 'text-spacing-widths', description: JSON.stringify(m) });
      expect.soft(m.scrollW, `${route.name}: no overflow with text-spacing override`).toBeLessThanOrEqual(m.clientW + 1);
      await page.screenshot({ path: `tests/screenshots/2026-08-25/text-spacing-${route.name}.png`, fullPage: false });
    });

    test(`${route.name} — 400% zoom equivalent, 320px reflow (1.4.4)`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 512 });
      await page.goto(route.path);
      await settle(page);
      await page.screenshot({ path: `tests/screenshots/2026-08-25/reflow-320-${route.name}.png`, fullPage: false });
      const clipped = await page.evaluate(() => {
        const out: Record<string, unknown>[] = [];
        document.querySelectorAll('h1,h2,h3,p,li,button,a').forEach((e) => {
          const el = e as HTMLElement;
          if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible') {
            out.push({ tag: el.tagName, text: (el.textContent || '').trim().slice(0, 40) });
          }
        });
        return out.slice(0, 10);
      });
      test.info().annotations.push({ type: 'clipped-at-320', description: JSON.stringify(clipped, null, 2) });
      expect.soft(clipped, 'no clipped text at 320px').toEqual([]);
    });
  }
});
