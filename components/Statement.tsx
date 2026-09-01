'use client';

import { Fragment, useRef } from 'react';
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
      className="pt-16 pb-20 md:pt-32 md:pb-40 lg:pb-60 relative bg-(--bg-alt)"
    >
      <div className="mx-auto max-w-[1880px] px-6 md:px-12">
        <h2
          id="statement-title"
          className="statement-text display-serif"
          style={{
            fontSize: 'clamp(2.5rem, 5.9vw, 4.9rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            /* The gap used to be a bare 0.18em margin with no space character
               between the words. A real space in this face advances 0.238em, so
               word-spacing is negative here to land back on the same 0.18em and
               keep the line breaks the design was set to. */
            wordSpacing: '-0.06em',
            maxWidth: '1550px',
          }}
        >
          {/* 1.3.1 — the space between the words has to exist in the DOM, not
              only in the margin. Without it the whole heading resolves to one
              unbroken token ("402m²powierzchnicałkowitej…") in both the
              accessible name and anything a visitor copies. The visual rhythm
              the margin used to add is preserved by word-spacing on the h2. */}
          {statement.text.split(' ').map((word, i) => (
            <Fragment key={i}>
              <span
                className="stmt-word inline-block"
                style={{ willChange: 'opacity' }}
              >
                {word}
              </span>{' '}
            </Fragment>
          ))}
        </h2>
      </div>
    </section>
  );
}
