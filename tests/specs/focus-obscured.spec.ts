import { test, expect } from '@playwright/test';
import { settle, settleScroll } from './helpers';

/** Requires NEXT_PUBLIC_GA_ID set, so the consent banner is on screen. */
test('focused controls are not hidden behind the consent banner (2.4.11)', async ({ page }) => {
  await page.route(/^https?:\/\/(?!localhost|127\.0\.0\.1)/, (r) => r.abort());
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await settle(page);
  // deliberately do NOT dismiss the banner

  const obscured: Record<string, unknown>[] = [];
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press('Tab');
    await settleScroll(page);
    const hit = await page.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      if (!a || a === document.body || a.tagName.startsWith('NEXTJS-')) return null;
      if (a.closest('[role="dialog"]')) return null; // the banner's own controls
      const r = a.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return null;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      if (cy < 0 || cy > window.innerHeight) return null;
      const top = document.elementFromPoint(cx, cy) as HTMLElement | null;
      if (!top || top === a || a.contains(top) || top.contains(a)) return null;
      return {
        focused: `${a.tagName}:${(a.getAttribute('name') || a.textContent || '').trim().slice(0, 30)}`,
        coveredBy: `${top.tagName}.${top.className.toString().slice(0, 40)}`,
        insideDialog: !!top.closest('[role="dialog"]'),
      };
    });
    if (hit) obscured.push(hit);
  }
  test.info().annotations.push({ type: 'obscured-by-banner', description: JSON.stringify(obscured, null, 2) });
  await page.screenshot({ path: 'tests/screenshots/2026-08-25/focus-behind-banner.png' });
  expect.soft(obscured.filter((o) => o.insideDialog), 'no focused control is hidden behind the consent banner').toEqual([]);
});
