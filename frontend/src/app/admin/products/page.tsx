'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { productsService } from '@/lib/api';
import ProductBulkActions from '@/components/admin/ProductBulkActions';
import { LoadingSpinner, SkeletonTable } from '@/components/ui';
import type { Product } from '@/types';

export default function ProductsListPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 12;

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');

  // Bulk selection
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch products
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: Record<string, string> = {
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
        };

        if (searchQuery) params.search = searchQuery;
        if (categoryFilter) params.category = categoryFilter;
        if (availabilityFilter) params.availability = availabilityFilter;
        if (featuredFilter) params.featured = featuredFilter;

        const response = await productsService.getAll(params);

        if (response.success && response.data) {
          setProducts(response.data as Product[]);
          
          if ('pagination' in response && response.pagination) {
            const pagination = response.pagination as any;
            setTotalPages(pagination.pages || 1);
            setTotalProducts(pagination.total || 0);
          }
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isAuthenticated, currentPage, searchQuery, categoryFilter, availabilityFilter, featuredFilter]);

  // Bulk selection handlers
  const handleSelectAll = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map(p => p._id!)));
    }
  };

  const handleSelectProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  useEffect(() => {
    setShowBulkActions(selectedProducts.size > 0);
  }, [selectedProducts]);

  // Handle bulk operations success
  const handleBulkSuccess = () => {
    // Refresh products list
    setCurrentPage(1);
  };

  // Handle clear selection
  const handleClearSelection = () => {
    setSelectedProducts(new Set());
  };

  // Format price
  const formatPrice = (price?: { amount: number; currency: string; unit?: string }) => {
    if (!price) return 'Prix sur demande';
    return `${price.amount.toLocaleString()} ${price.currency}${price.unit ? `/${price.unit}` : ''}`;
  };

  // Get availability badge
  const getAvailabilityBadge = (availability: string) => {
    const badges = {
      in_stock: { label: 'En stock', color: 'bg-green-100 text-green-800' },
      made_to_order: { label: 'Sur commande', color: 'bg-blue-100 text-blue-800' },
      out_of_stock: { label: 'Rupture', color: 'bg-red-100 text-red-800' },
    };
    return badges[availability as keyof typeof badges] || badges.made_to_order;
  };

  // Loading state
  if (authLoading || (loading && products.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <LoadingSpinner size="xl" variant="primary" text="Chargement..." centered />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold text-neutral-900">
                Gestion des produits
              </h1>
              <p className="mt-2 text-neutral-600">
                {totalProducts} produit{totalProducts > 1 ? 's' : ''} au total
              </p>
            </motion.div>

            <Link
              href="/admin/products/new"
              className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Créer un produit
            </Link>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Rechercher
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Nom, description, tags..."
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Catégorie
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">Toutes</option>
                <option value="cuisine">Cuisine</option>
                <option value="dressing">Dressing</option>
                <option value="mobilier">Mobilier</option>
                <option value="amenagement">Aménagement</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Disponibilité
              </label>
              <select
                value={availabilityFilter}
                onChange={(e) => {
                  setAvailabilityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">Toutes</option>
                <option value="in_stock">En stock</option>
                <option value="made_to_order">Sur commande</option>
                <option value="out_of_stock">Rupture</option>
              </select>
            </div>

            {/* Featured Filter */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                En vedette
              </label>
              <select
                value={featuredFilter}
                onChange={(e) => {
                  setFeaturedFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">Tous</option>
                <option value="true">En vedette uniquement</option>
                <option value="false">Non en vedette</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchQuery || categoryFilter || availabilityFilter || featuredFilter) && (
              <div className="lg:col-span-2 flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('');
                    setAvailabilityFilter('');
                    setFeaturedFilter('');
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {showBulkActions && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <ProductBulkActions
              selectedProductIds={Array.from(selectedProducts)}
              onSuccess={handleBulkSuccess}
              onClear={handleClearSelection}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          {error && (
            <div className="p-4 bg-red-50 border-b border-red-200">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="p-8">
              <SkeletonTable rows={5} columns={7} hasActions />
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-neutral-600 mb-4">
                {searchQuery || categoryFilter || availabilityFilter || featuredFilter
                  ? 'Essayez de modifier vos filtres'
                  : 'Commencez par créer votre premier produit'}
              </p>
              {!searchQuery && !categoryFilter && !availabilityFilter && !featuredFilter && (
                <Link
                  href="/admin/products/new"
                  className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Créer un produit
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedProducts.size === products.length && products.length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-amber-600 border-neutral-300 rounded focus:ring-amber-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Prix
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Disponibilité
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Vedette
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {products.map((product) => {
                      const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
                      const badge = getAvailabilityBadge(product.availability);

                      return (
                        <tr key={product._id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedProducts.has(product._id!)}
                              onChange={() => handleSelectProduct(product._id!)}
                              className="w-4 h-4 text-amber-600 border-neutral-300 rounded focus:ring-amber-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-100">
                              {primaryImage ? (
                                <Image
                                  src={primaryImage.url}
                                  alt={primaryImage.alt}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-neutral-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-neutral-500 line-clamp-1">
                              {product.shortDescription}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 capitalize">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-900">
                            {formatPrice(product.price)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                              {badge.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {product.featured ? (
                              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-neutral-300" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Link
                                href={`/admin/products/${product._id}/edit`}
                                className="text-amber-600 hover:text-amber-900 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </Link>
                              <button
                                onClick={async () => {
                                  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
                                    try {
                                      await productsService.delete(product._id!);
                                      setCurrentPage(1);
                                    } catch (err) {
                                      alert('Erreur lors de la suppression');
                                    }
                                  }
                                }}
                                className="text-red-600 hover:text-red-900 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-neutral-700">
                      Page {currentPage} sur {totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Précédent
                      </button>
                      
                      {/* Page numbers */}
                      <div className="hidden sm:flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-amber-600 text-white'
                                  : 'text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
