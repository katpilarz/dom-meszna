'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useConsent } from '@/hooks/useConsent';
import { CONSENT_REQUIRED } from '@/utils/analytics';
import { DEFAULT_CHOICES, type ConsentChoices } from '@/utils/consentStore';
import { consent as copy } from '@/data/site';

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
  const shell = useRef<HTMLDivElement>(null);

  // Decided and not deliberately reopened — stay out of the way.
  const visible = CONSENT_REQUIRED && hydrated && (!decided || reopened);

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
    return () => window.removeEventListener('keydown', onKey);
  }, [showPrefs]);

  /**
   * Focus moves into the panel when — and only when — the visitor asked for it,
   * by activating "Ustawienia prywatności" in the footer. Reopening a dialog is
   * a deliberate action and focus has to follow it, or the control the visitor
   * just pressed leaves them nowhere.
   *
   * On *first* appearance focus deliberately stays put. Hijacking focus on load
   * is not what SC 2.4.3 asks for: it interrupts a screen reader mid-title, and
   * it pushes the skip link out of first place. The banner's position in the tab
   * order is solved where it belongs — in app/layout.tsx, where it is mounted
   * ahead of the page content so it is the second stop rather than the last.
   */
  useEffect(() => {
    if (!visible || !reopened) return;
    panel.current?.focus();
  }, [visible, reopened, showPrefs]);

  /**
   * SC 2.4.11 Focus Not Obscured. A fixed panel over the page hid whatever had
   * focus behind it — including the contact form's submit button. Publishing the
   * measured height lets globals.css reserve the space instead of overlapping it.
   */
  useEffect(() => {
    const root = document.documentElement;
    if (!visible) {
      root.style.removeProperty('--consent-inset');
      return;
    }
    const el = shell.current;
    if (!el) return;

    const sync = () => {
      root.style.setProperty('--consent-inset', `${el.offsetHeight}px`);
    };
    sync();

    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener('resize', sync);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
      root.style.removeProperty('--consent-inset');
    };
  }, [visible, showPrefs]);

  if (!visible) return null;

  const close = () => {
    setShowPrefs(false);
    setReopened(false);
  };

  const buttonClass =
    'flex-1 rounded-xs border border-(--fg) px-6 py-3 display-serif italic text-lg transition-colors duration-500 hover:bg-(--fg) hover:text-(--bg)';

  return (
    <div
      ref={shell}
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
          {copy.kicker}
        </div>

        <h2
          id="consent-title"
          className="display-serif text-2xl md:text-3xl italic mb-3"
        >
          {copy.title}
        </h2>

        <p id="consent-body" className="text-sm leading-relaxed opacity-80">
          {copy.body}
        </p>

        {showPrefs && (
          <ul className="mt-6 space-y-4 border-t border-(--line) pt-6">
            <li className="flex items-start justify-between gap-6">
              <div>
                <div className="display-serif text-lg">
                  {copy.categories.essential.title}
                </div>
                <div className="text-xs opacity-60 mt-1 leading-relaxed">
                  {copy.categories.essential.body}
                </div>
              </div>
              <span className="label-mono text-[0.6rem] text-(--fg-muted) whitespace-nowrap pt-2">
                {copy.categories.essential.state}
              </span>
            </li>

            <li className="flex items-start justify-between gap-6">
              <label htmlFor="consent-analytics" className="cursor-pointer">
                <div className="display-serif text-lg">
                  {copy.categories.analytics.title}
                </div>
                <div className="text-xs opacity-60 mt-1 leading-relaxed">
                  {copy.categories.analytics.body}
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
            className={buttonClass}
          >
            {copy.reject}
          </button>

          {showPrefs ? (
            <button
              type="button"
              onClick={() => {
                accept(draft);
                close();
              }}
              className={buttonClass}
            >
              {copy.save}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                acceptAll();
                close();
              }}
              className={buttonClass}
            >
              {copy.accept}
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
            className="mt-4 label-mono text-[0.6rem] py-2 underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity"
          >
            {copy.customise}
          </button>
        )}
      </div>
    </div>
  );
}
