'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Footer() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from('.footer-mega', {
        yPercent: 30,
        opacity: 0,
        duration: 1.5,
        ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={ref}
      className="pt-32 pb-12 border-t border-[var(--line)] relative overflow-hidden"
    >
      <div className="mx-auto max-w-[1880px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-8 mb-32">
          <div className="col-span-12 md:col-span-5">
            <div className="display-serif text-2xl mb-2">Dom w Mesznej</div>
            <div className="label-mono opacity-60">
              Bezpośrednio od właścicielki · Beskid Śląski · 402 m²
            </div>
          </div>

          <div className="col-span-6 md:col-span-4">
            <div className="label-mono opacity-50 mb-4">Kontakt</div>
            <ul className="space-y-2 text-sm">
              <li className="break-all">dommeszna@proton.me</li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-3">
            <div className="label-mono opacity-50 mb-4">Oferta</div>
            <div className="font-mono text-sm">Sprzedaż prywatna</div>
            <div className="text-xs opacity-50 mt-2">
              Bez pośredników · bez prowizji
            </div>
            <div className="text-xs opacity-50 mt-1">
              Aktualizacja: 2026
            </div>
          </div>
        </div>

        <div className="footer-mega display-serif text-[clamp(4rem,18vw,18rem)] leading-[0.85] tracking-tight overflow-hidden">
          <span className="italic">Beskidy.</span>
        </div>

        <div className="hairline mt-12 mb-6" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 label-mono opacity-50 text-[0.65rem]">
          <div>© 2026 Dom w Mesznej · Sprzedaż prywatna</div>
          <div className="flex items-center gap-6">
            <a href="/polityka-prywatnosci" className="hover:text-[var(--accent)]">Polityka prywatności · RODO</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
