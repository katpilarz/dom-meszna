'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useSectionAnim } from '@/hooks/useSectionAnim';
import { revealBatch } from '@/utils/motion';
import { floorplan } from '@/data/site';

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
      aria-labelledby="uklad-title"
      id="uklad"
      ref={root}
      className="py-32 md:py-48 relative bg-(--bg-alt)"
    >
      <div className="mx-auto max-w-[1880px] px-6 md:px-10">
        <div className="floor-heading mb-20">
          <div className="flex items-center justify-between mb-12">
            <div className="label-mono opacity-60">{floorplan.eyebrow}</div>
            <div className="label-mono opacity-60 hidden md:block">
              {floorplan.eyebrowAside}
            </div>
          </div>
          {/* 1.4.12 Text Spacing — the words here are joined by ordinary spaces.
              A non-breaking space between "Jedno" and "przemyślane" used to make
              them one 17-character unbreakable run, which overflowed a 375 px
              viewport as soon as a visitor applied a spacing stylesheet. */}
          <h2
            id="uklad-title"
            className="display-serif text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] max-w-5xl"
          >
            {floorplan.headline.lead}
            <br />
            <span>{floorplan.headline.mid}</span>{' '}
            <span className="italic text-(--accent)">{floorplan.headline.accent}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-(--line-strong) rounded-xs border border-(--line-strong)">
          {floorplan.floors.map((floor) => (
            <div
              key={floor.level}
              className="floor-card bg-(--bg-alt) p-8 md:p-12 min-h-[480px] flex flex-col"
            >
              <div className="flex items-start justify-between gap-4 mb-12">
                <div className="min-w-0">
                  <div className="label-mono text-(--accent) mb-2">
                    {floorplan.levelLabel} {floor.level}
                  </div>
                  <h3 className="display-serif text-3xl md:text-4xl">{floor.title}</h3>
                  <div className="text-sm opacity-60 mt-2 italic">{floor.subtitle}</div>
                </div>
                <div className="display-serif text-6xl md:text-7xl opacity-10 shrink-0">
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
