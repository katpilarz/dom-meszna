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
} from '@/utils/consentStore';

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
