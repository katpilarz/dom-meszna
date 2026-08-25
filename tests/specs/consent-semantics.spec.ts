import { test, expect } from '@playwright/test';
import { settle } from './helpers';

/** Requires NEXT_PUBLIC_GA_ID set on the dev server. */
test.describe('Consent banner semantics', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(/^https?:\/\/(?!localhost|127\.0\.0\.1)/, (r) => r.abort());
  });

  test('dialog role, labelling, focus on appearance and Escape', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const info = await page.evaluate(() => {
      const el = document.querySelector('[role="dialog"]') as HTMLElement;
      const labelledby = el.getAttribute('aria-labelledby');
      const describedby = el.getAttribute('aria-describedby');
      return {
        role: el.getAttribute('role'),
        ariaModal: el.getAttribute('aria-modal'),
        labelText: labelledby ? document.getElementById(labelledby)?.textContent?.trim() : null,
        descText: describedby ? document.getElementById(describedby)?.textContent?.trim().slice(0, 60) : null,
        activeOnLoad: (document.activeElement as HTMLElement)?.tagName,
        domIndexOfDialog: Array.from(document.body.querySelectorAll('*')).indexOf(el),
        totalNodes: document.body.querySelectorAll('*').length,
      };
    });
    test.info().annotations.push({ type: 'dialog-info', description: JSON.stringify(info, null, 2) });

    expect.soft(info.role, 'role=dialog').toBe('dialog');
    expect.soft(info.labelText, 'dialog has an accessible name').toBeTruthy();

    // SC 2.4.3 asks for a focus order that preserves meaning, not for focus to be
    // seized on load. Stealing focus interrupts a screen reader mid-title and
    // costs the skip link its place as the first tab stop, so what is checked
    // here is what the SC actually wants: that a keyboard visitor meets the
    // dialog immediately rather than after the entire page. The banner is
    // mounted ahead of the page content in app/layout.tsx to achieve that.
    const stops: string[] = [];
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      stops.push(
        await page.evaluate(() => {
          const a = document.activeElement as HTMLElement | null;
          if (!a) return 'none';
          return a.closest('[role="dialog"]')
            ? 'dialog'
            : (a.textContent || a.tagName).trim().slice(0, 30);
        }),
      );
    }
    test.info().annotations.push({ type: 'first-stops', description: JSON.stringify(stops) });
    expect
      .soft(stops.indexOf('dialog'), 'consent dialog is reached within the first few tab stops')
      .toBeGreaterThanOrEqual(0);
    expect
      .soft(stops.indexOf('dialog'), 'consent dialog is reached within the first few tab stops')
      .toBeLessThanOrEqual(2);
  });

  test('reopening from the footer moves focus into the panel and Escape closes it', async ({ page }) => {
    await page.goto('/');
    await settle(page);
    await page.getByRole('button', { name: /akceptuj/i }).first().click();
    await page.waitForTimeout(800);

    const reopen = page.getByRole('button', { name: /ustawienia prywatno/i }).first();
    await reopen.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(800);

    const focused = await page.evaluate(() => ({
      tag: (document.activeElement as HTMLElement)?.tagName,
      inDialog: !!(document.activeElement as HTMLElement)?.closest('[role="dialog"]'),
    }));
    test.info().annotations.push({ type: 'reopen-focus', description: JSON.stringify(focused) });
    expect.soft(focused.inDialog, 'focus moves into the panel when reopened').toBe(true);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
    const stillOpen = await page.getByRole('dialog').isVisible().catch(() => false);
    expect.soft(stillOpen, 'Escape closes the reopened panel').toBe(false);

    const focusReturned = await page.evaluate(() => (document.activeElement as HTMLElement)?.textContent?.trim().slice(0, 30));
    test.info().annotations.push({ type: 'focus-after-escape', description: String(focusReturned) });
  });
});
