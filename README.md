# Dom w Mesznej — Marketing Website

Editorial marketing site for a 402 m² property in Meszna, Beskid Śląski, Poland.
**Direct sale from owner** — no agency, no broker fees.

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · GSAP · next-themes
**Hosting:** Netlify (z Netlify Forms)

---

## Szybki start lokalnie

```bash
npm install
npm run dev
# otwórz http://localhost:3000
```

---

## Deploy na Netlify — krok po kroku

### 1. Push do GitHuba

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:TWOJA_NAZWA/dom-w-mesznej.git
git push -u origin main
```

### 2. Connect repo na Netlify

1. Wejdź na [app.netlify.com](https://app.netlify.com)
2. Kliknij **"Add new site" → "Import an existing project"**
3. Wybierz **GitHub** → autoryzuj → wybierz repo `dom-w-mesznej`
4. Netlify **automatycznie wykryje Next.js** i ustawi:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Plugin: `@netlify/plugin-nextjs` (auto-instalowany)
5. Kliknij **"Deploy site"**
6. Pierwszy deploy zajmuje ~2–3 minuty

Po deployu strona będzie dostępna pod adresem typu `https://random-name-123.netlify.app`.
Możesz zmienić nazwę w **Site settings → Change site name** albo podpiąć własną domenę.

### 3. Konfiguracja Netlify Forms (auto-detekcja)

Formularz w `components/Contact.tsx` jest skonfigurowany z `data-netlify="true"` i wysyła dane przez `fetch()` do `/`. Aby Netlify wykrył formularz przy buildzie, w `public/__forms.html` znajduje się ukryty statyczny HTML z definicją pól.

> **Uwaga:** `@netlify/plugin-nextjs` od wersji 5 wymaga osobnego pliku `__forms.html` (poprzednio wystarczał ukryty formularz w `layout.tsx`). Patrz: https://ntl.fyi/next-runtime-forms-migration

**Po pierwszym deployu:**

1. Wejdź **Site → Forms** w panelu Netlify
2. Powinieneś zobaczyć formularz `kontakt`
3. Wyślij testowo zapytanie ze strony, by potwierdzić że spływa
4. **Site → Forms → Form notifications → Add notification → Email notification**
5. Ustaw adres: `dommeszna@proton.me`
6. Pole *"Event to listen for"*: `New form submission`
7. Zapisz

Od teraz każde zapytanie z formularza będzie wysyłane na Twoją skrzynkę Protonową.

**Limity (free plan):**
- 100 zgłoszeń / miesiąc
- 10 MB total payload / miesiąc
- Spam filter w cenie (honeypot `bot-field` już skonfigurowany w formularzu)

### 4. Własna domena

1. **Site settings → Domain management → Add custom domain**
2. Wpisz `dom-w-mesznej.pl` (albo cokolwiek kupisz)
3. Netlify pokaże instrukcje DNS — najczęściej:
   - dodajesz `CNAME` z `www` → `random-name-123.netlify.app`
   - dodajesz `A` z `@` → `75.2.60.5` (IP Netlify load balancer)
4. SSL/HTTPS jest **automatyczny** (Let's Encrypt) — Netlify konfiguruje certyfikat w 1–24h po podpięciu DNS

---

## Struktura projektu

```
villa-meszna/
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
- **Adres:** ul. Energetyków 53A, Meszna, gmina Wilkowice
- **Kontakt:** dommeszna@proton.me

---

## Edycja contentu — gdzie co zmienić

| Co | Plik | Linia |
|---|---|---|
| Cena | `components/Pricing.tsx` | szukaj `1 899 000` |
| E-mail kontaktowy | `components/Contact.tsx`, `components/Footer.tsx`, `app/polityka-prywatnosci/page.tsx` | szukaj `dommeszna@proton.me` |
| Zdjęcia w galerii zewn. | `components/Gallery.tsx` | tablica `photos` na górze |
| Zdjęcia we wnętrzach | `components/Interior.tsx` | tablica `interiors` na górze |
| Banner Beskidów | `components/Location.tsx` | szukaj `beskidy.jpg` |
| Polityka prywatności | `app/polityka-prywatnosci/page.tsx` | dane administratora |
| Tytuł strony / SEO | `app/layout.tsx` | `metadata` |

---

## Komendy

```bash
npm run dev          # Server deweloperski
npm run build        # Production build
npm start            # Uruchom production build lokalnie
npm run lint         # Lint kodu
```

---

## Standalone preview (do podglądu bez instalacji)

`preview-standalone.html` — wszystkie zdjęcia jako base64 (5,5 MB). Otwórz w przeglądarce.
**To tylko podgląd projektowy** — nie zawiera Netlify Forms, więc formularz nie zadziała. Działający formularz dostaniesz dopiero po deployu na Netlify.
