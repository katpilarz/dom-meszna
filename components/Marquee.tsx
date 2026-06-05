'use client';

export default function Marquee() {
  const items = [
    'Beskid Śląski',
    'Bezpośrednio od właściciela',
    '300 m do lasu',
    '600 m do szlaków na Klimczok',
    'Budowa 2018',
    '402 m² · 7 pokoi',
    'Działka 1 600 m²',
    'Bielsko-Biała 10 km',
    'Szczyrk 7 km',
    'Bez pośredników',
  ];

  return (
    <section
      className="py-8 border-y border-[var(--line)] overflow-hidden no-select"
      aria-hidden="true"
    >
      <div className="marquee-track flex whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="display-serif text-3xl md:text-5xl italic px-8 opacity-90"
          >
            {item}
            <span className="text-[var(--accent)] mx-8 not-italic">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
