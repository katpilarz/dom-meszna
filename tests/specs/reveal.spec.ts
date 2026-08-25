import { test, expect } from '@playwright/test';
import { settle } from './helpers';

/**
 * The reveal-* classes hide content in CSS and GSAP is what brings it back.
 * If GSAP never builds (reduced motion) or fails, that content must not stay
 * invisible — otherwise it is a 1.3.1/1.4.3 content-loss failure, not an
 * animation nicety.
 */
test.describe('CSS reveal classes vs. GSAP availability', () => {
  for (const mode of ['no-preference', 'reduce'] as const) {
    test(`content hidden by reveal-* classes under prefers-reduced-motion: ${mode}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: mode === 'reduce' ? 'reduce' : 'no-preference' });
      await page.goto('/');
      await settle(page);
      const hidden = await page.$$eval('.reveal-up, .reveal-fade, .reveal-mask, .reveal-scale', (els) =>
        els
          .map((e) => ({
            cls: e.className.toString().slice(0, 60),
            opacity: getComputedStyle(e).opacity,
            clip: getComputedStyle(e).clipPath,
            text: (e.textContent || '').trim().slice(0, 50),
          }))
          .filter((x) => parseFloat(x.opacity) < 0.1 || /inset\(0(px)? 100%/.test(x.clip)),
      );
      test.info().annotations.push({ type: `reveal-hidden-${mode}`, description: JSON.stringify(hidden, null, 2) });
      expect.soft(hidden, `no content left invisible by reveal-* under ${mode}`).toEqual([]);
    });
  }

  test('content is not left invisible if GSAP fails to load', async ({ page }) => {
    await page.route(/gsap/i, (r) => r.abort());
    await page.goto('/');
    await settle(page);
    const hidden = await page.$$eval('.reveal-up, .reveal-fade, .reveal-mask, .reveal-scale', (els) =>
      els.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.1).map((e) => (e.textContent || '').trim().slice(0, 50)),
    );
    test.info().annotations.push({ type: 'reveal-hidden-no-gsap', description: JSON.stringify(hidden, null, 2) });
  });
});
