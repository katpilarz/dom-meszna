/**
 * A vendor is only wired up when its id is configured, and consent is only
 * worth asking for when there is something to consent to. With no analytics id
 * set, the site transfers nothing to anyone and the banner stays away —
 * a banner on a site that sets no cookies is noise, not compliance.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';
export const ANALYTICS_CONFIGURED = GA_MEASUREMENT_ID.length > 0;
export const CONSENT_REQUIRED = ANALYTICS_CONFIGURED;
