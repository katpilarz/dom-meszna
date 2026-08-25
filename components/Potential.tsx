"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useSectionAnim } from "@/hooks/useSectionAnim";
import { revealBatch } from "@/utils/motion";
import { potential } from "@/data/site";

export default function Potential() {
  const root = useRef<HTMLElement>(null);

  useSectionAnim(root, () => {
    gsap.from(".pot-heading > *", {
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      scrollTrigger: { trigger: ".pot-heading", start: "top 80%" },
    });

    revealBatch(".pot-card");

    gsap.from(".pot-quote", {
      opacity: 0,
      y: 40,
      duration: 1.2,
      scrollTrigger: { trigger: ".pot-quote", start: "top 80%" },
    });
  });

  return (
    <section
      aria-labelledby="mozliwosci-title"
      ref={root}
      id="mozliwosci"
      className="py-32 md:py-48 relative bg-(--bg-alt)"
    >
      <div className="mx-auto max-w-[1880px] px-6 md:px-10">
        <div className="pot-heading mb-20">
          <div className="flex items-center justify-between mb-12">
            <div className="label-mono opacity-60">{potential.eyebrow}</div>
            <div className="label-mono opacity-60 hidden md:block">
              {potential.eyebrowAside}
            </div>
          </div>
          <h2
            id="mozliwosci-title"
            className="display-serif text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] max-w-5xl"
          >
            {potential.headline.lead}
            <br />
            {potential.headline.mid}{" "}
            <span className="italic text-(--accent)">
              {potential.headline.accent}
            </span>
          </h2>
          <p className="mt-8 max-w-2xl text-lg opacity-75 leading-relaxed">
            {potential.intro}
          </p>
        </div>

        {/* 1.3.1 — six equivalent cards, so a list; and each card's title is
            set at text-5xl and reads as a heading, so it is one. */}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-(--line-strong) rounded-xs border border-(--line-strong) mb-24">
          {potential.opportunities.map((opp) => (
            <li
              key={opp.n}
              className="pot-card bg-(--bg-alt) p-8 md:p-12 min-h-[280px] flex flex-col"
            >
              {/* 1.4.12 Text Spacing — min-w-0 lets the title wrap instead of
                  holding the row open at its longest word's width, which under a
                  spacing stylesheet pushed the number clean off the page. */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <h3 className="display-serif text-5xl min-w-0">{opp.title}</h3>
                {/* The list already carries position; this is the decorative
                    oversized numeral, not content. */}
                <span
                  className="display-serif text-[3rem] opacity-15 shrink-0"
                  aria-hidden="true"
                >
                  {opp.n}
                </span>
              </div>
              <p className="text-sm opacity-75 leading-relaxed mt-auto">
                {opp.body}
              </p>
            </li>
          ))}
        </ul>

        <div className="pot-quote max-w-4xl">
          <div className="label-mono text-(--accent) mb-6">
            {potential.quote.label}
          </div>
          <p className="display-serif text-2xl md:text-4xl italic leading-snug opacity-95">
            {potential.quote.body}
          </p>
        </div>
      </div>
    </section>
  );
}
