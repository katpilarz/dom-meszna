'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useIsomorphicEffect } from './useSectionAnim';
import { openIntroGate } from './introGate';

/** Never hold the curtain longer than this, whatever is still in flight. */
const HARD_TIMEOUT_MS = 5000;
/** Below this the panel reads as a flash of colour rather than an intro. */
const MIN_VISIBLE_MS = 900;
const SEEN_KEY = 'dm:intro-seen';

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useIsomorphicEffect(() => {
    const el = root.current;
    if (!el) return;

    // JS is alive, so drop the CSS-only failsafe fade and drive the panel here.
    el.classList.remove('preloader--failsafe');

    const finish = () => {
      openIntroGate();
      el.style.display = 'none';
    };

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      // Private mode / storage disabled — treat as a first visit.
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Repeat visit in this tab, or the visitor asked for less motion: the
    // curtain is decoration, so skip straight to the page.
    if (seen || reduced) {
      finish();
      return;
    }
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* nothing to do */
    }

    const bar = el.querySelector<HTMLElement>('.preloader-bar-fill');
    const pct = el.querySelector<HTMLElement>('.preloader-pct');
    const startedAt = performance.now();

    // Real work, not a fake timer: the hero photo is the thing worth waiting
    // for, fonts decide whether the headline reflows, and window load catches
    // whatever else the browser still considers pending.
    const settled = (p: Promise<unknown>) => p.then(() => void 0, () => void 0);
    const heroImg = document.querySelector<HTMLImageElement>('#hero img');

    const jobs: Promise<void>[] = [
      settled(document.fonts ? document.fonts.ready : Promise.resolve()),
      settled(
        heroImg && !heroImg.complete
          ? new Promise<void>((res) => {
              heroImg.addEventListener('load', () => res(), { once: true });
              heroImg.addEventListener('error', () => res(), { once: true });
            })
          : Promise.resolve(),
      ),
      settled(
        document.readyState === 'complete'
          ? Promise.resolve()
          : new Promise<void>((res) => {
              window.addEventListener('load', () => res(), { once: true });
            }),
      ),
    ];

    // `shown` trails the true ratio so the bar eases instead of jumping.
    const state = { shown: 0 };
    let ratio = 0;
    let doneCount = 0;

    const paint = () => {
      if (bar) bar.style.transform = `scaleX(${state.shown})`;
      if (pct) pct.textContent = String(Math.round(state.shown * 100)).padStart(3, '0');
    };
    paint();

    // Ease toward the real ratio every frame, never past it, never backwards.
    // Three jobs means three discrete steps; the follow is what makes them
    // read as a bar filling rather than a bar snapping.
    const creep = () => {
      const next = state.shown + (ratio - state.shown) * 0.08;
      if (Math.abs(next - state.shown) < 0.0005) return;
      state.shown = next;
      paint();
    };
    gsap.ticker.add(creep);

    jobs.forEach((job) => {
      void job.then(() => {
        doneCount += 1;
        ratio = doneCount / jobs.length;
      });
    });

    let exited = false;
    const exit = () => {
      if (exited) return;
      exited = true;
      gsap.ticker.remove(creep);
      clearTimeout(timer);

      const held = performance.now() - startedAt;
      const tl = gsap.timeline({
        delay: Math.max(0, MIN_VISIBLE_MS - held) / 1000,
        onComplete: finish,
      });

      // Fill to a true 100 before lifting — a curtain that rises on 87% reads
      // as a bug, not a transition.
      tl.to(state, {
        shown: 1,
        duration: 0.45,
        ease: 'power2.out',
        onUpdate: paint,
      })
        .to('.preloader-inner', { opacity: 0, y: -12, duration: 0.4, ease: 'power2.in' }, '-=0.1')
        // The hero is underneath; open the latch as the panel starts to lift so
        // the two movements read as one.
        .to(el, {
          yPercent: -100,
          duration: 1.1,
          ease: 'expo.inOut',
          onStart: openIntroGate,
        }, '-=0.15');
    };

    Promise.all(jobs).then(exit);
    const timer = setTimeout(exit, HARD_TIMEOUT_MS);

    return () => {
      gsap.ticker.remove(creep);
      clearTimeout(timer);
      // Unmounting with the gate shut would strand the hero at opacity 0.
      openIntroGate();
    };
  }, []);

  return (
    <div
      ref={root}
      // Decoration only: the real page is in the DOM underneath, so crawlers
      // and screen readers should walk straight past this.
      aria-hidden="true"
      role="presentation"
      className="preloader preloader--failsafe fixed inset-0 z-100 flex items-center justify-center bg-(--bg)"
    >
      <div className="preloader-inner flex flex-col items-center gap-8 px-6">
        <svg width="44" height="44" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M16 2 L28 14 L28 30 L4 30 L4 14 Z"
            stroke="var(--accent)"
            strokeWidth="1"
            fill="none"
          />
          <path d="M16 2 L16 30" stroke="var(--accent)" strokeWidth="0.5" />
          <circle cx="16" cy="20" r="1.5" fill="var(--accent)" />
        </svg>

        <div className="flex flex-col items-center gap-3">
          <div className="preloader-word text-3xl md:text-4xl text-center">
            Dom w Mesznej
          </div>
          <div className="preloader-caption opacity-45 text-center">
            Meszna · Beskid Śląski
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="preloader-bar relative h-px w-44 md:w-64 overflow-hidden bg-(--line-strong)">
            <div className="preloader-bar-fill absolute inset-0 origin-left bg-(--accent)" />
          </div>
          <div className="preloader-pct opacity-50">000</div>
        </div>
      </div>
    </div>
  );
}
