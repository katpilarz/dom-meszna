import { test } from '@playwright/test';
import { seedTheme, settle } from './helpers';

const DIR = 'tests/screenshots/2026-08-25';

test.describe('Evidence screenshots', () => {
  for (const theme of ['light', 'dark'] as const) {
    test(`home hero · ${theme}`, async ({ page }) => {
      await seedTheme(page, theme);
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      await settle(page);
      await page.screenshot({ path: `${DIR}/home-hero-${theme}.png` });
      await page.locator('#kontakt').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `${DIR}/contact-${theme}.png` });
    });
  }

  test('consent banner', async ({ page }) => {
    await page.route(/^https?:\/\/(?!localhost|127\.0\.0\.1)/, (r) => r.abort());
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await settle(page);
    await page.screenshot({ path: `${DIR}/consent-banner.png` });
  });

  test('focus indicator on light theme', async ({ page }) => {
    await seedTheme(page, 'light');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await settle(page);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${DIR}/focus-indicator-light.png`, clip: { x: 0, y: 0, width: 1280, height: 120 } });
  });
});
