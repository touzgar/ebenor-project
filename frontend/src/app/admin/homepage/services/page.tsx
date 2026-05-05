'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
import { SortableServiceItem } from '@/components/admin/SortableServiceItem';
import { PublishToggle } from '@/components/admin/PublishToggle';

interface Service {
  title: string;
  description: string;
  icon: string;
  image?: string;
}

export default function ServicesEditorPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Services state
  const [services, setServices] = useState<Service[]>([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalIcon, setModalIcon] = useState('');
  const [modalImage, setModalImage] = useState('');
  const [modalErrors, setModalErrors] = useState<Record<string, string>>({});

  // UI state
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load current services content
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
          
          if (content.services) {
            setServices(content.services);
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
    setModalTitle('');
    setModalDescription('');
    setModalIcon('');
    setModalImage('');
    setModalErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (index: number) => {
    const service = services[index];
    setEditingIndex(index);
    setModalTitle(service.title);
    setModalDescription(service.description);
    setModalIcon(service.icon);
    setModalImage(service.image || '');
    setModalErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setModalTitle('');
    setModalDescription('');
    setModalIcon('');
    setModalImage('');
    setModalErrors({});
  };

  const validateModal = (): boolean => {
    const errors: Record<string, string> = {};

    if (!modalTitle.trim()) {
      errors.title = 'Le titre est requis';
    } else if (modalTitle.length < 5) {
      errors.title = 'Le titre doit contenir au moins 5 caractères';
    } else if (modalTitle.length > 100) {
      errors.title = 'Le titre ne peut pas dépasser 100 caractères';
    }

    if (!modalDescription.trim()) {
      errors.description = 'La description est requise';
    } else if (modalDescription.length < 20) {
      errors.description = 'La description doit contenir au moins 20 caractères';
    } else if (modalDescription.length > 500) {
      errors.description = 'La description ne peut pas dépasser 500 caractères';
    }

    if (!modalIcon.trim()) {
      errors.icon = 'L\'icône est requise';
    } else if (modalIcon.length > 100) {
      errors.icon = 'L\'icône ne peut pas dépasser 100 caractères';
    }

    setModalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveModal = () => {
    if (!validateModal()) {
      return;
    }

    const newService: Service = {
      title: modalTitle.trim(),
      description: modalDescription.trim(),
      icon: modalIcon.trim(),
      image: modalImage.trim() || undefined,
    };

    if (editingIndex !== null) {
      // Edit existing service
      const updatedServices = [...services];
      updatedServices[editingIndex] = newService;
      setServices(updatedServices);
    } else {
      // Add new service
      setServices([...services, newService]);
    }

    closeModal();
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleServiceDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setServices((items) => {
        const oldIndex = items.findIndex((_, i) => String(i) === active.id);
        const newIndex = items.findIndex((_, i) => String(i) === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        services: services,
      };

      const response = await homeService.updateServices(payload.services);

      if (response.success) {
        alert('Section Services mise à jour avec succès !');
        router.push('/admin/dashboard');
      } else {
        throw new Error(response.message || 'Erreur lors de la mise à jour');
      }
    } catch (error: any) {
      console.error('Error updating services section:', error);

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
              Modifier la section Services
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
                  Modifier la section Services
                </h1>
                <p className="mt-2 text-neutral-600">
                  Gérez les services affichés sur votre page d'accueil
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
            <PublishToggle section="services" initialPublished={false} />
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

          {/* Services List Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">
                Services
              </h2>
              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un service
              </button>
            </div>

            {/* Services List with drag-and-drop */}
            {services.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleServiceDragEnd}>
                <SortableContext items={services.map((_, i) => String(i))} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {services.map((service, index) => (
                      <SortableServiceItem
                        key={index}
                        id={String(index)}
                        service={service}
                        index={index}
                        onEdit={openEditModal}
                        onRemove={handleRemoveService}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="text-center py-12 text-neutral-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-sm font-medium">Aucun service ajouté</p>
                <p className="text-xs mt-1">Cliquez sur "Ajouter un service" pour commencer</p>
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
              {services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service, index) => (
                    <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
                      {/* Icon */}
                      <div className="text-4xl mb-4">{service.icon}</div>
                      
                      {/* Title */}
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        {service.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-neutral-600 mb-4">
                        {service.description}
                      </p>
                      
                      {/* Image (if provided) */}
                      {service.image && (
                        <div className="relative aspect-video w-full bg-neutral-100 rounded-lg overflow-hidden">
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-500">
                  <p className="text-sm">Aucun service à afficher</p>
                </div>
              )}
            </div>

            <p className="text-xs text-neutral-500 mt-3 text-center">
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Ceci est un aperçu de la section Services telle qu'elle apparaîtra sur votre site
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

      {/* Service Modal */}
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
                    {editingIndex !== null ? 'Modifier le service' : 'Ajouter un service'}
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
                  {/* Title */}
                  <div>
                    <label htmlFor="modal-title" className="block text-sm font-medium text-neutral-700 mb-2">
                      Titre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="modal-title"
                      value={modalTitle}
                      onChange={(e) => setModalTitle(e.target.value)}
                      placeholder="Ex: Conception sur mesure"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                        modalErrors.title ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      maxLength={100}
                    />
                    <div className="flex items-center justify-between mt-1">
                      {modalErrors.title && (
                        <p className="text-sm text-red-600">{modalErrors.title}</p>
                      )}
                      <p className="text-xs text-neutral-500 ml-auto">
                        {modalTitle.length}/100 caractères
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="modal-description" className="block text-sm font-medium text-neutral-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="modal-description"
                      value={modalDescription}
                      onChange={(e) => setModalDescription(e.target.value)}
                      rows={4}
                      placeholder="Ex: Nous créons des meubles uniques adaptés à vos besoins et à votre espace"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none ${
                        modalErrors.description ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      maxLength={500}
                    />
                    <div className="flex items-center justify-between mt-1">
                      {modalErrors.description && (
                        <p className="text-sm text-red-600">{modalErrors.description}</p>
                      )}
                      <p className="text-xs text-neutral-500 ml-auto">
                        {modalDescription.length}/500 caractères
                      </p>
                    </div>
                  </div>

                  {/* Icon */}
                  <div>
                    <label htmlFor="modal-icon" className="block text-sm font-medium text-neutral-700 mb-2">
                      Icône (emoji ou texte) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="modal-icon"
                      value={modalIcon}
                      onChange={(e) => setModalIcon(e.target.value)}
                      placeholder="Ex: 🪚 ou ✨"
                      maxLength={100}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                        modalErrors.icon ? 'border-red-500' : 'border-neutral-300'
                      }`}
                    />
                    <div className="flex items-center justify-between mt-1">
                      {modalErrors.icon && (
                        <p className="text-sm text-red-600">{modalErrors.icon}</p>
                      )}
                      <p className="text-xs text-neutral-500 ml-auto">
                        {modalIcon.length}/100 caractères
                      </p>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Utilisez un emoji ou un symbole pour représenter le service
                    </p>
                  </div>

                  {/* Image (Optional) */}
                  <div>
                    <label htmlFor="modal-image" className="block text-sm font-medium text-neutral-700 mb-2">
                      URL de l'image (optionnel)
                    </label>
                    <input
                      type="text"
                      id="modal-image"
                      value={modalImage}
                      onChange={(e) => setModalImage(e.target.value)}
                      placeholder="Ex: https://example.com/image.jpg"
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
