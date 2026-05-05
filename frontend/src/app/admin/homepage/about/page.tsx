'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useAuth } from '@/hooks/useAuth';
import { homeService } from '@/lib/api';
import type { HomeContent } from '@/types';
import { SortableHighlightItem } from '@/components/admin/SortableHighlightItem';
import { PublishToggle } from '@/components/admin/PublishToggle';

export default function AboutEditorPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Highlights state
  const [highlights, setHighlights] = useState<string[]>([]);
  const [highlightInput, setHighlightInput] = useState('');
  const [highlightError, setHighlightError] = useState('');

  // UI state
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevents accidental drags
      },
    })
  );

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load current about content
  useEffect(() => {
    const loadContent = async () => {
      if (!isAuthenticated || authLoading) {
        return;
      }

      setIsLoadingContent(true);
      setLoadError(null);

      try {
        const response = await homeService.getContent();

        if (response.success && response.data) {
          const content = response.data as HomeContent;
          
          if (content.about) {
            setTitle(content.about.title || '');
            setDescription(content.about.description || '');
            setCurrentImage(content.about.image || '');
            setHighlights(content.about.highlights || []);
          }
        } else {
          throw new Error(response.message || 'Impossible de charger le contenu');
        }
      } catch (error: any) {
        console.error('Error loading content:', error);
        setLoadError(error.message || 'Une erreur est survenue lors du chargement du contenu');
      } finally {
        setIsLoadingContent(false);
      }
    };

    loadContent();
  }, [isAuthenticated, authLoading]);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        image: 'Le fichier doit être une image (JPG, PNG, WEBP)',
      }));
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        image: 'Le fichier ne peut pas dépasser 10 MB',
      }));
      return;
    }

    // Clear error
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.image;
      return newErrors;
    });

    // Set file and preview
    setImageFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Simulate file input change
      const input = document.getElementById('image') as HTMLInputElement;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      
      // Trigger change event
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
    }
  };

  // Highlights handlers
  const handleAddHighlight = () => {
    setHighlightError('');
    
    if (!highlightInput.trim()) {
      setHighlightError('Le point fort est requis');
      return;
    }
    
    if (highlightInput.length < 5) {
      setHighlightError('Le point fort doit contenir au moins 5 caractères');
      return;
    }
    
    if (highlightInput.length > 100) {
      setHighlightError('Le point fort ne peut pas dépasser 100 caractères');
      return;
    }
    
    setHighlights([...highlights, highlightInput.trim()]);
    setHighlightInput('');
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleHighlightKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddHighlight();
    }
  };

  const handleHighlightDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setHighlights((items) => {
        const oldIndex = items.findIndex((_, i) => String(i) === active.id);
        const newIndex = items.findIndex((_, i) => String(i) === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Title validation
    if (!title.trim()) {
      newErrors.title = 'Le titre est requis';
    } else if (title.length < 5) {
      newErrors.title = 'Le titre doit contenir au moins 5 caractères';
    } else if (title.length > 200) {
      newErrors.title = 'Le titre ne peut pas dépasser 200 caractères';
    }

    // Description validation
    if (!description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (description.length < 50) {
      newErrors.description = 'La description doit contenir au moins 50 caractères';
    } else if (description.length > 2000) {
      newErrors.description = 'La description ne peut pas dépasser 2000 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
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
      let finalImage = currentImage;

      // Upload new image if selected
      if (imageFile) {
        setIsUploadingImage(true);
        
        // TODO: Implement image upload to Cloudinary
        // For now, we'll use a placeholder
        console.warn('Image upload not yet implemented. Using existing image URL.');
        
        setIsUploadingImage(false);
      }

      // Prepare payload
      const payload = {
        about: {
          title: title.trim(),
          description: description.trim(),
          image: finalImage,
          highlights: highlights,
        },
      };

      const response = await homeService.updateAbout(payload.about);

      if (response.success) {
        // Show success notification
        alert('Section À propos mise à jour avec succès !');

        // Redirect to dashboard
        router.push('/admin/dashboard');
      } else {
        throw new Error(response.message || 'Erreur lors de la mise à jour');
      }
    } catch (error: any) {
      console.error('Error updating about section:', error);

      let errorMessage = 'Une erreur est survenue lors de la mise à jour';

      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setSubmitError(errorMessage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
      setIsUploadingImage(false);
    }
  };

  // Loading state
  if (authLoading || isLoadingContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">
            {authLoading ? 'Chargement...' : 'Chargement du contenu...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Error state
  if (loadError) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="bg-white border-b border-neutral-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-neutral-900">
              Modifier la section À propos
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
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Réessayer
            </button>
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  Modifier la section À propos
                </h1>
                <p className="mt-2 text-neutral-600">
                  Personnalisez la section À propos de votre page d'accueil
                </p>
              </div>

              <Link
                href="/admin/dashboard"
                className="inline-flex items-center px-4 py-2 text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Annuler
              </Link>
            </div>

            {/* Publish Toggle */}
            <PublishToggle section="about" initialPublished={false} />
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

          {/* Basic Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
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
                  placeholder="Ex: Notre histoire"
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
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  placeholder="Ex: Artisan ébéniste passionné depuis plus de 20 ans..."
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none ${
                    errors.description ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  maxLength={2000}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                  <p className="text-xs text-neutral-500 ml-auto">
                    {description.length}/2000 caractères
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">
              Image
            </h2>

            {/* Current Image Preview */}
            {currentImage && !imagePreview && (
              <div className="mb-6">
                <p className="text-sm font-medium text-neutral-700 mb-3">
                  Image actuelle
                </p>
                <div className="relative aspect-video w-full max-w-2xl mx-auto bg-neutral-100 rounded-lg overflow-hidden">
                  <Image
                    src={currentImage}
                    alt="About section"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
              </div>
            )}

            {/* New Image Preview */}
            {imagePreview && (
              <div className="mb-6">
                <p className="text-sm font-medium text-neutral-700 mb-3">
                  Nouvelle image
                </p>
                <div className="relative aspect-video w-full max-w-2xl mx-auto bg-neutral-100 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="About section preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
              </div>
            )}

            {/* Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                errors.image
                  ? 'border-red-300 bg-red-50'
                  : 'border-neutral-300 hover:border-amber-400 hover:bg-amber-50'
              }`}
            >
              <svg
                className="w-12 h-12 mx-auto mb-4 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-sm text-neutral-600 mb-2">
                Glissez-déposez une image ici, ou
              </p>
              <label
                htmlFor="image"
                className="inline-flex items-center px-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Parcourir les fichiers
              </label>
              <input
                type="file"
                id="image"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="text-xs text-neutral-500 mt-3">
                JPG, PNG ou WEBP • Maximum 10 MB
              </p>
            </div>

            {errors.image && (
              <p className="text-sm text-red-600 mt-2">{errors.image}</p>
            )}
          </motion.div>

          {/* Highlights Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">
              Points forts
            </h2>

            {/* Input area */}
            <div className="space-y-4 mb-6">
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    onKeyPress={handleHighlightKeyPress}
                    placeholder="Ex: Plus de 20 ans d'expérience"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                    maxLength={100}
                  />
                  {highlightError && (
                    <p className="text-sm text-red-600 mt-1">{highlightError}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter
                </button>
              </div>
            </div>

            {/* Highlights List with drag-and-drop */}
            {highlights.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleHighlightDragEnd}>
                <SortableContext items={highlights.map((_, i) => String(i))} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {highlights.map((highlight, index) => (
                      <SortableHighlightItem
                        key={index}
                        id={String(index)}
                        highlight={highlight}
                        index={index}
                        onRemove={handleRemoveHighlight}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm">Aucun point fort ajouté</p>
                <p className="text-xs mt-1">Ajoutez des points forts pour mettre en valeur votre entreprise</p>
              </div>
            )}
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">
              Aperçu
            </h2>

            <div className="bg-neutral-50 rounded-lg p-8">
              <div className="max-w-4xl mx-auto">
                {/* Image */}
                {(currentImage || imagePreview) && (
                  <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
                    <Image
                      src={imagePreview || currentImage}
                      alt="About preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                  </div>
                )}

                {/* Title */}
                <h3 className="text-3xl font-bold text-neutral-900 mb-4">
                  {title || 'Votre titre ici'}
                </h3>

                {/* Description */}
                <p className="text-lg text-neutral-700 mb-6 whitespace-pre-wrap">
                  {description || 'Votre description ici'}
                </p>

                {/* Highlights */}
                {highlights.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-neutral-700">{highlight}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-neutral-500 mt-3 text-center">
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Ceci est un aperçu de la section À propos telle qu'elle apparaîtra sur votre site
            </p>
          </motion.div>

          {/* Form Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="flex items-center justify-end gap-4"
          >
            <Link
              href="/admin/dashboard"
              className="px-6 py-3 text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || isUploadingImage ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isUploadingImage ? 'Téléchargement...' : 'Enregistrement...'}
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
