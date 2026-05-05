import { useState, useEffect } from 'react';
import { productsService } from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  subcategory?: string;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  specifications: Record<string, string>;
  materials: string[];
  finishes: string[];
  price: {
    amount: number;
    currency: string;
    unit: string;
  };
  availability: string;
  featured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface UseProductsOptions {
  featured?: boolean;
  category?: string;
  limit?: number;
  page?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
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

        const response = options.featured 
          ? await productsService.getAll({ featured: 'true', limit: options.limit || 6 })
          : await productsService.getAll(params);
        
        if (response.success && response.data) {
          setProducts(response.data as Product[]);
          
          if ('pagination' in response && response.pagination) {
            setPagination(response.pagination as { page: number; limit: number; total: number; pages: number; });
          }
        } else {
          throw new Error('Erreur lors du chargement des produits');
        }
      } catch (err) {
        console.error('Erreur lors du chargement des produits:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        
        // Fallback vers des produits par défaut en cas d'erreur
        const fallbackProducts: Product[] = [
          {
            _id: "1",
            name: "Cuisine Moderne Chêne",
            slug: "cuisine-moderne-chene",
            description: "Une cuisine moderne en chêne massif avec îlot central et finitions haut de gamme. Design épuré et fonctionnel pour un espace de vie convivial.",
            shortDescription: "Cuisine moderne en chêne massif avec îlot central",
            category: "cuisine",
            subcategory: "moderne",
            images: [
              {
                url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                alt: "Cuisine moderne en chêne",
                isPrimary: true
              }
            ],
            specifications: {
              "Matériau": "Chêne massif",
              "Finition": "Vernis mat",
              "Style": "Moderne",
              "Garantie": "10 ans"
            },
            materials: ["Chêne massif", "Quartz", "Inox"],
            finishes: ["Vernis mat", "Laque brillante"],
            price: {
              amount: 15000,
              currency: "TND",
              unit: "ensemble"
            },
            availability: "made_to_order",
            featured: true,
            tags: ["moderne", "chêne", "îlot", "haut-de-gamme"],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            _id: "2",
            name: "Dressing Walk-in Luxe",
            slug: "dressing-walk-in-luxe",
            description: "Dressing walk-in sur mesure avec éclairage LED intégré, miroirs et rangements optimisés. Parfait pour les grandes chambres parentales.",
            shortDescription: "Dressing walk-in avec éclairage LED intégré",
            category: "dressing",
            subcategory: "walk-in",
            images: [
              {
                url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                alt: "Dressing walk-in luxe",
                isPrimary: true
              }
            ],
            specifications: {
              "Matériau": "MDF laqué",
              "Éclairage": "LED intégré",
              "Miroirs": "Inclus",
              "Garantie": "5 ans"
            },
            materials: ["MDF", "Verre", "Aluminium"],
            finishes: ["Laque mate", "Laque brillante"],
            price: {
              amount: 8500,
              currency: "TND",
              unit: "ensemble"
            },
            availability: "made_to_order",
            featured: true,
            tags: ["dressing", "walk-in", "LED", "luxe"],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        
        if (options.featured) {
          setProducts(fallbackProducts.filter(p => p.featured));
        } else {
          setProducts(fallbackProducts);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [options.featured, options.category, options.limit, options.page]);

  return { products, loading, error, pagination };
}

export function useFeaturedProducts(limit: number = 6) {
  return useProducts({ featured: true, limit });
}