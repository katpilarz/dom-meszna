'use client';

export default function Marquee() {
  const items = [
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

  ];

  return (
    <section
      className="py-8 border-y border-[var(--line)] overflow-hidden no-select bg-[var(--bg-alt)]"
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
