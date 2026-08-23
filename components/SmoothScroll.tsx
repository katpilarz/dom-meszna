'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './useSectionAnim';

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Refresh ScrollTrigger after layout settles
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);

    // Back/forward-cache restores the page without remounting React, and the
    // browser reinstates scroll position afterwards — cached start/end values
    // go stale and reveal targets can stay stuck at opacity 0. 'pageshow' is
    // not part of ScrollTrigger's default autoRefreshEvents, so wire it up.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) ScrollTrigger.refresh();
    };
    window.addEventListener('pageshow', onPageShow);

    return () => {
      clearTimeout(t);
      window.removeEventListener('pageshow', onPageShow);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return <>{children}</>;
}
