'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useSectionAnim } from '@/hooks/useSectionAnim';
import { location, site } from '@/data/site';

// drawSVG below is a DrawSVGPlugin property — without this registration GSAP
// logs "Invalid property drawSVG… Missing plugin?" and silently skips the tween.
gsap.registerPlugin(DrawSVGPlugin);

export default function Location() {
  const root = useRef<HTMLElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);

  useSectionAnim(
    root,
    () => {
    gsap.from('.location-heading > *', {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 1,
      scrollTrigger: { trigger: '.location-heading', start: 'top 85%' },
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
      duration: 1.4,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: '.map-illustration', start: 'top 70%' },
    });
    },
    // Scrubbed parallax on the backdrop — a per-frame transform, so it is
    // confined to large viewports the way the gallery panel's is.
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
    },
  );

  return (
    <section
      id="lokalizacja"
      ref={root}
      aria-labelledby="lokalizacja-title"
      className="relative"
    >
      {/* Same device as the gallery opener: the section's own heading set at the
          foot of its photograph rather than above it. min-h so the intro, which
          runs to several lines on a phone, can push the panel taller instead of
          spilling out of the bottom of the image. */}
      <div className="relative min-h-screen overflow-hidden flex flex-col justify-end">
        {/* inset-[-5%] gives the parallax somewhere to travel without ever
            exposing an edge of the photograph. */}
        <div ref={backdrop} className="absolute inset-[-5%]">
          <Image
            src={location.banner.src}
            alt={location.banner.alt}
            fill
            className="object-cover img-warm"
            sizes="100vw"
          />
        </div>

        {/* Darkening for text legibility, and nothing more. The sky is left
            completely clear — the ramp only starts below the cloud line and is
            at full strength by the time the eyebrow appears, so the scrim pays
            for itself in contrast instead of flattening the photograph. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, transparent 36%, rgba(14,14,12,0.62) 48%, rgba(14,14,12,0.85) 64%, rgba(14,14,12,0.92) 82%, rgba(14,14,12,0.95) 100%)',
          }}
        />

        <div className="relative z-10 w-full px-6 md:px-12 pb-16 md:pb-20 text-white">
          <div className="mx-auto max-w-[1880px]">
            <div className="location-heading">
              <div className="flex items-center justify-between mb-8 md:mb-12">
                <div className="label-mono opacity-80">{location.eyebrow}</div>
                <div className="label-mono opacity-80 hidden md:block">
                  {site.geo.label}
                </div>
              </div>
              {/* 1.4.12 Text Spacing — ordinary spaces only. "prawdziwi&nbsp;miłośnicy"
                  was one unbreakable 19-character run and pushed this heading 55 px
                  past a 375 px viewport under a spacing stylesheet. */}
              <h2
                id="lokalizacja-title"
                className="display-serif text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] max-w-5xl"
              >
                {location.headline.lead}
                <br />
                {location.headline.mid}{' '}
                {/* Set over a darkened photograph, so this takes the on-dark
                    gold; the theme --accent is deliberately dark in light mode
                    and would disappear here. */}
                <span className="italic text-(--accent-on-dark)">
                  {location.headline.accent}
                </span>
              </h2>
              {/* Kept at reading size rather than the gallery standfirst's
                  text-2xl: that one is a single line, this is four sentences and
                  would take most of a phone screen set that large. */}
              <p className="mt-6 max-w-3xl text-lg md:text-xl opacity-85 leading-relaxed">
                {location.intro}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-(--bg) mx-auto max-w-[1880px] px-6 md:px-10 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 lg:col-span-7">
            {/* Map illustration */}
            <div className="map-illustration relative rounded-xs border border-(--line-strong) aspect-video bg-(--bg) overflow-hidden">
              <svg
                viewBox="0 0 800 450"
                className="absolute inset-0 w-full h-full"
                aria-hidden="true"
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

                {/* Centre pin — the house itself */}
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
                    {location.map.centreLabel}
                  </text>
                </g>

                {/* Other pins */}
                {location.map.pins.map((p) => (
                  <g
                    key={p.label}
                    className="map-pin"
                    transform={`translate(${p.x}, ${p.y})`}
                  >
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
                {location.map.caption}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 lg:pl-10">
            <h3 className="label-mono opacity-60 mb-4">{location.nearbyLabel}</h3>
            {/* 1.3.1 — twelve destinations numbered 01…12 on screen: an ordered
                list, so the numbering and the count come from the element
                rather than from a hand-formatted string. */}
            <ol className="nearby-list">
              {location.nearby.map((item, i) => (
                <li
                  key={item.name}
                  className="nearby-row flex items-center justify-between py-5 border-b border-(--line) group"
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      className="label-mono text-(--fg-muted) text-[0.65rem]"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <div className="display-serif text-xl group-hover:text-(--accent) transition-colors">
                        {item.name}
                      </div>
                      <div className="text-xs text-(--fg-muted) mt-1">{item.type}</div>
                    </div>
                  </div>
                  <div className="label-mono text-(--accent)">{item.distance}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
