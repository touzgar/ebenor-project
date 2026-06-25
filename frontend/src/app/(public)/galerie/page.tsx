'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/premium/Header';
import { Footer } from '@/components/public/Footer';
import ProductGrid from '@/components/public/ProductGrid';
import Pagination from '@/components/ui/Pagination';
import { SkeletonGrid } from '@/components/ui/LoadingSkeleton';
import { getProducts, Product, ProductFilters, getCategories } from '@/lib/api/products';
import { 
  Squares2X2Icon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

/**
 * Gallery Page showing Products with SEO optimization
 * Requirements: 23.5, 23.9, 23.10
 */
function GaleriePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  
  // Load custom content from localStorage
  const [pageContent, setPageContent] = useState({
    hero: {
      title: 'Nos Projets',
      subtitle: 'Projets',
      description: 'Découvrez nos réalisations et laissez-vous inspirer par notre savoir-faire artisanal.',
    },
    cta: {
      title: 'Vous avez un projet en tête ?',
      description: 'Transformons ensemble votre vision en réalité. Notre équipe d\'artisans qualifiés est prête à créer la pièce unique qui sublimera votre espace.',
      buttonText: 'Demander un Devis Gratuit',
      buttonLink: '/contact',
    },
  });

  // Load content from database first, fallback to localStorage
  useEffect(() => {
    const loadContent = async () => {
      try {
        // Try loading from database first
        const response = await fetch('/api/projects');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setPageContent(result.data);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error('Error loading projects content from database:', error);
      }
      
      // Fallback to localStorage if database fails
      const saved = localStorage.getItem('projects_page_content');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setPageContent(parsed);
        } catch (error) {
          // Use default content
        }
      }
      
      setIsLoading(false);
    };

    loadContent();

    // Listen for content updates from admin panel
    const handleUpdate = () => {
      loadContent();
    };
    
    // Method 1: Listen for custom event (same tab)
    window.addEventListener('projects_page_updated', handleUpdate);
    
    // Method 2: Listen for storage events (cross-tab updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'projects_page_content') {
        loadContent();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Method 3: BroadcastChannel for real-time cross-tab updates
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('projects_page_updates');
      channel.onmessage = (event) => {
        if (event.data.type === 'update') {
          setPageContent(event.data.data);
        }
      };
    } catch (e) {
      // BroadcastChannel not supported
    }

    return () => {
      window.removeEventListener('projects_page_updated', handleUpdate);
      window.removeEventListener('storage', handleStorageChange);
      if (channel) {
        channel.close();
      }
    };
  }, []);
  
  // Update document title and meta description
  useEffect(() => {
    document.title = 'Nos Projets - Réalisations en Bois | ÉBENOR CRÉATION';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Découvrez nos réalisations et laissez-vous inspirer par notre savoir-faire artisanal. Galerie de créations en bois haut de gamme.');
    }
  }, []);
  
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  // Filters from URL
  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams.get('category') || undefined,
  });

  const [availableCategories, setAvailableCategories] = useState<Array<{ 
    category: string; 
    name: string; 
    count: number;
    icon?: string;
    color?: string;
  }>>([]);
  
  // Category name lookup map
  const [categoryNameMap, setCategoryNameMap] = useState<Record<string, string>>({});

  // Fix SSR hydration by only rendering on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    if (!mounted) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await getProducts(currentPage, 12, filters, '-createdAt');
      
      if (!response.success) {
        setError('Impossible de charger les produits. Veuillez réessayer.');
      }
      
      setProducts(response.data || []);
      setTotalPages(response.pagination?.pages || 1);
      setTotal(response.pagination?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des produits');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, mounted]);

  // Fetch available categories with counts from API
  const loadCategories = useCallback(async () => {
    try {
      // Don't show loading state on refresh - just update silently
      // Fetch real categories from your database
      const response = await getCategories();

      if (response && response.success && Array.isArray(response.data)) {
        // Normalize fields from backend (some responses use slug, category, or both)
        const categoriesArray = response.data.map((cat: any) => {
          const slug = cat.slug || cat.category || (cat.name && cat.name.toLowerCase().replace(/\s+/g, '-')) || '';
          return {
            category: slug,
            name: cat.name || cat.slug || cat.category || slug,
            description: cat.description || cat.desc || '',
            count: typeof cat.count === 'number' ? cat.count : Number(cat.count) || 0,
            icon: cat.icon || cat.iconHTML || '',
            color: cat.color || cat.hex || '',
          };
        });

        // Create lookup map: slug -> real name
        const nameMap: Record<string, string> = {};
        categoriesArray.forEach((c: any) => { nameMap[c.category] = c.name; });
        setCategoryNameMap(nameMap);

        // Filter out empty slugs and sort
        const valid = categoriesArray.filter((c: any) => c.category && c.name);
        valid.sort((a: any, b: any) => b.count - a.count);

        setAvailableCategories(valid);
      } else {
        // Silent fail
      }
    } catch (err) {
      // Silent fail
    }
  }, []);

  // Initial load of categories
  useEffect(() => {
    if (!mounted) return;
    loadCategories();
  }, [mounted, loadCategories]);

  // Poll for category updates every 10 seconds
  useEffect(() => {
    if (!mounted) return;

    const intervalId = setInterval(() => {
      loadCategories();
    }, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, [mounted, loadCategories]);

  // Fetch products when dependencies change
  useEffect(() => {
    if (!mounted) return; // Only fetch on client side
    fetchProducts();
  }, [fetchProducts, mounted]);

  // Update URL when filters change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    const queryString = params.toString();
    router.push(`/galerie${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [filters, currentPage, router]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: category === 'all' ? undefined : category,
    }));
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const hasActiveFilters = filters.category;

  // Show loading state during SSR/mounting or data loading
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Hero Section - Modern */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-72 h-72 bg-amber-300/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              key={`hero-${pageContent.hero.title}-${pageContent.hero.description}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 shadow-2xl shadow-amber-500/30 mb-8"
              >
                <Squares2X2Icon className="w-10 h-10 text-white" />
              </motion.div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-neutral-900 mb-6">
                {pageContent.hero.title.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">
                  {pageContent.hero.title.split(' ').slice(-1)[0]}
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-neutral-600 leading-relaxed">
                {pageContent.hero.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters Section - Redesigned Innovative */}
        <section className="py-8 bg-white border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Filtrer par catégorie</h2>
                <p className="text-sm text-neutral-500 mt-1">Trouvez exactement ce que vous cherchez</p>
              </div>
              
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Réinitialiser
                </motion.button>
              )}
            </div>

            {/* Category Chips - Modern Design */}
            <div className="flex flex-wrap gap-3" suppressHydrationWarning>
              <AnimatePresence mode="popLayout">
                {availableCategories.length > 0 ? (
                  <>
                    {/* All Button */}
                    <motion.button
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => handleCategoryChange('all')}
                      className={`relative px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                        !filters.category
                          ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                          : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                      }`}
                      suppressHydrationWarning
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Toutes
                        <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold ${
                          !filters.category 
                            ? 'bg-white/20 text-white' 
                            : 'bg-neutral-200 text-neutral-700'
                        }`}>
                          {availableCategories.reduce((sum, cat) => sum + (cat.count || 0), 0)}
                        </span>
                      </span>
                    </motion.button>

                    {/* Category Buttons */}
                    {availableCategories.map((cat) => {
                      const isActive = filters.category === cat.category;
                      return (
                        <motion.button
                          key={cat.category}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => handleCategoryChange(cat.category)}
                          className={`relative px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                            isActive
                              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                              : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          <span className="relative z-10 flex items-center gap-2.5">
                            {/* Color indicator */}
                            <span 
                              className="w-2 h-2 rounded-full"
                              style={{ 
                                backgroundColor: isActive ? 'white' : cat.color,
                                opacity: isActive ? 1 : 0.7
                              }}
                            />
                            {cat.name}
                            <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold ${
                              isActive 
                                ? 'bg-white/20 text-white' 
                                : 'bg-neutral-200 text-neutral-700'
                            }`}>
                              {cat.count}
                            </span>
                          </span>
                        </motion.button>
                      );
                    })}
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-neutral-500 py-2">
                    <div className="w-5 h-5 border-2 border-neutral-300 border-t-amber-600 rounded-full animate-spin" />
                    <span className="text-sm">Chargement des catégories...</span>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 bg-gradient-to-b from-white to-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                    <XMarkIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-red-900 mb-1">Erreur de chargement</h3>
                    <p className="text-sm text-red-700 mb-3">{error}</p>
                    <button
                      onClick={() => fetchProducts()}
                      className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      🔄 Réessayer
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Results Header with Pagination Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  {loading ? (
                    <div className="h-10 w-64 bg-neutral-200 animate-pulse rounded-lg" />
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-3">
                        <h3 className="text-4xl font-bold text-neutral-900">{total}</h3>
                        <p className="text-lg text-neutral-600">
                          projet{total !== 1 ? 's' : ''} {hasActiveFilters ? 'trouvé' + (total !== 1 ? 's' : '') : 'au total'}
                        </p>
                      </div>
                      {hasActiveFilters && !loading && (
                        <p className="text-sm text-amber-600 font-medium mt-1">
                          ✓ Filtre actif: {availableCategories.find(c => c.category === filters.category)?.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Pagination Info Badge */}
                {!loading && total > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-full">
                      <span className="text-sm font-medium text-amber-900">
                        Page {currentPage} sur {totalPages}
                      </span>
                    </div>
                    <div className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-full">
                      <span className="text-sm font-medium text-neutral-700">
                        {((currentPage - 1) * 12) + 1} - {Math.min(currentPage * 12, total)} projets
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Product Grid */}
            {loading ? (
              <SkeletonGrid count={12} type="product" columns={3} />
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Squares2X2Icon className="w-12 h-12 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                  Aucun projet trouvé
                </h3>
                <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                  Aucun projet ne correspond aux filtres sélectionnés. Essayez de modifier vos critères de recherche.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    Afficher tous les projets
                  </button>
                )}
              </motion.div>
            ) : (
              <ProductGrid products={products} categoryNameMap={categoryNameMap} />
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-16">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative py-24 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-72 h-72 bg-amber-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-600 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              key={`cta-${pageContent.cta.title}-${pageContent.cta.buttonText}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl mb-8 shadow-xl">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                {pageContent.cta.title}
              </h2>
              
              <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                {pageContent.cta.description}
              </p>
              
              <a 
                href={pageContent.cta.buttonLink} 
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-900 font-bold text-lg rounded-xl hover:bg-neutral-100 transition-all transform hover:scale-105 shadow-2xl"
              >
                <span>{pageContent.cta.buttonText}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default function GaleriePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Chargement...</p>
        </div>
      </div>
    }>
      <GaleriePageContent />
    </Suspense>
  );
}
