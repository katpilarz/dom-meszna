import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Dom w Mesznej — sprzedaż bezpośrednio od właścicielki',
  description:
    'Dom 402 m² w Mesznej u stóp Beskidu Śląskiego. Działka 1 600 m², 7 pokoi, budowa 2018. Bez pośredników.',
  openGraph: {
    title: 'Dom w Mesznej — sprzedaż bezpośrednio od właścicielki',
    description:
      'Dom 402 m² u stóp Beskidu Śląskiego. Bez pośredników, bez prowizji.',
    type: 'website',
    locale: 'pl_PL',
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
        {/*
          Hidden static form for Netlify Forms detection at build time.
          Netlify scans the rendered HTML for forms with `data-netlify` attribute.
          The actual interactive form lives in components/Contact.tsx and submits
          to this endpoint via fetch().
        */}
        <form
          name="kontakt"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          hidden
          aria-hidden="true"
        >
          <input type="text" name="form-name" value="kontakt" readOnly />
          <input type="text" name="bot-field" />
          <input type="text" name="imie" />
          <input type="email" name="email" />
          <input type="tel" name="telefon" />
          <input type="text" name="termin" />
          <textarea name="wiadomosc" />
        </form>

        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

