import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

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
    images: [
      {
        url: '/images/house/house-01.jpg',
        width: 1200,
        height: 630,
        alt: 'Dom w Mesznej — widok od strony południowej z panoramą Beskidu Śląskiego',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dom w Mesznej — sprzedaż bez pośredników',
    description:
      'Dom 402 m² u stóp Beskidu Śląskiego. Bez pośredników, bez prowizji.',
    images: ['/images/house/house-01.jpg'],
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
icons: {
  icon: '/favicon.ico',
},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className="grain">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}