'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { galleryService } from '@/lib/api';
import type { GalleryImage } from '@/types';

const GALLERY_CATEGORIES = [
  'realisations',
  'atelier',
  'materiaux',
  'inspiration',
  'autre',
];

export default function EditGalleryImagePage() {
  const router = useRouter();
  const params = useParams();
  const imageId = params.id as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('realisations');
  const [tags, setTags] = useState<string[]>([]);
  const [altText, setAltText] = useState('');
  const [featured, setFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);

  // UI state
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imageData, setImageData] = useState<GalleryImage | null>(null);

  // Tag input state
  const [tagInput, setTagInput] = useState('');
  const [tagError, setTagError] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load image data
  useEffect(() => {
    const loadImage = async () => {
      if (!isAuthenticated || authLoading) {
        return;
      }

      setIsLoadingImage(true);
      setLoadError(null);

      try {
        // Fetch all images and find the one with matching ID
        const response = await galleryService.getImages({});

        if (response.success && response.data) {
          const images = response.data as GalleryImage[];
          const image = images.find((img) => img._id === imageId);

          if (image) {
            setImageData(image);
            setTitle(image.title || '');
            setDescription(image.description || '');
            setCategory(image.category || 'realisations');
            setTags(image.tags || []);
            setAltText(image.alt || '');
            setFeatured(image.featured || false);
            setSortOrder(image.sortOrder || 0);
          } else {
            throw new Error('Image non trouvée');
          }
        } else {
          throw new Error(response.message || 'Image non trouvée');
        }
      } catch (error: any) {
        console.error('Error loading image:', error);

        let errorMessage = 'Une erreur est survenue lors du chargement de l\'image';

        if (error.message) {
          if (error.message.includes('404') || error.message.includes('non trouvée')) {
            errorMessage = 'Image non trouvée (404)';
          } else if (error.message.includes('Network') || error.message.includes('fetch')) {
            errorMessage = 'Erreur réseau : impossible de charger l\'image';
          } else {
            errorMessage = error.message;
          }
        }

        setLoadError(errorMessage);
      } finally {
        setIsLoadingImage(false);
      }
    };

    loadImage();
  }, [isAuthenticated, authLoading, imageId]);

  // Auto-generate alt text from title if empty
  useEffect(() => {
    if (title && !altText) {
      setAltText(title);
    }
  }, [title, altText]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Title validation
    if (!title.trim()) {
      newErrors.title = 'Le titre est requis';
    } else if (title.length > 200) {
      newErrors.title = 'Le titre ne peut pas dépasser 200 caractères';
    }

    // Description validation
    if (description && description.length > 1000) {
      newErrors.description = 'La description ne peut pas dépasser 1000 caractères';
    }

    // Category validation
    if (!category) {
      newErrors.category = 'La catégorie est requise';
    }

    // Alt text validation
    if (!altText.trim()) {
      newErrors.altText = 'Le texte alternatif est requis';
    } else if (altText.length > 200) {
      newErrors.altText = 'Le texte alternatif ne peut pas dépasser 200 caractères';
    }

    // Sort order validation
    if (sortOrder < 0) {
      newErrors.sortOrder = 'L\'ordre de tri doit être un nombre positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle tag addition
  const handleAddTag = () => {
    setTagError('');

    if (!tagInput.trim()) {
      setTagError('Le tag est requis');
      return;
    }

    if (tagInput.length > 50) {
      setTagError('Le tag ne peut pas dépasser 50 caractères');
      return;
    }

    const normalizedTag = tagInput.toLowerCase().trim();

    if (tags.includes(normalizedTag)) {
      setTagError('Ce tag existe déjà');
      return;
    }

    setTags([...tags, normalizedTag]);
    setTagInput('');
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle tag input key press
  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      setSubmitError('Veuillez corriger les erreurs dans le formulaire');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        tags,
        alt: altText.trim(),
        featured,
        sortOrder,
      };

      const response = await galleryService.updateImage(imageId, payload);

      if (response.success) {
        // Show success notification
        alert('Image mise à jour avec succès !');

        // Redirect to gallery list
        router.push('/admin/gallery');
      } else {
        throw new Error(response.message || 'Erreur lors de la mise à jour de l\'image');
      }
    } catch (error: any) {
      console.error('Error updating image:', error);

      let errorMessage = 'Une erreur est survenue lors de la mise à jour de l\'image';

      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setSubmitError(errorMessage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (authLoading || isLoadingImage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">
            {authLoading ? 'Chargement...' : 'Chargement de l\'image...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Error state - image not found or network error
  if (loadError) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="bg-white border-b border-neutral-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-neutral-900">
              Modifier l'image
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-8 text-center"
          >
            <svg className="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              Erreur de chargement
            </h2>
            <p className="text-red-700 mb-6">{loadError}</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Réessayer
              </button>
              <Link
                href="/admin/gallery"
                className="inline-flex items-center px-4 py-2 text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour à la galerie
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  Modifier l'image
                </h1>
                <p className="mt-2 text-neutral-600">
                  Modifiez les informations de l'image
                </p>
              </div>

              <Link
                href="/admin/gallery"
                className="inline-flex items-center px-4 py-2 text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Annuler
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error Message */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                  <p className="mt-1 text-sm text-red-700">{submitError}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Image Preview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">
              Aperçu de l'image
            </h2>

            {imageData && (
              <div className="relative aspect-video w-full max-w-2xl mx-auto bg-neutral-100 rounded-lg overflow-hidden">
                <Image
                  src={imageData.url}
                  alt={imageData.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            )}

            {imageData && (
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-neutral-600">
                <div>
                  <span className="font-medium">Dimensions:</span>{' '}
                  {imageData.dimensions.width} × {imageData.dimensions.height} px
                </div>
                <div>
                  <span className="font-medium">Taille:</span>{' '}
                  {(imageData.fileSize / (1024 * 1024)).toFixed(2)} MB
                </div>
                <div>
                  <span className="font-medium">Format:</span>{' '}
                  {imageData.mimeType}
                </div>
                <div>
                  <span className="font-medium">Téléchargée le:</span>{' '}
                  {imageData.uploadedAt
                    ? new Date(imageData.uploadedAt).toLocaleDateString('fr-FR')
                    : 'N/A'}
                </div>
              </div>
            )}
          </motion.div>

          {/* Basic Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">
              Informations de base
            </h2>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
                  Titre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Cuisine moderne en chêne"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                    errors.title ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  maxLength={200}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title}</p>
                  )}
                  <p className="text-xs text-neutral-500 ml-auto">
                    {title.length}/200 caractères
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Description détaillée de l'image (optionnel)"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none ${
                    errors.description ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  maxLength={1000}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                  <p className="text-xs text-neutral-500 ml-auto">
                    {description.length}/1000 caractères
                  </p>
                </div>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-2">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                    errors.category ? 'border-red-500' : 'border-neutral-300'
                  }`}
                >
                  {GALLERY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-sm text-red-600 mt-1">{errors.category}</p>
                )}
              </div>

              {/* Alt Text */}
              <div>
                <label htmlFor="altText" className="block text-sm font-medium text-neutral-700 mb-2">
                  Texte alternatif <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="altText"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Description pour l'accessibilité"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                    errors.altText ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  maxLength={200}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.altText && (
                    <p className="text-sm text-red-600">{errors.altText}</p>
                  )}
                  <p className="text-xs text-neutral-500 ml-auto">
                    {altText.length}/200 caractères
                  </p>
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Le texte alternatif est généré automatiquement depuis le titre si non fourni
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tags Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">
              Tags
            </h2>

            {/* Tag Input */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="Ajouter un tag"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                    maxLength={50}
                  />
                  {tagError && (
                    <p className="text-sm text-red-600 mt-1">{tagError}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter
                </button>
              </div>

              {/* Tags List */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-amber-600 hover:text-amber-800 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {tags.length === 0 && (
                <p className="text-sm text-neutral-500 italic">
                  Aucun tag ajouté. Les tags aident à organiser et rechercher les images.
                </p>
              )}
            </div>
          </motion.div>

          {/* Settings Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">
              Paramètres
            </h2>

            <div className="space-y-6">
              {/* Featured Checkbox */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 text-amber-600 border-neutral-300 rounded focus:ring-amber-500"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="featured" className="text-sm font-medium text-neutral-700">
                    Image en vedette
                  </label>
                  <p className="text-xs text-neutral-500 mt-1">
                    Les images en vedette sont affichées en priorité sur la page d'accueil
                  </p>
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-neutral-700 mb-2">
                  Ordre de tri
                </label>
                <input
                  type="number"
                  id="sortOrder"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                    errors.sortOrder ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.sortOrder && (
                  <p className="text-sm text-red-600 mt-1">{errors.sortOrder}</p>
                )}
                <p className="text-xs text-neutral-500 mt-1">
                  Les images avec un ordre de tri plus bas sont affichées en premier
                </p>
              </div>
            </div>
          </motion.div>

          {/* Form Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="flex items-center justify-end gap-4"
          >
            <Link
              href="/admin/gallery"
              className="px-6 py-3 text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Enregistrer les modifications
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
