'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const nearby = [
  { name: 'Las', distance: '300 m', type: 'Bezpośrednie sąsiedztwo' },
  { name: 'Chata na Groniu', distance: '600 m', type: 'Schronisko górskie' },
  { name: 'Szlak na Klimczok', distance: '600 m', type: 'Szlaki górskie' },
  { name: 'Bielsko-Biała', distance: '10 km', type: 'Miasto' },
  { name: 'Szczyrk', distance: '7 km', type: 'Kurort narciarski' },
  { name: 'Obwodnica S52', distance: '4 km', type: 'Komunikacja' },
  { name: 'Szczyrk Mountain Resort', distance: '8 km', type: 'Narty' },
  { name: 'Skocznia Skalite', distance: '7 km', type: 'Atrakcja' },
  { name: 'Aquapark Aries', distance: '7 km', type: 'Rekreacja' },
  { name: 'Jezioro Międzybrodzkie', distance: '15 km', type: 'Natura' },
  { name: 'Wisła / Ustroń', distance: '25 km', type: 'Kurort' },
];

export default function Location() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from('.location-heading > *', {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 1,
        scrollTrigger: { trigger: '.location-heading', start: 'top 80%' },
      });

      gsap.from('.location-img', {
        clipPath: 'inset(0 0 100% 0)',
        duration: 1.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.location-img', start: 'top 80%' },
      });

      gsap.from('.nearby-row', {
        opacity: 0,
        x: -30,
        stagger: 0.07,
        duration: 0.7,
        scrollTrigger: { trigger: '.nearby-list', start: 'top 80%' },
      });

      // Animate the SVG location markers
      gsap.from('.map-pin', {
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'back.out(2)',
        transformOrigin: 'center',
        scrollTrigger: { trigger: '.map-illustration', start: 'top 70%' },
      });

      gsap.from('.map-line', {
        drawSVG: 0,
        scrollTrigger: { trigger: '.map-illustration', start: 'top 70%' },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="lokalizacja"
      ref={root}
      className="py-32 md:py-48 bg-[var(--bg-alt)] relative"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="location-heading mb-20">
          <div className="flex items-center justify-between mb-12">
            <div className="label-mono opacity-60">07 — Lokalizacja</div>
            <div className="label-mono opacity-60 hidden md:block">
              49°48′N · 19°02′E
            </div>
          </div>
          <h2 className="display-serif text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] max-w-5xl">
            Adres, który&nbsp;
            <span className="italic text-[var(--accent)]">znają</span>&nbsp;
            tylko miłośnicy gór.
          </h2>
          <p className="mt-8 max-w-2xl text-lg opacity-75 leading-relaxed">
            300 metrów do lasu. 600 metrów do Chaty na Groniu i szlaków
            górskich na Klimczok. Meszna leży na pograniczu Beskidu
            Śląskiego i Małego — z dala od zgiełku, ale w zasięgu
            najlepszych atrakcji Podbeskidzia: Szczyrk, Ustroń, Wisła.
            Niezliczone szlaki górskie i trasy rowerowe zaczynają się
            za rogiem.
          </p>
        </div>

        {/* Beskidy landscape banner */}
        <div className="location-banner mb-12 md:mb-20 relative overflow-hidden border border-[var(--line-strong)]">
          <div className="relative" style={{ aspectRatio: '21/9' }}>
            <Image
              src="/images/landscape/beskidy.jpg"
              alt="Beskid Śląski — krajobraz w okolicy"
              fill
              className="object-cover img-warm"
              sizes="100vw"
            />
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white"
            style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.55) 100%)' }}
          >
            <div className="flex items-end justify-between gap-4">
              <div className="label-mono text-xs md:text-sm opacity-90">↳ Beskid Śląski — krajobraz w sąsiedztwie</div>
              <div className="label-mono text-[0.6rem] md:text-xs opacity-70 hidden sm:block">Klimczok · Skrzyczne · Magurka</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 lg:col-span-7">
            {/* Map illustration */}
            <div className="map-illustration relative border border-[var(--line-strong)] aspect-[16/9] bg-[var(--bg)] overflow-hidden">
              <svg
                viewBox="0 0 800 450"
                className="absolute inset-0 w-full h-full"
              >
                {/* Decorative grid */}
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.3"
                      opacity="0.15"
                    />
                  </pattern>
                </defs>
                <rect width="800" height="450" fill="url(#grid)" />

                {/* Mountains silhouette */}
                <path
                  d="M0 280 L80 220 L160 250 L240 180 L320 210 L400 140 L480 190 L560 160 L640 200 L720 170 L800 220 L800 450 L0 450 Z"
                  fill="currentColor"
                  opacity="0.08"
                />
                <path
                  d="M0 320 L100 270 L200 300 L320 250 L420 280 L520 240 L640 270 L740 250 L800 280 L800 450 L0 450 Z"
                  fill="currentColor"
                  opacity="0.12"
                />

                {/* Road */}
                <path
                  className="map-line"
                  d="M50 380 Q200 350, 360 320 T720 250"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.4"
                />

                {/* Center pin - Villa */}
                <g className="map-pin" transform="translate(360, 320)">
                  <circle r="20" fill="var(--accent)" opacity="0.2" />
                  <circle r="10" fill="var(--accent)" opacity="0.4" />
                  <circle r="4" fill="var(--accent)" />
                  <text
                    x="0"
                    y="-30"
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="11"
                    fontFamily="var(--font-mono)"
                    letterSpacing="0.15em"
                  >
                    VILLA MESZNA
                  </text>
                </g>

                {/* Other pins */}
                {[
                  { x: 200, y: 350, label: 'BIELSKO-BIAŁA' },
                  { x: 520, y: 280, label: 'SZCZYRK' },
                  { x: 640, y: 200, label: 'WISŁA' },
                  { x: 720, y: 250, label: 'USTROŃ' },
                ].map((p) => (
                  <g key={p.label} className="map-pin" transform={`translate(${p.x}, ${p.y})`}>
                    <circle r="3" fill="currentColor" opacity="0.6" />
                    <text
                      x="6"
                      y="3"
                      fill="currentColor"
                      fontSize="9"
                      fontFamily="var(--font-mono)"
                      letterSpacing="0.1em"
                      opacity="0.6"
                    >
                      {p.label}
                    </text>
                  </g>
                ))}
              </svg>
              <div className="absolute bottom-4 left-4 label-mono opacity-60">
                Schemat poglądowy · Podbeskidzie
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 lg:pl-10">
            <div className="label-mono opacity-60 mb-4">↳ W zasięgu ręki</div>
            <div className="nearby-list">
              {nearby.map((item, i) => (
                <div
                  key={item.name}
                  className="nearby-row flex items-center justify-between py-5 border-b border-[var(--line)] group"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="label-mono opacity-40 text-[0.65rem]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <div className="display-serif text-xl group-hover:text-[var(--accent)] transition-colors">
                        {item.name}
                      </div>
                      <div className="text-xs opacity-50 mt-1">
                        {item.type}
                      </div>
                    </div>
                  </div>
                  <div className="label-mono text-[var(--accent)]">
                    {item.distance}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
