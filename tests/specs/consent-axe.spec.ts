import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';
import { THEMES, seedTheme, settle } from './helpers';

/** Requires: NEXT_PUBLIC_GA_ID=G-TEST1234567 npx next dev */
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

test.describe('axe — with consent banner visible', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(/^https?:\/\/(?!localhost|127\.0\.0\.1)/, (r) => r.abort());
  });

  for (const theme of THEMES) {
    test(`home · ${theme} · banner`, async ({ page }) => {
      await seedTheme(page, theme);
      await page.goto('/');
      await settle(page);
      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      const dir = path.join(__dirname, '..', '.artifacts', 'axe-consent');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(
        path.join(dir, `${theme}.json`),
        JSON.stringify(results.violations.map((v) => ({
          id: v.id, impact: v.impact, help: v.help, tags: v.tags.filter((t) => t.startsWith('wcag')),
          nodes: v.nodes.map((n) => ({ target: n.target, html: n.html.slice(0, 200), why: n.failureSummary })),
        })), null, 2),
      );
      expect.soft(results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious').map((v) => v.id), `serious axe violations (${theme})`).toEqual([]);
    });
  }

  test('banner controls are keyboard reachable', async ({ page }) => {
    await page.goto('/');
    await settle(page);
    const order: string[] = [];
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(150);
      const s = await page.evaluate(() => {
        const a = document.activeElement as HTMLElement;
        if (!a || a === document.body) return 'BODY';
        return `${a.tagName}:${(a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 30)}`;
      });
      order.push(s);
      if (/Akceptuj|Odrzu/i.test(s)) break;
    }
    test.info().annotations.push({ type: 'tab-to-banner', description: JSON.stringify(order, null, 2) });
    const idx = order.findIndex((s) => /Akceptuj|Odrzu/i.test(s));
    expect.soft(idx, 'consent controls reachable by Tab').toBeGreaterThan(-1);
    expect.soft(idx, 'consent controls reached within a few tab presses').toBeLessThan(4);
  });
});
