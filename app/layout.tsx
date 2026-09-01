import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// Self-hosted at build time: no request ever leaves the visitor's browser for
// Google, which removes the only third-party data transfer on the site and so
// removes any need to ask consent for it (GDPR Art. 25, privacy by design).
// 'latin-ext' is not optional here — it carries ą ć ę ł ń ó ś ź ż.
const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
});

const interTight = Inter_Tight({
  subsets: ['latin', 'latin-ext'],
  weight: ['200', '300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-inter-tight',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400'],
  display: 'swap',
  variable: '--font-jetbrains',
});

import { ThemeProvider } from '@/components/ThemeProvider';
import ConsentBanner from '@/components/consent/ConsentBanner';
import Analytics from '@/components/consent/Analytics';
import { meta, site, skipLink } from '@/data/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: meta.titleDefault,
    template: meta.titleTemplate,
  },
  description: meta.description,
  keywords: [...meta.keywords],
  authors: [{ name: site.author }],
  creator: site.author,
  publisher: site.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    /* Relative, so it resolves against metadataBase. Inherited by every route,
       which is why any page that is not the homepage has to override it — see
       app/polityka-prywatnosci/page.tsx. */
    canonical: '/',
  },
  openGraph: {
    title: meta.openGraph.title,
    description: meta.openGraph.description,
    url: site.url,
    siteName: site.name,
    locale: site.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: meta.twitter.title,
    description: meta.twitter.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={site.lang}
      suppressHydrationWarning
      className={`${cormorant.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <body className="grain">
        <a href={skipLink.href} className="skip-link">
          {skipLink.label}
        </a>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {/* SC 2.4.3 Focus Order. The banner is fixed to the bottom of the
              viewport but is not part of the page content, so its position in
              the DOM is what decides where a keyboard visitor meets it. Mounted
              after {children} it was the *last* tab stop — a dialog asking for a
              decision, reachable only after the entire page including the form
              it sits on top of. Mounted here it is the second stop, right after
              the skip link, which is where a consent prompt belongs. */}
          <ConsentBanner />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
