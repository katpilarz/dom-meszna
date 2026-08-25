"use client";

/**
 * Consent state lives outside React so it can be read by non-component code
 * (script gating) and stays correct across tabs. Components subscribe through
 * useSyncExternalStore, which also gives a truthful server snapshot — the
 * server cannot know a visitor's choice, so it renders as "undecided".
 */

export type OptionalCategory = "analytics";
export type ConsentChoices = Record<OptionalCategory, boolean>;

export type ConsentRecord = {
  /** Bumped when the purposes change; an old record stops counting as consent. */
  version: number;
  /** Proof of when consent was given — GDPR Art. 7(1) requires it be demonstrable. */
  decidedAt: string;
  choices: ConsentChoices;
};

export const CONSENT_VERSION = 1;
const STORAGE_KEY = "dm:consent";

/** Nothing optional is on until the visitor turns it on. No pre-ticked boxes. */
export const DEFAULT_CHOICES: ConsentChoices = { analytics: false };

let cache: ConsentRecord | null | undefined;
const listeners = new Set<() => void>();

function read(): ConsentRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    // A record written against older purposes is not consent for the new ones.
    if (parsed?.version !== CONSENT_VERSION) return null;
    if (typeof parsed.choices?.analytics !== "boolean") return null;
    return parsed;
  } catch {
    return null;
  }
}

function emit() {
  for (const l of [...listeners]) l();
}

export function subscribe(onChange: () => void) {
  if (listeners.size === 0 && typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function onStorage(e: StorageEvent) {
  if (e.key !== null && e.key !== STORAGE_KEY) return;
  cache = undefined;
  emit();
}

/** Referentially stable between writes, as useSyncExternalStore requires. */
export function getSnapshot(): ConsentRecord | null {
  if (cache === undefined) cache = read();
  return cache;
}

export function getServerSnapshot(): ConsentRecord | null {
  return null;
}

export function saveConsent(choices: ConsentChoices) {
  const record: ConsentRecord = {
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
    choices,
  };
  cache = record;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Storage unavailable: the decision still holds for this page view, and the
    // visitor is simply asked again next time. Failing closed is the safe side.
  }
  emit();
}

/** Withdrawing consent must be as easy as giving it — GDPR Art. 7(3). */
export function withdrawConsent() {
  cache = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to do */
  }
  emit();
}
