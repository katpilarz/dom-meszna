import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';
import { ROUTES, THEMES, VIEWPORTS, seedTheme, settle } from './helpers';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const OUT = path.join(__dirname, '..', '.artifacts', 'axe');

test.describe('axe-core — WCAG 2.2 AA', () => {
  for (const route of ROUTES) {
    for (const theme of THEMES) {
      for (const vp of [VIEWPORTS[0], VIEWPORTS[1], VIEWPORTS[3]]) {
        test(`${route.name} · ${theme} · ${vp.name}`, async ({ page }, testInfo) => {
          await page.setViewportSize({ width: vp.width, height: vp.height });
          await seedTheme(page, theme);
          await page.goto(route.path);
          await settle(page);

          const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();

          fs.mkdirSync(OUT, { recursive: true });
          const key = `${route.name}-${theme}-${vp.name}-${testInfo.project.name}`;
          fs.writeFileSync(
            path.join(OUT, `${key}.json`),
            JSON.stringify(
              {
                key,
                url: route.path,
                theme,
                viewport: vp.name,
                browser: testInfo.project.name,
                violations: results.violations.map((v) => ({
                  id: v.id,
                  impact: v.impact,
                  tags: v.tags.filter((t) => t.startsWith('wcag') || t === 'best-practice'),
                  help: v.help,
                  helpUrl: v.helpUrl,
                  nodes: v.nodes.slice(0, 60).map((n) => ({
                    target: n.target,
                    html: n.html.slice(0, 300),
                    failureSummary: n.failureSummary,
                  })),
                  totalNodes: v.nodes.length,
                })),
                passCount: results.passes.length,
                incompleteIds: results.incomplete.map((i) => i.id),
              },
              null,
              2,
            ),
          );

          const serious = results.violations.filter(
            (v) => v.impact === 'critical' || v.impact === 'serious',
          );
          expect
            .soft(serious, `serious/critical axe violations on ${key}`)
            .toEqual([]);
        });
      }
    }
  }
});
