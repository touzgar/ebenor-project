'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { toast } from '@/lib/toast';
import { productsService, categoryService } from '@/lib/api';
import { triggerDashboardRefresh } from '@/lib/dashboardRefresh';
import type { Product } from '@/types';
import ColumnVisibilityMenu from '@/components/admin/ColumnVisibilityMenu';
import type { Column } from '@/components/admin/ColumnVisibilityMenu';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CubeIcon,
  StarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export default function ProductsListPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 10;

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Define table columns
  const tableColumns: Column[] = [
    { id: 'image', label: 'Image', isEssential: true, defaultVisible: true },
    { id: 'product', label: 'Produit', isEssential: true, defaultVisible: true },
    { id: 'category', label: 'Catégorie', defaultVisible: true },
    { id: 'price', label: 'Prix', defaultVisible: true },
    { id: 'availability', label: 'Disponibilité', defaultVisible: true },
    { id: 'featured', label: 'Vedette', defaultVisible: true },
    { id: 'video', label: 'Vidéo', defaultVisible: false },
    { id: 'materials', label: 'Matériaux', defaultVisible: false },
    { id: 'dimensions', label: 'Dimensions', defaultVisible: false },
    { id: 'tags', label: 'Tags', defaultVisible: false },
    { id: 'created', label: 'Date de création', defaultVisible: false },
    { id: 'actions', label: 'Actions', isEssential: true, defaultVisible: true },
  ];

  // Column visibility management
  const { visibleColumns, setVisibleColumns, isColumnVisible } = useColumnVisibility({
    columns: tableColumns,
    storageKey: 'products-table-columns',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Check for success parameters in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const successParam = urlParams.get('success');
    const productName = urlParams.get('name') || 'Produit';

    if (successParam === 'updated') {
      toast.success(`${productName} a été mis à jour avec succès`);
      // Clean URL
      window.history.replaceState({}, '', '/admin/products');
    } else if (successParam === 'true') {
      toast.success(`${productName} a été créé avec succès`);
      // Clean URL
      window.history.replaceState({}, '', '/admin/products');
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
    // Also listen for URL refresh parameter
    const urlParams = new URLSearchParams(window.location.search);
    const refreshParam = urlParams.get('refresh');
    // refreshParam is included to trigger refetch when URL changes
  }, [isAuthenticated, currentPage, searchQuery, categoryFilter, availabilityFilter, featuredFilter]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll({ isActive: 'true', limit: 100 });
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params: Record<string, string> = {
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        _t: Date.now().toString(), // Cache buster
      };

      const trimmedSearch = searchQuery.trim();
      if (trimmedSearch.length >= 2) {
        params.search = trimmedSearch;
      }

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
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    try {
      setActionLoading(true);
      const response = await productsService.delete(deletingProduct._id!);

      if (response.success) {
        toast.success('Produit supprimé avec succès');
        fetchProducts();
        triggerDashboardRefresh();
        setShowDeleteModal(false);
        setDeletingProduct(null);
      }
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Erreur lors de la suppression');
    } finally {
      setActionLoading(false);
    }
  };

  const formatPrice = (price?: { amount: number; currency: string; unit?: string }) => {
    if (!price) return 'Prix sur demande';
    return `${price.amount.toLocaleString()} ${price.currency}${price.unit ? `/${price.unit}` : ''}`;
  };

  const formatDimensions = (dimensions?: { length?: number; width?: number; height?: number; unit?: string }) => {
    if (!dimensions) return '-';
    const { length, width, height, unit = 'cm' } = dimensions;
    if (length && width && height) {
      return `${length}×${width}×${height} ${unit}`;
    }
    return '-';
  };

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getAvailabilityBadge = (availability: string) => {
    const badges = {
      in_stock: { label: 'En stock', color: 'bg-green-100 text-green-800' },
      made_to_order: { label: 'Sur commande', color: 'bg-blue-100 text-blue-800' },
      out_of_stock: { label: 'Rupture', color: 'bg-red-100 text-red-800' },
    };
    return badges[availability as keyof typeof badges] || badges.made_to_order;
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-amber-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
                <CubeIcon className="h-8 w-8 text-amber-600" />
                Gestion des Produits
              </h1>
              <p className="mt-2 text-neutral-600">
                Gérez votre catalogue de produits
              </p>
            </div>
            <Link
              href="/admin/products/new"
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="h-5 w-5" />
              Nouveau Produit
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-amber-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Produits</p>
                <p className="text-3xl font-bold text-neutral-900">{totalProducts}</p>
              </div>
              <CubeIcon className="h-12 w-12 text-amber-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">En Stock</p>
                <p className="text-3xl font-bold text-neutral-900">
                  {products.filter((p) => p.availability === 'in_stock').length}
                </p>
              </div>
              <CheckCircleIcon className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">En Vedette</p>
                <p className="text-3xl font-bold text-neutral-900">
                  {products.filter((p) => p.featured).length}
                </p>
              </div>
              <StarIcon className="h-12 w-12 text-yellow-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Rechercher un produit..."
              className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">Toutes catégories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={availabilityFilter}
                onChange={(e) => {
                  setAvailabilityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">Toute disponibilité</option>
                <option value="in_stock">En stock</option>
                <option value="made_to_order">Sur commande</option>
                <option value="out_of_stock">Rupture</option>
              </select>
            </div>

            <div>
              <select
                value={featuredFilter}
                onChange={(e) => {
                  setFeaturedFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">Tous</option>
                <option value="true">En vedette</option>
                <option value="false">Non en vedette</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-sm text-neutral-600">Chargement des produits...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <CubeIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Aucun produit</h3>
            <p className="text-neutral-600 mb-6">
              {searchQuery || categoryFilter || availabilityFilter || featuredFilter
                ? 'Aucun produit ne correspond à vos critères'
                : 'Commencez par créer votre premier produit'}
            </p>
            {!searchQuery && !categoryFilter && !availabilityFilter && !featuredFilter && (
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <PlusIcon className="h-5 w-5" />
                Créer un produit
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Table Header with Column Controls */}
            <div className="px-6 py-4 bg-gradient-to-r from-neutral-50 via-amber-50/30 to-neutral-50 border-b border-neutral-200">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-neutral-200 shadow-sm">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2m0-8a2 2 0 012 2v6a2 2 0 01-2 2m-6 4a2 2 0 002 2h2a2 2 0 002-2m0 0V7m0 10v2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">
                      Liste des produits
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {products.length} produit{products.length > 1 ? 's' : ''} • {visibleColumns.length} colonne{visibleColumns.length > 1 ? 's' : ''} visible{visibleColumns.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                {/* Column Visibility Menu in Table Header */}
                <ColumnVisibilityMenu
                  columns={tableColumns}
                  visibleColumns={visibleColumns}
                  onVisibilityChange={setVisibleColumns}
                  storageKey="products-table-columns"
                />
              </div>
            </div>

            {/* Info banner when columns are hidden */}
            {visibleColumns.length < tableColumns.length && (
              <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {tableColumns.length - visibleColumns.length} colonne{tableColumns.length - visibleColumns.length > 1 ? 's' : ''} masquée{tableColumns.length - visibleColumns.length > 1 ? 's' : ''}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const allColumns = tableColumns.map(col => col.id);
                    setVisibleColumns(allColumns);
                  }}
                  className="text-xs font-medium text-blue-700 hover:text-blue-900 underline"
                >
                  Afficher tout
                </button>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    {isColumnVisible('image') && (
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Image
                      </th>
                    )}
                    {isColumnVisible('product') && (
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Produit
                      </th>
                    )}
                    {isColumnVisible('category') && (
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                    )}
                    {isColumnVisible('price') && (
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Prix
                      </th>
                    )}
                    {isColumnVisible('availability') && (
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Disponibilité
                      </th>
                    )}
                    {isColumnVisible('featured') && (
                      <th className="px-6 py-4 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Vedette
                      </th>
                    )}
                    {isColumnVisible('video') && (
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Vidéo
                      </th>
                    )}
                    {isColumnVisible('materials') && (
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Matériaux
                      </th>
                    )}
                    {isColumnVisible('dimensions') && (
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Dimensions
                      </th>
                    )}
                    {isColumnVisible('tags') && (
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Tags
                      </th>
                    )}
                    {isColumnVisible('created') && (
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Date de création
                      </th>
                    )}
                    {isColumnVisible('actions') && (
                      <th className="px-6 py-4 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {products.map((product) => {
                    const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
                    const badge = getAvailabilityBadge(product.availability);

                    return (
                      <tr key={product._id} className="hover:bg-neutral-50 transition-colors">
                        {isColumnVisible('image') && (
                          <td className="px-6 py-4 whitespace-nowrap">
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
                                  <CubeIcon className="h-8 w-8 text-neutral-400" />
                                </div>
                              )}
                            </div>
                          </td>
                        )}
                        {isColumnVisible('product') && (
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-neutral-900">{product.name}</div>
                              <div className="text-xs text-neutral-500 truncate max-w-xs">
                                {product.shortDescription}
                              </div>
                            </div>
                          </td>
                        )}
                        {isColumnVisible('category') && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                              {categories.find(cat => cat.slug === product.category)?.name || product.category}
                            </span>
                          </td>
                        )}
                        {isColumnVisible('price') && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-amber-600">
                              {formatPrice(product.price)}
                            </span>
                          </td>
                        )}
                        {isColumnVisible('availability') && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                              {badge.label}
                            </span>
                          </td>
                        )}
                        {isColumnVisible('featured') && (
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {product.featured ? (
                              <StarIcon className="h-5 w-5 text-yellow-500 mx-auto fill-current" />
                            ) : (
                              <span className="text-neutral-300">-</span>
                            )}
                          </td>
                        )}
                        {isColumnVisible('video') && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.video ? (
                              <div className="relative w-20 h-12 rounded overflow-hidden bg-neutral-100 group">
                                {product.video.thumbnail ? (
                                  <img
                                    src={product.video.thumbnail}
                                    alt="Video thumbnail"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <video
                                    src={product.video.url}
                                    className="w-full h-full object-cover"
                                    muted
                                  />
                                )}
                                {/* Play icon overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-neutral-400">-</span>
                            )}
                          </td>
                        )}
                        {isColumnVisible('materials') && (
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {product.materials && product.materials.length > 0 ? (
                                product.materials.slice(0, 3).map((material, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {material}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-neutral-400">-</span>
                              )}
                              {product.materials && product.materials.length > 3 && (
                                <span className="text-xs text-neutral-500">
                                  +{product.materials.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                        )}
                        {isColumnVisible('dimensions') && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-neutral-700">
                              {formatDimensions(product.dimensions)}
                            </span>
                          </td>
                        )}
                        {isColumnVisible('tags') && (
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {product.tags && product.tags.length > 0 ? (
                                product.tags.slice(0, 2).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                                  >
                                    {tag}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-neutral-400">-</span>
                              )}
                              {product.tags && product.tags.length > 2 && (
                                <span className="text-xs text-neutral-500">
                                  +{product.tags.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                        )}
                        {isColumnVisible('created') && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-neutral-700">
                              {formatDate(product.createdAt)}
                            </span>
                          </td>
                        )}
                        {isColumnVisible('actions') && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/admin/products/${product._id}/edit`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Modifier"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </Link>
                              <button
                                onClick={() => {
                                  setDeletingProduct(product);
                                  setShowDeleteModal(true);
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Supprimer"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-neutral-700">
                    Page {currentPage} sur {totalPages} • {totalProducts} produit{totalProducts > 1 ? 's' : ''} au total
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Précédent
                    </button>

                    {/* Page numbers */}
                    <div className="hidden sm:flex items-center gap-1">
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
                      className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Suivant →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && deletingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrashIcon className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-neutral-900">Confirmer la suppression</h3>
            </div>
            <p className="text-neutral-600 mb-6">
              Êtes-vous sûr de vouloir supprimer le produit <strong>{deletingProduct.name}</strong> ?
              Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingProduct(null);
                }}
                disabled={actionLoading}
                className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Suppression...
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-5 w-5" />
                    Supprimer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
