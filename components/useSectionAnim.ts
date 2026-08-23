'use client';

import { useEffect, useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useLayoutEffect on the client, useEffect on the server. Lets code that must
 * settle the DOM before first paint do so without React's SSR warning.
 */
export const useIsomorphicEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** Visitors who have not asked the OS to reduce motion. */
export const MOTION = '(prefers-reduced-motion: no-preference)';

/** Same, but only where a pointer-driven scrub is worth its frame cost. */
export const MOTION_DESKTOP =
  '(prefers-reduced-motion: no-preference) and (min-width: 1024px)';

type Builder = (root: HTMLElement) => void | (() => void);

/**
 * Scoped, motion-aware wrapper around gsap.context.
 *
 * Every reveal in this project is a gsap.from()/gsap.set() that starts from a
 * hidden state, so simply *not* building under `prefers-reduced-motion: reduce`
 * leaves the markup in its natural, fully visible state — there is no
 * "jump to the end" bookkeeping to get wrong.
 *
 * `scrub` builds heavy per-frame parallax; pass it separately so it can be
 * confined to large viewports instead of running on phones.
 */
export function useSectionAnim(
  scope: RefObject<HTMLElement | null>,
  build: Builder,
  scrub?: Builder,
) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);
    mm.add(MOTION, () => build(root));
    if (scrub) mm.add(MOTION_DESKTOP, () => scrub(root));

    return () => {
      mm.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Reveal a set of elements as they scroll in. Unlike a per-element trigger with
 * `delay: i * n` (which is dead air, not a stagger, because each element waits
 * out an absolute delay after its own trigger fires), batch staggers only what
 * enters together and fires anything arriving alone immediately.
 */
export function revealBatch(
  targets: string,
  { y = 60, start = 'top 85%', duration = 1, stagger = 0.1, ease = 'power3.out' } = {},
) {
  gsap.set(targets, { opacity: 0, y });
  ScrollTrigger.batch(targets, {
    start,
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, duration, stagger, ease, overwrite: true }),
  });
}
