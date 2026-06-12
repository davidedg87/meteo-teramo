import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Meteo Teramo e Provincia',
    template: '%s — Provincia di Teramo',
  },
  description: 'Dati meteo in tempo reale per Teramo e tutti i comuni della provincia: costa adriatica, collina e Gran Sasso',
  openGraph: {
    title: 'Meteo Teramo e Provincia',
    description: 'Temperatura, vento, pioggia e previsioni per tutta la provincia di Teramo',
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
