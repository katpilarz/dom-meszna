import { test, expect } from '@playwright/test';
import { settle } from './helpers';

test.describe('Motion & animation', () => {
  test('reduced motion: all content is fully visible without scrolling animations (2.3.3, 1.4.3)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await settle(page);

    const faded = await page.$$eval('*', (els) =>
      els
        .filter((e) => {
          const cs = getComputedStyle(e);
          const o = parseFloat(cs.opacity);
          return o < 0.9 && o > 0 && (e.textContent || '').trim().length > 0 && e.children.length === 0;
        })
        .slice(0, 25)
        .map((e) => ({ tag: e.tagName, cls: e.className.toString().slice(0, 50), opacity: getComputedStyle(e).opacity, text: (e.textContent || '').trim().slice(0, 40) })),
    );
    test.info().annotations.push({ type: 'reduced-motion-faded', description: JSON.stringify(faded, null, 2) });

    const stmt = await page.$$eval('.stmt-word', (els) => els.map((e) => getComputedStyle(e).opacity));
    test.info().annotations.push({ type: 'stmt-word-opacity-reduced', description: JSON.stringify([...new Set(stmt)]) });
    expect.soft([...new Set(stmt)], 'Statement words fully opaque under reduced motion').toEqual(['1']);

    // scroll-behavior must not stay smooth under reduce
    const sb = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
    test.info().annotations.push({ type: 'scroll-behavior-reduced', description: sb });
    expect.soft(sb, 'scroll-behavior is auto under prefers-reduced-motion').toBe('auto');

    // marquee must not animate under reduce
    const marquee = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('*')).filter((e) => {
        const cs = getComputedStyle(e);
        return cs.animationName !== 'none' && cs.animationIterationCount === 'infinite';
      });
      return els.map((e) => ({ cls: (e as HTMLElement).className.toString().slice(0, 60), name: getComputedStyle(e).animationName, dur: getComputedStyle(e).animationDuration }));
    });
    test.info().annotations.push({ type: 'infinite-animations-reduced', description: JSON.stringify(marquee, null, 2) });
    expect.soft(marquee, 'no infinite CSS animation under reduced motion (2.2.2)').toEqual([]);
  });

  test('normal motion: infinite animations have a pause mechanism (2.2.2)', async ({ page }) => {
    await page.goto('/');
    await settle(page);
    const infinite = await page.evaluate(() =>
      Array.from(document.querySelectorAll('*'))
        .filter((e) => {
          const cs = getComputedStyle(e);
          return cs.animationIterationCount === 'infinite' && cs.animationName !== 'none';
        })
        .map((e) => ({ cls: (e as HTMLElement).className.toString().slice(0, 60), name: getComputedStyle(e).animationName, dur: getComputedStyle(e).animationDuration })),
    );
    test.info().annotations.push({ type: 'infinite-animations', description: JSON.stringify(infinite, null, 2) });

    const pauseControl = await page.getByRole('button', { name: /pauz|zatrzym|stop|pause/i }).count();
    test.info().annotations.push({ type: 'pause-control-count', description: String(pauseControl) });
    if (infinite.some((a) => parseFloat(a.dur) > 5)) {
      expect.soft(pauseControl, 'a pause/stop control exists for animation running over 5s (2.2.2)').toBeGreaterThan(0);
    }
  });

  test('content survives with JavaScript disabled (preloader failsafe)', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/');
    await page.waitForTimeout(4000);
    const h1 = await page.locator('h1').first().isVisible().catch(() => false);
    const shot = 'tests/screenshots/2026-08-25/nojs-home.png';
    await page.screenshot({ path: shot, fullPage: false });
    test.info().annotations.push({ type: 'nojs', description: `h1 visible: ${h1}; screenshot: ${shot}` });
    expect.soft(h1, 'hero heading is visible without JavaScript').toBe(true);
    await ctx.close();
  });

  test('Statement words reach full opacity when scrolled through', async ({ page }) => {
    await page.goto('/');
    await settle(page);
    const before = await page.$$eval('.stmt-word', (e) => getComputedStyle(e[0]).opacity);
    await page.locator('.statement-text').scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(2500);
    const after = await page.$$eval('.stmt-word', (e) => e.map((x) => parseFloat(getComputedStyle(x).opacity)));
    test.info().annotations.push({ type: 'stmt-opacity', description: `before=${before} after min=${Math.min(...after)} max=${Math.max(...after)}` });
    expect.soft(Math.max(...after), 'statement words become fully readable').toBeGreaterThan(0.9);
  });
});
