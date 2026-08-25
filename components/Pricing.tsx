'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useSectionAnim } from '@/hooks/useSectionAnim';
import { facts, pricing } from '@/data/site';

export default function Pricing() {
  const root = useRef<HTMLElement>(null);

  useSectionAnim(root, (el) => {
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

    // The markup ships the real asking price (1 899 000) so crawlers and no-JS
    // visitors never see the anchor figure the counter starts from — it used to
    // contradict the 1899000 in our JSON-LD. Rewind to the anchor only once we
    // know the count-down is going to run.
    const priceEl = el.querySelector<HTMLElement>('.big-price');
    if (priceEl) {
      priceEl.textContent = facts.priceAnchor.toLocaleString('pl-PL');
      const obj = { val: facts.priceAnchor };
      gsap.to(obj, {
        val: facts.price,
        duration: 2.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: priceEl, start: 'top 80%' },
        onUpdate: () => {
          priceEl.textContent = Math.round(obj.val).toLocaleString('pl-PL');
        },
      });
    }

    // Reveal anchor label after price animation lands
    gsap.from('.price-anchor-note', {
      opacity: 0,
      y: 12,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.big-price', start: 'top 80%' },
      delay: 2.4,
    });
  });

  return (
    <section
      ref={root}
      aria-labelledby="cena-title"
      className="py-32 md:py-48 relative bg-(--bg-alt)"
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

          <h2 id="cena-title" className="display-serif leading-[0.92]">
            <div className="overflow-hidden">
              <div className="pricing-line text-[clamp(3rem,9vw,8rem)]">
                <span className="big-price">{pricing.priceLabel}</span>
                <span className="text-(--accent)">{pricing.currencySuffix}</span>
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="pricing-line text-[clamp(1.3rem,3vw,2.4rem)] italic opacity-70 mt-4">
                {pricing.perSqm}
              </div>
            </div>
          </h2>

          <div className="price-anchor-note mt-8 max-w-xl">
            <div className="label-mono text-(--fg-muted) text-[0.65rem] mb-2">
              {pricing.anchor.label}
            </div>
            <p className="text-sm md:text-base opacity-75 leading-relaxed">
              {pricing.anchor.before}
              <span className="text-lg! display-serif italic text-(--accent)">
                {pricing.anchor.amount}
              </span>
              {pricing.anchor.after}
            </p>
          </div>
        </div>

        <div className="hairline my-16" />

        <div className="pricing-details grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16">
          {pricing.details.map((d) => (
            <div key={d.label} className="pricing-detail">
              <div className="label-mono text-(--fg-muted) mb-3">{d.label}</div>
              <div
                className={`display-serif text-3xl${d.accent ? ' text-(--accent)' : ''}`}
              >
                {d.value}
              </div>
              <div className="text-xs opacity-60 mt-2">{d.note}</div>
            </div>
          ))}
        </div>

        <div className="pricing-detail mt-20 max-w-4xl">
          <p className="display-serif text-6xl italic leading-snug opacity-95">
            {pricing.closing.lead}
            <span className="text-(--accent) not-italic">{pricing.closing.accent}</span>.
            <br />
            {pricing.closing.tail}
          </p>
          <div className="mt-4 label-mono opacity-60">{pricing.closing.note}</div>
        </div>
      </div>
    </section>
  );
}
