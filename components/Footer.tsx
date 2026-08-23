'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useSectionAnim } from './useSectionAnim';
import ConsentLink from './consent/ConsentLink';

export default function Footer() {
  const ref = useRef<HTMLElement>(null);

  useSectionAnim(ref, (el) => {
    gsap.from('.footer-mega', {
      yPercent: 30,
      opacity: 0,
      duration: 1.5,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 80%' },
    });
  });

  return (
    <footer
      ref={ref}
      className="pt-32 pb-12 border-t border-(--line) relative overflow-hidden"
    >
      <div className="mx-auto max-w-[1880px] px-6 md:px-10">
        <div className="flex footer-mega display-serif text-[clamp(4rem,14vw,14rem)] justify-between tracking-tight overflow-hidden">
          <span className="italic leading-[0.85]">Dom Meszna · Beskidy</span>
        </div>
          <div className='flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mt-24'>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <a
                href="/polityka-prywatnosci"
                className="text-sm hover:text-(--accent) inline-block transition-colors"
              >
                Polityka prywatności · RODO
              </a>
              <ConsentLink />
            </div>
          <p className="opacity-50 text-sm">
            © 2026 Wszelkie prawa zastrzeżone
          </p>
        </div>
      </div>
    </footer>
  );
}