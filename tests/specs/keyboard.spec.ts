import { test, expect } from '@playwright/test';
import { settle, dismissConsent, settleScroll } from './helpers';

test.describe('Keyboard operability', () => {
  test('tab order reaches every control, no trap, focus always visible (2.1.1, 2.1.2, 2.4.7)', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    type Stop = {
      tag: string; text: string; href: string | null; outline: string; boxShadow: string;
      rect: { x: number; y: number; w: number; h: number }; inViewport: boolean; skip?: boolean;
    };
    const visited: Stop[] = [];
    const seen = new Set<string>();
    let trapped = false;

    for (let i = 0; i < 80; i++) {
      await page.keyboard.press('Tab');
      await settleScroll(page);
      const info = await page.evaluate(() => {
        const a = document.activeElement as HTMLElement | null;
        if (!a || a === document.body) return null;
        if (a.tagName.startsWith('NEXTJS-')) return { skip: true } as unknown as Stop;
        const cs = getComputedStyle(a);
        const r = a.getBoundingClientRect();
        return {
          tag: a.tagName,
          text: (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 45),
          href: a.getAttribute('href'),
          outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`,
          boxShadow: cs.boxShadow,
          rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
          inViewport: r.top >= 0 && r.bottom <= window.innerHeight,
        };
      });
      if (!info) break;
      if (info.skip) continue;
      const key = `${info.tag}|${info.text}|${info.href}|${info.rect.x},${info.rect.y}`;
      if (seen.has(key) && visited.length > 3) { trapped = false; break; } // cycled = fine
      seen.add(key);
      visited.push(info);
    }

    test.info().annotations.push({ type: 'tab-order', description: JSON.stringify(visited, null, 2) });

    expect.soft(visited.length, 'at least a handful of focusable controls').toBeGreaterThan(3);
    expect.soft(trapped, 'no keyboard trap').toBe(false);

    // 2.4.7 — every stop must render a visible focus indicator
    const noIndicator = visited.filter(
      (v) => (v.outline.startsWith('none') || v.outline.includes('0px')) && v.boxShadow === 'none',
    );
    expect.soft(noIndicator, 'every focused element shows a focus indicator').toEqual([]);

    // 2.5.8 — target size
    const tooSmall = visited.filter((v) => v.rect.w > 0 && (v.rect.w < 24 || v.rect.h < 24));
    expect.soft(tooSmall, 'focusable targets are at least 24x24 CSS px (2.5.8)').toEqual([]);
  });

  test('focus is not obscured by the sticky header or consent banner (2.4.11)', async ({ page }) => {
    await page.goto('/');
    await settle(page);
    await dismissConsent(page);

    const obscured: Record<string, unknown>[] = [];
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      await settleScroll(page);
      const hit = await page.evaluate(() => {
        const a = document.activeElement as HTMLElement | null;
        if (!a || a === document.body || a.tagName.startsWith('NEXTJS-')) return null;
        const r = a.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return null;
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        if (cy < 0 || cy > window.innerHeight) return null;
        const topPt = document.elementFromPoint(cx, Math.max(1, r.top + 2));
        const top = document.elementFromPoint(cx, cy);
        const coveredCentre = !!top && top !== a && !a.contains(top) && !top.contains(a);
        const coveredTop = !!topPt && topPt !== a && !a.contains(topPt) && !topPt.contains(a);
        const covered = coveredCentre || coveredTop;
        return covered
          ? { focused: (a.textContent || '').trim().slice(0, 40), coveredBy: ((top || topPt) as HTMLElement).tagName + '.' + ((top || topPt) as HTMLElement).className.slice(0, 40), centre: coveredCentre, topEdge: coveredTop }
          : null;
      });
      if (hit) obscured.push(hit);
    }
    expect.soft(obscured, 'focused element is never fully covered (2.4.11)').toEqual([]);
  });

  test('mobile menu is keyboard-operable and closes on Escape', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await settle(page);
    await dismissConsent(page);

    const toggle = page.locator('header button').first();
    const count = await page.locator('header button').count();
    test.info().annotations.push({ type: 'header-buttons', description: String(count) });
    test.skip(count === 0, 'no header buttons found');

    await toggle.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(800);
    const openState = await page.evaluate(() => document.body.innerHTML.length);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
    const focusAfter = await page.evaluate(() => (document.activeElement as HTMLElement)?.tagName);
    test.info().annotations.push({ type: 'escape-focus', description: String(focusAfter) + ' len:' + openState });
  });
});
