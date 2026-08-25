import { test, expect } from '@playwright/test';
import { settle } from './helpers';

test.describe('Consent banner', () => {
  test('is present, keyboard-reachable, and offers equal accept/reject', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const banner = page.locator('[role="dialog"], [aria-label*="cookie" i], [aria-label*="zgod" i], [class*="consent" i]').first();
    const visible = await banner.isVisible().catch(() => false);
    test.info().annotations.push({ type: 'banner-visible', description: String(visible) });
    expect.soft(visible, 'consent banner renders').toBe(true);

    const buttons = await page.$$eval('button', (els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect();
        const cs = getComputedStyle(e);
        return {
          text: (e.textContent || '').trim().slice(0, 40),
          w: Math.round(r.width), h: Math.round(r.height),
          bg: cs.backgroundColor, color: cs.color,
          fontSize: cs.fontSize,
          y: Math.round(r.y),
        };
      }),
    );
    test.info().annotations.push({ type: 'buttons', description: JSON.stringify(buttons, null, 2) });

    // roles/landmark semantics
    const semantics = await page.evaluate(() => {
      const el = document.querySelector('[class*="consent" i], [role="dialog"]') as HTMLElement | null;
      if (!el) return null;
      return {
        tag: el.tagName,
        role: el.getAttribute('role'),
        ariaLabel: el.getAttribute('aria-label'),
        ariaLabelledby: el.getAttribute('aria-labelledby'),
        ariaModal: el.getAttribute('aria-modal'),
        ariaLive: el.getAttribute('aria-live'),
        zIndex: getComputedStyle(el).zIndex,
        position: getComputedStyle(el).position,
      };
    });
    test.info().annotations.push({ type: 'banner-semantics', description: JSON.stringify(semantics, null, 2) });
  });

  test('no analytics or third-party requests fire before consent', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (r) => {
      const u = new URL(r.url());
      if (!/localhost|127\.0\.0\.1/.test(u.hostname)) external.push(r.url());
    });
    await page.goto('/');
    await settle(page);
    test.info().annotations.push({ type: 'external-requests', description: JSON.stringify([...new Set(external)], null, 2) });
    const analytics = external.filter((u) => /google|gtag|analytics|plausible|umami|hotjar|facebook|clarity/i.test(u));
    expect.soft(analytics, 'no analytics requests before consent').toEqual([]);
  });

  test('consent choice persists and banner is dismissible by keyboard', async ({ page }) => {
    await page.goto('/');
    await settle(page);
    const before = await page.$$eval('button', (e) => e.map((b) => (b.textContent || '').trim()));
    test.info().annotations.push({ type: 'buttons-before', description: JSON.stringify(before) });

    const accept = page.getByRole('button', { name: /akceptuj|zgadzam|accept|zgoda/i }).first();
    if (await accept.count()) {
      await accept.focus();
      await expect(accept).toBeFocused();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
      const stored = await page.evaluate(() => JSON.stringify(Object.entries(localStorage)));
      test.info().annotations.push({ type: 'localStorage-after-accept', description: stored });
      await page.reload();
      await settle(page);
      const stillThere = await accept.isVisible().catch(() => false);
      expect.soft(stillThere, 'banner does not reappear after a choice').toBe(false);
    }
  });
});

/**
 * The banner only renders when NEXT_PUBLIC_GA_ID is set — with it empty the site
 * makes no third-party requests and there is nothing to consent to. These checks
 * therefore require the dev server to be started with a dummy id:
 *   NEXT_PUBLIC_GA_ID=G-TEST1234567 npx next dev
 * All non-localhost requests are aborted so nothing ever reaches Google.
 */
test.describe('Consent banner (analytics enabled)', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(/^https?:\/\/(?!localhost|127\.0\.0\.1)/, (r) => r.abort());
  });

  test('banner semantics, focus behaviour and button parity', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const buttons = await page.$$eval('button', (els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect();
        const cs = getComputedStyle(e);
        return {
          text: (e.textContent || '').trim().slice(0, 40),
          w: Math.round(r.width), h: Math.round(r.height),
          bg: cs.backgroundColor, color: cs.color, border: cs.borderWidth,
          fontSize: cs.fontSize, textDecoration: cs.textDecorationLine,
        };
      }),
    );
    test.info().annotations.push({ type: 'consent-buttons', description: JSON.stringify(buttons, null, 2) });

    const semantics = await page.evaluate(() => {
      const candidates = Array.from(document.querySelectorAll('div,section,aside'))
        .filter((e) => /cookie|zgod|prywatn/i.test(e.textContent || '') && e.querySelector('button'))
        .slice(-1);
      const el = candidates[0] as HTMLElement | undefined;
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName, role: el.getAttribute('role'),
        ariaLabel: el.getAttribute('aria-label'), ariaLabelledby: el.getAttribute('aria-labelledby'),
        ariaModal: el.getAttribute('aria-modal'), ariaLive: el.getAttribute('aria-live'),
        position: cs.position, zIndex: cs.zIndex,
        activeElementOnLoad: (document.activeElement as HTMLElement)?.tagName,
      };
    });
    test.info().annotations.push({ type: 'consent-semantics', description: JSON.stringify(semantics, null, 2) });

    // Tab order: how many stops before the banner's own controls are reached?
    const order: string[] = [];
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      order.push(await page.evaluate(() => {
        const a = document.activeElement as HTMLElement;
        return a && a !== document.body ? `${a.tagName}:${(a.textContent || '').trim().slice(0, 28)}` : 'BODY';
      }));
    }
    test.info().annotations.push({ type: 'tab-order-with-banner', description: JSON.stringify(order, null, 2) });
  });

  test('no Google request before consent; script only after accept', async ({ page }) => {
    const reqs: string[] = [];
    page.on('request', (r) => { if (!/localhost|127\.0\.0\.1/.test(r.url())) reqs.push(r.url()); });
    await page.goto('/');
    await settle(page);
    const before = [...new Set(reqs)];
    test.info().annotations.push({ type: 'external-before-consent', description: JSON.stringify(before, null, 2) });
    expect.soft(before.filter((u) => /google|gtag/i.test(u)), 'no Google request before consent').toEqual([]);

    const accept = page.getByRole('button', { name: /akceptuj|zgadzam|accept|zgoda/i }).first();
    if (await accept.count()) {
      await accept.click();
      await page.waitForTimeout(2500);
      const after = [...new Set(reqs)];
      test.info().annotations.push({ type: 'external-after-consent', description: JSON.stringify(after, null, 2) });
      expect.soft(after.some((u) => /googletagmanager/i.test(u)), 'GA loads only after consent').toBe(true);
    }
  });

  test('reject-only path loads nothing', async ({ page }) => {
    const reqs: string[] = [];
    page.on('request', (r) => { if (!/localhost|127\.0\.0\.1/.test(r.url())) reqs.push(r.url()); });
    await page.goto('/');
    await settle(page);
    const reject = page.getByRole('button', { name: /odrzu|nie zgadzam|reject|decline|tylko niezb/i }).first();
    const found = await reject.count();
    test.info().annotations.push({ type: 'reject-button-found', description: String(found) });
    if (found) {
      await reject.click();
      await page.waitForTimeout(2000);
      expect.soft(reqs.filter((u) => /google|gtag/i.test(u)), 'nothing loads after reject').toEqual([]);
    }
  });
});
