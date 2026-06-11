import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Meteo Teramo',
  description: 'Dati meteo in tempo reale per Teramo, Abruzzo',
  openGraph: {
    title: 'Meteo Teramo',
    description: 'Temperatura, vento, pioggia e previsioni per Teramo',
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
