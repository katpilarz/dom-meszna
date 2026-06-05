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
      className="pt-32 pb-12 border-t border-[var(--line)] relative overflow-hidden bg-[var(--bg-alt)]"
    >
      <div className="mx-auto max-w-[1880px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-8 mb-20">
          <div className="col-span-12 md:col-span-5">
            <div className="display-serif text-2xl mb-2">Dom w Mesznej</div>
            <div className="label-mono opacity-60">
              Sprzedaż bezpośrednia · 1,60 ha · 402 m2
            </div>
          </div>

          <div className="col-span-6 md:col-span-4">
            <div className="label-mono opacity-50 mb-3">Kontakt</div>
            <div className="text-sm break-all hover:text-[var(--accent)]">dommeszna@proton.me</div>
          </div>

          <div className="col-span-6 md:col-span-3">
            <div className="label-mono opacity-50 mb-3">Oferta</div>
            <a
              href="/polityka-prywatnosci"
              className="text-sm hover:text-[var(--accent)] mt-2 inline-block transition-colors"
            >
              Polityka prywatności · RODO
            </a>
          </div>
        </div>



        <div className="flex flex-col lg:flex-row footer-mega display-serif text-[clamp(4rem,18vw,18rem)] justify-between tracking-tight overflow-hidden">
          <span className="italic leading-[0.85]">Beskidy.</span>
                  <div className="label-mono opacity-50 text-[0.65rem] mt-auto mb-6">
          © 2026 Dom w Mesznej
        </div>
        </div>
      </div>
    </footer>
  );
}