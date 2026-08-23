'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useSectionAnim } from './useSectionAnim';

export default function Pricing() {
  const root = useRef<HTMLElement>(null);

  useSectionAnim(root, (el) => {
    gsap.from('.pricing-line', {
      yPercent: 110,
      stagger: 0.1,
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.pricing-block', start: 'top 75%' },
    });

    gsap.from('.pricing-detail', {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.8,
      scrollTrigger: { trigger: '.pricing-details', start: 'top 80%' },
    });

    // The markup ships the real asking price (1 899 000) so crawlers and no-JS
    // visitors never see the anchor figure the counter starts from — it used to
    // contradict the 1899000 in our JSON-LD. Rewind to the anchor only once we
    // know the count-down is going to run.
    const priceEl = el.querySelector<HTMLElement>('.big-price');
    if (priceEl) {
      priceEl.textContent = (2250000).toLocaleString('pl-PL');
      const obj = { val: 2250000 };
      gsap.to(obj, {
        val: 1899000,
        duration: 2.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: priceEl, start: 'top 80%' },
        onUpdate: () => {
          priceEl.textContent = Math.round(obj.val).toLocaleString('pl-PL');
        },
      });
    }

    // Reveal anchor label after price animation lands
    gsap.from('.price-anchor-note', {
      opacity: 0,
      y: 12,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.big-price', start: 'top 80%' },
      delay: 2.4,
    });
  });

  return (
    <section ref={root} className="py-32 md:py-48 relative bg-(--bg-alt)">
      <div className="mx-auto max-w-[1880px] px-6 md:px-10">
        <div className="flex items-center justify-between mb-16">
          <div className="label-mono opacity-60">08 — Oferta</div>
          <div className="label-mono opacity-60 hidden md:block">
            Sprzedaż bez pośredników
          </div>
        </div>

        <div className="pricing-block">
          <div className="overflow-hidden">
            <div className="pricing-line label-mono text-(--accent) mb-6">
              ✦ Bez pośredników · bez prowizji · bez ukrytych kosztów
            </div>
          </div>

          <h2 className="display-serif leading-[0.92]">
            <div className="overflow-hidden">
              <div className="pricing-line text-[clamp(3rem,9vw,8rem)]">
                <span className="big-price">1 899 000</span>
                <span className="text-(--accent)"> zł</span>
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="pricing-line text-[clamp(1.3rem,3vw,2.4rem)] italic opacity-70 mt-4">
                4 720 zł / m² za 402 m² i 1 600 m² działki.
              </div>
            </div>
          </h2>

          <div className="price-anchor-note mt-8 max-w-xl">
            <div className="label-mono opacity-50 text-[0.65rem] mb-2">
              ↳ Wcześniej w ofertach agencyjnych
            </div>
            <p className="text-sm md:text-base opacity-75 leading-relaxed">
              Nieruchomość była wystawiona w ofertach pośredników za{' '}
              <span className="text-lg! display-serif italic" style={{ color: 'var(--accent)' }}>
                2 250 000 zł
              </span>
              . Oferta bezpośrednia oznacza realną oszczędność na prowizji i marży
              pośrednika — różnica trafia do Ciebie.
            </p>
          </div>
        </div>

        <div className="hairline my-16" />

        <div className="pricing-details grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16">
          <div className="pricing-detail">
            <div className="label-mono opacity-50 mb-3">Cena za m²</div>
            <div className="display-serif text-3xl">4 720 zł</div>
            <div className="text-xs opacity-60 mt-2">
              Atrakcyjna stawka jak na lokalizację
            </div>
          </div>
          <div className="pricing-detail">
            <div className="label-mono opacity-50 mb-3">Stan</div>
            <div className="display-serif text-3xl">Dobry</div>
            <div className="text-xs opacity-60 mt-2">
              Do indywidualnego wykończenia
            </div>
          </div>
          <div className="pricing-detail">
            <div className="label-mono opacity-50 mb-3">Forma własności</div>
            <div className="display-serif text-3xl">Współwłasność</div>
            <div className="text-xs opacity-60 mt-2">
              Działka 1 600 m² · ogrodzona
              <br />
              1 800 m² łącznie z udziałem w drodze dojazdowej
            </div>
          </div>
          <div className="pricing-detail">
            <div className="label-mono opacity-50 mb-3">Status</div>
            <div className="display-serif text-3xl text-(--accent)">
              Dostępne
            </div>
            <div className="text-xs opacity-60 mt-2">
              Oferta bezpośrednia · bez pośredników
            </div>
          </div>
        </div>

        <div className="pricing-detail mt-20 max-w-4xl">
          <p className="display-serif text-6xl italic leading-snug opacity-95">
            Cena{' '}
            <span className="text-(--accent) not-italic">bez pośrednika</span>.<br></br>
            Bez prowizji, bez doliczonych marż.
          </p>
          <div className="mt-4 label-mono opacity-60">
            ↳ Sprzedaż prywatna
          </div>
        </div>
      </div>
    </section>
  );
}
