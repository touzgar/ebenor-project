import { useState, useEffect } from 'react';
import { getFeaturedProducts, Product } from '@/lib/api/products';
import { getFeaturedGalleryImages, GalleryImage } from '@/lib/api/gallery';

/**
 * Hook to fetch featured products
 */
export function useFeaturedProducts(limit: number = 6) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getFeaturedProducts(limit);
        setProducts(response.data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit]);

  return { products, loading, error };
}

/**
 * Hook to fetch featured gallery images
 */
export function useFeaturedGallery(limit: number = 12) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await getFeaturedGalleryImages(limit);
        setImages(response.data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching featured gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [limit]);

  return { images, loading, error };
}

/**
 * Hook to fetch home content
 */
export function useHomeContent() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_BASE_URL}/home`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch home content');
        }
        
        const data = await response.json();
        setContent(data.data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching home content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return { content, loading, error };
}
