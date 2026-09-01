/**
 * Single source of truth for everything the visitor reads.
 *
 * Components in this project are layout and motion only — every string, figure,
 * image path and list lives here. That keeps copy edits (which happen often on a
 * listing page) out of files that carry GSAP timelines and accessibility
 * plumbing, and it means the same figure cannot drift between the hero, the
 * stats grid, the JSON-LD and the OG image.
 *
 * Headings that mix roman and italic are stored as parts rather than as a single
 * string: the words belong here, the markup belongs in the component.
 */

/* ── Identity ─────────────────────────────────────────────────────────────── */

export const site = {
  name: 'Dom w Mesznej',
  tagline: 'Bez pośredników',
  url: 'https://dom-meszna.pl',
  locale: 'pl_PL',
  lang: 'pl',
  email: 'dommeszna@proton.me',
  author: 'PAISAK4U',
  architect: 'Studio Atrium, Bielsko-Biała',
  address: {
    street: 'ul. Energetyków',
    locality: 'Meszna',
    region: 'śląskie',
    postalCode: '43-365',
    country: 'PL',
    /** Rendered under the street line in the contact block. */
    detail: '43-365 Wilkowice · powiat bielski · województwo śląskie',
  },
  geo: { latitude: 49.7393, longitude: 19.0473, label: '49°48′N · 19°02′E' },
} as const;

/** Every figure quoted on the site. Nothing re-types these numbers by hand. */
export const facts = {
  totalArea: 402.35,
  usableArea: 170.75,
  plotArea: 1600,
  plotAreaWithRoad: 1800,
  rooms: 7,
  bathrooms: 2,
  floors: 3,
  yearBuilt: 2018,
  price: 1899000,
  /** What agencies previously listed it for — the anchor the counter starts from. */
  priceAnchor: 2250000,
  pricePerSqm: 4720,
  currency: 'PLN',
} as const;

/* ── Metadata ─────────────────────────────────────────────────────────────── */

export const meta = {
  titleDefault: 'Dom w Mesznej — sprzedaż bez pośredników',
  titleTemplate: '%s — Dom w Mesznej',
  description:
    'Dom 402 m² w Mesznej u stóp Beskidu Śląskiego. 170,75 m² powierzchni użytkowej, działka 1 600 m², 7 pokoi, trzy kondygnacje. Oddany do użytku w 2018 r. Projekt Studio Atrium. Sprzedaż bez pośredników.',
  keywords: [
    'dom na sprzedaż',
    'Meszna',
    'Wilkowice',
    'Beskid Śląski',
    'Bielsko-Biała',
    'Szczyrk',
    'nieruchomość Beskidy',
    'dom bez pośredników',
    'sprzedaż bezpośrednia',
  ],
  openGraph: {
    title: 'Dom w Mesznej — sprzedaż bez pośredników',
    description:
      'Dom 402 m² u stóp Beskidu Śląskiego. Trzy kondygnacje, działka 1 600 m², projekt Studio Atrium 2018. Sprzedaż bez pośredników, bez prowizji.',
  },
  twitter: {
    title: 'Dom w Mesznej — sprzedaż bez pośredników',
    description: 'Dom 402 m² u stóp Beskidu Śląskiego. Bez pośredników, bez prowizji.',
  },
} as const;

/** Copy baked into the generated OG image. */
export const ogImage = {
  alt: 'Dom w Mesznej — sprzedaż bez pośredników',
  headlineLeft: 'Dom z',
  headlineItalicAccent: 'widokiem',
  headlineRightPrefix: 'na',
  headlineItalicEnd: 'Beskidy.',
  location: 'MESZNA · BESKID ŚLĄSKI',
  facts: '402 m² · 1 600 m² działki · 1 899 000 zł',
  url: 'dom-meszna.pl',
} as const;

/* ── Chrome ───────────────────────────────────────────────────────────────── */

export const header = {
  logoLabel: 'Dom w Mesznej — strona główna',
  navLabel: 'Nawigacja główna',
  wordmark: 'Dom w Mesznej',
  wordmarkSub: 'Bez pośredników',
  cta: { label: 'Umów oglądanie', href: '/#kontakt' },
  themeToggleLabel: 'Przełącz motyw',
} as const;

export const footer = {
  mega: 'Dom Meszna · Beskidy',
  privacyLink: { label: 'Polityka prywatności · RODO', href: '/polityka-prywatnosci' },
  /** Split so the year can be wrapped in <time dateTime>. */
  copyright: { year: '2026', rest: 'Wszelkie prawa zastrzeżone' },
} as const;

export const skipLink = { label: 'Przejdź do treści', href: '#tresc' } as const;

export const preloader = {
  word: 'Dom w Mesznej',
  caption: 'Meszna · Beskid Śląski',
} as const;

/* ── 00 · Hero ────────────────────────────────────────────────────────────── */

export const hero = {
  /* Art direction, not just a resize. The landscape frame is 4:3, and a portrait
     phone crops it to a ~35 % vertical slice of gutter and roof — the house stops
     reading as a house. house-07 is shot portrait and holds the whole front
     elevation at phone aspect, so each viewport gets the frame it can actually
     show. The alt describes what both photographs have in common, because
     <picture> carries a single accessible name across its sources. */
  image: {
    src: '/images/house/house-01.jpg',
    width: 2400,
    height: 1800,
    alt: 'Dom w Mesznej — bryła domu z czerwonym dachem, balkonami na białych kolumnach i kamienną okładziną elewacji.',
  },
  imageMobile: {
    src: '/images/house/house-07.jpg',
    width: 1799,
    height: 2400,
  },
  labelPrimary: 'Oferta bezpośrednia',
  labelSecondary: 'Meszna · Wilkowice · Śląskie',
  /** Each entry is one masked line of the <h1>. */
  headline: [
    [{ text: 'Dom z widokiem' }],
    [{ text: 'na ' }, { text: 'Beskidy.', italic: true }],
  ] as ReadonlyArray<ReadonlyArray<{ text: string; italic?: boolean }>>,
  sub: '402 m² · 1 600 m² działki · trzy kondygnacje · widok na Beskid Śląski. 300 m do lasu, 600 m do szlaków na Klimczok.',
} as const;

/* ── Marquee ──────────────────────────────────────────────────────────────── */

export const marquee = {
  pauseLabel: 'Zatrzymaj przewijanie informacji',
  resumeLabel: 'Wznów przewijanie informacji',
  items: [
    'Beskid Śląski',
    '170 m² pow. użytkowej · 7 pokoi',
    '300 m do lasu',
    'Oddany do użytku 2018',
    'Działka 1 600 m²',
    'Bielsko-Biała 10 km',
    '600 m do szlaków na Klimczok',
    'Szczyrk 7 km',
    'Bez pośredników',
    '402 m² pow. całkowitej',
  ],
} as const;

/* ── 01 · Stats ───────────────────────────────────────────────────────────── */

export type Stat = { label: string; value: string; unit: string; note?: string };

export const stats = {
  eyebrow: '01 — Najważniejsze fakty',
  eyebrowAside: 'Projekt Studio Atrium · oddany do użytku 2018',
  items: [
    { label: 'Powierzchnia całkowita', value: '402,35', unit: 'm²' },
    { label: 'Powierzchnia użytkowa', value: '170,75', unit: 'm²' },
    {
      label: 'Działka',
      value: '1600',
      unit: 'm²',
      note: '1 800 m² z udziałem w drodze dojazdowej',
    },
    { label: 'Pokoje', value: '7', unit: '' },
    { label: 'Kondygnacje', value: '3', unit: '' },
    { label: 'Oddanie do użytku', value: '2018', unit: '' },
  ] satisfies Stat[],
} as const;

/* ── Statement ────────────────────────────────────────────────────────────── */

export const statement = {
  text: '402 m² powierzchni całkowitej. 170 m² powierzchni użytkowej. 1600 metrów działki. Trzy kondygnacje. Solidny dom z 2018 roku, w pełni mieszkalny, w dobrym stanie. Z perspektywą remontu, który pozwoli dostosować go pod siebie.',
} as const;

/* ── 02 · Gallery ─────────────────────────────────────────────────────────── */

export type Photo = { src: string; alt: string; label: string; tag: string; span: string; aspect: string };

export const gallery = {
  eyebrow: '02 — Galeria',
  eyebrowAside: 'Perspektywa',
  headline: { lead: 'Architektura', mid: 'wpisana w', accent: 'krajobraz.' },
  /* The section heading is set over this photograph rather than over an empty
     dark band, which is what the standalone full-bleed interlude used to be for.
     One frame, one heading — the interlude repeated both a screen later. */
  backdrop: {
    src: '/images/house/house-03.jpg',
    alt: 'Bryła domu od strony podjazdu — dwa balkony na białych kolumnach, kamienna okładzina cokołu i ceramiczna dachówka.',
  },
  /** Standfirst under the heading; formerly the interlude's own headline. */
  standfirst: { lead: 'Kolumny, kamień.', accent: 'Klasyka,', tail: 'która się broni.' },
  photos: [
    {
      src: '/images/house/house-04.jpg',
      alt: 'Trawiasta działka za kamiennym murem i ogrodzeniem, w tle drewniane domy i drzewa na zboczu.',
      label: 'Duża działka obok',
      tag: '01',
      span: 'col-span-12',
      aspect: '16/9',
    },
    {
      src: '/images/house/house-02.jpg',
      alt: 'Widok z góry na podjazd, skalniak z iglakami i sąsiednie zabudowania u podnóża zalesionego zbocza.',
      label: 'Panorama na ogród',
      tag: '02',
      span: 'col-span-12',
      aspect: '16/9',
    },
    {
      src: '/images/house/house-05.jpg',
      alt: 'Bryła domu z czerwonym dachem i balkonami, widziana zza metalowego ogrodzenia od strony podjazdu z kostki brukowej.',
      label: 'Panorama od strony drogi',
      tag: '03',
      span: 'col-span-12',
      aspect: '16/9',
    },
    {
      src: '/images/house/house-09.jpg',
      alt: 'Zielona dolina latem — brzozy, ogrody i droga dojazdowa, w tle pasmo gór za mgłą.',
      label: 'Zieleń dookoła',
      tag: '04',
      span: 'col-span-12 md:col-span-8',
      aspect: '4/3',
    },
    {
      src: '/images/house/house-10.jpg',
      alt: 'Drewniany taras z metalową balustradą oplecioną winoroślą, z widokiem na dolinę i odległe wzgórza.',
      label: 'Przestronny taras',
      tag: '05',
      span: 'col-span-12 md:col-span-4',
      aspect: '3/4',
    },
  ] satisfies Photo[],
} as const;

/* ── 03 · Potential ───────────────────────────────────────────────────────── */

export const potential = {
  eyebrow: '03 — Możliwości',
  eyebrowAside: 'Stan: dobry · do indywidualnego dostosowania',
  headline: { lead: 'Gotowy do życia.', mid: 'Otwarty na', accent: 'Twoje zmiany' },
  intro:
    'Dom umeblowany, w dobrym stanie technicznym — można wprowadzić się od razu. Wymaga remontu instalacji ogrzewania i odświeżenia wnętrz, co daje szeroką możliwość przemodelowania go pod własne potrzeby, bez konieczności budowania od zera.',
  opportunities: [
    {
      n: '01',
      title: 'Solidna baza',
      body: 'Dom oddany do użytku w 2018 — keramzyt, wełna 20 cm, ceramiczna dachówka na pełnym deskowaniu. Konstrukcja, której nie da się dziś tanio odtworzyć.',
    },
    {
      n: '02',
      title: 'Mieszkalny od razu',
      body: 'Dom umeblowany, w dobrym stanie technicznym, gotowy do wprowadzenia. Remont i odświeżenie możesz zaplanować na własnych warunkach, w swoim tempie.',
    },
    {
      n: '03',
      title: 'Zakres remontu',
      body: 'Wymiana instalacji ogrzewania (obecnie węglowe) i odświeżenie wnętrz — pozostałe elementy są w porządku. Zakres jasny, kosztorys przewidywalny.',
    },
    {
      n: '04',
      title: 'Wnętrze pod Ciebie',
      body: 'Odświeżenie to szansa, by układ funkcjonalny, kolory i materiały dopasować dokładnie do swojego stylu życia — bez kompromisów na cudze gusta.',
    },
    {
      n: '05',
      title: 'Cena z marginesem',
      body: '1 899 000 zł za 402 m² i 1 600 m² działki. Cena uwzględnia zakres prac — zostawia realny budżet na ich przeprowadzenie.',
    },
    {
      n: '06',
      title: 'Lokalizacja premium',
      body: 'Działki w Mesznej i okolicach Szczyrku zyskują na wartości od lat. Po remoncie — naturalny wzrost rynkowy.',
    },
  ],
  quote: {
    label: '✦ Dla kogo jest ten dom',
    body: 'Dla kogoś, kto szuka prawdziwego domu na lata — z miejscem dla rodziny, ogrodem i widokiem na góry. Z perspektywą remontu, który sprawi, że wnętrze stanie się naprawdę Twoje.',
  },
} as const;

/* ── 04 · Floorplan ───────────────────────────────────────────────────────── */

export type Floor = { level: string; title: string; subtitle: string; rooms: string[] };

export const floorplan = {
  eyebrow: '04 — Układ kondygnacji',
  eyebrowAside: '402,35 m² · 170,75 m² powierzchni użytkowej',
  headline: { lead: 'Trzy poziomy.', mid: 'Jedno', accent: 'przemyślane wnętrze.' },
  levelLabel: 'Kondygnacja',
  floors: [
    {
      level: '01',
      title: 'Poziom 0',
      subtitle: 'Strefa techniczna i wejściowa',
      rooms: [
        'Garaż',
        'Wiatrołap',
        'Przedpokój',
        'Pomieszczenie gospodarcze / Pokój',
        'Kotłownia',
        'Pomieszczenie gospodarcze',
      ],
    },
    {
      level: '02',
      title: 'Parter',
      subtitle: 'Strefa dzienna z wyjściem na taras',
      rooms: [
        'Salon z otwartą kuchnią',
        'Wyjście na ogród i taras',
        'Spiżarnia',
        'Dwa pokoje',
        'Łazienka',
        'Korytarz',
      ],
    },
    {
      level: '03',
      title: 'Poddasze',
      subtitle: 'Strefa nocna w panoramie gór',
      rooms: [
        'Trzy sypialnie',
        'Garderoba przy sypialni głównej',
        'Łazienka z prysznicem i wanną',
        'Pralnia',
      ],
    },
  ] satisfies Floor[],
} as const;

/* ── 05 · Location ────────────────────────────────────────────────────────── */

export const location = {
  eyebrow: '05 — Lokalizacja',
  headline: { lead: 'Adres, który znają', mid: 'prawdziwi', accent: 'miłośnicy gór.' },
  intro:
    '300 metrów do lasu. 600 metrów do Chaty na Groniu i szlaków górskich na Klimczok. Meszna leży na pograniczu Beskidu Śląskiego i Małego — z dala od zgiełku, ale w zasięgu najlepszych atrakcji Podbeskidzia: Szczyrk, Ustroń, Wisła. Niezliczone szlaki górskie i trasy rowerowe zaczynają się za rogiem.',
  banner: {
    src: '/images/landscape/beskidy.jpg',
    alt: 'Beskid Śląski — krajobraz w okolicy',
  },
  map: {
    caption: 'Schemat poglądowy · Podbeskidzie',
    centreLabel: 'DOM MESZNA',
    pins: [
      { x: 200, y: 350, label: 'BIELSKO-BIAŁA' },
      { x: 520, y: 280, label: 'SZCZYRK' },
      { x: 640, y: 200, label: 'WISŁA' },
      { x: 720, y: 250, label: 'USTROŃ' },
    ],
  },
  nearbyLabel: '↳ W zasięgu ręki',
  nearby: [
    { name: 'Las', distance: '300 m', type: 'Bezpośrednie sąsiedztwo' },
    { name: 'Chata na Groniu', distance: '600 m', type: 'Schronisko górskie' },
    { name: 'Szlak na Klimczok', distance: '600 m', type: 'Szlaki górskie' },
    { name: 'Bielsko-Biała', distance: '10 km', type: 'Miasto' },
    { name: 'Szczyrk', distance: '7 km', type: 'Kurort narciarski' },
    { name: 'Obwodnica S52', distance: '4 km', type: 'Komunikacja' },
    { name: 'Szczyrk Mountain Resort', distance: '8 km', type: 'Narty' },
    { name: 'Skocznia Skalite', distance: '7 km', type: 'Atrakcja' },
    { name: 'Aquapark Aries', distance: '7 km', type: 'Rekreacja' },
    { name: 'Jezioro Żywieckie', distance: '15 km', type: 'Natura' },
    { name: 'Wisła / Ustroń', distance: '25 km', type: 'Kurort' },
  ],
} as const;

/* ── 06 · Interior ────────────────────────────────────────────────────────── */

export type Interior = { src: string; alt: string; label: string; span: string; aspect: string };

export const interior = {
  eyebrow: '06 — Wnętrza',
  eyebrowAside: 'Stan obecny · do odświeżenia',
  headline: { lead: 'Wnętrza,', leadItalic: 'które', mid: 'żyły', accent: 'codziennością.' },
  intro:
    'Salon z kominkiem, otwarta kuchnia, sypialnia z łukowym oknem na poddaszu, łazienka z wanną z hydromasażem, domowe biuro i widok na las z okien dachowych. Zdjęcia pokazują dom takim, jakim jest dziś — z charakterem, ale też z miejscem na Twoją wizję.',
  // Alt text is deliberately unique per photo: five images previously shared two
  // strings, which tells a screen-reader user nothing about what changed.
  photos: [
    // Strefa dzienna — parter
    {
      src: '/images/interior/interior-30.jpg',
      alt: 'Otwarte pomieszczenie dzienne z owalnym podwieszanym sufitem, telewizorem na ścianie i przeszklonymi drzwiami tarasowymi za firaną.',
      label: 'Strefa wypoczynkowa',
      span: 'col-span-12',
      aspect: '16/9',
    },
    {
      src: '/images/interior/interior-42.jpg',
      alt: 'Skórzane fotele i sofa przy ścianie z kamiennej okładziny, obok przejście do korytarza i murowany kominek z drewnianym gzymsem.',
      label: 'Otwarta strefa dzienna z kominkiem',
      span: 'col-span-12 md:col-span-6',
      aspect: '4/3',
    },
    {
      src: '/images/interior/interior-31.jpg',
      alt: 'Wolnostojący kominek z białym okapem, za nim otwarta kuchnia w ciemnym drewnie i długi dębowy stół z krzesłami.',
      label: 'Salon z kominkiem',
      span: 'col-span-12 md:col-span-6',
      aspect: '4/3',
    },
    {
      src: '/images/interior/interior-07.jpg',
      alt: 'Kuchnia w ciemnym drewnie z płytą gazową, piekarnikiem i stalową lodówką, obok wyspa z drewnianym blatem i duża roślina doniczkowa.',
      label: 'Otwarta kuchnia',
      span: 'col-span-12 md:col-span-6',
      aspect: '4/3',
    },
    {
      src: '/images/interior/interior-41.jpg',
      alt: 'Kominek z wkładem żeliwnym i białym okapem na tle kamiennej okładziny, z ramkami i roślinami na drewnianej półce.',
      label: 'Kominek z bliska',
      span: 'col-span-12 md:col-span-6',
      aspect: '4/3',
    },
    {
      src: '/images/interior/interior-46.jpg',
      alt: 'Jasny salon z dwoma skórzanymi fotelami i sofą, firaną w oknie tarasowym i owalnym podwieszanym sufitem.',
      label: 'Strefa wypoczynkowa dzienna',
      span: 'col-span-12',
      aspect: '16/9',
    },
    {
      src: '/images/interior/interior-47.jpg',
      alt: 'Dębowy stół na sześć osób pod podwieszanym sufitem, między dwoma oknami z firanami, na ścianie obraz z kwiatami.',
      label: 'Jadalnia',
      span: 'col-span-12 md:col-span-6',
      aspect: '4/3',
    },
    {
      src: '/images/interior/interior-48.jpg',
      alt: 'Widok znad stołu jadalnego na część wypoczynkową z fotelami, kominek i przejście do kuchni.',
      label: 'Otwarty salon',
      span: 'col-span-12 md:col-span-6',
      aspect: '4/3',
    },
    // Poddasze
    {
      src: '/images/interior/interior-51.jpg',
      alt: 'Sypialnia ze skórzanym łóżkiem kontynentalnym, naklejkami z motylami i kwiatami na ścianie i wysokim oknem tarasowym z granatowymi zasłonami.',
      label: 'Główna sypialnia',
      span: 'col-span-12',
      aspect: '16/9',
    },
    {
      src: '/images/interior/interior-17.jpg',
      alt: 'Pokój na poddaszu z dwoma oknami połaciowymi, turkusową sofą narożną i grzejnikiem pod skosem.',
      label: 'Pokój dziecięcy — widok od okna',
      span: 'col-span-12 md:col-span-6',
      aspect: '4/3',
    },
    {
      src: '/images/interior/interior-18.jpg',
      alt: 'Biurko z krzesłem i tablicą korkową pod oknem dachowym, obok regał z książkami, zabawkami i pluszakami.',
      label: 'Pokój dziecięcy — strefa nauki',
      span: 'col-span-12 md:col-span-6',
      aspect: '4/3',
    },
    {
      src: '/images/interior/interior-24.jpg',
      alt: 'Granatowa sofa narożna pod skosem poddasza, dwa okna dachowe z widokiem na las i biurko w rogu.',
      label: 'Pokój nastolatki',
      span: 'col-span-12',
      aspect: '16/9',
    },
    {
      src: '/images/interior/interior-27.jpg',
      alt: 'Szafka z umywalką i lustrem pod skosem poddasza, obok okno dachowe, wisząca szafka i bidet; jasne płytki w drewnopodobnym wzorze.',
      label: 'Łazienka główna — umywalka i lustro',
      span: 'col-span-12 md:col-span-6',
      aspect: '4/3',
    },
    {
      src: '/images/interior/interior-28.jpg',
      alt: 'Narożna wanna z hydromasażem pod skosem dachu, obok przeszklona kabina prysznicowa, grzejnik drabinkowy i duża roślina doniczkowa.',
      label: 'Łazienka główna — strefa wanny',
      span: 'col-span-12 md:col-span-6',
      aspect: '4/3',
    },
    {
      src: '/images/interior/interior-29.jpg',
      alt: 'Umywalka z lustrem w drewnianej ramie, bidet i wisząca toaleta, na półce storczyki; ściany w płytkach z motywem liści.',
      label: 'Łazienka główna — widok całości',
      span: 'col-span-12',
      aspect: '16/9',
    },
  ] satisfies Interior[],
} as const;

/* ── 07 · Plans ───────────────────────────────────────────────────────────── */

export const plans = {
  eyebrow: '07 — Dokumentacja',
  eyebrowAside: 'Studio Atrium · Bielsko-Biała',
  headline: { lead: 'Plany do', accent: 'wglądu.' },
  intro:
    'Dom został zaprojektowany przez Studio Atrium z Bielska-Białej. Pełna dokumentacja architektoniczna dostępna do wglądu — poniżej skany planów i sytuacji geodezyjnej.',
  sheets: [
    {
      src: '/images/plans/plan-site.jpg',
      alt: 'Mapa sytuacyjna: obrys budynku wrysowany w granice działki przy ul. Energetyków, z wymiarami, sąsiednimi parcelami i drogą dojazdową.',
      title: 'Sytuacja',
      subtitle: 'Plan zagospodarowania · Meszna',
    },
    {
      src: '/images/plans/plan-przekroj.jpg',
      alt: 'Rysunek techniczny: pionowe przekroje A-A i C-C przez wszystkie kondygnacje, z rzędnymi wysokości, konstrukcją dachu i biegami schodów.',
      title: 'Przekrój',
      subtitle: 'Przekroje A-A i C-C · spadek dachu 39°',
    },
    {
      src: '/images/plans/plan-parter.jpg',
      alt: 'Rzut parteru z wymiarami, ścianami nośnymi, oznaczeniami pomieszczeń i stolarki oraz zmianami naniesionymi na czerwono.',
      title: 'Parter',
      subtitle: 'Otwarta przestrzeń',
    },
    {
      src: '/images/plans/plan-poddasze.jpg',
      alt: 'Rzut poddasza z wymiarami, pomieszczeniami pod skosami, dwoma balkonami i oznaczeniami więźby dachowej.',
      title: 'Poddasze',
      subtitle: 'Pokoje pod skosami · balkon · druga łazienka',
    },
    {
      src: '/images/plans/plan-pietro.jpg',
      alt: 'Rzut najniższej kondygnacji z wymiarami, ścianami fundamentowymi, przewodem nawiewnym do kominka i zmianami naniesionymi na czerwono.',
      title: 'Poziom 0',
      subtitle: 'Garaż · pomieszczenia gospodarcze',
    },
  ],
  note: {
    label: '✦ Pełna dokumentacja',
    body: 'Komplet dokumentów (projekt budowlany, pomiar geodezyjny, dziennik budowy, pozwolenia, świadectwo charakterystyki energetycznej) dostępny do wglądu przy oglądaniu nieruchomości lub na żądanie.',
  },
} as const;

/* ── 08 · Pricing ─────────────────────────────────────────────────────────── */

export const pricing = {
  eyebrow: '08 — Oferta',
  eyebrowAside: 'Sprzedaż bez pośredników',
  kicker: '✦ Bez pośredników · bez prowizji · bez ukrytych kosztów',
  /** Rendered as the count-down target; the anchor it starts from is facts.priceAnchor. */
  priceLabel: '1 899 000',
  currencySuffix: ' zł',
  perSqm: '4 720 zł / m² za 402 m² i 1 600 m² działki.',
  anchor: {
    label: '↳ Wcześniej w ofertach agencyjnych',
    before: 'Nieruchomość była wystawiona w ofertach pośredników za ',
    amount: '2 250 000 zł',
    after:
      '. Oferta bezpośrednia oznacza realną oszczędność na prowizji i marży pośrednika — różnica trafia do Ciebie.',
  },
  details: [
    {
      label: 'Cena za m²',
      value: '4 720 zł',
      note: 'Atrakcyjna stawka jak na lokalizację',
      accent: false,
    },
    {
      label: 'Stan',
      value: 'Dobry',
      note: 'Do indywidualnego wykończenia',
      accent: false,
    },
    {
      label: 'Status',
      value: 'Dostępne',
      note: 'Oferta bezpośrednia · bez pośredników',
      accent: true,
    },
  ] as ReadonlyArray<{ label: string; value: string; note: string; accent: boolean }>,
  closing: {
    lead: 'Cena ',
    accent: 'bez pośrednika',
    tail: 'Bez prowizji, bez doliczonych marż.',
    note: '↳ Sprzedaż prywatna',
  },
} as const;

/* ── 09 · Contact ─────────────────────────────────────────────────────────── */

export const contact = {
  eyebrow: '09 — Kontakt',
  eyebrowAside: 'Prywatna prezentacja oferty',
  headline: { lead: 'Porozmawiajmy', accent: 'wprost.', second: 'Bez pośredników.' },
  intro:
    'Dom oferowany jest bez pośredników — chętnie odpowiem na pytania i pokażę nieruchomość w dogodnym terminie. Zostaw kontakt, odpowiem w ciągu doby.',
  form: {
    netlifyName: 'kontakt',
    honeypotLabel: 'Nie wypełniaj tego pola:',
    fields: {
      imie: { label: 'Imię i nazwisko', autoComplete: 'name' },
      telefon: { label: 'Telefon', autoComplete: 'tel' },
      email: { label: 'Adres e-mail', autoComplete: 'email' },
      termin: {
        label: 'Preferowany termin prezentacji',
        placeholder: 'np. najbliższa sobota, popołudnie',
      },
      wiadomosc: { label: 'Dodatkowe pytania' },
    },
    submit: 'Wyślij zapytanie',
    submitting: 'Wysyłam…',
    success: {
      title: 'Dziękuję za wiadomość.',
      body: 'Odezwę się w ciągu 24 godzin na podany adres e-mail.',
    },
    error: {
      title: 'Nie udało się wysłać wiadomości.',
      bodyBefore: 'Spróbuj ponownie lub napisz bezpośrednio na ',
    },
    consentBefore: 'Wysyłając zapytanie, potwierdzasz zapoznanie się z ',
    consentLinkLabel: 'polityką prywatności',
    consentAfter:
      ' i akceptujesz przetwarzanie podanych danych w celu udzielenia odpowiedzi (RODO, art. 6 ust. 1 lit. b).',
    reassurance: 'Zapytanie jest niezobowiązujące. Odpowiem w ciągu 24 godzin.',
  },
  info: {
    contact: {
      label: 'Kontakt',
      value: 'Strona sprzedająca',
      note: 'Bez pośredników · bez prowizji · rozmowa wprost',
    },
    emailLabel: 'E-mail',
    locationLabel: 'Lokalizacja',
    why: {
      label: '✦ Dlaczego bezpośrednio',
      body: 'Brak pośredników oznacza realną cenę bez doliczonych prowizji i bezpośrednią rozmowę o szczegółach, terminie i ewentualnych ustaleniach.',
    },
  },
} as const;

/* ── Consent ──────────────────────────────────────────────────────────────── */

export const consent = {
  kicker: '✦ Prywatność',
  title: 'Zgoda na analitykę',
  body: 'Ta strona działa bez plików cookies śledzących. Czcionki i wszystkie materiały serwowane są z naszego serwera — żadne dane nie trafiają do podmiotów trzecich. Chcielibyśmy jedynie zbierać anonimowe statystyki odwiedzin, aby wiedzieć, które treści są przydatne. Zgoda jest dobrowolna i możesz ją wycofać w każdej chwili.',
  categories: {
    essential: {
      title: 'Niezbędne',
      body: 'Zapamiętanie motywu i tego, że animacja powitalna już się wyświetliła. Dane nie opuszczają Twojej przeglądarki.',
      state: 'Zawsze aktywne',
    },
    analytics: {
      title: 'Analityka',
      body: 'Anonimowe statystyki odwiedzin. Bez tej zgody żaden skrypt analityczny nie jest wczytywany.',
    },
  },
  reject: 'Odrzuć',
  accept: 'Akceptuj',
  save: 'Zapisz wybór',
  customise: 'Dostosuj ustawienia',
  reopen: 'Ustawienia prywatności',
} as const;

/* ── Structured data ──────────────────────────────────────────────────────── */

/** schema.org SingleFamilyResidence, built from the figures above. */
export function buildStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SingleFamilyResidence',
    name: site.name,
    description:
      'Dom o powierzchni całkowitej 402 m² (170,75 m² powierzchni użytkowej) w Mesznej u stóp Beskidu Śląskiego. Trzy kondygnacje, działka 1 600 m². Projekt Studio Atrium, oddany do użytku w 2018 r. 300 m do lasu, 600 m do szlaków górskich na Klimczok.',
    url: site.url,
    image: [
      `${site.url}/images/house/house-01.jpg`,
      `${site.url}/images/house/house-02.jpg`,
      `${site.url}/images/house/house-03.jpg`,
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    // Schema.org floorSize = powierzchnia użytkowa (konwencja polskiego rynku
    // dla porównań cenowych — tak liczą Otodom, Sprzedajemy, akty notarialne)
    floorSize: {
      '@type': 'QuantitativeValue',
      value: facts.usableArea,
      unitCode: 'MTK',
      name: 'Powierzchnia użytkowa',
    },
    // additionalProperty — drugorzędne ale równie istotne dane mierzalne
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Powierzchnia całkowita',
        value: facts.totalArea,
        unitCode: 'MTK',
        description:
          'Całkowita powierzchnia budynku łącznie z piwnicą, garażem i pomieszczeniami gospodarczymi.',
      },
      {
        '@type': 'PropertyValue',
        name: 'Powierzchnia działki',
        value: facts.plotArea,
        unitCode: 'MTK',
      },
      {
        '@type': 'PropertyValue',
        name: 'Powierzchnia działki z udziałem w drodze dojazdowej',
        value: facts.plotAreaWithRoad,
        unitCode: 'MTK',
        description: 'Działka 1 600 m² wraz z udziałem we współwłasności drogi dojazdowej.',
      },
      { '@type': 'PropertyValue', name: 'Liczba kondygnacji', value: facts.floors },
    ],
    numberOfRooms: facts.rooms,
    numberOfBathroomsTotal: facts.bathrooms,
    yearBuilt: facts.yearBuilt,
    amenityFeature: [
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Architekt',
        value: site.architect,
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Materiały konstrukcyjne',
        value: 'Keramzyt, wełna mineralna 20 cm, ceramiczna dachówka',
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Forma własności',
        value: 'Współwłasność',
      },
    ],
    offers: {
      '@type': 'Offer',
      price: String(facts.price),
      priceCurrency: facts.currency,
      availability: 'https://schema.org/InStock',
      url: site.url,
      seller: { '@type': 'Person', name: 'Sprzedaż bezpośrednia' },
    },
  };
}
