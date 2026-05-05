'use client';

import { useState, useEffect } from 'react';
import { mediaService } from '@/lib/api';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  PhotoIcon,
  VideoCameraIcon,
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
}

interface MediaSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedMedia: string | string[]) => void;
  multiple?: boolean;
  mediaType?: 'image' | 'video' | 'all';
  title?: string;
  maxSelection?: number;
}

export function MediaSelector({
  isOpen,
  onClose,
  onSelect,
  multiple = false,
  mediaType = 'all',
  title = 'Sélectionner un média',
  maxSelection,
}: MediaSelectorProps) {
  // State
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selection
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 24;

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>(
    mediaType === 'all' ? 'all' : mediaType
  );
  const [sourceFilter, setSourceFilter] = useState<'all' | 'product' | 'gallery' | 'homepage'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch media when modal opens or filters change
  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, currentPage, typeFilter, sourceFilter, categoryFilter]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedUrls(new Set());
      setSearchQuery('');
      setCurrentPage(1);
      setError(null);
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, any> = {
        page: currentPage.toString(),
        limit: limit.toString(),
      };

      // Apply media type filter (from prop or user selection)
      if (mediaType !== 'all') {
        params.type = mediaType;
      } else if (typeFilter !== 'all') {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMedia();
  };

  const handleToggleSelection = (url: string) => {
    const newSelection = new Set(selectedUrls);

    if (newSelection.has(url)) {
      newSelection.delete(url);
    } else {
      if (multiple) {
        // Check max selection limit
        if (maxSelection && newSelection.size >= maxSelection) {
          alert(`Vous ne pouvez sélectionner que ${maxSelection} média(s) maximum`);
          return;
        }
        newSelection.add(url);
      } else {
        // Single selection - replace
        newSelection.clear();
        newSelection.add(url);
      }
    }

    setSelectedUrls(newSelection);
  };

  const handleConfirm = () => {
    const selected = Array.from(selectedUrls);
    if (selected.length === 0) {
      alert('Veuillez sélectionner au moins un média');
      return;
    }

    if (multiple) {
      onSelect(selected);
    } else {
      onSelect(selected[0]);
    }

    onClose();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
            <p className="text-sm text-neutral-600 mt-1">
              {multiple
                ? `Sélectionnez jusqu'à ${maxSelection || 'plusieurs'} média(s)`
                : 'Sélectionnez un média'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-neutral-200">
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
              {mediaType === 'all' && (
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
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Source</label>
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

          {/* Selection Info */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-neutral-600">
              {totalItems} média{totalItems !== 1 ? 's' : ''} disponible{totalItems !== 1 ? 's' : ''}
            </span>
            {selectedUrls.size > 0 && (
              <span className="text-amber-600 font-medium">
                {selectedUrls.size} sélectionné{selectedUrls.size !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-6">
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {media.map((item) => {
                const isSelected = selectedUrls.has(item.url);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggleSelection(item.url)}
                    className={`relative bg-white rounded-lg shadow hover:shadow-lg transition-all overflow-hidden group ${
                      isSelected ? 'ring-4 ring-amber-500' : ''
                    }`}
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

                      {/* Selection Overlay */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-amber-500 bg-opacity-20 flex items-center justify-center">
                          <CheckCircleIcon className="h-12 w-12 text-amber-600" />
                        </div>
                      )}

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
                    </div>

                    {/* Media Info */}
                    <div className="p-2">
                      <p
                        className="text-xs font-medium text-neutral-900 truncate"
                        title={item.filename}
                      >
                        {item.filename}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-xs text-neutral-500">
                        <span>{formatFileSize(item.size)}</span>
                        {item.dimensions && (
                          <span className="text-xs">
                            {item.dimensions.width}×{item.dimensions.height}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
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
            <div className="flex items-center justify-center gap-2 mt-6">
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

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-neutral-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedUrls.size === 0}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <CheckCircleIcon className="h-5 w-5" />
            Confirmer la sélection
            {selectedUrls.size > 0 && ` (${selectedUrls.size})`}
          </button>
        </div>
      </div>
    </div>
  );
}
