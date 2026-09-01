'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useSectionAnim } from '@/hooks/useSectionAnim';
import { revealBatch } from '@/utils/motion';
import { gallery } from '@/data/site';

export default function Gallery() {
  const root = useRef<HTMLElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);

  useSectionAnim(
    root,
    () => {
      gsap.from('.gallery-heading > *', {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.gallery-heading', start: 'top 85%' },
      });

      revealBatch('.gallery-item', { start: 'top 88%', duration: 1.2 });
    },
    // Scrubbed image parallax runs a transform write every frame per photo.
    // Confined to large viewports — on a phone it is a jank source, not a
    // detail anyone notices.
    () => {
      gsap.to(backdrop.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

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
    <section ref={root} id="galeria" aria-labelledby="galeria-title" className="relative">
      {/* The heading panel. min-h rather than h: the heading and standfirst wrap
          to several lines on a narrow phone, and a fixed height would push them
          out through the bottom of the photograph. */}
      <div className="relative min-h-screen overflow-hidden flex flex-col justify-end">
        {/* inset-[-5%] gives the parallax somewhere to travel without ever
            exposing an edge of the photograph. */}
        <div ref={backdrop} className="absolute inset-[-5%]">
          <Image
            src={gallery.backdrop.src}
            alt={gallery.backdrop.alt}
            fill
            className="object-cover img-warm"
            sizes="100vw"
          />
        </div>

        {/* Darkening for text legibility — weakest across the middle so the
            house is not flattened, strongest under the type. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(14,14,12,0.45) 0%, rgba(14,14,12,0.1) 28%, rgba(14,14,12,0.45) 60%, rgba(14,14,12,0.85) 90%, rgba(14,14,12,0.92) 100%)',
          }}
        />

        <div className="relative z-10 w-full px-6 md:px-12 pb-16 md:pb-20 text-white">
          <div className="mx-auto max-w-[1880px]">
            <div className="gallery-heading">
              <div className="flex items-center justify-between mb-8 md:mb-12">
                <div className="label-mono opacity-70">{gallery.eyebrow}</div>
                <div className="label-mono opacity-70 hidden md:block">
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
                {/* Set over a darkened photograph, so this takes the on-dark
                    gold; the theme --accent is deliberately dark in light mode
                    and would disappear here. */}
                <span className="inline-block italic text-(--accent-on-dark)">
                  {gallery.headline.accent}
                </span>
              </h2>
              <p className="mt-6 display-serif italic text-2xl md:text-3xl opacity-90 max-w-3xl">
                {gallery.standfirst.lead}{' '}
                <span className="text-(--accent-on-dark)">
                  {gallery.standfirst.accent}
                </span>{' '}
                {gallery.standfirst.tail}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1880px] px-6 md:px-12 py-16 md:py-24 lg:py-32">
        {/* 1.3.1 — equivalent items, so a list: a screen reader announces the
            count and the position ("5 items… item 3 of 5") instead of reading
            five unrelated blocks. */}
        <ul className="grid grid-cols-12 gap-4 md:gap-6">
          {gallery.photos.map((p) => (
            <li key={p.tag} className={`gallery-item ${p.span} flex`}>
              {/* Two photos sharing a grid row each derived their height from
                  their own aspect-ratio, so an 8-col 4/3 finished taller than
                  the 4-col 3/4 beside it. The row already stretches both <li>s
                  to its tallest item; this passes that height down — `grow`
                  rather than `flex-1` so the aspect-ratio still supplies the
                  base height that sets the row in the first place. Single
                  full-width photos, and everything on mobile, are unaffected:
                  nothing to stretch to. */}
              <figure className="flex w-full flex-col">
                <div
                  className="relative overflow-hidden grow"
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
