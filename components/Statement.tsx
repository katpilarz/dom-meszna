'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useSectionAnim } from '@/hooks/useSectionAnim';
import { statement } from '@/data/site';

export default function Statement() {
  const root = useRef<HTMLElement>(null);

  useSectionAnim(root, () => {
    gsap.fromTo(
      '.stmt-word',
      { opacity: 0.5 },
      {
        opacity: 1,
        stagger: 0.03,
        ease: 'none',
        scrollTrigger: {
          trigger: '.statement-text',
          start: 'top 75%',
          end: 'bottom 60%',
          scrub: 1,
        },
      },
    );
  });

  return (
    <section
      ref={root}
      aria-labelledby="statement-title"
      className="pt-32 pb-40 lg:pb-60 relative bg-(--bg-alt)"
    >
      <div className="mx-auto max-w-[1880px] px-6 md:px-12">
        <h2
          id="statement-title"
          className="statement-text display-serif"
          style={{
            fontSize: 'clamp(2.5rem, 5.9vw, 4.9rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            maxWidth: '1550px',
          }}
        >
          {statement.text.split(' ').map((word, i) => (
            <span
              key={i}
              className="stmt-word inline-block"
              style={{ marginRight: '0.18em', willChange: 'opacity' }}
            >
              {word}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
