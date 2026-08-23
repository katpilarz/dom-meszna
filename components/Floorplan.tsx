'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useSectionAnim, revealBatch } from './useSectionAnim';

const floors = [
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
];

export default function Floorplan() {
  const root = useRef<HTMLElement>(null);

  useSectionAnim(root, () => {
    gsap.from('.floor-heading > *', {
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      scrollTrigger: { trigger: '.floor-heading', start: 'top 80%' },
    });

    revealBatch('.floor-card', { y: 80, duration: 1.2, stagger: 0.15 });

    gsap.utils.toArray<HTMLElement>('.floor-card').forEach((card) => {
      gsap.from(card.querySelectorAll('.floor-room'), {
        opacity: 0,
        x: -20,
        stagger: 0.06,
        duration: 0.6,
        scrollTrigger: { trigger: card, start: 'top 75%' },
      });
    });
  });

  return (
    <section
      id="uklad"
      ref={root}
      className="py-32 md:py-48 relative bg-(--bg-alt) "
    >
      <div className="mx-auto max-w-[1880px] px-6 md:px-10">
        <div className="floor-heading mb-20">
          <div className="flex items-center justify-between mb-12">
            <div className="label-mono opacity-60">04 — Układ kondygnacji</div>
            <div className="label-mono opacity-60 hidden md:block">
              402,35 m² · 170,75 m² powierzchni użytkowej
            </div>
          </div>
          <h2 className="display-serif text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] max-w-5xl">
            Trzy poziomy.&nbsp;
            <br></br>
            <span>Jedno</span>
            <span className="italic text-(--accent)">&nbsp;przemyślane wnętrze.</span>
            
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-(--line-strong) rounded-xs border border-(--line-strong)">
          {floors.map((floor) => (
            <div
              key={floor.level}
              className="floor-card bg-(--bg-alt) p-8 md:p-12 min-h-[480px] flex flex-col"
            >
              <div className="flex items-start justify-between mb-12">
                <div>
                  <div className="label-mono text-(--accent) mb-2">
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
                    className="floor-room flex items-center gap-3 text-sm border-b border-(--line) pb-2"
                  >
                    <span className="text-(--accent) text-xs">○</span>
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
