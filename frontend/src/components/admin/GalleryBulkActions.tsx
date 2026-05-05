'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryService } from '@/lib/api';

interface GalleryBulkActionsProps {
  selectedImageIds: string[];
  onComplete: () => void;
}

type BulkAction = 'delete' | 'feature' | 'unfeature' | 'changeCategory';

export default function GalleryBulkActions({
  selectedImageIds,
  onComplete,
}: GalleryBulkActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<BulkAction | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const selectedCount = selectedImageIds.length;

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle bulk action initiation
  const handleBulkAction = (action: BulkAction) => {
    setPendingAction(action);
    
    if (action === 'changeCategory') {
      setShowCategoryDialog(true);
    } else if (action === 'delete') {
      setShowConfirmDialog(true);
    } else {
      // Feature/Unfeature don't need confirmation
      executeBulkAction(action);
    }
  };

  // Execute bulk action
  const executeBulkAction = async (action: BulkAction, data?: any) => {
    setIsProcessing(true);
    setShowConfirmDialog(false);
    setShowCategoryDialog(false);

    try {
      const response = await galleryService.bulkOperations({
        action,
        imageIds: selectedImageIds,
        data,
      });

      if (response.success) {
        const actionMessages = {
          delete: `${selectedCount} image(s) supprimée(s) avec succès`,
          feature: `${selectedCount} image(s) mise(s) en vedette`,
          unfeature: `${selectedCount} image(s) retirée(s) de la vedette`,
          changeCategory: `Catégorie changée pour ${selectedCount} image(s)`,
        };

        showNotification('success', actionMessages[action]);
        onComplete();
      }
    } catch (error) {
      console.error('Bulk operation error:', error);
      showNotification(
        'error',
        error instanceof Error ? error.message : 'Une erreur est survenue'
      );
    } finally {
      setIsProcessing(false);
      setPendingAction(null);
    }
  };

  // Handle category change submission
  const handleCategorySubmit = () => {
    if (!selectedCategory) {
      showNotification('error', 'Veuillez sélectionner une catégorie');
      return;
    }

    executeBulkAction('changeCategory', { category: selectedCategory });
  };

  return (
    <>
      {/* Bulk Actions Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full mr-3">
              <svg
                className="w-5 h-5 text-amber-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">
                {selectedCount} image{selectedCount > 1 ? 's' : ''} sélectionnée
                {selectedCount > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-amber-700">
                Choisissez une action à appliquer
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Feature Button */}
            <button
              onClick={() => handleBulkAction('feature')}
              disabled={isProcessing}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-amber-700 bg-white border border-amber-300 rounded-lg hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Mettre en vedette
            </button>

            {/* Unfeature Button */}
            <button
              onClick={() => handleBulkAction('unfeature')}
              disabled={isProcessing}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-amber-700 bg-white border border-amber-300 rounded-lg hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
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
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              Retirer vedette
            </button>

            {/* Change Category Button */}
            <button
              onClick={() => handleBulkAction('changeCategory')}
              disabled={isProcessing}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-amber-700 bg-white border border-amber-300 rounded-lg hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              Changer catégorie
            </button>

            {/* Delete Button */}
            <button
              onClick={() => handleBulkAction('delete')}
              disabled={isProcessing}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Supprimer
            </button>
          </div>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-amber-200"
          >
            <div className="flex items-center text-sm text-amber-800">
              <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mr-2" />
              Traitement en cours...
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && pendingAction === 'delete' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowConfirmDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-red-600"
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
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    Confirmer la suppression
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Êtes-vous sûr de vouloir supprimer{' '}
                    <span className="font-semibold">{selectedCount}</span> image
                    {selectedCount > 1 ? 's' : ''} ? Cette action est irréversible et
                    supprimera également les fichiers de Cloudinary.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => executeBulkAction('delete')}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Selection Dialog */}
      <AnimatePresence>
        {showCategoryDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowCategoryDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Changer la catégorie
                </h3>
                <p className="text-sm text-neutral-600">
                  Sélectionnez une nouvelle catégorie pour{' '}
                  <span className="font-semibold">{selectedCount}</span> image
                  {selectedCount > 1 ? 's' : ''}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {/* Category Select */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Catégorie <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="realisations">Réalisations</option>
                    <option value="atelier">Atelier</option>
                    <option value="materiaux">Matériaux</option>
                    <option value="inspiration">Inspiration</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowCategoryDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCategorySubmit}
                  disabled={!selectedCategory}
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Appliquer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50 max-w-md"
          >
            <div
              className={`rounded-lg shadow-lg p-4 ${
                notification.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {notification.type === 'success' ? (
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <p
                    className={`text-sm font-medium ${
                      notification.type === 'success'
                        ? 'text-green-800'
                        : 'text-red-800'
                    }`}
                  >
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={() => setNotification(null)}
                  className={`ml-4 flex-shrink-0 ${
                    notification.type === 'success'
                      ? 'text-green-600 hover:text-green-800'
                      : 'text-red-600 hover:text-red-800'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
