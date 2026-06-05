'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const opportunities = [
  {
    n: '01',
    title: 'Solidna baza',
    body: 'Dom wybudowany w 2018 — keramzyt, wełna 20 cm, ceramiczna dachówka na pełnym deskowaniu. Konstrukcja, której nie da się dziś tanio odtworzyć.',
  },
  {
    n: '02',
    title: 'Mieszkalny od razu',
    body: 'Dom umeblowany, w dobrym stanie technicznym, gotowy do wprowadzenia. Remont i odświeżenie możesz zaplanować na własnych warunkach, w swoim tempie.',
  },
  {
    n: '03',
    title: 'Zakres remontu',
    body: 'Wymiana instalacji ogrzewania (obecnie węglowe) i odświeżenie wnętrz — pozostałe elementy są w porządku. Zakres jasny, kosztorys przewidywalny.',
  },
  {
    n: '04',
    title: 'Wnętrze pod Ciebie',
    body: 'Odświeżenie to szansa, by układ funkcjonalny, kolory i materiały dopasować dokładnie do swojego stylu życia — bez kompromisów na cudze gusta.',
  },
  {
    n: '05',
    title: 'Cena z marginesem',
    body: '1 899 000 zł za 402 m² i 1 600 m² działki. Cena uwzględnia zakres prac — zostawia realny budżet na ich przeprowadzenie.',
  },
  {
    n: '06',
    title: 'Lokalizacja premium',
    body: 'Działki w Mesznej i okolicach Szczyrku zyskują na wartości od lat. Po remoncie — naturalny wzrost rynkowy.',
  },
];

export default function Potential() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from('.pot-heading > *', {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        scrollTrigger: { trigger: '.pot-heading', start: 'top 80%' },
      });

      gsap.utils.toArray<HTMLElement>('.pot-card').forEach((card, i) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 1,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%' },
        });
      });

      gsap.from('.pot-quote', {
        opacity: 0,
        y: 40,
        duration: 1.2,
        scrollTrigger: { trigger: '.pot-quote', start: 'top 80%' },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="mozliwosci" className="py-32 md:py-48 relative">
      <div className="mx-auto max-w-[1880px] px-6 md:px-10">
        <div className="pot-heading mb-20">
          <div className="flex items-center justify-between mb-12">
            <div className="label-mono opacity-60">
              05 — Możliwości
            </div>
            <div className="label-mono opacity-60 hidden md:block">
              Stan: dobry · do indywidualnego wykończenia
            </div>
          </div>
          <h2 className="display-serif text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] max-w-5xl">
            Gotowy do życia.&nbsp;
        
            <br />
        Otwarty na
                <span className="italic text-[var(--accent)]">Twoje zmiany</span>
          </h2>
          <p className="mt-8 max-w-2xl text-lg opacity-75 leading-relaxed">
            Dom umeblowany, w dobrym stanie technicznym — można wprowadzić
            się od razu. Wymaga remontu instalacji ogrzewania i odświeżenia
            wnętrz, co daje szeroką możliwość przemodelowania go pod własne
            potrzeby, bez konieczności budowania od zera.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--line-strong)] border border-[var(--line-strong)] mb-24">
          {opportunities.map((opp) => (
            <div
              key={opp.n}
              className="pot-card bg-[var(--bg)] p-8 md:p-12 min-h-[280px] flex flex-col"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="display-serif text-xl">{opp.title}</div>
                <div className="display-serif text-5xl opacity-15">
                  {opp.n}
                </div>
              </div>
              <p className="text-sm opacity-75 leading-relaxed mt-auto">
                {opp.body}
              </p>
            </div>
          ))}
        </div>

        <div className="pot-quote max-w-4xl">
          <div className="label-mono text-[var(--accent)] mb-6">
            ✦ Dla kogo jest ten dom
          </div>
          <p className="display-serif text-2xl md:text-4xl italic leading-snug opacity-95">
            Dla kogoś, kto szuka prawdziwego domu na lata — z miejscem dla
            rodziny, ogrodem i widokiem na góry. Z perspektywą remontu, który
            sprawi, że wnętrze stanie się naprawdę Twoje.
          </p>
        </div>
      </div>
    </section>
  );
}
