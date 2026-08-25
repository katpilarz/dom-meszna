'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useSectionAnim } from '@/hooks/useSectionAnim';
import { onIntroOpen } from '@/utils/introGate';
import { hero } from '@/data/site';

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useSectionAnim(root, (el) => {
    // paused — the .from() tweens still render their start state on creation,
    // so the hero stays masked until we decide to run the timeline.
    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' },
    });
    tl.from('.hero-label', { opacity: 0, y: 20, duration: 1, delay: 0.3 })
      .from(
        '.hero-word',
        { yPercent: 110, duration: 1.4, stagger: 0.1, ease: 'expo.out' },
        '-=0.6',
      )
      .from('.hero-sub', { opacity: 0, y: 20, duration: 1 }, '-=0.8');

    gsap.to('.hero-img-bg', {
      yPercent: 15,
      scale: 1.05,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Two gates, both of which must be open before the entrance is worth
    // spending: the preloader curtain has to be lifting (otherwise the whole
    // animation plays behind it), and the tab has to be on screen —
    // requestAnimationFrame is suspended while hidden, so a timeline started in
    // a background tab never really plays; GSAP catches up on the first frame
    // after focus and the hero snaps in fully formed.
    let offVisible: (() => void) | undefined;

    const start = () => {
      if (document.visibilityState === 'visible') {
        tl.play(0);
        return;
      }
      const onVisible = () => {
        if (document.visibilityState !== 'visible') return;
        offVisible?.();
        tl.play(0);
      };
      document.addEventListener('visibilitychange', onVisible);
      offVisible = () => {
        document.removeEventListener('visibilitychange', onVisible);
        offVisible = undefined;
      };
    };

    const offIntro = onIntroOpen(start);

    return () => {
      offIntro();
      offVisible?.();
    };
  });

  return (
    <section
      aria-labelledby="hero-title"
      ref={root}
      id="hero"
      className="relative min-h-screen overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <div className="hero-img-bg absolute inset-0">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            priority
            className="object-cover img-warm"
            sizes="100vw"
          />
        </div>

        {/* Warm color cast — light warm tone with multiply
            tints the photo without darkening (white = no effect, only color shift). */}
        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(255, 220, 180, 1)',
            mixBlendMode: 'multiply',
          }}
        />

        {/* Darkening for text legibility — gradient on top, stronger at bottom. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.67) 85%, rgba(0,0,0,0.77) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-end pb-24 text-white">
        <div className="mx-auto max-w-[1880px] w-full px-6 md:px-12">
          <div className="flex items-center justify-start gap-14 mb-4 lg:mb-12">
            <div className="hero-label label-mono opacity-80">
              <span className="text-(--accent-on-dark)">●</span> {hero.labelPrimary}
            </div>
            <div className="hero-label label-mono opacity-80 hidden md:block">
              {hero.labelSecondary}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1880px] w-full px-6 md:px-12">
          <h1
            id="hero-title"
            className="display-serif"
            style={{
              fontSize: 'clamp(4rem, 14vw, 16rem)',
              lineHeight: 0.85,
              letterSpacing: '-0.03em',
            }}
          >
            {hero.headline.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                {line.map((part, j) => (
                  <span
                    key={j}
                    className={`hero-word inline-block${part.italic ? ' italic' : ''}`}
                  >
                    {part.text.endsWith(' ') ? (
                      <>
                        {part.text.trimEnd()}
                        &nbsp;
                      </>
                    ) : (
                      part.text
                    )}
                  </span>
                ))}
              </span>
            ))}
          </h1>
        </div>

        <div className="mx-auto max-w-[1880px] w-full px-6 md:px-12">
          <p className="hero-sub display-serif text-2xl md:text-3xl italic opacity-90 max-w-3xl">
            {hero.sub}
          </p>
        </div>
      </div>
    </section>
  );
}
