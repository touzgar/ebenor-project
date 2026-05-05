import { useEffect } from 'react';
import { generateProductSchema, generateBreadcrumbSchema, getCanonicalUrl } from '@/lib/seo';
import { getCategoryLabel } from '@/lib/api/products';

interface Product {
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
}

/**
 * Custom hook to manage SEO for product detail pages
 * Requirements: 23.1, 23.2, 23.3, 23.4, 23.5
 */
export function useProductSEO(product: Product | null) {
  useEffect(() => {
    if (!product) return;

    // Update document title
    // Requirement 23.1: Product detail page includes meta title with product name and brand
    const productTitle = product.seoTitle || `${product.name} | ÉBENOR CRÉATION`;
    document.title = productTitle;

    // Update or create meta description
    // Requirement 23.2: Product detail page includes meta description with product short description
    const productDescription = product.seoDescription || product.shortDescription;
    updateMetaTag('name', 'description', productDescription);

    // Update canonical URL
    // Requirement 23.5: Product catalog includes canonical URL tags
    const canonicalUrl = getCanonicalUrl(`/produits/${product.slug}`);
    updateLinkTag('canonical', canonicalUrl);

    // Update Open Graph tags
    // Requirement 23.3: Product detail page includes Open Graph tags for social media sharing
    updateMetaTag('property', 'og:type', 'product');
    updateMetaTag('property', 'og:title', productTitle);
    updateMetaTag('property', 'og:description', productDescription);
    updateMetaTag('property', 'og:image', product.images[0]?.url || '/placeholder-product.jpg');
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:site_name', 'ÉBENOR CRÉATION');
    updateMetaTag('property', 'product:brand', 'ÉBENOR CRÉATION');
    updateMetaTag('property', 'product:availability', product.availability);

    if (product.price) {
      updateMetaTag('property', 'product:price:amount', product.price.amount.toString());
      updateMetaTag('property', 'product:price:currency', product.price.currency);
    }

    // Update Twitter Card tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', productTitle);
    updateMetaTag('name', 'twitter:description', productDescription);
    updateMetaTag('name', 'twitter:image', product.images[0]?.url || '/placeholder-product.jpg');

    // Add structured data scripts
    // Requirement 23.4: Product detail page includes structured data markup for Product schema
    const productSchema = generateProductSchema(product);
    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Accueil', url: '/' },
      { name: 'Produits', url: '/produits' },
      { name: getCategoryLabel(product.category), url: `/produits?category=${product.category}` },
      { name: product.name, url: `/produits/${product.slug}` },
    ]);

    addStructuredData('product-schema', productSchema);
    addStructuredData('breadcrumb-schema', breadcrumbSchema);

    // Cleanup function
    return () => {
      // Remove structured data scripts on unmount
      removeStructuredData('product-schema');
      removeStructuredData('breadcrumb-schema');
    };
  }, [product]);
}

/**
 * Helper function to update or create meta tags
 */
function updateMetaTag(attribute: 'name' | 'property', value: string, content: string) {
  let metaTag = document.querySelector(`meta[${attribute}="${value}"]`);
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute(attribute, value);
    document.head.appendChild(metaTag);
  }
  metaTag.setAttribute('content', content);
}

/**
 * Helper function to update or create link tags
 */
function updateLinkTag(rel: string, href: string) {
  let linkTag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  if (!linkTag) {
    linkTag = document.createElement('link');
    linkTag.setAttribute('rel', rel);
    document.head.appendChild(linkTag);
  }
  linkTag.href = href;
}

/**
 * Helper function to add structured data script
 */
function addStructuredData(id: string, data: any) {
  // Remove existing script if present
  removeStructuredData(id);

  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

/**
 * Helper function to remove structured data script
 */
function removeStructuredData(id: string) {
  const existingScript = document.getElementById(id);
  if (existingScript) {
    existingScript.remove();
  }
}
