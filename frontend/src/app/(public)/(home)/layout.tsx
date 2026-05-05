import { ReactNode } from 'react';
import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo';

interface HomeLayoutProps {
  children: ReactNode;
}

/**
 * Default metadata for homepage
 * Requirements: 23.1, 23.2, 23.6, 23.9, 23.10
 */
export const metadata: Metadata = generateSEOMetadata({
  title: 'ÉBENOR CRÉATION',
  description: 'ÉBENOR CRÉATION - Menuiserie haut de gamme en Tunisie. Créations sur mesure en bois : cuisines, dressings, mobilier et aménagements d\'exception.',
  path: '/',
});

/**
 * Home Layout Component
 * 
 * Minimal layout for homepage - the page itself handles all structure
 * including Header, main content, and Footer.
 * 
 * **Validates: Requirement 23.9** - Semantic HTML structure with proper heading hierarchy
 */
export default function HomeLayout({ children }: HomeLayoutProps) {
  // Generate structured data for Organization and WebSite
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <>
      {/* Structured Data - Organization and WebSite schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      
      {/* Homepage handles its own structure - no wrapper needed */}
      {children}
    </>
  );
}
