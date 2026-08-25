'use client';

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSectionAnim } from '@/hooks/useSectionAnim';
import Arrow from './Arrow';
import { contact, footer, site } from '@/data/site';

type Status = 'idle' | 'submitting' | 'success' | 'error';

// Encode form data for Netlify Forms (application/x-www-form-urlencoded)
function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

const fieldClass =
  'w-full px-3 bg-transparent border-b border-(--line-strong) py-3 focus:border-(--accent) outline-hidden transition-colors';

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useSectionAnim(root, () => {
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
  });

  return (
    // 1.4.10 Reflow — `.contact-info-item` enters from `x: 30`, so until the
    // section scrolls into view those cards sit 30 px past the right edge and
    // widen the document. `overflow-x: clip` contains them without turning this
    // into a scroll container the way `overflow: hidden` would.
    <section
      id="kontakt"
      ref={root}
      aria-labelledby="kontakt-title"
      className="py-32 md:py-48 relative overflow-x-clip"
    >
      <div className="mx-auto max-w-[1880px] px-6 md:px-10">
        <div className="flex items-center justify-between mb-16">
          <div className="label-mono opacity-60">{contact.eyebrow}</div>
          <div className="label-mono opacity-60 hidden md:block">
            {contact.eyebrowAside}
          </div>
        </div>

        <div className="contact-headline mb-20">
          <h2 id="kontakt-title" className="display-serif leading-[0.92]">
            <div className="overflow-hidden">
              <div className="contact-line text-[clamp(2.5rem,8vw,7rem)]">
                {contact.headline.lead}{' '}
                <span className="italic text-(--accent)">
                  {contact.headline.accent}
                </span>
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="contact-line text-[clamp(2.5rem,8vw,7rem)]">
                {contact.headline.second}
              </div>
            </div>
          </h2>
          <p className="mt-8 max-w-xl opacity-75 text-lg leading-relaxed">
            {contact.intro}
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6 lg:gap-16">
          {/* Form */}
          <form
            className="contact-form col-span-12 lg:col-span-7 space-y-8"
            name={contact.form.netlifyName}
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
              const payload: Record<string, string> = {
                'form-name': contact.form.netlifyName,
              };
              formData.forEach((value, key) => {
                payload[key] = value.toString();
              });
              try {
                const res = await fetch('/__forms.html', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
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
                    : 'Nieznany błąd. Spróbuj ponownie lub napisz na e-mail.',
                );
              }
            }}
          >
            {/* Required hidden input — tells Netlify which form was submitted */}
            <input
              type="hidden"
              name="form-name"
              value={contact.form.netlifyName}
              autoComplete="off"
            />
            {/* Honeypot — invisible field; if filled, it's a bot. aria-hidden plus
                tabIndex={-1} keeps it out of the accessibility tree entirely,
                which is the right treatment for a spam trap: a screen-reader
                user should never be asked to skip a field that only bots see. */}
            <p className="hidden" aria-hidden="true">
              <label htmlFor="bot-field">{contact.form.honeypotLabel} </label>
              <input id="bot-field" name="bot-field" tabIndex={-1} autoComplete="off" />
            </p>

            <div className="contact-field grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label
                  className="label-mono text-(--fg-muted) block mb-2"
                  htmlFor="imie"
                >
                  {contact.form.fields.imie.label}
                </label>
                <input
                  id="imie"
                  name="imie"
                  type="text"
                  autoComplete={contact.form.fields.imie.autoComplete}
                  required
                  className={fieldClass}
                />
              </div>
              <div>
                <label
                  className="label-mono text-(--fg-muted) block mb-2"
                  htmlFor="telefon"
                >
                  {contact.form.fields.telefon.label}
                </label>
                <input
                  id="telefon"
                  name="telefon"
                  type="tel"
                  autoComplete={contact.form.fields.telefon.autoComplete}
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="contact-field">
              <label className="label-mono text-(--fg-muted) block mb-2" htmlFor="email">
                {contact.form.fields.email.label}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete={contact.form.fields.email.autoComplete}
                required
                className={fieldClass}
              />
            </div>

            <div className="contact-field">
              <label
                className="label-mono text-(--fg-muted) block mb-2"
                htmlFor="termin"
              >
                {contact.form.fields.termin.label}
              </label>
              <input
                id="termin"
                name="termin"
                type="text"
                placeholder={contact.form.fields.termin.placeholder}
                className={`${fieldClass} placeholder:text-(--fg-muted)`}
              />
            </div>

            <div className="contact-field">
              <label
                className="label-mono text-(--fg-muted) block mb-2"
                htmlFor="wiadomosc"
              >
                {contact.form.fields.wiadomosc.label}
              </label>
              <textarea
                id="wiadomosc"
                name="wiadomosc"
                rows={4}
                className={`${fieldClass} resize-none`}
              />
            </div>

            {/* Success and failure both land in this live region so a screen
                reader hears the outcome of a submission it cannot see. */}
            <div role="status" aria-live="polite">
              {status === 'success' && (
                <div className="contact-field border-l-2 border-(--accent) pl-5 py-3 bg-(--bg-alt)">
                  <div className="display-serif italic text-xl mb-1 text-(--accent)">
                    {contact.form.success.title}
                  </div>
                  <p className="text-sm opacity-75">{contact.form.success.body}</p>
                </div>
              )}

              {status === 'error' && (
                <div className="contact-field border-l-2 border-red-500 pl-5 py-3">
                  <div className="display-serif italic text-xl mb-1 text-red-500">
                    {contact.form.error.title}
                  </div>
                  <p className="text-sm opacity-75">
                    {contact.form.error.bodyBefore}
                    <a
                      href={`mailto:${site.email}`}
                      className="underline underline-offset-2 py-1"
                    >
                      {site.email}
                    </a>
                    .
                  </p>
                  {errorMsg && (
                    <p className="text-xs text-(--fg-muted) mt-2">({errorMsg})</p>
                  )}
                </div>
              )}
            </div>

            <div className="contact-field pt-4">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="group inline-flex rounded-xs items-center justify-between gap-6 w-full lg:min-w-[400px] border border-(--fg) px-6 md:px-8 py-6 lg:py-8 hover:bg-(--fg) hover:text-(--bg) transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-current"
              >
                <span className="display-serif italic text-4xl">
                  {status === 'submitting'
                    ? contact.form.submitting
                    : contact.form.submit}
                </span>
                <Arrow
                  size={34}
                  className="transition-transform duration-500 group-hover:translate-x-1.5"
                />
              </button>
              <p className="text-md opacity-60 mt-5 max-w-full leading-relaxed">
                {contact.form.consentBefore}
                {/* py-1 lifts this inline link to a 28 px target. SC 2.5.8 exempts
                    links in a sentence, but a bigger tap area costs nothing. */}
                <a
                  href={footer.privacyLink.href}
                  className="underline decoration-dotted underline-offset-2 hover:text-(--accent) py-1"
                >
                  {contact.form.consentLinkLabel}
                </a>
                {contact.form.consentAfter}
              </p>
              <p className="text-md text-(--fg-muted) mt-2">
                {contact.form.reassurance}
              </p>
            </div>
          </form>

          {/* Contact info */}
          <div className="contact-info col-span-12 lg:col-span-5 mt-12 lg:mt-0 pl-0 lg:pl-16 lg:border-l lg:border-(--line)">
            <div className="contact-info-item mb-10">
              <div className="label-mono text-(--fg-muted) mb-2">
                {contact.info.contact.label}
              </div>
              <div className="display-serif text-2xl">{contact.info.contact.value}</div>
              <div className="text-sm opacity-70 mt-2">{contact.info.contact.note}</div>
            </div>

            <div className="contact-info-item mb-10">
              <div className="label-mono text-(--fg-muted) mb-2">
                {contact.info.emailLabel}
              </div>
              <a
                href={`mailto:${site.email}`}
                className="display-serif text-2xl hover:text-(--accent) transition-colors break-all"
              >
                {site.email}
              </a>
            </div>

            <div className="contact-info-item mb-10">
              <div className="label-mono text-(--fg-muted) mb-2">
                {contact.info.locationLabel}
              </div>
              <div className="display-serif text-xl">
                {site.address.street}, {site.address.locality}
              </div>
              <div className="text-sm opacity-70 mt-1">{site.address.detail}</div>
            </div>

            <div className="contact-info-item mt-12 p-6 rounded-xs border border-(--line-strong)">
              <div className="label-mono text-(--accent) mb-3">
                {contact.info.why.label}
              </div>
              <div className="text-sm leading-relaxed">{contact.info.why.body}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
