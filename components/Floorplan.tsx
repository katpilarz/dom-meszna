'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const floors = [
  {
    level: '01',
    title: 'Parter',
    subtitle: 'Strefa techniczna i powitalna',
    rooms: [
      'Wiatrołap',
      'Przedpokój',
      'Pokój',
      'Kotłownia',
      'Pomieszczenie gospodarcze',
      'Garaż',
    ],
  },
  {
    level: '02',
    title: 'Pierwsze piętro',
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
    title: 'Drugie piętro',
    subtitle: 'Strefa nocna w panoramie gór',
    rooms: [
      'Trzy sypialnie',
      'Garderoba przy sypialni głównej',
      'Łazienka z prysznicem i wanną',
      'Pralnia',
    ],
  },
];

export default function Floorplan() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from('.floor-heading > *', {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        scrollTrigger: { trigger: '.floor-heading', start: 'top 80%' },
      });

      gsap.utils.toArray<HTMLElement>('.floor-card').forEach((card, i) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          duration: 1.2,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%' },
        });

        const lines = card.querySelectorAll('.floor-room');
        gsap.from(lines, {
          opacity: 0,
          x: -20,
          stagger: 0.06,
          duration: 0.6,
          scrollTrigger: { trigger: card, start: 'top 75%' },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="uklad"
      ref={root}
      className="py-32 md:py-48 relative"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="floor-heading mb-20">
          <div className="flex items-center justify-between mb-12">
            <div className="label-mono opacity-60">06 — Układ kondygnacji</div>
            <div className="label-mono opacity-60 hidden md:block">
              402,35 m² · 170,75 m² powierzchni użytkowej
            </div>
          </div>
          <h2 className="display-serif text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] max-w-5xl">
            Trzy poziomy.&nbsp;
            <span className="italic text-[var(--accent)]">Jedno</span>
            &nbsp;przemyślane wnętrze.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--line-strong)] border border-[var(--line-strong)]">
          {floors.map((floor) => (
            <div
              key={floor.level}
              className="floor-card bg-[var(--bg-alt)] p-8 md:p-12 min-h-[480px] flex flex-col"
            >
              <div className="flex items-start justify-between mb-12">
                <div>
                  <div className="label-mono text-[var(--accent)] mb-2">
                    Kondygnacja {floor.level}
                  </div>
                  <h3 className="display-serif text-3xl md:text-4xl">
                    {floor.title}
                  </h3>
                  <div className="text-sm opacity-60 mt-2 italic">
                    {floor.subtitle}
                  </div>
                </div>
                <div className="display-serif text-6xl md:text-7xl opacity-10">
                  {floor.level}
                </div>
              </div>

              <ul className="space-y-3 mt-auto">
                {floor.rooms.map((room) => (
                  <li
                    key={room}
                    className="floor-room flex items-center gap-3 text-sm border-b border-[var(--line)] pb-2"
                  >
                    <span className="text-[var(--accent)] text-xs">○</span>
                    <span>{room}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
