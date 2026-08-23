'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useSectionAnim, revealBatch } from './useSectionAnim';

const interiors = [
  // Strefa dzienna — parter
  { src: '/images/interior/interior-30.jpg', label: 'Strefa wypoczynkowa', span: 'col-span-12', aspect: '16/9' },
  { src: '/images/interior/interior-42.jpg', label: 'Otwarta strefa dzienna z kominkiem', span: 'col-span-12 md:col-span-6', aspect: '4/3' },
  { src: '/images/interior/interior-31.jpg', label: 'Salon z kominkiem', span: 'col-span-12 md:col-span-6', aspect: '4/3' },
  { src: '/images/interior/interior-07.jpg', label: 'Otwarta kuchnia', span: 'col-span-12 md:col-span-6', aspect: '4/3' },
  { src: '/images/interior/interior-41.jpg', label: 'Kominek z bliska', span: 'col-span-12 md:col-span-6', aspect: '4/3' },
  { src: '/images/interior/interior-46.jpg', label: 'Strefa wypoczynkowa dzienna', span: 'col-span-12', aspect: '16/9' },
  { src: '/images/interior/interior-47.jpg', label: 'Jadalnia', span: 'col-span-12 md:col-span-6', aspect: '4/3' },
  { src: '/images/interior/interior-48.jpg', label: 'Otwarty salon', span: 'col-span-12 md:col-span-6', aspect: '4/3' },

  //Poddasze
  { src: '/images/interior/interior-51.jpg', label: 'Główna sypialnia', span: 'col-span-12', aspect: '16/9' },
  { src: '/images/interior/interior-17.jpg', label: 'Pokój dziecięcy', span: 'col-span-12 md:col-span-6', aspect: '4/3' },
  { src: '/images/interior/interior-18.jpg', label: 'Pokój dziecięcy', span: 'col-span-12 md:col-span-6', aspect: '4/3' },
  { src: '/images/interior/interior-24.jpg', label: 'Pokój nastolatki', span: 'col-span-12', aspect: '16/9' },
  { src: '/images/interior/interior-27.jpg', label: 'Łazienka główna', span: 'col-span-12 md:col-span-6', aspect: '4/3' },
  { src: '/images/interior/interior-28.jpg', label: 'Łazienka główna', span: 'col-span-12 md:col-span-6', aspect: '4/3' },
    { src: '/images/interior/interior-29.jpg', label: 'Łazienka główna', span: 'col-span-12', aspect: '16/9' },

];

export default function Interior() {
  const root = useRef<HTMLElement>(null);

  useSectionAnim(
    root,
    () => {
      gsap.from('.interior-heading > *', {
        opacity: 0, y: 50, stagger: 0.1, duration: 1, ease: 'power3.out',
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
          scale: 1.15, ease: 'none',
          scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      });
    },
  );

  return (
    <section ref={root} id="wnetrza" className="py-32 md:py-48 relative bg-(--bg-alt)">
      <div className="mx-auto max-w-[1880px] px-6 md:px-12">
        <div className="interior-heading mb-20">
          <div className="flex items-center justify-between mb-12">
            <div className="label-mono opacity-60">06 — Wnętrza</div>
            <div className="label-mono opacity-60 hidden md:block">Stan obecny · do odświeżenia</div>
          </div>
          <h2 className="display-serif" style={{ fontSize: 'clamp(2.5rem, 9vw, 9rem)', lineHeight: 0.85, letterSpacing: '-0.03em' }}>
            <span className="inline-block">Wnętrza,</span>&nbsp;<span className="inline-block italic">które</span>
            <br />
            <span className="inline-block">żyły</span>&nbsp;<span className="inline-block italic text-(--accent)">codziennością.</span>
          </h2>
          <p className="mt-12 max-w-3xl text-xl md:text-2xl opacity-80 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300 }}>
            Salon z kominkiem, otwarta kuchnia, sypialnia z łukowym oknem na poddaszu, łazienka z wanną z hydromasażem, domowe biuro i widok na las z okien dachowych. Zdjęcia pokazują dom takim, jakim jest dziś — z charakterem, ale też z miejscem na Twoją wizję.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {interiors.map((p, i) => (
            <figure key={p.src} className={`interior-item ${p.span}`}>
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
                <div className="label-mono opacity-50">
                  {String(i + 1).padStart(2, '0')} / {String(interiors.length).padStart(2, '0')}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
