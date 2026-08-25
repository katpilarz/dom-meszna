import { test, expect } from '@playwright/test';
import { settle } from './helpers';

/**
 * The Stats counters animate from 0. If GSAP never builds — which is exactly
 * what happens under prefers-reduced-motion — the headline facts of the whole
 * page must still be the real numbers, not 0.
 */
test.describe('Stats counters', () => {
  for (const mode of ['no-preference', 'reduce'] as const) {
    test(`values under prefers-reduced-motion: ${mode}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: mode === 'reduce' ? 'reduce' : 'no-preference' });
      await page.goto('/');
      await settle(page);

      const section = page.locator('#dom');
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(3000);

      const values = await page.evaluate(() => {
        const sec = document.querySelector('#dom');
        if (!sec) return null;
        return Array.from(sec.querySelectorAll('*'))
          .filter((e) => e.children.length === 0 && /\d/.test(e.textContent || ''))
          .map((e) => (e.textContent || '').trim())
          .slice(0, 20);
      });
      test.info().annotations.push({ type: `stats-${mode}`, description: JSON.stringify(values, null, 2) });
      await page.screenshot({ path: `tests/screenshots/2026-08-25/stats-${mode}.png` });

      const zeros = (values || []).filter((v) => /^0([,.]0+)?\s*(m²)?$/.test(v));
      expect.soft(zeros, `no stat stuck at zero under ${mode}`).toEqual([]);
    });
  }

  test('values in the initial server-rendered HTML', async ({ request }) => {
    const html = await (await request.get('/')).text();
    const m = html.match(/>[\d\s,.]+(m²)?</g)?.slice(0, 30);
    test.info().annotations.push({ type: 'ssr-numbers', description: JSON.stringify(m, null, 2) });
  });
});
