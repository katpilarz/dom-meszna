'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useSectionAnim } from '@/hooks/useSectionAnim';
import { revealBatch } from '@/utils/motion';
import { gallery } from '@/data/site';

export default function Gallery() {
  const root = useRef<HTMLElement>(null);

  useSectionAnim(
    root,
    () => {
      gsap.from('.gallery-heading > *', {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.gallery-heading', start: 'top 80%' },
      });

      revealBatch('.gallery-item', { start: 'top 88%', duration: 1.2 });
    },
    // Scrubbed image parallax runs a transform write every frame per photo.
    // Confined to large viewports — on a phone it is a jank source, not a
    // detail anyone notices.
    () => {
      gsap.utils.toArray<HTMLElement>('.gallery-item').forEach((item) => {
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
      ref={root}
      id="galeria"
      aria-labelledby="galeria-title"
      className="py-32 md:py-48 relative"
    >
      <div className="mx-auto max-w-[1880px] px-6 md:px-12">
        <div className="gallery-heading mb-20">
          <div className="flex items-center justify-between mb-12">
            <div className="label-mono opacity-60">{gallery.eyebrow}</div>
            <div className="label-mono opacity-60 hidden md:block">
              {gallery.eyebrowAside}
            </div>
          </div>
          <h2
            id="galeria-title"
            className="display-serif"
            style={{
              fontSize: 'clamp(2.5rem, 9vw, 9rem)',
              lineHeight: 0.85,
              letterSpacing: '-0.03em',
            }}
          >
            <span className="inline-block">{gallery.headline.lead}</span>{' '}
            <br />
            <span className="inline-block">{gallery.headline.mid}</span>{' '}
            <span className="inline-block italic text-(--accent)">
              {gallery.headline.accent}
            </span>
          </h2>
        </div>

        {/* 1.3.1 — six equivalent items, so a list: a screen reader announces
            the count and the position ("6 items… item 3 of 6") instead of
            reading six unrelated blocks. */}
        <ul className="grid grid-cols-12 gap-4 md:gap-6">
          {gallery.photos.map((p) => (
            <li key={p.tag} className={`gallery-item ${p.span}`}>
              <figure>
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: p.aspect }}
                >
                  {/* 1.1.1 — alt describes the photograph; the caption below
                      names it. Repeating the caption here had every figure
                      announced twice. */}
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
                  {/* The list already carries position and count. */}
                  <span className="label-mono text-(--fg-muted)" aria-hidden="true">
                    {p.tag} / {String(gallery.photos.length).padStart(2, '0')}
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
