'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useSectionAnim } from '@/hooks/useSectionAnim';
import { pricing } from '@/data/site';

export default function Pricing() {
  const root = useRef<HTMLElement>(null);

  useSectionAnim(root, () => {
    gsap.from('.pricing-line', {
      yPercent: 110,
      stagger: 0.1,
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.pricing-block', start: 'top 75%' },
    });

    gsap.from('.pricing-detail', {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.8,
      scrollTrigger: { trigger: '.pricing-details', start: 'top 80%' },
    });
  });

  return (
    <section
      ref={root}
      aria-labelledby="cena-title"
      className="py-16 md:py-32 lg:py-48 relative bg-(--bg-alt)"
    >
      <div className="mx-auto max-w-[1880px] px-6 md:px-10">
        <div className="flex items-center justify-between mb-16">
          <div className="label-mono opacity-60">{pricing.eyebrow}</div>
          <div className="label-mono opacity-60 hidden md:block">
            {pricing.eyebrowAside}
          </div>
        </div>

        <div className="pricing-block">
          <div className="overflow-hidden">
            <div className="pricing-line label-mono text-(--accent) mb-6">
              {pricing.kicker}
            </div>
          </div>

          {/* 4.1.1 — a heading's content model is phrasing content, so these
              overflow masks are <span className="block">, not <div>. Renders
              identically and keeps the line break in the accessible name. */}
          <h2 id="cena-title" className="display-serif leading-[0.92]">
            <span className="block overflow-hidden">
              <span className="pricing-line block text-[clamp(3rem,9vw,8rem)]">
                <span>{pricing.priceLabel}</span>
                <span className="text-(--accent)">{pricing.currencySuffix}</span>
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="pricing-line block text-[clamp(1.3rem,3vw,2.4rem)] italic opacity-70 mt-4">
                {pricing.perSqm}
              </span>
            </span>
          </h2>
        </div>

        <div className="hairline my-16" />

        {/* 1.3.1 — name/value pairs; see Stats.tsx. */}
        <dl className="pricing-details grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          {pricing.details.map((d) => (
            <div key={d.label} className="pricing-detail">
              <dt className="label-mono text-(--fg-muted) mb-3">{d.label}</dt>
              <dd
                className={`display-serif text-3xl${d.accent ? ' text-(--accent)' : ''}`}
              >
                {d.value}
              </dd>
              <dd className="text-xs opacity-60 mt-2">{d.note}</dd>
            </div>
          ))}
        </dl>

        <div className="pricing-detail mt-20 max-w-4xl">
          {/* 2.4.10 — set at text-6xl and read as this section's closing
              statement, so it is a heading rather than a paragraph. */}
          <h3 className="display-serif text-[clamp(1.875rem,5vw,3.75rem)] italic leading-snug opacity-95">
            {pricing.closing.lead}
            <span className="text-(--accent) not-italic">{pricing.closing.accent}</span>.
            <br />
            {pricing.closing.tail}
          </h3>
          <div className="mt-4 label-mono opacity-60">{pricing.closing.note}</div>
        </div>
      </div>
    </section>
  );
}
