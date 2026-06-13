import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Meteo Italia',
    template: '%s — Meteo Italia',
  },
  description: 'Dati meteo in tempo reale per tutti i comuni italiani: temperatura, vento, pioggia e mappa di calore nazionale',
  openGraph: {
    title: 'Meteo Italia',
    description: 'Temperatura, vento, pioggia e previsioni per tutti i comuni d\'Italia',
    locale: 'it_IT',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
