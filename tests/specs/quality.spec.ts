import { test, expect } from '@playwright/test';
import { ROUTES, settle } from './helpers';

test.describe('Non-accessibility web quality', () => {
  for (const route of ROUTES) {
    test(`${route.name} — no console errors or failed requests`, async ({ page }) => {
      const errors: string[] = [];
      const warnings: string[] = [];
      const failed: string[] = [];
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(m.text().slice(0, 200));
        if (m.type() === 'warning') warnings.push(m.text().slice(0, 200));
      });
      page.on('requestfailed', (r) => failed.push(`${r.url()} — ${r.failure()?.errorText}`));
      page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });

      await page.goto(route.path);
      await settle(page);

      test.info().annotations.push({ type: 'console-errors', description: JSON.stringify([...new Set(errors)], null, 2) });
      test.info().annotations.push({ type: 'console-warnings', description: JSON.stringify([...new Set(warnings)], null, 2) });
      test.info().annotations.push({ type: 'failed-requests', description: JSON.stringify([...new Set(failed)], null, 2) });

      const hydration = errors.filter((e) => /hydrat|did not match|Text content does not match/i.test(e));
      expect.soft(hydration, 'no hydration mismatch').toEqual([]);
      expect.soft([...new Set(errors)], 'no console errors').toEqual([]);
      expect.soft([...new Set(failed)], 'no failed requests').toEqual([]);
    });
  }

  test('internal links and in-page anchors all resolve', async ({ page, request }) => {
    await page.goto('/');
    await settle(page);
    const hrefs = await page.$$eval('a[href]', (els) => els.map((e) => e.getAttribute('href') as string));
    const anchors = [...new Set(hrefs.filter((h) => h.includes('#')))];
    const internal = [...new Set(hrefs.filter((h) => h.startsWith('/') && !h.includes('#')))];

    const brokenAnchors: string[] = [];
    for (const a of anchors) {
      const id = a.split('#')[1];
      if (!id) continue;
      const found = await page.evaluate((i) => !!document.getElementById(i), id);
      if (!found) brokenAnchors.push(a);
    }
    expect.soft(brokenAnchors, 'every in-page anchor has a target').toEqual([]);

    const broken: string[] = [];
    for (const href of internal) {
      const res = await request.get(href);
      if (res.status() >= 400) broken.push(`${res.status()} ${href}`);
    }
    expect.soft(broken, 'no broken internal links').toEqual([]);
    test.info().annotations.push({ type: 'links', description: JSON.stringify({ anchors, internal }, null, 2) });
  });

  test('sitemap.xml, robots.txt and structured data are valid', async ({ page, request }) => {
    const sitemap = await request.get('/sitemap.xml');
    expect.soft(sitemap.status(), 'sitemap.xml responds 200').toBe(200);
    const sx = await sitemap.text();
    expect.soft(sx, 'sitemap is XML with urls').toContain('<urlset');

    const robots = await request.get('/robots.txt');
    expect.soft(robots.status(), 'robots.txt responds 200').toBe(200);
    const rt = await robots.text();
    test.info().annotations.push({ type: 'robots', description: rt.slice(0, 400) });
    test.info().annotations.push({ type: 'sitemap', description: sx.slice(0, 600) });

    await page.goto('/');
    await settle(page);
    const ld = await page.$$eval('script[type="application/ld+json"]', (els) => els.map((e) => e.textContent || ''));
    expect.soft(ld.length, 'JSON-LD structured data present').toBeGreaterThan(0);
    for (const block of ld) {
      expect.soft(() => JSON.parse(block), 'JSON-LD parses').not.toThrow();
    }
    test.info().annotations.push({ type: 'jsonld-types', description: JSON.stringify(ld.map((b) => { try { const j = JSON.parse(b); return j['@type']; } catch { return 'PARSE ERROR'; } })) });
  });

  test('og:image renders', async ({ request }) => {
    const res = await request.get('/opengraph-image');
    expect.soft(res.status(), 'opengraph-image responds 200').toBe(200);
    expect.soft(res.headers()['content-type'], 'og image is an image').toContain('image');
  });
});
