'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const photos = [
  { src: '/images/house/house-05.jpg', label: 'Elewacja południowa', tag: '01', span: 'col-span-12 md:col-span-8', aspect: '4/3' },
  { src: '/images/house/house-07.jpg', label: 'Kolumny i kamień', tag: '02', span: 'col-span-12 md:col-span-4', aspect: '3/4' },
  { src: '/images/house/house-02.jpg', label: 'Panorama od strony drogi', tag: '05', span: 'col-span-12', aspect: '16/9' },
];

export default function Gallery() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from('.gallery-heading > *', {
        opacity: 0, y: 50, stagger: 0.1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.gallery-heading', start: 'top 80%' },
      });

      gsap.utils.toArray<HTMLElement>('.gallery-item').forEach((item) => {
        gsap.from(item, {
          opacity: 0, y: 60, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 88%' },
        });
        const img = item.querySelector('img');
        if (img) {
          gsap.from(img, {
            scale: 1.15, ease: 'none',
            scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: 1 },
          });
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="galeria" className="py-32 md:py-48 relative">
      <div className="mx-auto max-w-[1880px] px-6 md:px-12">
        <div className="gallery-heading mb-20">
          <div className="flex items-center justify-between mb-12">
            <div className="label-mono opacity-60">03 — Galeria</div>
            <div className="label-mono opacity-60 hidden md:block">Zdjęcia: luty 2024</div>
          </div>
          <h2 className="display-serif" style={{ fontSize: 'clamp(2.5rem, 9vw, 9rem)', lineHeight: 0.85, letterSpacing: '-0.03em' }}>
            <span className="inline-block">Architektura</span>&nbsp;
            <br />
            <span className="inline-block">wpisana w</span>&nbsp;
            <span className="inline-block italic text-[var(--accent)]">krajobraz.</span>
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {photos.map((p) => (
            <figure key={p.tag} className={`gallery-item ${p.span}`}>
              <div className="relative overflow-hidden" style={{ aspectRatio: p.aspect }}>
                <Image
                  src={p.src}
                  alt={p.label}
                  fill
                  className="object-cover img-warm"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between">
                <div className="display-serif text-xl italic">{p.label}</div>
                <div className="label-mono opacity-50">{p.tag} / {String(photos.length).padStart(2, '0')}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
