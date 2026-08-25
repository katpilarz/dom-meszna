import { test } from "@playwright/test";
import { settle } from "./helpers";

/** Find elements that push the document wider, ignoring anything inside an overflow-hidden/auto ancestor. */
test.describe("Horizontal overflow root cause", () => {
  for (const w of [320, 375]) {
    test(`home @ ${w}px`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 800 });
      await page.goto("/");
      await settle(page);
      const culprits = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const clipped = (el: Element) => {
          let p: Element | null = el.parentElement;
          while (p && p !== document.documentElement) {
            const o = getComputedStyle(p);
            if (
              o.overflowX === "hidden" ||
              o.overflowX === "auto" ||
              o.overflowX === "scroll"
            )
              return true;
            p = p.parentElement;
          }
          return false;
        };
        const out: Record<string, unknown>[] = [];
        document.querySelectorAll("*").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0) return;
          if (r.right <= vw + 1) return;
          if (clipped(el)) return;
          out.push({
            tag: el.tagName,
            cls: (el as HTMLElement).className.toString().slice(0, 70),
            right: Math.round(r.right),
            width: Math.round(r.width),
            text: (el.textContent || "").trim().slice(0, 30),
          });
        });
        return {
          vw,
          docScrollW: document.documentElement.scrollWidth,
          culprits: out.slice(0, 12),
        };
      });
      test
        .info()
        .annotations.push({
          type: `culprits-${w}`,
          description: JSON.stringify(culprits, null, 2),
        });
    });
  }
});
