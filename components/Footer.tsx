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
        <div className="flex footer-mega display-serif text-[clamp(4rem,14vw,14rem)] justify-between tracking-tight overflow-hidden">
          <span className="italic leading-[0.85]">Dom Meszna · Beskidy</span>
        </div>
          <div className='flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mt-[6rem]'>
            <a
              href="/polityka-prywatnosci"
              className="text-sm hover:text-[var(--accent)] inline-block transition-colors"
            >
              Polityka prywatności · RODO
            </a>
          <p className="opacity-50 text-sm">
            © 2026 Wszelkie prawa zastrzeżone
          </p>
        </div>
      </div>
    </footer>
  );
}