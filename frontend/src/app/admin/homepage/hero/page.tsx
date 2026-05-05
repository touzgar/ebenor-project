'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { homeService } from '@/lib/api';
import type { HomeContent } from '@/types';
import { PublishToggle } from '@/components/admin/PublishToggle';

export default function HeroEditorPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // UI state
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load current hero content
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
          
          if (content.hero) {
            setTitle(content.hero.title || '');
            setSubtitle(content.hero.subtitle || '');
            setCtaText(content.hero.ctaText || '');
            setCtaLink(content.hero.ctaLink || '');
            setBackgroundImage(content.hero.backgroundImage || '');
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

  // Validate form
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

    // Subtitle validation
    if (!subtitle.trim()) {
      newErrors.subtitle = 'Le sous-titre est requis';
    } else if (subtitle.length < 10) {
      newErrors.subtitle = 'Le sous-titre doit contenir au moins 10 caractères';
    } else if (subtitle.length > 500) {
      newErrors.subtitle = 'Le sous-titre ne peut pas dépasser 500 caractères';
    }

    // CTA text validation
    if (!ctaText.trim()) {
      newErrors.ctaText = 'Le texte du bouton est requis';
    } else if (ctaText.length < 2) {
      newErrors.ctaText = 'Le texte du bouton doit contenir au moins 2 caractères';
    } else if (ctaText.length > 50) {
      newErrors.ctaText = 'Le texte du bouton ne peut pas dépasser 50 caractères';
    }

    // CTA link validation
    if (!ctaLink.trim()) {
      newErrors.ctaLink = 'Le lien du bouton est requis';
    } else {
      // Basic URL validation
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      const isRelativePath = ctaLink.startsWith('/');
      
      if (!isRelativePath && !urlPattern.test(ctaLink)) {
        newErrors.ctaLink = 'Le lien doit être une URL valide ou un chemin relatif (ex: /contact)';
      }
    }

    // Background image validation
    if (!backgroundImage && !imageFile) {
      newErrors.backgroundImage = 'Une image de fond est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
        backgroundImage: 'Le fichier doit être une image (JPG, PNG, WEBP)',
      }));
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        backgroundImage: 'Le fichier ne peut pas dépasser 10 MB',
      }));
      return;
    }

    // Clear error
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.backgroundImage;
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
      const input = document.getElementById('backgroundImage') as HTMLInputElement;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      
      // Trigger change event
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
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
      let finalBackgroundImage = backgroundImage;

      // Upload new image if selected
      if (imageFile) {
        setIsUploadingImage(true);
        
        // TODO: Implement image upload to Cloudinary
        // For now, we'll use a placeholder
        // In a real implementation, you would upload to Cloudinary here
        console.warn('Image upload not yet implemented. Using existing image URL.');
        
        setIsUploadingImage(false);
      }

      // Prepare payload
      const payload = {
        hero: {
          title: title.trim(),
          subtitle: subtitle.trim(),
          backgroundImage: finalBackgroundImage,
          ctaText: ctaText.trim(),
          ctaLink: ctaLink.trim(),
        },
      };

      const response = await homeService.updateHero(payload.hero);

      if (response.success) {
        // Show success notification
        alert('Section hero mise à jour avec succès !');

        // Redirect to dashboard
        router.push('/admin/dashboard');
      } else {
        throw new Error(response.message || 'Erreur lors de la mise à jour');
      }
    } catch (error: any) {
      console.error('Error updating hero section:', error);

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
              Modifier la section Hero
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
                  Modifier la section Hero
                </h1>
                <p className="mt-2 text-neutral-600">
                  Personnalisez la bannière principale de votre page d'accueil
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
            <PublishToggle section="hero" initialPublished={false} />
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

          {/* Hero Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">
              Contenu de la section Hero
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
                  placeholder="Ex: Artisan ébéniste d'exception"
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

              {/* Subtitle */}
              <div>
                <label htmlFor="subtitle" className="block text-sm font-medium text-neutral-700 mb-2">
                  Sous-titre <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  rows={4}
                  placeholder="Ex: Créations sur mesure en bois noble pour sublimer votre intérieur"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none ${
                    errors.subtitle ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  maxLength={500}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.subtitle && (
                    <p className="text-sm text-red-600">{errors.subtitle}</p>
                  )}
                  <p className="text-xs text-neutral-500 ml-auto">
                    {subtitle.length}/500 caractères
                  </p>
                </div>
              </div>

              {/* CTA Text */}
              <div>
                <label htmlFor="ctaText" className="block text-sm font-medium text-neutral-700 mb-2">
                  Texte du bouton <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="ctaText"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Ex: Découvrir nos réalisations"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                    errors.ctaText ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  maxLength={50}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.ctaText && (
                    <p className="text-sm text-red-600">{errors.ctaText}</p>
                  )}
                  <p className="text-xs text-neutral-500 ml-auto">
                    {ctaText.length}/50 caractères
                  </p>
                </div>
              </div>

              {/* CTA Link */}
              <div>
                <label htmlFor="ctaLink" className="block text-sm font-medium text-neutral-700 mb-2">
                  Lien du bouton <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="ctaLink"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  placeholder="Ex: /galerie ou https://example.com"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                    errors.ctaLink ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.ctaLink && (
                  <p className="text-sm text-red-600 mt-1">{errors.ctaLink}</p>
                )}
                <p className="text-xs text-neutral-500 mt-2">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Utilisez un chemin relatif (ex: /contact) ou une URL complète
                </p>
              </div>
            </div>
          </motion.div>

          {/* Background Image Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">
              Image de fond <span className="text-red-500">*</span>
            </h2>

            {/* Current Image Preview */}
            {(backgroundImage || imagePreview) && (
              <div className="mb-6">
                <p className="text-sm font-medium text-neutral-700 mb-3">
                  {imagePreview ? 'Nouvelle image' : 'Image actuelle'}
                </p>
                <div className="relative aspect-video w-full max-w-2xl mx-auto bg-neutral-100 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview || backgroundImage}
                    alt="Hero background"
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
                errors.backgroundImage
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
                htmlFor="backgroundImage"
                className="inline-flex items-center px-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Parcourir les fichiers
              </label>
              <input
                type="file"
                id="backgroundImage"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="text-xs text-neutral-500 mt-3">
                JPG, PNG ou WEBP • Maximum 10 MB
              </p>
            </div>

            {errors.backgroundImage && (
              <p className="text-sm text-red-600 mt-2">{errors.backgroundImage}</p>
            )}
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">
              Aperçu
            </h2>

            <div className="relative aspect-video w-full bg-neutral-900 rounded-lg overflow-hidden">
              {/* Background Image */}
              {(backgroundImage || imagePreview) && (
                <Image
                  src={imagePreview || backgroundImage}
                  alt="Hero preview"
                  fill
                  className="object-cover opacity-60"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              )}

              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4 max-w-3xl">
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    {title || 'Votre titre ici'}
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 mb-8">
                    {subtitle || 'Votre sous-titre ici'}
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
                  >
                    {ctaText || 'Texte du bouton'}
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-500 mt-3 text-center">
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Ceci est un aperçu de la section hero telle qu'elle apparaîtra sur votre site
            </p>
          </motion.div>

          {/* Form Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
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
