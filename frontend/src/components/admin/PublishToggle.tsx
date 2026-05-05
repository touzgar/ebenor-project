'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { homeService } from '@/lib/api';

interface PublishToggleProps {
  section: 'hero' | 'about' | 'services' | 'process' | 'testimonials' | 'contact';
  initialPublished?: boolean;
}

export function PublishToggle({ section, initialPublished = false }: PublishToggleProps) {
  const [isPublished, setIsPublished] = useState(initialPublished);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleTogglePublish = async (newPublishedState: boolean) => {
    // Show confirmation dialog only for unpublishing
    if (!newPublishedState && isPublished) {
      setShowConfirmDialog(true);
      return;
    }

    await performToggle(newPublishedState);
  };

  const performToggle = async (newPublishedState: boolean) => {
    setIsLoading(true);
    setShowConfirmDialog(false);

    try {
      const response = await homeService.togglePublish(section, newPublishedState);

      if (response.success) {
        setIsPublished(newPublishedState);
        setNotification({
          type: 'success',
          message: newPublishedState
            ? 'Section publiée avec succès'
            : 'Section dépubliée avec succès',
        });

        // Auto-hide notification after 3 seconds
        setTimeout(() => setNotification(null), 3000);
      } else {
        throw new Error(response.message || 'Erreur lors de la mise à jour');
      }
    } catch (error: any) {
      console.error('Error toggling publish status:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Une erreur est survenue',
      });

      // Auto-hide error notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Publish Status and Toggle */}
      <div className="flex items-center gap-4">
        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-700">Statut:</span>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              isPublished
                ? 'bg-green-100 text-green-800'
                : 'bg-neutral-100 text-neutral-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-2 ${
                isPublished ? 'bg-green-600' : 'bg-neutral-400'
              }`}
            />
            {isPublished ? 'Publié' : 'Non publié'}
          </span>
        </div>

        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => handleTogglePublish(!isPublished)}
          disabled={isLoading}
          className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isPublished
              ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              : 'bg-amber-600 text-white hover:bg-amber-700'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Chargement...
            </>
          ) : (
            <>
              {isPublished ? (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                  Dépublier
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Publier
                </>
              )}
            </>
          )}
        </button>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-4 p-4 rounded-lg border ${
              notification.type === 'success'
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-start">
              {notification.type === 'success' ? (
                <svg
                  className="w-5 h-5 text-green-600 mt-0.5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-red-600 mt-0.5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              <div>
                <h4
                  className={`text-sm font-medium ${
                    notification.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {notification.type === 'success' ? 'Succès' : 'Erreur'}
                </h4>
                <p
                  className={`mt-1 text-sm ${
                    notification.type === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {notification.message}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmDialog(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                {/* Dialog Header */}
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Confirmer la dépublication
                    </h3>
                    <p className="mt-2 text-sm text-neutral-600">
                      Êtes-vous sûr de vouloir dépublier cette section ? Elle ne sera plus
                      visible sur le site public.
                    </p>
                  </div>
                </div>

                {/* Dialog Actions */}
                <div className="flex items-center justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowConfirmDialog(false)}
                    className="px-4 py-2 text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => performToggle(false)}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
