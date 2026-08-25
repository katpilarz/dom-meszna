'use client';

import { CONSENT_REQUIRED } from '@/utils/analytics';
import { consent } from '@/data/site';
import { OPEN_CONSENT_EVENT } from './ConsentBanner';

/**
 * Withdrawing or changing consent has to be as easy as giving it (GDPR
 * Art. 7(3)), which means a permanently reachable control — not a one-time
 * banner. Hidden when nothing on the site needs consent.
 */
export default function ConsentLink({
  className = '',
}: {
  className?: string;
}) {
  if (!CONSENT_REQUIRED) return null;

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT))}
      className={`text-sm hover:text-(--accent) inline-block py-1 transition-colors ${className}`}
    >
      {consent.reopen}
    </button>
  );
}
