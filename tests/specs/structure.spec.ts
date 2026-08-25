import { test, expect } from '@playwright/test';
import { ROUTES, settle } from './helpers';

test.describe('Structure & semantics', () => {
  for (const route of ROUTES) {
    test(`${route.name} — landmarks, headings, lang`, async ({ page }) => {
      await page.goto(route.path);
      await settle(page);

      // 3.1.1 Language of Page
      await expect(page.locator('html')).toHaveAttribute('lang', 'pl');

      // 1.3.1 / 2.4.6 — exactly one h1, no skipped levels
      const h1s = await page.locator('h1').allTextContents();
      expect.soft(h1s.length, 'exactly one <h1>').toBe(1);

      const levels = await page.$$eval('h1,h2,h3,h4,h5,h6', (els) =>
        els.map((e) => ({ level: +e.tagName[1], text: (e.textContent || '').trim().slice(0, 60) })),
      );
      const skips = levels.filter((h, i) => i > 0 && h.level - levels[i - 1].level > 1);
      expect.soft(skips, 'no skipped heading levels').toEqual([]);

      // 1.3.1 — landmarks
      expect.soft(await page.locator('main').count(), '<main> landmark').toBe(1);
      expect.soft(await page.locator('header').count(), '<header> landmark').toBeGreaterThan(0);
      expect.soft(await page.locator('footer').count(), '<footer> landmark').toBeGreaterThan(0);
      expect.soft(await page.locator('nav').count(), '<nav> landmark').toBeGreaterThan(0);

      // 2.4.1 — skip link must be the first tab stop
      await page.keyboard.press('Tab');
      const first = await page.evaluate(() => {
        const a = document.activeElement as HTMLElement | null;
        return a ? { tag: a.tagName, text: (a.textContent || '').trim().slice(0, 40), href: a.getAttribute('href') } : null;
      });
      expect.soft(JSON.stringify(first), 'first tab stop is a skip link').toMatch(/#(main|tresc|content)|przejdź|skip/i);

      // 1.3.1 — sections should carry accessible names
      const unnamed = await page.$$eval('section', (els) =>
        els
          .filter((e) => !e.getAttribute('aria-label') && !e.getAttribute('aria-labelledby') && e.getAttribute('aria-hidden') !== 'true')
          .map((e) => e.id || e.className.slice(0, 50)),
      );
      expect.soft(unnamed, 'every <section> has an accessible name').toEqual([]);
    });

    test(`${route.name} — images have alt text`, async ({ page }) => {
      await page.goto(route.path);
      await settle(page);
      const imgs = await page.$$eval('img', (els) =>
        els.map((e) => ({ src: (e.getAttribute('src') || '').slice(-60), alt: e.getAttribute('alt') })),
      );
      const missing = imgs.filter((i) => i.alt === null);
      expect.soft(missing, 'no <img> without an alt attribute').toEqual([]);

      const filenameAlt = imgs.filter((i) => i.alt && /\.(jpe?g|png|webp|avif)$/i.test(i.alt));
      expect.soft(filenameAlt, 'no filename used as alt text').toEqual([]);

      const nonEmpty = imgs.filter((i) => i.alt).map((i) => i.alt as string);
      const dupes = nonEmpty.filter((a, i) => nonEmpty.indexOf(a) !== i);
      expect.soft([...new Set(dupes)], 'no duplicated alt text across images').toEqual([]);
    });
  }

  test('home — contact form labels & autocomplete (1.3.5, 3.3.2)', async ({ page }) => {
    await page.goto('/');
    await settle(page);
    const fields = await page.$$eval('input, textarea, select', (els) =>
      els.map((e) => {
        const el = e as HTMLInputElement;
        const id = el.id;
        const labelled =
          (id && !!document.querySelector(`label[for="${CSS.escape(id)}"]`)) ||
          !!el.getAttribute('aria-label') ||
          !!el.getAttribute('aria-labelledby') ||
          !!el.closest('label');
        return {
          name: el.name || el.id || el.type,
          type: el.type,
          labelled,
          autocomplete: el.getAttribute('autocomplete'),
          required: el.hasAttribute('required'),
          ariaRequired: el.getAttribute('aria-required'),
          placeholderOnly: !labelled && !!el.getAttribute('placeholder'),
        };
      }),
    );
    test.info().annotations.push({ type: 'fields', description: JSON.stringify(fields, null, 2) });

    expect.soft(fields.filter((f) => !f.labelled && f.type !== 'hidden'), 'every field has a programmatic label').toEqual([]);
    // Hidden inputs are excluded for the same reason they are on the line above:
    // 1.3.5 is about fields the visitor fills in. Netlify's required
    // `form-name` control matched purely on the substring "name".
    const wantsAutocomplete = fields.filter(
      (f) =>
        f.type !== 'hidden' &&
        /name|email|tel|phone|imie|nazwisko|telefon/i.test(f.name) &&
        !f.autocomplete,
    );
    expect.soft(wantsAutocomplete, 'identity fields declare autocomplete (1.3.5)').toEqual([]);
  });
});
