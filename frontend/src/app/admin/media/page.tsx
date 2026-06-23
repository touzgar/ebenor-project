'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/lib/toast';
import { mediaService, categoryService, galleryService } from '@/lib/api';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  TrashIcon,
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface MediaItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
  filename: string;
  type: 'image' | 'video';
  mimeType?: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  category?: string;
  tags?: string[];
  uploadedAt: string;
  source: 'product' | 'gallery' | 'homepage';
  sourceId: string;
  references?: MediaReference[]; // Made optional
}

interface MediaReference {
  type: 'product' | 'gallery' | 'homepage';
  id: string;
  name: string;
  field?: string;
}

interface MediaStats {
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

interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export default function MediaLibraryPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // State
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [stats, setStats] = useState<MediaStats | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 24;

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'product' | 'gallery' | 'homepage'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch categories
  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated]);

  // Fetch media and stats
  useEffect(() => {
    if (isAuthenticated) {
      fetchMedia();
      fetchStats();
    }
  }, [isAuthenticated, currentPage, typeFilter, sourceFilter, categoryFilter]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.success && response.data) {
        setCategories(response.data.filter((cat: Category) => cat.isActive));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, any> = {
        page: currentPage.toString(),
        limit: limit.toString(),
      };

      if (typeFilter !== 'all') {
        params.type = typeFilter;
      }

      if (sourceFilter !== 'all') {
        params.source = sourceFilter;
      }

      if (categoryFilter !== 'all') {
        params.category = categoryFilter;
      }

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await mediaService.getAll(params);

      if (response.success && response.data) {
        setMedia(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.pages);
          setTotalItems(response.pagination.total);
        }
      }
    } catch (err: any) {
      console.error('Error fetching media:', err);
      setError(err.message || 'Erreur lors du chargement des médias');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await mediaService.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMedia();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSourceLabel = (source: string): string => {
    const labels: Record<string, string> = {
      product: 'Produit',
      gallery: 'Galerie',
      homepage: 'Page d\'accueil',
    };
    return labels[source] || source;
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      cuisine: 'Cuisine',
      dressing: 'Dressing',
      mobilier: 'Mobilier',
      amenagement: 'Aménagement',
      showroom: 'Showroom',
      process: 'Processus',
      autre: 'Autre',
    };
    return labels[category] || category;
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Responsive */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Bibliothèque de Médias</h1>
              <p className="mt-2 text-sm sm:text-base text-neutral-600">
                Consultez tous vos fichiers médias en un seul endroit
              </p>
            </div>
            {/* Cleanup Buttons - Responsive */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* Delete ALL Gallery Images */}
              {media.length > 0 && (
                <button
                  onClick={async () => {
                    if (!confirm('⚠️ ATTENTION: Voulez-vous SUPPRIMER TOUTES LES IMAGES de la galerie (GalleryImage collection) ? Cette action est IRRÉVERSIBLE!')) return;
                    if (!confirm('Êtes-vous ABSOLUMENT SÛR? Cela supprimera TOUTES les images de la base de données!')) return;
                    try {
                      setLoading(true);
                      // Direct MongoDB delete all
                      const response = await fetch('/api/admin/gallery/bulk', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                          action: 'deleteAll',
                        }),
                      });
                      
                      const result = await response.json();
                      if (result.success) {
                        toast.success('Toutes les images ont été supprimées!');
                        await fetchMedia();
                        await fetchStats();
                      } else {
                        toast.error(result.message || 'Erreur lors de la suppression');
                      }
                    } catch (err: any) {
                      console.error('Error deleting all:', err);
                      toast.error(err.message || 'Erreur lors de la suppression');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="px-3 sm:px-4 py-2 bg-red-700 text-white text-sm rounded-lg hover:bg-red-800 transition-colors flex items-center justify-center gap-2 shadow-lg border-2 border-red-900 w-full sm:w-auto"
                  title="Supprimer TOUTES les images de la galerie"
                >
                  <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm font-medium">TOUT SUPPRIMER</span>
                </button>
              )}
              
              {/* Cleanup Orphaned */}
              {media.length > 0 && (
                <button
                  onClick={async () => {
                    if (!confirm('Voulez-vous nettoyer toutes les images orphelines (non utilisées par les produits) ?')) return;
                    try {
                      setLoading(true);
                      const response = await galleryService.cleanupOrphanedImages();
                      if (response.success) {
                        toast.success(response.message || 'Nettoyage terminé avec succès');
                        await fetchMedia();
                        await fetchStats();
                      }
                    } catch (err: any) {
                      console.error('Error cleaning up:', err);
                      toast.error(err.message || 'Erreur lors du nettoyage');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="px-3 sm:px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto"
                  title="Nettoyer les images orphelines"
                >
                  <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm font-medium">Nettoyer orphelines</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards - REMOVED AS REQUESTED */}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom de fichier ou tags..."
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Rechercher
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2"
              >
                <FunnelIcon className="h-5 w-5" />
                Filtres
              </button>
            </form>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-200">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Type de média
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => {
                      setTypeFilter(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="all">Tous</option>
                    <option value="image">Images</option>
                    <option value="video">Vidéos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Source
                  </label>
                  <select
                    value={sourceFilter}
                    onChange={(e) => {
                      setSourceFilter(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="all">Toutes</option>
                    <option value="product">Produits</option>
                    <option value="gallery">Galerie</option>
                    <option value="homepage">Page d'accueil</option>
                  </select>
                </div>

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
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="all">Toutes</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-neutral-600">
          {totalItems} média{totalItems !== 1 ? 's' : ''} trouvé{totalItems !== 1 ? 's' : ''}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        )}

        {/* Media Grid */}
        {!loading && media.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
            {media.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white rounded-xl shadow-sm border border-neutral-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden"
              >
                {/* Media Preview */}
                <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-50 relative overflow-hidden">
                  {item.type === 'image' ? (
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full relative">
                      {/* Video element with hover autoplay */}
                      <video
                        src={item.url}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        muted
                        loop
                        playsInline
                        poster={item.thumbnailUrl}
                        onMouseEnter={(e) => {
                          const video = e.currentTarget;
                          video.play().catch(() => {
                            // Ignore autoplay errors
                          });
                        }}
                        onMouseLeave={(e) => {
                          const video = e.currentTarget;
                          video.pause();
                          video.currentTime = 0;
                        }}
                      />
                      {/* Play icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:opacity-0 transition-opacity pointer-events-none">
                        <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                          <svg className="w-8 h-8 text-amber-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hover Overlay - Read Only (No Actions) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {/* Info overlay on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <p className="text-xs font-medium truncate">{item.filename}</p>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm ${
                        item.type === 'image'
                          ? 'bg-blue-500/90 text-white'
                          : 'bg-purple-500/90 text-white'
                      }`}
                    >
                      {item.type === 'image' ? '📷 Image' : '🎥 Vidéo'}
                    </span>
                  </div>

                  {/* Source Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white/90 backdrop-blur-sm text-neutral-800 shadow-lg">
                      {getSourceLabel(item.source)}
                    </span>
                  </div>

                  {/* References Indicator */}
                  {item.references && item.references.length > 0 && (
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/90 backdrop-blur-sm text-white shadow-lg flex items-items gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        {item.references.length}
                      </span>
                    </div>
                  )}
                </div>

                {/* Media Info */}
                <div className="p-3.5 space-y-2">
                  <p className="text-sm font-semibold text-neutral-900 truncate" title={item.filename}>
                    {item.filename}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span className="font-medium">{formatFileSize(item.size)}</span>
                    {item.dimensions && (
                      <span className="text-neutral-400">
                        {item.dimensions.width}×{item.dimensions.height}
                      </span>
                    )}
                  </div>
                  
                  {item.category && (
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
                      <span className="text-xs font-medium text-neutral-600">
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-xs text-neutral-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(item.uploadedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && media.length === 0 && (
          <div className="text-center py-12">
            <PhotoIcon className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-2 text-sm font-medium text-neutral-900">Aucun média trouvé</h3>
            <p className="mt-1 text-sm text-neutral-500">
              Essayez de modifier vos filtres ou votre recherche
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Précédent
            </button>
            <span className="px-4 py-2 text-neutral-700">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
