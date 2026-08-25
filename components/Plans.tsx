'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useSectionAnim } from '@/hooks/useSectionAnim';
import { revealBatch } from '@/utils/motion';
import { plans } from '@/data/site';

export default function Plans() {
  const root = useRef<HTMLElement>(null);

  useSectionAnim(root, () => {
    gsap.from('.plans-heading > *', {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 1,
      scrollTrigger: { trigger: '.plans-heading', start: 'top 80%' },
    });

    revealBatch('.plan-item', { y: 50 });
  });

  return (
    <section
      ref={root}
      id="plany"
      aria-labelledby="plany-title"
      className="py-32 md:py-48 relative"
    >
      <div className="mx-auto max-w-[1880px] px-6 md:px-12">
        <div className="plans-heading mb-20">
          <div className="flex items-center justify-between mb-12">
            <div className="label-mono opacity-60">{plans.eyebrow}</div>
            <div className="label-mono opacity-60 hidden md:block">
              {plans.eyebrowAside}
            </div>
          </div>
          <h2
            id="plany-title"
            className="display-serif"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 7rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.03em',
            }}
          >
            {plans.headline.lead}{' '}
            <span className="italic text-(--accent)">{plans.headline.accent}</span>
          </h2>
          <p className="mt-8 max-w-3xl text-lg md:text-xl opacity-75 leading-relaxed">
            {plans.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {plans.sheets.map((p) => (
            <div key={p.title} className="plan-item group cursor-zoom-in">
              <div
                className="rounded-xs border border-(--line-strong) relative flex items-center justify-center overflow-hidden transition-colors duration-500 group-hover:border-(--accent)"
                style={{
                  padding: '1.5rem',
                  aspectRatio: '5 / 7',
                }}
              >
                <Image
                  src={p.src}
                  alt={`${p.title} — ${p.subtitle}`}
                  fill
                  className="object-contain transition-transform duration-700 ease-out group-hover:scale-125"
                  style={{ filter: 'contrast(1.4)', padding: '1.5rem' }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="mt-4 flex gap-2 flex-col sm:flex-row items-baseline justify-between">
                <div className="display-serif text-xl italic">{p.title}</div>
                <div className="label-mono text-(--fg-muted)">{p.subtitle}</div>
              </div>
            </div>
          ))}
          <div className="plans-note plan-item h-[96%] p-6 md:p-8 rounded-xs border border-(--line-strong) max-w-3xl">
            <div className="label-mono text-(--accent) mb-3">{plans.note.label}</div>
            <p className="text-sm leading-relaxed opacity-80">{plans.note.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
