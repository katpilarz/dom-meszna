import { defineConfig, devices } from '@playwright/test';

/**
 * Accessibility & website test config for dom-meszna.
 * Run: npx playwright test --config tests/playwright.config.ts
 *
 * Note: webkit requires system libraries that are not installed on this host
 * (`sudo npx playwright install-deps`). It is declared but skipped by default;
 * enable with WEBKIT=1.
 */
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './specs',
  outputDir: './.artifacts',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 2,
  reporter: [['list'], ['json', { outputFile: './.artifacts/results.json' }]],
  use: {
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    ...(process.env.WEBKIT ? [{ name: 'webkit', use: { ...devices['Desktop Safari'] } }] : []),
  ],
  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
    cwd: '..',
  },
});
