# Dom w Mesznej — Marketing Website

Editorial marketing site for a 402 m² property in Meszna, Beskid Śląski, Poland.
**Direct sale from owner** — no agency, no broker fees.

![Dom w Mesznej — sekcja hero](public/images/house/house-01.jpg)

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript 5.9 · Tailwind CSS v4 · GSAP 3 · next-themes · lucide-react
**Fonts:** `next/font/google` — Cormorant Garamond (display), Inter Tight (sans), JetBrains Mono (mono)
**Hosting:** Netlify (`@netlify/plugin-nextjs`, Netlify Forms)

> Tailwind v4 is configured CSS-first — the theme lives in the `@theme` block in
> [app/globals.css](app/globals.css) and there is **no `tailwind.config.js`**.
> PostCSS loads it through `@tailwindcss/postcss` ([postcss.config.js](postcss.config.js)).
> ESLint uses the flat config in [eslint.config.mjs](eslint.config.mjs).

---

## Struktura projektu

```
dom-meszna/
├── app/
│   ├── layout.tsx                       # Root layout, next/font, metadata + OG/Twitter
│   ├── page.tsx                         # Strona główna (kolejność sekcji)
│   ├── globals.css                      # Tailwind v4 @theme (kolory, fonty, tracking)
│   ├── icon.svg                         # Favicon
│   ├── opengraph-image.tsx              # Dynamiczny obraz OG (generowany w runtime)
│   ├── robots.ts                        # robots.txt
│   ├── sitemap.ts                       # sitemap.xml
│   └── polityka-prywatnosci/
│       └── page.tsx                     # Polityka RODO
├── components/
│   ├── Header.tsx                       # Logo + theme toggle + CTA
│   ├── Preloader.tsx                    # Intro animacja (bramkowana przez introGate)
│   ├── introGate.ts                     # Stan intro — reszta sekcji czeka na koniec
│   ├── Hero.tsx                         # Full-bleed panorama (house-01.jpg)
│   ├── Marquee.tsx
│   ├── Stats.tsx                        # Animowane liczniki
│   ├── Statement.tsx
│   ├── Gallery.tsx                      # Galeria zewnętrzna (6 zdjęć)
│   ├── Potential.tsx
│   ├── Showcase.tsx                     # Reusable full-screen photo
│   ├── Floorplan.tsx
│   ├── Location.tsx                     # Banner Beskidów + SVG mapa
│   ├── Interior.tsx                     # Galeria wnętrz (15 zdjęć)
│   ├── Plans.tsx                        # 6 planów w jednolitej wysokości
│   ├── Pricing.tsx                      # 1 899 000 zł (cena w HTML, licznik od kotwicy)
│   ├── Contact.tsx                      # Netlify Forms (POST → /__forms.html) + RODO
│   ├── Footer.tsx
│   ├── SmoothScroll.tsx
│   ├── ThemeProvider.tsx                # next-themes (klasa .dark)
│   ├── Arrow.tsx
│   ├── useSectionAnim.ts                # Wspólny hook GSAP dla sekcji
│   ├── " StructuredData.tsx"            # JSON-LD (uwaga: spacja w nazwie pliku)
│   └── consent/
│       ├── ConsentBanner.tsx            # Baner cookies (tylko gdy jest GA_ID)
│       ├── ConsentLink.tsx              # Ponowne otwarcie ustawień zgody
│       ├── Analytics.tsx                # GA4 ładowane dopiero po zgodzie
│       ├── consentStore.ts
│       └── useConsent.ts
├── public/
│   ├── __forms.html                     # Schemat formularza do detekcji Netlify Forms
│   ├── google03d00cf0bb91c15c.html      # Weryfikacja Google Search Console
│   └── images/
│       ├── house/                       # 11 zdjęć zewnętrznych (galeria używa 6)
│       ├── interior/                    # 33 zdjęcia wnętrz (galeria używa 15)
│       ├── plans/                       # 6 planów architektonicznych
│       └── landscape/beskidy.jpg
├── netlify.toml                         # Build + cache headers + security headers
├── next.config.js                       # strict mode, formaty AVIF/WebP
├── postcss.config.js
├── eslint.config.mjs
├── .env.example
└── package.json
```

---

## Property data

- **Cena:** 1 899 000 zł (4 720 zł/m²) · bez pośredników
- **Powierzchnia:** 402,35 m² (170,75 m² użytkowej) · działka 1 600 m²
- **Pokoje:** 7 · kondygnacje: 3 · rok: 2018 · Architekt: Studio Atrium
- **Adres:** Meszna, gmina Wilkowice
- **Kontakt:** dommeszna@proton.me

---

## Analytics i zgody

Analityka jest **domyślnie wyłączona**. Bez `NEXT_PUBLIC_GA_ID` strona nie wysyła
żadnych żądań do zewnętrznych serwisów, a baner zgody się nie pokazuje — nie ma
na co wyrażać zgody.

```bash
cp .env.example .env.local
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  → włącza baner i (po zgodzie) GA4
```

Skrypt Google ładuje się dopiero po aktywnej zgodzie ([components/consent/Analytics.tsx](components/consent/Analytics.tsx)).

---

## Formularz kontaktowy

Formularz obsługuje **Netlify Forms**. Schemat formularza musi istnieć jako statyczny
HTML — dlatego [public/__forms.html](public/__forms.html) (wymagane przez
`@netlify/plugin-nextjs` v5+). Formularz użytkownika w
[components/Contact.tsx](components/Contact.tsx) wysyła `POST` na `/__forms.html`
przez `fetch`. Zmiana pól formularza wymaga aktualizacji **obu** plików.

---

## Komendy

```bash
npm install
npm run dev          # Server deweloperski
npm run build        # Production build
npm start            # Uruchom production build lokalnie
npm run lint         # ESLint (flat config)
```
