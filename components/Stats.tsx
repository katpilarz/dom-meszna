'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const stats = [
  { label: 'Powierzchnia całkowita', value: '402,35', unit: 'm²' },
  { label: 'Powierzchnia użytkowa', value: '170,75', unit: 'm²' },
  { label: 'Działka', value: '1600', unit: 'm²' },
  { label: 'Pokoje', value: '7', unit: '' },
  { label: 'Kondygnacje', value: '3', unit: '' },
  { label: 'Oddanie do użytku', value: '2018', unit: '' },
];

export default function Stats() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.spec-number').forEach((el) => {
        const raw = el.dataset.value || '0';
        const num = parseFloat(raw.replace(/\s/g, '').replace(',', '.'));
        if (!Number.isFinite(num)) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: num,
          duration: 1.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
          onUpdate: () => {
            const formatted = raw.includes(',')
              ? obj.val.toFixed(2).replace('.', ',')
              : Math.round(obj.val).toLocaleString('pl-PL');
            el.textContent = formatted;
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
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="dom" className="py-24 md:py-32 relative bg-[var(--bg-alt)]">
      <div className="mx-auto max-w-[1880px] px-6 md:px-12">
        <div className="flex items-center justify-between mb-16">
          <div className="label-mono opacity-60">01 — Najważniejsze fakty</div>
          <div className="label-mono opacity-60 hidden md:block">Projekt Studio Atrium · oddany do użytku 2018</div>
        </div>

        <div
          className="stats-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px border-y border-[var(--line-strong)] bg-[var(--bg-alt)]"
          style={{ background: 'var(--line-strong)' }}
        >
          {stats.map((s) => (
            <div key={s.label} className="stat-item bg-[var(--bg-alt)] p-6 md:p-10">
              <div className="label-mono opacity-50 mb-3 text-[0.6rem]">{s.label}</div>
              <div className="display-serif text-3xl md:text-5xl">
                <span className="spec-number" data-value={s.value}>0</span>
                {s.unit && <span className="text-base opacity-50 ml-1">{s.unit}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
