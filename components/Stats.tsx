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
    <section
      aria-label={stats.label}
      ref={root}
      id="dom"
      className="py-24 md:py-32 relative bg-(--bg-alt)"
    >
      <div className="mx-auto max-w-[1880px] px-6 md:px-12">
        <div className="flex items-center justify-between mb-16">
          <div className="label-mono opacity-60">{stats.eyebrow}</div>
          <div className="label-mono opacity-60 hidden md:block">
            {stats.eyebrowAside}
          </div>
        </div>

        <div
          className="stats-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px border-y border-(--line-strong) bg-(--bg-alt)"
          style={{ background: 'var(--line-strong)' }}
        >
          {stats.items.map((s) => (
            <div key={s.label} className="stat-item bg-(--bg-alt) p-6 md:p-10">
              <div className="label-mono text-(--fg-muted) mb-3 text-[0.6rem]">
                {s.label}
              </div>
              <div className="display-serif text-3xl md:text-5xl">
                <span className="spec-number" data-value={s.value}>
                  {s.value}
                </span>
                {s.unit && (
                  <span className="text-base text-(--fg-muted) ml-1">{s.unit}</span>
                )}
              </div>
              {s.note && (
                <div className="label-mono text-(--fg-muted) mt-2 text-[0.55rem] leading-snug">
                  {s.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
