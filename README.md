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
├── components/
│   ├── Header.tsx
│   ├── Preloader.tsx
│   ├── introGate.ts
│   ├── Hero.tsx
│   ├── Marquee.tsx
│   ├── Stats.tsx
│   ├── Statement.tsx
│   ├── Gallery.tsx
│   ├── Potential.tsx
│   ├── Showcase.tsx
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
│   ├── useSectionAnim.ts
│   ├── " StructuredData.tsx"
│   └── consent/
│       ├── ConsentBanner.tsx
│       ├── ConsentLink.tsx
│       ├── Analytics.tsx
│       ├── consentStore.ts
│       └── useConsent.ts
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

## Property data

- **Price:** 1 899 000 zł (4 720 zł/m²) · no agent commission
- **Area:** 402.35 m² total (170.75 m² living space) · 1 600 m² plot
- **Rooms:** 7 · floors: 3 · built: 2018 · architect: Studio Atrium
- **Address:** Meszna, Wilkowice municipality
- **Contact:** dommeszna@proton.me

---

## Analytics and consent

Analytics is **off by default**. Without `NEXT_PUBLIC_GA_ID` the site makes no
third-party requests at all and the consent banner stays hidden — there is
nothing to consent to.

```bash
cp .env.example .env.local
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  → enables the banner and, once accepted, GA4
```

The Google script is loaded only after active consent ([components/consent/Analytics.tsx](components/consent/Analytics.tsx)).

---

## Contact form

The form is handled by **Netlify Forms**, which needs the form schema to exist as
static HTML — hence [public/__forms.html](public/__forms.html) (required by
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
```
