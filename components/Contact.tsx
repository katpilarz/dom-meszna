'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Arrow from './Arrow';

type Status = 'idle' | 'submitting' | 'success' | 'error';

// Encode form data for Netlify Forms (application/x-www-form-urlencoded)
function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from('.contact-line', {
        yPercent: 110,
        stagger: 0.08,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.contact-headline', start: 'top 75%' },
      });

      gsap.from('.contact-field', {
        opacity: 0,
        y: 30,
        stagger: 0.08,
        duration: 0.7,
        scrollTrigger: { trigger: '.contact-form', start: 'top 80%' },
      });

      gsap.from('.contact-info-item', {
        opacity: 0,
        x: 30,
        stagger: 0.1,
        duration: 0.8,
        scrollTrigger: { trigger: '.contact-info', start: 'top 80%' },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="kontakt"
      ref={root}
      className="py-32 md:py-48 relative"
    >
      <div className="mx-auto max-w-[1880px] px-6 md:px-10">
        <div className="flex items-center justify-between mb-16">
          <div className="label-mono opacity-60">10 — Kontakt</div>
          <div className="label-mono opacity-60 hidden md:block">
            Prywatna prezentacja oferty
          </div>
        </div>

        <div className="contact-headline mb-20">
          <h2 className="display-serif leading-[0.92]">
            <div className="overflow-hidden">
              <div className="contact-line text-[clamp(2.5rem,8vw,7rem)]">
                Porozmawiajmy&nbsp;<span className="italic text-[var(--accent)]">wprost.</span>
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="contact-line text-[clamp(2.5rem,8vw,7rem)]">
                Bez pośredników.
              </div>
            </div>
          </h2>
          <p className="mt-8 max-w-xl opacity-75 text-lg leading-relaxed">
            Sprzedaję dom osobiście — chętnie odpowiem na pytania
            i pokażę nieruchomość w dogodnym terminie. Zostaw kontakt,
            odpowiem w ciągu doby.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6 lg:gap-16">
          {/* Form */}
          <form
            className="contact-form col-span-12 lg:col-span-7 space-y-8"
            name="kontakt"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={async (e) => {
              e.preventDefault();
              if (status === 'submitting') return;
              setStatus('submitting');
              setErrorMsg('');
              const form = e.currentTarget;
              const formData = new FormData(form);
              const payload: Record<string, string> = { 'form-name': 'kontakt' };
              formData.forEach((value, key) => {
                payload[key] = value.toString();
              });
              try {
                const res = await fetch('/', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                  body: encode(payload),
                });
                if (!res.ok) throw new Error(`Status ${res.status}`);
                setStatus('success');
                form.reset();
              } catch (err) {
                setStatus('error');
                setErrorMsg(
                  err instanceof Error
                    ? err.message
                    : 'Nieznany błąd. Spróbuj ponownie lub napisz na e-mail.'
                );
              }
            }}
          >
            {/* Required hidden input — tells Netlify which form was submitted */}
            <input type="hidden" name="form-name" value="kontakt" />
            {/* Honeypot — invisible field; if filled, it's a bot */}
            <p className="hidden" aria-hidden="true">
              <label>
                Nie wypełniaj tego pola: <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </p>

            <div className="contact-field grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="label-mono opacity-50 block mb-2" htmlFor="imie">
                  Imię i nazwisko
                </label>
                <input
                  id="imie"
                  name="imie"
                  type="text"
                  required
                  className="w-full bg-transparent border-b border-[var(--line-strong)] py-3 focus:border-[var(--accent)] outline-none transition-colors"
                />
              </div>
              <div>
                <label className="label-mono opacity-50 block mb-2" htmlFor="telefon">
                  Telefon
                </label>
                <input
                  id="telefon"
                  name="telefon"
                  type="tel"
                  className="w-full bg-transparent border-b border-[var(--line-strong)] py-3 focus:border-[var(--accent)] outline-none transition-colors"
                />
              </div>
            </div>

            <div className="contact-field">
              <label className="label-mono opacity-50 block mb-2" htmlFor="email">
                Adres e-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-transparent border-b border-[var(--line-strong)] py-3 focus:border-[var(--accent)] outline-none transition-colors"
              />
            </div>

            <div className="contact-field">
              <label className="label-mono opacity-50 block mb-2" htmlFor="termin">
                Preferowany termin prezentacji
              </label>
              <input
                id="termin"
                name="termin"
                type="text"
                placeholder="np. najbliższa sobota, popołudnie"
                className="w-full bg-transparent border-b border-[var(--line-strong)] py-3 focus:border-[var(--accent)] outline-none transition-colors placeholder:opacity-40"
              />
            </div>

            <div className="contact-field">
              <label className="label-mono opacity-50 block mb-2" htmlFor="wiadomosc">
                Dodatkowe pytania
              </label>
              <textarea
                id="wiadomosc"
                name="wiadomosc"
                rows={4}
                className="w-full bg-transparent border-b border-[var(--line-strong)] py-3 focus:border-[var(--accent)] outline-none transition-colors resize-none"
              />
            </div>

            {/* Success message */}
            {status === 'success' && (
              <div className="contact-field border-l-2 border-[var(--accent)] pl-5 py-3 bg-[var(--bg-alt)]">
                <div
                  className="display-serif italic text-xl mb-1"
                  style={{ color: 'var(--accent)' }}
                >
                  Dziękuję za wiadomość.
                </div>
                <p className="text-sm opacity-75">
                  Odezwę się w ciągu 24 godzin na podany adres e-mail.
                </p>
              </div>
            )}

            {/* Error message */}
            {status === 'error' && (
              <div className="contact-field border-l-2 border-red-500 pl-5 py-3">
                <div className="display-serif italic text-xl mb-1 text-red-500">
                  Nie udało się wysłać wiadomości.
                </div>
                <p className="text-sm opacity-75">
                  Spróbuj ponownie lub napisz bezpośrednio na{' '}
                  <a href="mailto:dommeszna@proton.me" className="underline">
                    dommeszna@proton.me
                  </a>
                  .
                </p>
                {errorMsg && <p className="text-xs opacity-50 mt-2">({errorMsg})</p>}
              </div>
            )}

            <div className="contact-field pt-4">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="group inline-flex items-center justify-between gap-6 w-full lg:min-w-[400px] border border-[var(--fg)] px-6 md:px-8 py-5 md:py-6 hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-current"
              >
                <span className="display-serif italic text-2xl">
                  {status === 'submitting' ? 'Wysyłam…' : 'Wyślij zapytanie'}
                </span>
                <Arrow size={34} className="transition-transform duration-500 group-hover:translate-x-1.5" />
              </button>
              <p className="text-xs opacity-60 mt-5 max-w-full leading-relaxed">
                Wysyłając zapytanie, potwierdzasz zapoznanie się z{' '}
                <a href="/polityka-prywatnosci" className="underline decoration-dotted underline-offset-2 hover:text-[var(--accent)]">
                  polityką prywatności
                </a>{' '}
                i akceptujesz przetwarzanie podanych danych w celu udzielenia odpowiedzi (RODO, art. 6 ust. 1 lit. b).
              </p>
              <p className="text-xs opacity-50 mt-2">
                Zapytanie jest niezobowiązujące. Odpowiem w ciągu 24 godzin.
              </p>
            </div>
          </form>

          {/* Contact info */}
          <div className="contact-info col-span-12 lg:col-span-5 mt-12 lg:mt-0 pl-0 lg:pl-16 lg:border-l lg:border-[var(--line)]">
            <div className="contact-info-item mb-10">
              <div className="label-mono opacity-50 mb-2">Sprzedająca</div>
              <div className="display-serif text-2xl">
                Właścicielka domu
              </div>
              <div className="text-sm opacity-70 mt-2">
                Bez pośredników · bez prowizji · rozmowa wprost
              </div>
            </div>

            <div className="contact-info-item mb-10">
              <div className="label-mono opacity-50 mb-2">E-mail</div>
              <a
                href="mailto:dommeszna@proton.me"
                className="display-serif text-2xl hover:text-[var(--accent)] transition-colors break-all"
              >
                dommeszna@proton.me
              </a>
            </div>

            <div className="contact-info-item mb-10">
              <div className="label-mono opacity-50 mb-2">Lokalizacja</div>
              <div className="display-serif text-xl">
                Meszna, gmina Wilkowice
              </div>
              <div className="text-sm opacity-70 mt-1">
                powiat bielski · województwo śląskie
              </div>
            </div>

            <div className="contact-info-item mt-12 p-6 border border-[var(--line-strong)]">
              <div className="label-mono text-[var(--accent)] mb-3">
                ✦ Dlaczego bezpośrednio
              </div>
              <div className="text-sm leading-relaxed">
                Brak pośredników oznacza realną cenę bez doliczonych prowizji
                i bezpośrednią rozmowę o szczegółach, terminie i ewentualnych
                ustaleniach.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
