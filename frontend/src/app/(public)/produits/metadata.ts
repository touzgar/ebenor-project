import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

/**
 * Metadata for Product Catalog Page
 * Requirements: 23.5, 23.9, 23.10
 */
export const metadata: Metadata = generateMetadata({
  title: 'Nos Produits - Créations en Bois Sur Mesure',
  description: 'Découvrez notre collection de créations en bois d\'exception : cuisines sur mesure, dressings, mobilier et aménagements haut de gamme. Savoir-faire artisanal tunisien.',
  path: '/produits',
});
