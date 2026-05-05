import { useState, useEffect } from 'react';
import { galleryService } from '@/lib/api';

interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  alt: string;
  dimensions: {
    width: number;
    height: number;
  };
  fileSize: number;
  mimeType: string;
  featured: boolean;
  sortOrder: number;
  uploadedAt: Date;
}

interface UseGalleryOptions {
  featured?: boolean;
  category?: string;
  limit?: number;
  page?: number;
}

export function useGallery(options: UseGalleryOptions = {}) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params: Record<string, any> = {};
        
        if (options.featured !== undefined) {
          params.featured = options.featured.toString();
        }
        
        if (options.category) {
          params.category = options.category;
        }
        
        if (options.limit) {
          params.limit = options.limit.toString();
        }
        
        if (options.page) {
          params.page = options.page.toString();
        }

        const response = await galleryService.getImages(params);
        
        if (response.success && response.data) {
          setImages(response.data as GalleryImage[]);
          
          if ('pagination' in response && response.pagination) {
            setPagination(response.pagination as { page: number; limit: number; total: number; pages: number; });
          }
        } else {
          throw new Error('Erreur lors du chargement de la galerie');
        }
      } catch (err) {
        console.error('Erreur lors du chargement de la galerie:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        
        // Fallback vers des images par défaut en cas d'erreur
        const fallbackImages: GalleryImage[] = [
          {
            _id: "1",
            title: "Cuisine Contemporaine",
            description: "Réalisation d'une cuisine contemporaine avec îlot central",
            url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            thumbnailUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            category: "cuisine",
            tags: ["moderne", "îlot", "contemporain"],
            alt: "Cuisine contemporaine avec îlot central",
            dimensions: {
              width: 1200,
              height: 800
            },
            fileSize: 245760,
            mimeType: "image/jpeg",
            featured: true,
            sortOrder: 1,
            uploadedAt: new Date()
          },
          {
            _id: "2",
            title: "Dressing Sur Mesure",
            description: "Dressing personnalisé avec rangements optimisés",
            url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            thumbnailUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            category: "dressing",
            tags: ["sur-mesure", "rangement", "optimisé"],
            alt: "Dressing sur mesure avec rangements",
            dimensions: {
              width: 1000,
              height: 1200
            },
            fileSize: 198432,
            mimeType: "image/jpeg",
            featured: true,
            sortOrder: 2,
            uploadedAt: new Date()
          },
          {
            _id: "3",
            title: "Salon Moderne",
            description: "Aménagement complet d'un salon moderne",
            url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            thumbnailUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            category: "salon",
            tags: ["moderne", "aménagement", "complet"],
            alt: "Salon moderne avec mobilier sur mesure",
            dimensions: {
              width: 1400,
              height: 900
            },
            fileSize: 312000,
            mimeType: "image/jpeg",
            featured: true,
            sortOrder: 3,
            uploadedAt: new Date()
          },
          {
            _id: "4",
            title: "Bureau Exécutif",
            description: "Bureau exécutif en bois noble",
            url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            thumbnailUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            category: "bureau",
            tags: ["exécutif", "bois-noble", "professionnel"],
            alt: "Bureau exécutif en bois noble",
            dimensions: {
              width: 1100,
              height: 800
            },
            fileSize: 278000,
            mimeType: "image/jpeg",
            featured: false,
            sortOrder: 4,
            uploadedAt: new Date()
          }
        ];
        
        if (options.featured) {
          setImages(fallbackImages.filter(img => img.featured));
        } else {
          setImages(fallbackImages);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [options.featured, options.category, options.limit, options.page]);

  return { images, loading, error, pagination };
}

export function useFeaturedGallery(limit: number = 12) {
  return useGallery({ featured: true, limit });
}