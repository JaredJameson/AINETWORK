import { Montserrat } from 'next/font/google';
import './globals.css';
import LayoutShell from '@/components/LayoutShell';

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata = {
  title: 'AI NETWORK — Platforma wiedzy i wydarzeń AI',
  description: 'Platforma transferu wiedzy i budowy kompetencji AI. Integrujemy ludzi z różnych branż wokół praktycznych wdrożeń sztucznej inteligencji.',
  keywords: 'AI, sztuczna inteligencja, wdrożenia AI, события AI, biznes AI, machine learning',
  openGraph: {
    title: 'AI NETWORK',
    description: 'Platforma wiedzy i wydarzeń AI dla ludzi, którzy AI wdrażają — nie tylko o nim mówią.',
    locale: 'pl_PL',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={montserrat.variable}>
      <body>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
