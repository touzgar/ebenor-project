import { ReactNode } from 'react';
import { Metadata } from 'next';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { generateMetadata as generateSEOMetadata, generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo';

interface PublicLayoutProps {
  children: ReactNode;
}

/**
 * Default metadata for public pages
 * Requirements: 23.1, 23.2, 23.6, 23.9, 23.10
 */
export const metadata: Metadata = generateSEOMetadata({
  title: 'ÉBENOR CRÉATION',
  description: 'ÉBENOR CRÉATION - Menuiserie haut de gamme en Tunisie. Créations sur mesure en bois : cuisines, dressings, mobilier et aménagements d\'exception.',
  path: '/',
});

/**
 * Public Layout Component
 * 
 * Provides semantic HTML structure for public pages
 * 
 * **Validates: Requirement 21.10** - Semantic HTML structure
 * **Validates: Requirement 23.9** - Semantic HTML structure with proper heading hierarchy
 */
export default function PublicLayout({ children }: PublicLayoutProps) {
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
      
      {/* Skip navigation removed - not needed for this design */}
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}