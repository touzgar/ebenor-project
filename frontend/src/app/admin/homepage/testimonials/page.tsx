'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { homeService } from '@/lib/api';
import type { HomeContent } from '@/types';
import { PublishToggle } from '@/components/admin/PublishToggle';

interface Testimonial {
  name: string;
  company: string;
  text: string;
  rating: number;
  image?: string;
}

export default function TestimonialsEditorPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Testimonials state
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [modalName, setModalName] = useState('');
  const [modalCompany, setModalCompany] = useState('');
  const [modalText, setModalText] = useState('');
  const [modalRating, setModalRating] = useState(5);
  const [modalImage, setModalImage] = useState('');
  const [modalErrors, setModalErrors] = useState<Record<string, string>>({});

  // UI state
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load current testimonials content
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
          
          if (content.testimonials) {
            setTestimonials(content.testimonials);
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

  // Modal handlers
  const openAddModal = () => {
    setEditingIndex(null);
    setModalName('');
    setModalCompany('');
    setModalText('');
    setModalRating(5);
    setModalImage('');
    setModalErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (index: number) => {
    const testimonial = testimonials[index];
    setEditingIndex(index);
    setModalName(testimonial.name);
    setModalCompany(testimonial.company);
    setModalText(testimonial.text);
    setModalRating(testimonial.rating);
    setModalImage(testimonial.image || '');
    setModalErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setModalName('');
    setModalCompany('');
    setModalText('');
    setModalRating(5);
    setModalImage('');
    setModalErrors({});
  };

  const validateModal = (): boolean => {
    const errors: Record<string, string> = {};

    if (!modalName.trim()) {
      errors.name = 'Le nom est requis';
    } else if (modalName.length < 2) {
      errors.name = 'Le nom doit contenir au moins 2 caractères';
    } else if (modalName.length > 100) {
      errors.name = 'Le nom ne peut pas dépasser 100 caractères';
    }

    if (!modalCompany.trim()) {
      errors.company = 'L\'entreprise est requise';
    } else if (modalCompany.length < 2) {
      errors.company = 'L\'entreprise doit contenir au moins 2 caractères';
    } else if (modalCompany.length > 100) {
      errors.company = 'L\'entreprise ne peut pas dépasser 100 caractères';
    }

    if (!modalText.trim()) {
      errors.text = 'Le témoignage est requis';
    } else if (modalText.length < 10) {
      errors.text = 'Le témoignage doit contenir au moins 10 caractères';
    } else if (modalText.length > 1000) {
      errors.text = 'Le témoignage ne peut pas dépasser 1000 caractères';
    }

    if (modalRating < 1 || modalRating > 5) {
      errors.rating = 'La note doit être entre 1 et 5';
    }

    setModalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveModal = () => {
    if (!validateModal()) {
      return;
    }

    const newTestimonial: Testimonial = {
      name: modalName.trim(),
      company: modalCompany.trim(),
      text: modalText.trim(),
      rating: modalRating,
      image: modalImage.trim() || undefined,
    };

    if (editingIndex !== null) {
      // Edit existing testimonial
      const updatedTestimonials = [...testimonials];
      updatedTestimonials[editingIndex] = newTestimonial;
      setTestimonials(updatedTestimonials);
    } else {
      // Add new testimonial
      setTestimonials([...testimonials, newTestimonial]);
    }

    closeModal();
  };

  const handleRemoveTestimonial = (index: number) => {
    setTestimonials(testimonials.filter((_, i) => i !== index));
  };

  // Helper function to render stars
  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizeClasses[size]} ${star <= rating ? 'text-amber-400' : 'text-neutral-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        testimonials: testimonials,
      };

      const response = await homeService.updateTestimonials(payload.testimonials);

      if (response.success) {
        alert('Section Témoignages mise à jour avec succès !');
        router.push('/admin/dashboard');
      } else {
        throw new Error(response.message || 'Erreur lors de la mise à jour');
      }
    } catch (error: any) {
      console.error('Error updating testimonials section:', error);

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
              Modifier la section Témoignages
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
                  Modifier la section Témoignages
                </h1>
                <p className="mt-2 text-neutral-600">
                  Gérez les témoignages clients affichés sur votre page d'accueil
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
            <PublishToggle section="testimonials" initialPublished={false} />
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

          {/* Testimonials List Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">
                Témoignages
              </h2>
              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un témoignage
              </button>
            </div>

            {/* Testimonials List */}
            {testimonials.length > 0 ? (
              <div className="space-y-3">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-neutral-50 border border-neutral-200 rounded-lg hover:border-amber-400 transition-colors"
                  >
                    {/* Avatar/Image */}
                    <div className="flex-shrink-0">
                      {testimonial.image ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-200">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                          <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-semibold text-neutral-900">
                            {testimonial.name}
                          </h4>
                          <p className="text-xs text-neutral-600">
                            {testimonial.company}
                          </p>
                        </div>
                        {renderStars(testimonial.rating, 'sm')}
                      </div>
                      <p className="text-sm text-neutral-600 line-clamp-2">
                        "{testimonial.text}"
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditModal(index)}
                        className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveTestimonial(index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-sm font-medium">Aucun témoignage ajouté</p>
                <p className="text-xs mt-1">Cliquez sur "Ajouter un témoignage" pour commencer</p>
              </div>
            )}
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">
              Aperçu
            </h2>

            <div className="bg-neutral-50 rounded-lg p-8">
              {testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200 flex flex-col"
                    >
                      {/* Quote Icon */}
                      <svg className="w-8 h-8 text-amber-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>

                      {/* Testimonial Text */}
                      <p className="text-neutral-700 mb-4 flex-1 italic">
                        "{testimonial.text}"
                      </p>

                      {/* Rating */}
                      <div className="mb-4">
                        {renderStars(testimonial.rating, 'sm')}
                      </div>

                      {/* Author Info */}
                      <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
                        {testimonial.image ? (
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
                            <Image
                              src={testimonial.image}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-neutral-900 truncate">
                            {testimonial.name}
                          </p>
                          <p className="text-xs text-neutral-600 truncate">
                            {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-500">
                  <p className="text-sm">Aucun témoignage à afficher</p>
                </div>
              )}
            </div>

            <p className="text-xs text-neutral-500 mt-3 text-center">
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Ceci est un aperçu de la section Témoignages telle qu'elle apparaîtra sur votre site
            </p>
          </motion.div>

          {/* Form Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
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

      {/* Testimonial Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                  <h3 className="text-xl font-semibold text-neutral-900">
                    {editingIndex !== null ? 'Modifier le témoignage' : 'Ajouter un témoignage'}
                  </h3>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="modal-name" className="block text-sm font-medium text-neutral-700 mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="modal-name"
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                      placeholder="Ex: Jean Dupont"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                        modalErrors.name ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      maxLength={100}
                    />
                    <div className="flex items-center justify-between mt-1">
                      {modalErrors.name && (
                        <p className="text-sm text-red-600">{modalErrors.name}</p>
                      )}
                      <p className="text-xs text-neutral-500 ml-auto">
                        {modalName.length}/100 caractères
                      </p>
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="modal-company" className="block text-sm font-medium text-neutral-700 mb-2">
                      Entreprise <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="modal-company"
                      value={modalCompany}
                      onChange={(e) => setModalCompany(e.target.value)}
                      placeholder="Ex: Entreprise ABC"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                        modalErrors.company ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      maxLength={100}
                    />
                    <div className="flex items-center justify-between mt-1">
                      {modalErrors.company && (
                        <p className="text-sm text-red-600">{modalErrors.company}</p>
                      )}
                      <p className="text-xs text-neutral-500 ml-auto">
                        {modalCompany.length}/100 caractères
                      </p>
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <div>
                    <label htmlFor="modal-text" className="block text-sm font-medium text-neutral-700 mb-2">
                      Témoignage <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="modal-text"
                      value={modalText}
                      onChange={(e) => setModalText(e.target.value)}
                      rows={4}
                      placeholder="Ex: Excellent travail, très professionnel et à l'écoute de nos besoins..."
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none ${
                        modalErrors.text ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      maxLength={1000}
                    />
                    <div className="flex items-center justify-between mt-1">
                      {modalErrors.text && (
                        <p className="text-sm text-red-600">{modalErrors.text}</p>
                      )}
                      <p className="text-xs text-neutral-500 ml-auto">
                        {modalText.length}/1000 caractères
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label htmlFor="modal-rating" className="block text-sm font-medium text-neutral-700 mb-2">
                      Note <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setModalRating(star)}
                            className="focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
                          >
                            <svg
                              className={`w-8 h-8 transition-colors ${
                                star <= modalRating ? 'text-amber-400 hover:text-amber-500' : 'text-neutral-300 hover:text-neutral-400'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                      <span className="text-sm text-neutral-600">
                        {modalRating} étoile{modalRating > 1 ? 's' : ''}
                      </span>
                    </div>
                    {modalErrors.rating && (
                      <p className="text-sm text-red-600 mt-1">{modalErrors.rating}</p>
                    )}
                  </div>

                  {/* Image URL (Optional) */}
                  <div>
                    <label htmlFor="modal-image" className="block text-sm font-medium text-neutral-700 mb-2">
                      URL de l'image (optionnel)
                    </label>
                    <input
                      type="text"
                      id="modal-image"
                      value={modalImage}
                      onChange={(e) => setModalImage(e.target.value)}
                      placeholder="Ex: https://example.com/photo.jpg"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                    />
                    <p className="text-xs text-neutral-500 mt-2">
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      TODO: L'upload d'image sera implémenté ultérieurement
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveModal}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    {editingIndex !== null ? 'Enregistrer' : 'Ajouter'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
