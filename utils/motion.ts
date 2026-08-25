'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Visitors who have not asked the OS to reduce motion. */
export const MOTION = '(prefers-reduced-motion: no-preference)';

/** Same, but only where a pointer-driven scrub is worth its frame cost. */
export const MOTION_DESKTOP =
  '(prefers-reduced-motion: no-preference) and (min-width: 1024px)';

/**
 * Reveal a set of elements as they scroll in. Unlike a per-element trigger with
 * `delay: i * n` (which is dead air, not a stagger, because each element waits
 * out an absolute delay after its own trigger fires), batch staggers only what
 * enters together and fires anything arriving alone immediately.
 */
export function revealBatch(
  targets: string,
  {
    y = 60,
    start = 'top 85%',
    duration = 1,
    stagger = 0.1,
    ease = 'power3.out',
  } = {},
) {
  gsap.set(targets, { opacity: 0, y });
  ScrollTrigger.batch(targets, {
    start,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        ease,
        overwrite: true,
      }),
  });
}
