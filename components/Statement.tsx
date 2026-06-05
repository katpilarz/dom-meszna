'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const text =
  '402 metry kwadratowe. 1 600 metrów działki. Trzy kondygnacje. Solidny dom z 2018 roku, w pełni mieszkalny, w dobrym stanie. Z perspektywą remontu, który pozwoli dostosować go pod siebie.';

export default function Statement() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.stmt-word',
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.03,
          ease: 'none',
          scrollTrigger: {
            trigger: '.statement-text',
            start: 'top 75%',
            end: 'bottom 60%',
            scrub: 1,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="py-32 md:py-48 relative">
      <div className="mx-auto max-w-[1880px] px-6 md:px-12">
        <div className="flex items-center justify-between mb-20">
          <div className="label-mono opacity-60">02 — Charakter miejsca</div>
          <div className="label-mono opacity-60 hidden md:block">Meszna · Podbeskidzie</div>
        </div>

        <h2
          className="statement-text display-serif"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 6rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            maxWidth: '1400px',
          }}
        >
          {text.split(' ').map((word, i) => (
            <span key={i} className="stmt-word inline-block" style={{ marginRight: '0.18em' }}>
              {word}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
