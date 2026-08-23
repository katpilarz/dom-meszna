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

export const metadata: Metadata = {
  metadataBase: new URL('https://www.dom-meszna.pl'),
  title: {
    default: 'Dom w Mesznej — sprzedaż bez pośredników',
    template: '%s — Dom w Mesznej',
  },
  description:
    'Dom 402 m² w Mesznej u stóp Beskidu Śląskiego. 170,75 m² powierzchni użytkowej, działka 1 600 m², 7 pokoi, trzy kondygnacje. Oddany do użytku w 2018 r. Projekt Studio Atrium. Sprzedaż bez pośredników.',
  keywords: [
    'dom na sprzedaż',
    'Meszna',
    'Wilkowice',
    'Beskid Śląski',
    'Bielsko-Biała',
    'Szczyrk',
    'nieruchomość Beskidy',
    'dom bez pośredników',
    'sprzedaż bezpośrednia',
  ],
  authors: [{ name: 'PAISAK4U' }],
  creator: 'PAISAK4U',
  publisher: 'Dom w Mesznej',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://www.dom-meszna.pl',
  },
  openGraph: {
    title: 'Dom w Mesznej — sprzedaż bez pośredników',
    description:
      'Dom 402 m² u stóp Beskidu Śląskiego. Trzy kondygnacje, działka 1 600 m², projekt Studio Atrium 2018. Sprzedaż bez pośredników, bez prowizji.',
    url: 'https://www.dom-meszna.pl',
    siteName: 'Dom w Mesznej',
    locale: 'pl_PL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dom w Mesznej — sprzedaż bez pośredników',
    description:
      'Dom 402 m² u stóp Beskidu Śląskiego. Bez pośredników, bez prowizji.',
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
      lang="pl"
      suppressHydrationWarning
      className={`${cormorant.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <body className="grain">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <ConsentBanner />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}