'use client';

import { useEffect, useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { MOTION, MOTION_DESKTOP } from '@/utils/motion';

/**
 * useLayoutEffect on the client, useEffect on the server. Lets code that must
 * settle the DOM before first paint do so without React's SSR warning.
 */
export const useIsomorphicEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

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
