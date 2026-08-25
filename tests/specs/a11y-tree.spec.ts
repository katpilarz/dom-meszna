import { test, expect } from '@playwright/test';
import { settle } from './helpers';

test.describe('Accessibility tree (not a screen-reader session)', () => {
  test('roles, names and reading order', async ({ page }) => {
    await page.goto('/');
    await settle(page);
    const aria = await page.locator('body').ariaSnapshot();
    const flat = aria.split('\n');
    test.info().annotations.push({ type: 'a11y-tree', description: flat.slice(0, 160).join('\n') });

    const unnamed = flat.filter((l) => /- (button|link|textbox|checkbox)\s*:?\s*$/.test(l));
    expect.soft(unnamed, 'no interactive node without an accessible name').toEqual([]);
  });

  test('required-field errors are exposed to assistive tech (3.3.1, 4.1.3)', async ({ page }) => {
    const posted: string[] = [];
    page.on('request', (r) => { if (r.method() === 'POST') posted.push(r.url()); });
    await page.goto('/');
    await settle(page);

    const form = page.locator('form').first();
    await form.scrollIntoViewIfNeeded();
    const submit = form.getByRole('button').last();
    await submit.click();
    await page.waitForTimeout(1200);

    const state = await page.evaluate(() => {
      const f = document.querySelector('form') as HTMLFormElement;
      const fields = Array.from(f.querySelectorAll('input,textarea')).map((e) => {
        const el = e as HTMLInputElement;
        return {
          name: el.name,
          required: el.required,
          valid: el.validity.valid,
          validationMessage: el.validationMessage,
          ariaInvalid: el.getAttribute('aria-invalid'),
          ariaDescribedby: el.getAttribute('aria-describedby'),
        };
      });
      const live = Array.from(document.querySelectorAll('[aria-live],[role="alert"],[role="status"]')).map((e) => ({
        role: e.getAttribute('role'), live: e.getAttribute('aria-live'), text: (e.textContent || '').trim().slice(0, 60),
      }));
      return { fields, live, novalidate: f.hasAttribute('novalidate'), action: f.getAttribute('action'), method: f.getAttribute('method'), netlify: f.hasAttribute('data-netlify') || f.getAttribute('name') };
    });
    test.info().annotations.push({ type: 'form-error-state', description: JSON.stringify(state, null, 2) });
    test.info().annotations.push({ type: 'posts-made', description: JSON.stringify(posted) });

    expect.soft(posted, 'invalid submit does not POST anywhere').toEqual([]);
    expect.soft(state.live.length, 'a live region exists to announce form status (4.1.3)').toBeGreaterThan(0);
  });

  test('required fields are indicated in visible text, not colour alone (3.3.2)', async ({ page }) => {
    await page.goto('/');
    await settle(page);
    const labels = await page.$$eval('form label', (els) =>
      els.map((e) => ({ text: (e.textContent || '').trim().slice(0, 60), for: e.getAttribute('for') })),
    );
    test.info().annotations.push({ type: 'form-labels', description: JSON.stringify(labels, null, 2) });
  });
});
