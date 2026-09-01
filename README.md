# Dom w Mesznej — Marketing Website

Editorial marketing site for a 402 m² property in Meszna, Beskid Śląski, Poland.
**Direct sale from owner** — no agency, no broker fees.

![Dom w Mesznej — hero section](docs/hero.jpg)

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript 5.9 · Tailwind CSS v4 · GSAP 3 · next-themes · lucide-react
**Fonts:** `next/font/google` — Cormorant Garamond (display), Inter Tight (sans), JetBrains Mono (mono)
**Hosting:** Netlify (`@netlify/plugin-nextjs`, Netlify Forms)

> Tailwind v4 is configured CSS-first — the theme lives in the `@theme` block in
> [app/globals.css](app/globals.css) and there is **no `tailwind.config.js`**.
> PostCSS loads it through `@tailwindcss/postcss` ([postcss.config.js](postcss.config.js)).
> ESLint uses the flat config in [eslint.config.mjs](eslint.config.mjs).

---

## Project structure

```
dom-meszna/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── icon.svg
│   ├── opengraph-image.tsx
│   ├── robots.ts
│   ├── sitemap.ts
│   └── polityka-prywatnosci/
│       └── page.tsx
├── data/
│   └── site.ts               # All site copy, figures, image lists, JSON-LD
├── hooks/
│   ├── useSectionAnim.ts     # Motion-gated GSAP scope + useIsomorphicEffect
│   └── useConsent.ts
├── utils/
│   ├── motion.ts             # MOTION media queries, revealBatch, ScrollTrigger
│   ├── introGate.ts          # Preloader → hero latch
│   ├── consentStore.ts       # useSyncExternalStore-backed consent record
│   └── analytics.ts          # GA id + CONSENT_REQUIRED
├── components/
│   ├── Header.tsx
│   ├── Preloader.tsx
│   ├── Hero.tsx
│   ├── Marquee.tsx
│   ├── Stats.tsx
│   ├── Statement.tsx
│   ├── Gallery.tsx
│   ├── Potential.tsx
│   ├── Floorplan.tsx
│   ├── Location.tsx
│   ├── Interior.tsx
│   ├── Plans.tsx
│   ├── Pricing.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   ├── SmoothScroll.tsx
│   ├── ThemeProvider.tsx
│   ├── Arrow.tsx
│   ├── StructuredData.tsx
│   └── consent/
│       ├── ConsentBanner.tsx
│       ├── ConsentLink.tsx
│       └── Analytics.tsx
├── tests/
│   ├── playwright.config.ts
│   ├── specs/                # Accessibility & quality suite (WCAG 2.2 AA)
│   └── test-2026-08-25.md    # Dated audit report
├── public/
│   ├── __forms.html
│   ├── google03d00cf0bb91c15c.html
│   └── images/
│       ├── house/
│       ├── interior/
│       ├── plans/
│       └── landscape/beskidy.jpg
├── docs/
│   └── hero.jpg
├── netlify.toml
├── next.config.js
├── postcss.config.js
├── eslint.config.mjs
├── .env.example
└── package.json
```

---

## Where content lives

Every user-facing string, figure, image path and list is in
[data/site.ts](data/site.ts). Components hold layout, motion and accessibility
plumbing only — to change copy or a photo caption, edit the data file and
nothing else. Figures quoted in more than one place (area, price, room count)
come from the `facts` object, so the hero, the stats grid, the JSON-LD and the
OG image cannot drift apart.

Headings that mix roman and italic are stored as parts (`lead` / `mid` /
`accent`), because the words belong to the data file and the markup belongs to
the component.

---

## Accessibility

The site targets **WCAG 2.2 Level AA**. The suite in [tests/](tests/) covers
both routes, both themes, five viewports, both `prefers-reduced-motion` states
and a no-JavaScript pass.

```bash
npx playwright test --config tests/playwright.config.ts
```

The consent banner only renders when `NEXT_PUBLIC_GA_ID` is set, so to exercise
those specs start the dev server as
`NEXT_PUBLIC_GA_ID=G-TEST1234567 npm run dev` first.

Two theme tokens carry accessibility intent worth knowing about before editing
[app/globals.css](app/globals.css):

- `--accent` must keep **4.5:1** against both `--bg` and `--bg-alt`. It is also
  the focus-ring colour, which 1.4.11 holds to 3:1.
- `--accent-on-dark` is for type set over the darkened hero and gallery
  photographs. That surface is dark in both themes, so it does **not** flip with
  the theme.

---

## Property data

- **Price:** 1 899 000 zł (4 720 zł/m²) · no agent commission
- **Area:** 402.35 m² total (170.75 m² living space) · 1 600 m² plot
- **Rooms:** 7 · floors: 3 · built: 2018 · architect: Studio Atrium
- **Address:** Meszna, Wilkowice municipality
- **Contact:** dommeszna@proton.me

---

## Contact form

The form is handled by **Netlify Forms**, which needs the form schema to exist as
static HTML — hence [public/\_\_forms.html](public/__forms.html) (required by
`@netlify/plugin-nextjs` v5+). The user-facing form in
[components/Contact.tsx](components/Contact.tsx) `POST`s to `/__forms.html` via
`fetch`. Changing the form fields means updating **both** files.

---

## Commands

```bash
npm install
npm run dev          # Development server
npm run build        # Production build
npm start            # Run the production build locally
npm run lint         # ESLint (flat config)
npx tsc --noEmit     # Type check

npx playwright test --config tests/playwright.config.ts   # Accessibility suite
```
