'use client';

import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { marquee } from '@/data/site';

/**
 * The track is a CSS keyframe, not a GSAP tween, so it never passed through the
 * `prefers-reduced-motion` gate in useSectionAnim — globals.css now stops it for
 * that audience. WCAG 2.2 SC 2.2.2 (Level A) also requires a way to stop motion
 * that runs longer than five seconds for everyone else, which is what the toggle
 * below is for. The button lives outside the aria-hidden subtree: the scrolling
 * text is decorative and repeats content stated elsewhere, but the control that
 * stops it has to be reachable.
 */
export default function Marquee() {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Nothing is moving under reduced motion, so a pause control would be a
  // button that does nothing — hide it rather than offer a dead affordance.

  return (
    // 1.3.6 — not a landmark. As a named <section> this advertised itself as
    // "the most important information about the property" while its entire
    // contents were aria-hidden, so a visitor who navigated to it found one
    // pause button. The text is decorative and repeats the stats section; the
    // button stays exactly where it was, outside the hidden subtree.
    <div className="relative py-8 border-y border-(--line) overflow-hidden no-select bg-(--bg-alt)">
      <div
        className="marquee-track flex whitespace-nowrap"
        data-paused={paused ? 'true' : 'false'}
        aria-hidden="true"
      >
        {[...marquee.items, ...marquee.items, ...marquee.items].map((item, i) => (
          <span
            key={i}
            className="display-serif text-3xl md:text-5xl italic px-8 opacity-90"
          >
            {item}
            <span className="text-(--accent) mx-8 not-italic">✦</span>
          </span>
        ))}
      </div>

      {!reduced && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? marquee.resumeLabel : marquee.pauseLabel}
          className="absolute right-3 bottom-3 w-11 h-11 rounded-xs flex items-center justify-center border border-(--line-strong) bg-(--bg) transition-colors hover:bg-(--bg-alt)"
        >
          {paused ? (
            <Play size={16} strokeWidth={1.4} aria-hidden="true" />
          ) : (
            <Pause size={16} strokeWidth={1.4} aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}
