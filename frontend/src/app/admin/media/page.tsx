'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { mediaService } from '@/lib/api';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  TrashIcon,
  ArrowPathIcon,
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
  references: MediaReference[];
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

export default function MediaLibraryPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // State
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [stats, setStats] = useState<MediaStats | null>(null);
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

  // Selected media for actions
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [showReferencesModal, setShowReferencesModal] = useState(false);
  const [references, setReferences] = useState<MediaReference[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch media and stats
  useEffect(() => {
    if (isAuthenticated) {
      fetchMedia();
      fetchStats();
    }
  }, [isAuthenticated, currentPage, typeFilter, sourceFilter, categoryFilter]);

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

  const handleDelete = async () => {
    if (!selectedMedia) return;

    try {
      setActionLoading(true);

      // Check references first
      const refResponse = await mediaService.getReferences(selectedMedia.url);
      if (refResponse.success && refResponse.data) {
        if (refResponse.data.inUse) {
          setReferences(refResponse.data.references);
          setShowDeleteModal(false);
          setShowReferencesModal(true);
          return;
        }
      }

      // Delete if no references
      const response = await mediaService.delete(selectedMedia.url);

      if (response.success) {
        alert('Média supprimé avec succès');
        setShowDeleteModal(false);
        setSelectedMedia(null);
        fetchMedia();
        fetchStats();
      }
    } catch (err: any) {
      console.error('Error deleting media:', err);
      alert(err.message || 'Erreur lors de la suppression du média');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReplace = async (file: File) => {
    if (!selectedMedia) return;

    try {
      setActionLoading(true);

      const response = await mediaService.uploadAndReplace(selectedMedia.url, file);

      if (response.success) {
        alert(`Média remplacé avec succès dans ${response.data.updated} référence(s)`);
        setShowReplaceModal(false);
        setSelectedMedia(null);
        fetchMedia();
        fetchStats();
      }
    } catch (err: any) {
      console.error('Error replacing media:', err);
      alert(err.message || 'Erreur lors du remplacement du média');
    } finally {
      setActionLoading(false);
    }
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Bibliothèque de Médias</h1>
          <p className="mt-2 text-neutral-600">
            Gérez tous vos fichiers médias en un seul endroit
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total Médias</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.totalMedia}</p>
                </div>
                <PhotoIcon className="h-8 w-8 text-amber-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Images</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.totalImages}</p>
                </div>
                <PhotoIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Vidéos</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.totalVideos}</p>
                </div>
                <VideoCameraIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Stockage</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {formatFileSize(stats.totalSize)}
                  </p>
                </div>
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

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
                    <option value="cuisine">Cuisine</option>
                    <option value="dressing">Dressing</option>
                    <option value="mobilier">Mobilier</option>
                    <option value="amenagement">Aménagement</option>
                    <option value="showroom">Showroom</option>
                    <option value="process">Processus</option>
                    <option value="autre">Autre</option>
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
                className="group relative bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Media Preview */}
                <div className="aspect-square bg-neutral-100 relative">
                  {item.type === 'image' ? (
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <VideoCameraIcon className="h-12 w-12 text-neutral-400" />
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedMedia(item);
                          setShowReplaceModal(true);
                        }}
                        className="p-2 bg-white rounded-full hover:bg-neutral-100 transition-colors"
                        title="Remplacer"
                      >
                        <ArrowPathIcon className="h-5 w-5 text-neutral-700" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMedia(item);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                        title="Supprimer"
                      >
                        <TrashIcon className="h-5 w-5 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        item.type === 'image'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {item.type === 'image' ? 'Image' : 'Vidéo'}
                    </span>
                  </div>

                  {/* Source Badge */}
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 text-xs font-medium rounded bg-neutral-100 text-neutral-800">
                      {getSourceLabel(item.source)}
                    </span>
                  </div>
                </div>

                {/* Media Info */}
                <div className="p-3">
                  <p className="text-sm font-medium text-neutral-900 truncate" title={item.filename}>
                    {item.filename}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-xs text-neutral-500">
                    <span>{formatFileSize(item.size)}</span>
                    {item.dimensions && (
                      <span>
                        {item.dimensions.width}×{item.dimensions.height}
                      </span>
                    )}
                  </div>
                  {item.category && (
                    <p className="mt-1 text-xs text-neutral-500">
                      {getCategoryLabel(item.category)}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-neutral-400">{formatDate(item.uploadedAt)}</p>
                  {item.references.length > 0 && (
                    <p className="mt-1 text-xs text-amber-600">
                      {item.references.length} référence{item.references.length !== 1 ? 's' : ''}
                    </p>
                  )}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-neutral-900">Confirmer la suppression</h3>
            </div>
            <p className="text-neutral-600 mb-6">
              Êtes-vous sûr de vouloir supprimer ce média ? Cette action est irréversible.
            </p>
            <p className="text-sm text-neutral-500 mb-6">
              <strong>Fichier :</strong> {selectedMedia.filename}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedMedia(null);
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

      {/* Replace Modal */}
      {showReplaceModal && selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Remplacer le média</h3>
              <button
                onClick={() => {
                  setShowReplaceModal(false);
                  setSelectedMedia(null);
                }}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <p className="text-neutral-600 mb-4">
              Sélectionnez un nouveau fichier pour remplacer ce média. Toutes les références seront
              automatiquement mises à jour.
            </p>
            <p className="text-sm text-neutral-500 mb-6">
              <strong>Fichier actuel :</strong> {selectedMedia.filename}
            </p>
            <input
              type="file"
              accept={selectedMedia.type === 'image' ? 'image/*' : 'video/*'}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleReplace(file);
                }
              }}
              disabled={actionLoading}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50"
            />
            {actionLoading && (
              <div className="mt-4 flex items-center gap-2 text-amber-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                <span className="text-sm">Remplacement en cours...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* References Modal */}
      {showReferencesModal && selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Média en cours d'utilisation</h3>
              </div>
              <button
                onClick={() => {
                  setShowReferencesModal(false);
                  setSelectedMedia(null);
                  setReferences([]);
                }}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <p className="text-neutral-600 mb-4">
              Ce média ne peut pas être supprimé car il est utilisé dans les emplacements suivants :
            </p>
            <div className="space-y-2 mb-6">
              {references.map((ref, index) => (
                <div key={index} className="p-3 bg-neutral-50 rounded-lg">
                  <p className="font-medium text-neutral-900">{ref.name}</p>
                  <p className="text-sm text-neutral-600">
                    Type: {getSourceLabel(ref.type)}
                    {ref.field && ` • Champ: ${ref.field}`}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-sm text-neutral-500 mb-6">
              Pour supprimer ce média, vous devez d'abord le retirer de tous ces emplacements ou utiliser
              la fonction "Remplacer" pour le remplacer par un autre fichier.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowReferencesModal(false);
                  setReferences([]);
                }}
                className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setShowReferencesModal(false);
                  setShowReplaceModal(true);
                }}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
              >
                <ArrowPathIcon className="h-5 w-5" />
                Remplacer le média
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
