import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ÉBÉNOR CRÉATION - L\'élégance du bois, l\'empreinte de l\'art',
    template: '%s | ÉBÉNOR CRÉATION',
  },
  description: 'Créateur d\'espaces d\'exception en Tunisie depuis plus de 25 ans. Cuisines sur mesure, dressings luxueux, mobilier haut de gamme. Savoir-faire artisanal et matériaux nobles.',
  keywords: ['ébénisterie Tunisie', 'cuisine sur mesure', 'dressing luxueux', 'mobilier haut de gamme', 'menuiserie artisanale', 'aménagement intérieur', 'bois noble', 'fabrication sur mesure Tunis'],
  authors: [{ name: 'ÉBÉNOR CRÉATION' }],
  creator: 'ÉBÉNOR CRÉATION',
  publisher: 'ÉBÉNOR CRÉATION',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    title: 'ÉBÉNOR CRÉATION - L\'élégance du bois, l\'empreinte de l\'art',
    description: 'Créateur d\'espaces d\'exception en Tunisie depuis plus de 25 ans. Cuisines sur mesure, dressings luxueux, mobilier haut de gamme.',
    siteName: 'ÉBÉNOR CRÉATION',
    images: [
      {
        url: '/logo/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'ÉBÉNOR CRÉATION - Fabrication de bois haut de gamme',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ÉBÉNOR CRÉATION - L\'élégance du bois, l\'empreinte de l\'art',
    description: 'Créateur d\'espaces d\'exception en Tunisie depuis plus de 25 ans. Cuisines sur mesure, dressings luxueux, mobilier haut de gamme.',
    images: ['/logo/logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo/logo.jpg',
    shortcut: '/logo/logo.jpg',
    apple: '/logo/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          <div id="root">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}