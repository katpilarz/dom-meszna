'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ShowcaseProps {
  src: string;
  alt: string;
  caption: string;
  headline: React.ReactNode;
  accent?: string;
  position?: 'top' | 'bottom';
}

export default function Showcase({
  src,
  alt,
  caption,
  headline,
  accent,
  position = 'bottom',
}: ShowcaseProps) {
  const root = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || !imgRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.to(imgRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative h-screen overflow-hidden">
      <div ref={imgRef} className="absolute inset-[-5%]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover img-warm"
          sizes="100vw"
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            position === 'bottom'
              ? 'linear-gradient(to bottom, transparent 30%, rgba(14,14,12,0.4) 60%, rgba(14,14,12,0.8) 85%, rgba(14,14,12,0.92) 100%)'
              : 'linear-gradient(to bottom, rgba(14,14,12,0.45) 0%, rgba(14,14,12,0.1) 28%, rgba(14,14,12,0.45) 60%, rgba(14,14,12,0.85) 90%, rgba(14,14,12,0.92) 100%)',
        }}
      />
      <div className="absolute bottom-12 left-0 right-0 px-6 md:px-12 text-white">
        <div className="mx-auto max-w-[1880px]">
          <div className="label-mono opacity-70 mb-3">↳ {caption}</div>
          <div
            className="display-serif"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 7rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
            }}
          >
            {headline}
          </div>
          {accent && (
            <p className="mt-4 display-serif italic text-xl md:text-2xl opacity-80 max-w-2xl">
              {accent}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
