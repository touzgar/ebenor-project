import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ebenor-creation.com';

interface Product {
  slug: string;
  updatedAt: string;
}

interface GalleryImage {
  _id: string;
  updatedAt: string;
}

/**
 * Generate XML sitemap for all public pages
 * Requirement 23.7: System generates XML sitemap including all public pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/produits`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/galerie`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  sitemap.push(...staticPages);

  try {
    // Fetch all products for dynamic product pages
    const productsResponse = await fetch(`${API_URL}/products?limit=1000`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      const products: Product[] = productsData.data || [];

      const productPages = products.map((product) => ({
        url: `${SITE_URL}/produits/${product.slug}`,
        lastModified: new Date(product.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));

      sitemap.push(...productPages);
    }
  } catch (error) {
    // Silently ignore - backend not running during build
  }

  try {
    // Fetch all gallery images for dynamic gallery pages (if individual pages exist)
    // Currently gallery is a single page, but we include it for future expansion
    const galleryResponse = await fetch(`${API_URL}/gallery?limit=1000`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (galleryResponse.ok) {
      const galleryData = await galleryResponse.json();
      const images: GalleryImage[] = galleryData.data || [];

      // If we add individual gallery image pages in the future, uncomment this:
      // const galleryPages = images.map((image) => ({
      //   url: `${SITE_URL}/galerie/${image._id}`,
      //   lastModified: new Date(image.updatedAt),
      //   changeFrequency: 'monthly' as const,
      //   priority: 0.6,
      // }));
      // sitemap.push(...galleryPages);
    }
  } catch (error) {
    // Silently ignore - backend not running during build
  }

  return sitemap;
}
