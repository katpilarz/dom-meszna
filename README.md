# Dom w Mesznej — Marketing Website

Editorial marketing site for a 402 m² property in Meszna, Beskid Śląski, Poland.
**Direct sale from owner** — no agency, no broker fees.

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · GSAP · next-themes
**Hosting:** Netlify (z Netlify Forms)

---

## Struktura projektu

```
dom-meszna/
├── app/
│   ├── layout.tsx                       # Root layout + ukryty form do Netlify detection
│   ├── page.tsx                         # Strona główna
│   ├── globals.css
│   └── polityka-prywatnosci/
│       └── page.tsx                     # Polityka RODO
├── components/
│   ├── Header.tsx                       # Logo + theme toggle + CTA
│   ├── Hero.tsx                         # Full-bleed mountain panorama
│   ├── Marquee.tsx
│   ├── Stats.tsx                        # 6 animowanych liczników
│   ├── Statement.tsx
│   ├── Showcase.tsx                     # Reusable full-screen photo
│   ├── Gallery.tsx                      # Galeria zewnętrzna (6 zdjęć)
│   ├── Interior.tsx                     # Galeria wnętrz (16 zdjęć)
│   ├── Potential.tsx
│   ├── Floorplan.tsx
│   ├── Location.tsx                     # Banner Beskidów + SVG mapa
│   ├── Plans.tsx                        # 6 planów w jednolitej wysokości
│   ├── Pricing.tsx                      # 1 899 000 zł
│   ├── Contact.tsx                      # Netlify Forms + RODO klauzula
│   ├── Footer.tsx
│   ├── SmoothScroll.tsx
│   └── ThemeProvider.tsx
├── public/
│   └── images/
│       ├── house/                       # 8 zdjęć zewnętrznych
│       ├── interior/                    # 45 zdjęć wnętrz (galeria używa 16)
│       ├── plans/                       # 6 planów architektonicznych
│       └── landscape/beskidy.jpg
├── netlify.toml                         # Konfiguracja Netlify (build + headers)
├── next.config.js
├── package.json
└── tailwind.config.js
```

---

## Property data

- **Cena:** 1 899 000 zł (4 720 zł/m²) · bez pośredników
- **Powierzchnia:** 402,35 m² (170,75 m² użytkowej) · działka 1 600 m²
- **Pokoje:** 7 · kondygnacje: 3 · rok: 2018 · Architekt: Studio Atrium
- **Adres:** Meszna, gmina Wilkowice
- **Kontakt:** dommeszna@proton.me

---


## Komendy

```bash
npm run dev          # Server deweloperski
npm run build        # Production build
npm start            # Uruchom production build lokalnie
npm run lint         # Lint kodu
```

---
