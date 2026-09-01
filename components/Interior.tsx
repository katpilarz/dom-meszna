'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useSectionAnim } from '@/hooks/useSectionAnim';
import { revealBatch } from '@/utils/motion';
import { interior } from '@/data/site';

export default function Interior() {
  const root = useRef<HTMLElement>(null);

  useSectionAnim(
    root,
    () => {
      gsap.from('.interior-heading > *', {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.interior-heading', start: 'top 80%' },
      });

      revealBatch('.interior-item', { start: 'top 88%', duration: 1.2 });
    },
    // Scrubbed image parallax runs a transform write every frame per photo.
    // Confined to large viewports — on a phone it is a jank source, not a
    // detail anyone notices.
    () => {
      gsap.utils.toArray<HTMLElement>('.interior-item').forEach((item) => {
        const img = item.querySelector('img');
        if (!img) return;
        gsap.from(img, {
          scale: 1.15,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    },
  );

  return (
    <section
      aria-labelledby="wnetrza-title"
      ref={root}
      id="wnetrza"
      className="py-16 md:py-32 lg:py-48 relative bg-(--bg-alt)"
    >
      <div className="mx-auto max-w-[1880px] px-6 md:px-12">
        <div className="interior-heading mb-20">
          <div className="flex items-center justify-between mb-12">
            <div className="label-mono opacity-60">{interior.eyebrow}</div>
            <div className="label-mono opacity-60 hidden md:block">
              {interior.eyebrowAside}
            </div>
          </div>
          <h2
            id="wnetrza-title"
            className="display-serif"
            style={{
              fontSize: 'clamp(2.5rem, 9vw, 9rem)',
              lineHeight: 0.85,
              letterSpacing: '-0.03em',
            }}
          >
            <span className="inline-block">{interior.headline.lead}</span>{' '}
            <span className="inline-block italic">{interior.headline.leadItalic}</span>
            <br />
            <span className="inline-block">{interior.headline.mid}</span>{' '}
            <span className="inline-block italic text-(--accent)">
              {interior.headline.accent}
            </span>
          </h2>
          <p
            className="mt-12 max-w-3xl text-xl md:text-2xl opacity-80 leading-relaxed"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontWeight: 300,
            }}
          >
            {interior.intro}
          </p>
        </div>

        {/* 1.3.1 — fifteen equivalent items; see Gallery.tsx. */}
        <ul className="grid grid-cols-12 gap-4 md:gap-6">
          {interior.photos.map((p, i) => (
            <li key={p.src} className={`interior-item ${p.span}`}>
              <figure>
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: p.aspect }}
                >
                  {/* 1.1.1 — alt describes, caption names. */}
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    className="object-cover img-warm"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <figcaption className="mt-3 flex items-baseline justify-between">
                  <span className="display-serif text-xl italic">{p.label}</span>
                  <span className="label-mono text-(--fg-muted)" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')} /{' '}
                    {String(interior.photos.length).padStart(2, '0')}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
