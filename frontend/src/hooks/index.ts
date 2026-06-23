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
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [limit]);

  return { images, loading, error };
}

/**
 * Hook to fetch home content from API
 */
export function useHomeContent() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
        const response = await fetch(`${API_BASE_URL}/home`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch home content');
        }
        
        const data = await response.json();
        setContent(data.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return { content, loading, error };
}

/**
 * Hook to fetch home content from localStorage with real-time updates
 */
export function useHomeContentLocal() {
  const [content, setContent] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const loadContent = () => {
      const saved = localStorage.getItem('homepage_content');
      if (saved) {
        try {
          setContent(JSON.parse(saved));
        } catch (error) {
          // Use null if parsing fails
        }
      }
    };

    loadContent();

    // Listen for updates
    const handleUpdate = () => loadContent();
    window.addEventListener('homepage_content_updated', handleUpdate);
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'homepage_content') {
        loadContent();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('homepage_updates');
      channel.onmessage = (event) => {
        if (event.data.type === 'update') {
          setContent(event.data.data);
        }
      };
    } catch (e) {
      // BroadcastChannel not supported
    }

    return () => {
      window.removeEventListener('homepage_content_updated', handleUpdate);
      window.removeEventListener('storage', handleStorageChange);
      if (channel) {
        channel.close();
      }
    };
  }, [mounted]);

  return { content, mounted };
}
