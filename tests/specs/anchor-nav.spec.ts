import { test, expect } from '@playwright/test';
import { ROUTES, settle, settleScroll } from './helpers';

/**
 * "Umów oglądanie" is the site's only call to action and the only route to the
 * contact form, so where it actually lands matters more than whether the anchor
 * resolves (which quality.spec.ts already covers).
 *
 * The failure this guards against was invisible to a link-resolution check:
 * arriving at /#kontakt from another route, the browser's scroll to the anchor
 * and ScrollTrigger's scroll restore raced, the restore won several hundred
 * pixels short, and the visitor was left stranded mid-page with no contact form
 * in sight.
 */
test.describe('Call-to-action anchor', () => {
  for (const route of ROUTES) {
    test(`"Umów oglądanie" from ${route.name} lands on the contact section`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(route.path);
      await settle(page);

      await page.getByRole('link', { name: /Umów oglądanie/i }).first().click();
      await page.waitForTimeout(1500); // cross-route mount + ScrollTrigger refresh
      await settleScroll(page);

      const landed = await page.evaluate(() => {
        const el = document.getElementById('kontakt');
        if (!el) return null;
        const pad =
          parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        return {
          path: location.pathname,
          hash: location.hash,
          top: Math.round(el.getBoundingClientRect().top),
          expected: Math.round(pad),
          heading: !!document.getElementById('kontakt-title'),
        };
      });

      test.info().annotations.push({
        type: `cta-from-${route.name}`,
        description: JSON.stringify(landed),
      });

      expect(landed).not.toBeNull();
      expect.soft(landed!.path, 'navigates to the home route').toBe('/');
      expect.soft(landed!.hash, 'keeps the anchor in the URL').toBe('#kontakt');
      expect.soft(landed!.heading, 'the contact heading exists').toBe(true);

      // The fixed header is 6rem deep, so scroll-padding-top is what the section
      // should be sitting at — not 0, and certainly not thousands of pixels away.
      expect
        .soft(
          Math.abs(landed!.top - landed!.expected),
          'contact section is parked just below the fixed header',
        )
        .toBeLessThanOrEqual(8);
    });
  }
});
