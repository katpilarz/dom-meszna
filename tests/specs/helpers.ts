import { Page } from '@playwright/test';

export const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/polityka-prywatnosci', name: 'privacy' },
];

export const VIEWPORTS = [
  { name: '320x568', width: 320, height: 568 },
  { name: '375x812', width: 375, height: 812 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '1280x800', width: 1280, height: 800 },
  { name: '1920x1080', width: 1920, height: 1080 },
];

export const THEMES = ['light', 'dark'] as const;

/** Force a next-themes theme before the app boots, and skip the intro gate. */
export async function seedTheme(page: Page, theme: 'light' | 'dark') {
  await page.addInitScript((t) => {
    try {
      localStorage.setItem('theme', t);
    } catch {}
  }, theme);
  await page.emulateMedia({ colorScheme: theme });
}

/** Wait for the Preloader to finish and the page to settle. */
export async function settle(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(4000); // preloader + GSAP intro
}

/**
 * Wait for a focus-driven scroll to finish.
 *
 * `html { scroll-behavior: smooth }` makes the scroll that follows a Tab press
 * asynchronous, and this page is ~24 000 px tall, so one Tab into the contact
 * form can be in flight for well over a second. Sampling geometry on a fixed
 * timeout catches the focused element mid-flight and reports it as obscured by
 * whatever it happens to be passing at that instant. Poll until the offset has
 * held still for three consecutive frames' worth of samples instead.
 */
export async function settleScroll(page: Page, maxMs = 4000) {
  const start = Date.now();
  let last = Number.NaN;
  let stable = 0;
  while (Date.now() - start < maxMs) {
    const y = await page.evaluate(() => window.scrollY);
    if (y === last) {
      if (++stable >= 3) return;
    } else {
      stable = 0;
      last = y;
    }
    await page.waitForTimeout(80);
  }
}

export async function dismissConsent(page: Page) {
  const accept = page.getByRole('button', { name: /akceptuj|zgadzam|accept/i }).first();
  if (await accept.isVisible().catch(() => false)) await accept.click();
}
