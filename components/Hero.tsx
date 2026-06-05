'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-label', { opacity: 0, y: 20, duration: 1, delay: 0.3 })
        .from('.hero-word', { yPercent: 110, duration: 1.4, stagger: 0.1, ease: 'expo.out' }, '-=0.6')
        .from('.hero-sub', { opacity: 0, y: 20, duration: 1 }, '-=0.8');

      gsap.to('.hero-img-bg', {
        yPercent: 15,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="hero" className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="hero-img-bg absolute inset-[-5%]">
          <Image
            src="/images/house/house-01.jpg"
            alt="Dom w Mesznej — elewacja południowa"
            fill
            priority
            className="object-cover img-warm"
            sizes="100vw"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(14,14,12,0.55) 0%, rgba(14,14,12,0.5) 30%, rgba(14,14,12,0.78) 50%, rgba(14,14,12,0.72) 68%, rgba(14,14,12,0.6) 82%, rgba(14,14,12,0.78) 92%, rgba(14,14,12,0.72) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-end pb-24 text-white">
        <div className="mx-auto max-w-[1880px] w-full px-6 md:px-12">
          <div className="flex items-center justify-start gap-14 mb-12">
            <div className="hero-label label-mono opacity-80">
              <span style={{ color: '#d4a76a' }}>●</span> Sprzedaż bezpośrednia 
            </div>
            <div className="hero-label label-mono opacity-80 hidden md:block">
              Meszna · Wilkowice · Śląskie
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1880px] w-full px-6 md:px-12">
          <h1
            className="display-serif"
            style={{
              fontSize: 'clamp(4rem, 14vw, 16rem)',
              lineHeight: 0.85,
              letterSpacing: '-0.03em',
            }}
          >
            <div className="overflow-hidden">
              <span className="hero-word inline-block">Dom z&nbsp;</span>
              <span
                className="hero-word inline-block italic"
                style={{ color: '#d4a76a' }}
              >
                widokiem
              </span>
            </div>
            <div className="overflow-hidden">
              <span className="hero-word inline-block">na&nbsp;</span>
              <span className="hero-word inline-block italic">Beskidy.</span>
            </div>
          </h1>
        </div>

        <div className="mx-auto max-w-[1880px] w-full px-6 md:px-12">
          <p className="hero-sub display-serif text-2xl md:text-3xl italic opacity-90 max-w-3xl">
            402 m² · 1 600 m² działki · trzy kondygnacje · widok na Beskid Śląski. 300 m do lasu, 600 m do szlaków na Klimczok.
          </p>
        </div>
      </div>
    </section>
  );
}