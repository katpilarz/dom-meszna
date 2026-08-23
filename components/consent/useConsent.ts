'use client';

import { useCallback, useSyncExternalStore } from 'react';
import {
  DEFAULT_CHOICES,
  getServerSnapshot,
  getSnapshot,
  saveConsent,
  subscribe,
  withdrawConsent,
  type ConsentChoices,
  type OptionalCategory,
} from './consentStore';

/**
 * A vendor is only wired up when its id is configured, and consent is only
 * worth asking for when there is something to consent to. With no analytics id
 * set, the site transfers nothing to anyone and the banner stays away —
 * a banner on a site that sets no cookies is noise, not compliance.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';
export const ANALYTICS_CONFIGURED = GA_MEASUREMENT_ID.length > 0;
export const CONSENT_REQUIRED = ANALYTICS_CONFIGURED;

export function useConsent() {
  const record = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const accept = useCallback((choices: ConsentChoices) => saveConsent(choices), []);
  const acceptAll = useCallback(() => saveConsent({ analytics: true }), []);
  const rejectAll = useCallback(() => saveConsent({ ...DEFAULT_CHOICES }), []);
  const withdraw = useCallback(() => withdrawConsent(), []);

  const allows = useCallback(
    (category: OptionalCategory) => record?.choices[category] === true,
    [record],
  );

  return {
    record,
    /** Undecided until an explicit choice exists. Silence is never consent. */
    decided: record !== null,
    allows,
    accept,
    acceptAll,
    rejectAll,
    withdraw,
  };
}
