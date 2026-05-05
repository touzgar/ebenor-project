import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Product statistics interface
 */
export interface ProductStats {
  totalProducts: number;
  featuredProducts: number;
  categoriesCount: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
}

/**
 * Gallery statistics interface
 */
export interface GalleryStats {
  totalImages: number;
  featuredImages: number;
  categoriesCount: number;
  totalSize: number;
  avgSize: number;
  formatsCount: number;
}

/**
 * Media library statistics interface
 */
export interface MediaStats {
  totalMedia: number;
  totalImages: number;
  totalVideos: number;
  totalSize: number;
  bySource: {
    product: number;
    gallery: number;
    homepage: number;
  };
  byCategory: Record<string, number>;
}

/**
 * Recent upload item interface
 */
export interface RecentUpload {
  id: string;
  type: 'product' | 'gallery';
  name: string;
  imageUrl?: string;
  createdAt: string;
  category?: string;
}

/**
 * Products breakdown by category
 */
export interface CategoryBreakdown {
  category: string;
  count: number;
  subcategories: string[];
}

/**
 * Hook to fetch product statistics
 */
export function useProductStats() {
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products/stats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch product stats');
        }

        const data = await response.json();
        setStats(data.data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching product stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}

/**
 * Hook to fetch gallery statistics
 */
export function useGalleryStats() {
  const [stats, setStats] = useState<GalleryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/gallery/stats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch gallery stats');
        }

        const data = await response.json();
        setStats(data.data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching gallery stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}

/**
 * Hook to fetch media library statistics (requires authentication)
 */
export function useMediaStats() {
  const [stats, setStats] = useState<MediaStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_BASE_URL}/admin/media/stats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch media stats');
        }

        const data = await response.json();
        setStats(data.data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching media stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}

/**
 * Hook to fetch products breakdown by category
 */
export function useProductCategories() {
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch product categories');
        }

        const data = await response.json();
        setCategories(data.data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching product categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

/**
 * Hook to fetch recent uploads (last 10 items)
 */
export function useRecentUploads() {
  const [uploads, setUploads] = useState<RecentUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRecentUploads = async () => {
      try {
        setLoading(true);
        
        // Fetch recent products and gallery images in parallel
        const [productsResponse, galleryResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/products?limit=5&sort=-createdAt`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }),
          fetch(`${API_BASE_URL}/gallery?limit=5&sort=date`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }),
        ]);

        if (!productsResponse.ok || !galleryResponse.ok) {
          throw new Error('Failed to fetch recent uploads');
        }

        const productsData = await productsResponse.json();
        const galleryData = await galleryResponse.json();

        // Combine and format the data
        const recentProducts: RecentUpload[] = (productsData.data || []).map((product: any) => ({
          id: product._id,
          type: 'product' as const,
          name: product.name,
          imageUrl: product.images?.[0]?.url,
          createdAt: product.createdAt,
          category: product.category,
        }));

        const recentGallery: RecentUpload[] = (galleryData.data || []).map((image: any) => ({
          id: image._id,
          type: 'gallery' as const,
          name: image.title,
          imageUrl: image.url,
          createdAt: image.uploadedAt,
          category: image.category,
        }));

        // Combine and sort by date
        const combined = [...recentProducts, ...recentGallery]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10);

        setUploads(combined);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching recent uploads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentUploads();
  }, []);

  return { uploads, loading, error };
}

/**
 * Combined hook for all dashboard analytics
 */
export function useDashboardAnalytics() {
  const productStats = useProductStats();
  const galleryStats = useGalleryStats();
  const mediaStats = useMediaStats();
  const categories = useProductCategories();
  const recentUploads = useRecentUploads();

  const loading = 
    productStats.loading || 
    galleryStats.loading || 
    mediaStats.loading || 
    categories.loading || 
    recentUploads.loading;

  const error = 
    productStats.error || 
    galleryStats.error || 
    mediaStats.error || 
    categories.error || 
    recentUploads.error;

  return {
    productStats: productStats.stats,
    galleryStats: galleryStats.stats,
    mediaStats: mediaStats.stats,
    categories: categories.categories,
    recentUploads: recentUploads.uploads,
    loading,
    error,
  };
}
