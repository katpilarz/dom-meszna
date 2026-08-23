'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { CONSENT_REQUIRED, useConsent } from './useConsent';
import { DEFAULT_CHOICES, type ConsentChoices } from './consentStore';

/** Footer (or anywhere) can reopen the panel to let a visitor change their mind. */
export const OPEN_CONSENT_EVENT = 'dm:open-consent';

const noopSubscribe = () => () => {};

export default function ConsentBanner() {
  // Server cannot know a stored choice, so it would render the banner for
  // everyone and then yank it away on hydration. Render nothing until hydrated.
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const { record, decided, acceptAll, rejectAll, accept } = useConsent();
  const [showPrefs, setShowPrefs] = useState(false);
  const [reopened, setReopened] = useState(false);
  const [draft, setDraft] = useState<ConsentChoices>(DEFAULT_CHOICES);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const open = () => {
      setDraft(record?.choices ?? DEFAULT_CHOICES);
      setShowPrefs(true);
      setReopened(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open);
  }, [record]);

  useEffect(() => {
    if (!showPrefs) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowPrefs(false);
        setReopened(false);
      }
    };
    window.addEventListener('keydown', onKey);
    panel.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [showPrefs]);

  if (!CONSENT_REQUIRED || !hydrated) return null;
  // Decided and not deliberately reopened — stay out of the way.
  if (decided && !reopened) return null;

  const close = () => {
    setShowPrefs(false);
    setReopened(false);
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-90 px-4 pb-4 md:px-6 md:pb-6"
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      aria-describedby="consent-body"
    >
      <div
        ref={panel}
        tabIndex={-1}
        className="mx-auto max-w-3xl rounded-xs border border-(--line-strong) bg-(--bg) p-6 md:p-8 shadow-[0_18px_50px_-24px_rgba(14,14,12,0.55)] outline-none"
      >
        <div className="label-mono text-(--accent) mb-3 text-[0.6rem]">
          ✦ Prywatność
        </div>

        <h2 id="consent-title" className="display-serif text-2xl md:text-3xl italic mb-3">
          Zgoda na analitykę
        </h2>

        <p id="consent-body" className="text-sm leading-relaxed opacity-80">
          Ta strona działa bez plików cookies śledzących. Czcionki i wszystkie
          materiały serwowane są z naszego serwera — żadne dane nie trafiają do
          podmiotów trzecich. Chcielibyśmy jedynie zbierać anonimowe statystyki
          odwiedzin, aby wiedzieć, które treści są przydatne. Zgoda jest
          dobrowolna i możesz ją wycofać w każdej chwili.
        </p>

        {showPrefs && (
          <ul className="mt-6 space-y-4 border-t border-(--line) pt-6">
            <li className="flex items-start justify-between gap-6">
              <div>
                <div className="display-serif text-lg">Niezbędne</div>
                <div className="text-xs opacity-60 mt-1 leading-relaxed">
                  Zapamiętanie motywu i tego, że animacja powitalna już się
                  wyświetliła. Dane nie opuszczają Twojej przeglądarki.
                </div>
              </div>
              <span className="label-mono text-[0.6rem] opacity-50 whitespace-nowrap pt-2">
                Zawsze aktywne
              </span>
            </li>

            <li className="flex items-start justify-between gap-6">
              <label htmlFor="consent-analytics" className="cursor-pointer">
                <div className="display-serif text-lg">Analityka</div>
                <div className="text-xs opacity-60 mt-1 leading-relaxed">
                  Anonimowe statystyki odwiedzin. Bez tej zgody żaden skrypt
                  analityczny nie jest wczytywany.
                </div>
              </label>
              <input
                id="consent-analytics"
                type="checkbox"
                checked={draft.analytics}
                onChange={(e) => setDraft({ ...draft, analytics: e.target.checked })}
                className="mt-2 size-5 shrink-0 cursor-pointer accent-(--accent)"
              />
            </li>
          </ul>
        )}

        {/* Reject carries exactly the same weight as accept — a hidden or
            de-emphasised refusal is the single most-enforced dark pattern
            under GDPR/ePrivacy. */}
        <div className="mt-7 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              rejectAll();
              close();
            }}
            className="flex-1 rounded-xs border border-(--fg) px-6 py-3 display-serif italic text-lg transition-colors duration-500 hover:bg-(--fg) hover:text-(--bg)"
          >
            Odrzuć
          </button>

          {showPrefs ? (
            <button
              type="button"
              onClick={() => {
                accept(draft);
                close();
              }}
              className="flex-1 rounded-xs border border-(--fg) px-6 py-3 display-serif italic text-lg transition-colors duration-500 hover:bg-(--fg) hover:text-(--bg)"
            >
              Zapisz wybór
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                acceptAll();
                close();
              }}
              className="flex-1 rounded-xs border border-(--fg) px-6 py-3 display-serif italic text-lg transition-colors duration-500 hover:bg-(--fg) hover:text-(--bg)"
            >
              Akceptuj
            </button>
          )}
        </div>

        {!showPrefs && (
          <button
            type="button"
            onClick={() => {
              setDraft(record?.choices ?? DEFAULT_CHOICES);
              setShowPrefs(true);
            }}
            className="mt-4 label-mono text-[0.6rem] opacity-60 underline underline-offset-4 hover:opacity-100 transition-opacity"
          >
            Dostosuj ustawienia
          </button>
        )}
      </div>
    </div>
  );
}
