import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Dom w Mesznej — sprzedaż bezpośrednio od właścicielki',
  description:
    'Dom 402 m² w Mesznej u stóp Beskidu Śląskiego. Działka 1 600 m², 7 pokoi, budowa 2018. Bez pośredników.',
  authors: { name: 'PAISAK4U' },
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}