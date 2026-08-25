'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useSectionAnim } from '@/hooks/useSectionAnim';
import { stats } from '@/data/site';

export default function Stats() {
  const root = useRef<HTMLElement>(null);

  useSectionAnim(root, () => {
    gsap.utils.toArray<HTMLElement>('.spec-number').forEach((el) => {
      const raw = el.dataset.value || '0';
      const num = parseFloat(raw.replace(/\s/g, '').replace(',', '.'));
      if (!Number.isFinite(num)) return;

      const format = (v: number) =>
        raw.includes(',')
          ? v.toFixed(2).replace('.', ',')
          : Math.round(v).toLocaleString('pl-PL');

      // The markup ships the real figure so crawlers and no-JS visitors read
      // "402,35" rather than the counter's starting "0". Reset to zero only
      // once we know the count-up is actually going to run.
      el.textContent = format(0);

      const obj = { val: 0 };
      gsap.to(obj, {
        val: num,
        duration: 1.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
        onUpdate: () => {
          el.textContent = format(obj.val);
        },
      });
    });

    gsap.from('.stat-item', {
      opacity: 0,
      y: 40,
      stagger: 0.08,
      duration: 0.9,
      scrollTrigger: { trigger: '.stats-grid', start: 'top 80%' },
    });
  });

  return (
    // 2.4.6 — labelled by the eyebrow that is already on screen, rather than by
    // an aria-label naming the section with words no sighted visitor ever sees.
    // Promoting it to <h2> also puts the property's headline figures within
    // reach of heading navigation, which they were not before.
    <section
      aria-labelledby="dom-title"
      ref={root}
      id="dom"
      className="py-24 md:py-32 relative bg-(--bg-alt)"
    >
      <div className="mx-auto max-w-[1880px] px-6 md:px-12">
        <div className="flex items-center justify-between mb-16">
          <h2 id="dom-title" className="label-mono opacity-60">
            {stats.eyebrow}
          </h2>
          <div className="label-mono opacity-60 hidden md:block">
            {stats.eyebrowAside}
          </div>
        </div>

        {/* 1.3.1 — six name/value pairs, which is what <dl> is for. As nested
            divs the pairing existed only in the visual layout. The wrapper div
            around each dt/dd group is valid inside <dl> and keeps the grid. */}
        <dl
          className="stats-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px border-y border-(--line-strong) bg-(--bg-alt)"
          style={{ background: 'var(--line-strong)' }}
        >
          {stats.items.map((s) => (
            <div key={s.label} className="stat-item bg-(--bg-alt) p-6 md:p-10">
              <dt className="label-mono text-(--fg-muted) mb-3 text-[0.6rem]">
                {s.label}
              </dt>
              <dd className="display-serif text-3xl md:text-5xl">
                <span className="spec-number" data-value={s.value}>
                  {s.value}
                </span>
                {s.unit && (
                  <span className="text-base text-(--fg-muted) ml-1">{s.unit}</span>
                )}
              </dd>
              {s.note && (
                <dd className="label-mono text-(--fg-muted) mt-2 text-[0.55rem] leading-snug">
                  {s.note}
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
