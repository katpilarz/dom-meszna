'use client';

import Script from 'next/script';
import { GA_MEASUREMENT_ID, useConsent } from './useConsent';

/**
 * Analytics is mounted only once consent exists, so nothing is fetched from
 * Google and no identifier is written before the visitor agrees. This is the
 * strict reading of ePrivacy Art. 5(3): prior consent, not consent-mode
 * "cookieless pings" that still contact the vendor.
 *
 * Set NEXT_PUBLIC_GA_ID to switch this on; until then the banner never appears
 * because there is nothing to consent to.
 */
export default function Analytics() {
  const { allows } = useConsent();

  if (!GA_MEASUREMENT_ID || !allows('analytics')) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
