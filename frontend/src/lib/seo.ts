import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ebenor-creation.tn';
const SITE_NAME = 'ÉBENOR CRÉATION';
const DEFAULT_DESCRIPTION = 'ÉBENOR CRÉATION - Menuiserie haut de gamme en Tunisie. Créations sur mesure en bois : cuisines, dressings, mobilier et aménagements d\'exception.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

/**
 * Generate canonical URL for a page
 * Requirement 23.5: Product catalog includes canonical URL tags
 */
export function getCanonicalUrl(path: string): string {
  // Remove trailing slash and ensure path starts with /
  const cleanPath = path.replace(/\/$/, '').replace(/^([^/])/, '/$1');
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Generate base metadata for a page
 * Requirement 23.10: System ensures all pages have unique title and description tags
 */
export function generateMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = getCanonicalUrl(path);
  const ogImage = image || DEFAULT_IMAGE;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'fr_TN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
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
  };
}

/**
 * Generate Product schema structured data (JSON-LD)
 * Requirement 23.4: Product detail page includes structured data markup for Product schema
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  shortDescription: string;
  slug: string;
  images: Array<{ url: string; alt: string }>;
  price?: {
    amount: number;
    currency: string;
  };
  availability: 'in_stock' | 'made_to_order' | 'out_of_stock';
  category: string;
  materials?: string[];
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  seoTitle?: string;
  seoDescription?: string;
}) {
  const primaryImage = product.images.find((img) => img.url) || product.images[0];
  const productUrl = getCanonicalUrl(`/produits/${product.slug}`);

  // Map availability to schema.org format
  const availabilityMap = {
    in_stock: 'https://schema.org/InStock',
    made_to_order: 'https://schema.org/PreOrder',
    out_of_stock: 'https://schema.org/OutOfStock',
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description,
    image: product.images.map((img) => img.url),
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    category: product.category,
    ...(product.materials && product.materials.length > 0 && {
      material: product.materials.join(', '),
    }),
    ...(product.price && {
      offers: {
        '@type': 'Offer',
        url: productUrl,
        priceCurrency: product.price.currency || 'TND',
        price: product.price.amount,
        availability: availabilityMap[product.availability],
        seller: {
          '@type': 'Organization',
          name: SITE_NAME,
        },
      },
    }),
  };

  return schema;
}

/**
 * Generate BreadcrumbList schema structured data (JSON-LD)
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.url),
    })),
  };
}

/**
 * Generate Organization schema structured data (JSON-LD)
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.jpg`,
    description: DEFAULT_DESCRIPTION,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TN',
      addressLocality: 'Tunis',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'contact@ebenor-creation.tn',
      availableLanguage: ['French', 'Arabic'],
    },
    sameAs: [
      // Add social media URLs here when available
    ],
  };
}

/**
 * Generate WebSite schema structured data (JSON-LD)
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/produits?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION, DEFAULT_IMAGE };
