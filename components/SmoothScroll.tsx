'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '@/utils/motion';

/** Where the hash target should end up: its own offset, less scroll-padding-top. */
function hashTargetOffset() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return null;
  const el = document.getElementById(id);
  if (!el) return null;
  const pad =
    parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  return Math.round(el.getBoundingClientRect().top + window.scrollY - pad);
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    let cancelled = false;
    // If the visitor takes control, stop correcting — being dragged back to an
    // anchor you have started scrolling away from is worse than a missed anchor.
    const release = () => {
      cancelled = true;
    };

    const t = setTimeout(() => {
      ScrollTrigger.refresh();

      // Landing on /#kontakt from another route used to strand the visitor in
      // the middle of the page. Three things scroll during those first few
      // hundred milliseconds: the browser starts its own ~22 000 px glide to the
      // anchor, and ScrollTrigger.refresh() records and re-applies a scroll
      // offset a frame or two later, clobbering it. The refresh won, at a
      // position several hundred pixels off the target, and nothing corrected
      // it afterwards.
      //
      // So assert the anchor last, and keep asserting until it holds. The jump
      // is deliberately instant: this is an arrival at a new route, and a
      // smooth 22 000 px crawl reads as a broken button anyway. Same-page
      // clicks never reach here — this effect only runs on mount — so those
      // keep the CSS smooth scroll.
      if (hashTargetOffset() === null) return;

      let frames = 0;
      const land = () => {
        if (cancelled || frames++ > 10) return;
        const want = hashTargetOffset();
        if (want === null) return;
        if (Math.abs(window.scrollY - want) <= 2) return; // landed and holding
        window.scrollTo({ top: want, behavior: 'instant' });
        requestAnimationFrame(land);
      };
      requestAnimationFrame(land);
    }, 300);

    for (const evt of ['wheel', 'touchstart', 'keydown'] as const) {
      window.addEventListener(evt, release, { passive: true, once: true });
    }

    // Back/forward-cache restores the page without remounting React, and the
    // browser reinstates scroll position afterwards — cached start/end values
    // go stale and reveal targets can stay stuck at opacity 0. 'pageshow' is
    // not part of ScrollTrigger's default autoRefreshEvents, so wire it up.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) ScrollTrigger.refresh();
    };
    window.addEventListener('pageshow', onPageShow);

    return () => {
      cancelled = true;
      clearTimeout(t);
      for (const evt of ['wheel', 'touchstart', 'keydown'] as const) {
        window.removeEventListener(evt, release);
      }
      window.removeEventListener('pageshow', onPageShow);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return <>{children}</>;
}
