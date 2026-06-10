'use client';

import { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { galleryService } from '@/lib/api';

interface UploadFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

const ACCEPTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export default function GalleryUploadPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // State management
  const [uploadQueue, setUploadQueue] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Validate file
  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file type
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      return {
        isValid: false,
        error: `${file.name}: Format non autorisé. Formats acceptés: JPG, PNG, WebP`,
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return {
        isValid: false,
        error: `${file.name}: Fichier trop volumineux (${sizeMB}MB). Taille maximale: 10MB`,
      };
    }

    return { isValid: true };
  };

  // Handle file selection
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const errors: string[] = [];
    const newFiles: UploadFile[] = [];

    Array.from(files).forEach((file) => {
      const validation = validateFile(file);

      if (!validation.isValid) {
        errors.push(validation.error!);
        return;
      }

      // Create preview URL
      const preview = URL.createObjectURL(file);

      newFiles.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview,
        progress: 0,
        status: 'pending',
      });
    });

    setValidationErrors(errors);

    if (newFiles.length > 0) {
      setUploadQueue((prev) => [...prev, ...newFiles]);
    }
  };

  // Handle drag over
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Handle drop
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  // Handle file input change
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  // Handle click on upload zone
  const handleUploadZoneClick = () => {
    fileInputRef.current?.click();
  };

  // Remove file from queue
  const handleRemoveFile = (fileId: string) => {
    setUploadQueue((prev) => {
      const file = prev.find((f) => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  // Upload single file
  const uploadFile = async (uploadFile: UploadFile): Promise<boolean> => {
    try {
      // Update status to uploading
      setUploadQueue((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: 'uploading' as const, progress: 0 }
            : f
        )
      );

      // Create FormData
      const formData = new FormData();
      formData.append('image', uploadFile.file);

      // Simulate progress (since we can't track real upload progress easily)
      const progressInterval = setInterval(() => {
        setUploadQueue((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id && f.progress < 90
              ? { ...f, progress: f.progress + 10 }
              : f
          )
        );
      }, 200);

      try {
        // Upload to API
        const response = await galleryService.uploadImage(formData);

        if (response.success) {
          // Update status to success
          setUploadQueue((prev) =>
            prev.map((f) =>
              f.id === uploadFile.id
                ? { ...f, status: 'success' as const, progress: 100 }
                : f
            )
          );
          return true;
        } else {
          throw new Error('Upload failed');
        }
      } finally {
        // Always clear interval
        clearInterval(progressInterval);
      }
    } catch (error) {
      console.error('Upload error:', error);
      
      // Update status to error
      setUploadQueue((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? {
                ...f,
                status: 'error' as const,
                progress: 0,
                error: error instanceof Error ? error.message : 'Erreur lors du téléchargement',
              }
            : f
        )
      );
      return false;
    }
  };

  // Upload all files
  const handleUploadAll = async () => {
    if (uploadQueue.length === 0) return;

    setIsUploading(true);
    setSuccessCount(0);
    setErrorCount(0);

    const pendingFiles = uploadQueue.filter((f) => f.status === 'pending');

    // Upload files sequentially to avoid overwhelming the server
    for (const file of pendingFiles) {
      const success = await uploadFile(file);
      if (success) {
        setSuccessCount((prev) => prev + 1);
      } else {
        setErrorCount((prev) => prev + 1);
      }
    }

    setIsUploading(false);

    // If all uploads succeeded, redirect after a short delay
    if (errorCount === 0 && pendingFiles.length > 0) {
      setTimeout(() => {
        router.push('/admin/gallery');
      }, 2000);
    }
  };

  // Retry failed upload
  const handleRetryFile = async (fileId: string) => {
    const file = uploadQueue.find((f) => f.id === fileId);
    if (!file) return;

    await uploadFile(file);
  };

  // Clear completed uploads
  const handleClearCompleted = () => {
    setUploadQueue((prev) => {
      // Revoke preview URLs for completed files
      prev
        .filter((f) => f.status === 'success')
        .forEach((f) => {
          if (f.preview) {
            URL.revokeObjectURL(f.preview);
          }
        });
      
      return prev.filter((f) => f.status !== 'success');
    });
    setSuccessCount(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      uploadQueue.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [uploadQueue]);

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const pendingCount = uploadQueue.filter((f) => f.status === 'pending').length;
  const uploadingCount = uploadQueue.filter((f) => f.status === 'uploading').length;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold text-neutral-900">
                Télécharger des images
              </h1>
              <p className="mt-2 text-neutral-600">
                Ajoutez des images à votre galerie
              </p>
            </motion.div>

            <button
              onClick={() => router.push('/admin/gallery')}
              className="inline-flex items-center px-4 py-2 text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à la galerie
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Upload Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8"
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleUploadZoneClick}
              className={`relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-neutral-300 hover:border-amber-400 hover:bg-neutral-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPTED_FORMATS.join(',')}
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="space-y-4">
                {/* Upload Icon */}
                <div className="flex justify-center">
                  <svg
                    className={`w-20 h-20 transition-colors ${
                      isDragging ? 'text-amber-500' : 'text-neutral-400'
                    }`}
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
                </div>

                {/* Upload Text */}
                <div>
                  <p className="text-xl font-medium text-neutral-900">
                    {isDragging
                      ? 'Déposez les images ici'
                      : 'Glissez-déposez des images ou cliquez pour sélectionner'}
                  </p>
                  <p className="text-sm text-neutral-600 mt-2">
                    Vous pouvez sélectionner plusieurs fichiers à la fois
                  </p>
                </div>

                {/* Upload Info */}
                <div className="inline-flex items-center space-x-6 text-sm text-neutral-500 bg-neutral-50 px-6 py-3 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>JPG, PNG, WebP</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Max 10MB par image</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Validation Errors */}
          <AnimatePresence>
            {validationErrors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0"
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
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800 mb-2">
                      Erreurs de validation
                    </h3>
                    <ul className="text-sm text-red-700 space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setValidationErrors([])}
                      className="mt-3 text-sm text-red-700 hover:text-red-900 underline"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Queue */}
          {uploadQueue.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
            >
              {/* Queue Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">
                    File d'attente ({uploadQueue.length})
                  </h2>
                  <p className="text-sm text-neutral-600 mt-1">
                    {pendingCount > 0 && `${pendingCount} en attente`}
                    {uploadingCount > 0 && ` • ${uploadingCount} en cours`}
                    {successCount > 0 && ` • ${successCount} réussi(s)`}
                    {errorCount > 0 && ` • ${errorCount} échoué(s)`}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {successCount > 0 && (
                    <button
                      onClick={handleClearCompleted}
                      disabled={isUploading}
                      className="px-4 py-2 text-sm text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Effacer les réussites
                    </button>
                  )}
                  
                  {pendingCount > 0 && (
                    <button
                      onClick={handleUploadAll}
                      disabled={isUploading}
                      className="inline-flex items-center px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Téléchargement...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Télécharger tout ({pendingCount})
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Queue Items */}
              <div className="space-y-3">
                <AnimatePresence>
                  {uploadQueue.map((uploadFile) => (
                    <motion.div
                      key={uploadFile.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                    >
                      {/* Preview */}
                      <div className="relative w-20 h-20 flex-shrink-0 bg-neutral-200 rounded-lg overflow-hidden">
                        <Image
                          src={uploadFile.preview}
                          alt={uploadFile.file.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                        
                        {/* Status Overlay */}
                        {uploadFile.status === 'uploading' && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                        
                        {uploadFile.status === 'success' && (
                          <div className="absolute inset-0 bg-green-500 bg-opacity-80 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        
                        {uploadFile.status === 'error' && (
                          <div className="absolute inset-0 bg-red-500 bg-opacity-80 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {uploadFile.file.name}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {(uploadFile.file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>

                        {/* Progress Bar */}
                        {uploadFile.status === 'uploading' && (
                          <div className="mt-2">
                            <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadFile.progress}%` }}
                                className="h-full bg-amber-600 rounded-full"
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                            <p className="text-xs text-neutral-500 mt-1">
                              {uploadFile.progress}%
                            </p>
                          </div>
                        )}

                        {/* Error Message */}
                        {uploadFile.status === 'error' && uploadFile.error && (
                          <p className="text-xs text-red-600 mt-2">
                            {uploadFile.error}
                          </p>
                        )}

                        {/* Success Message */}
                        {uploadFile.status === 'success' && (
                          <p className="text-xs text-green-600 mt-2 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Téléchargement réussi
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {uploadFile.status === 'error' && (
                          <button
                            onClick={() => handleRetryFile(uploadFile.id)}
                            disabled={isUploading}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Réessayer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                        )}

                        {uploadFile.status !== 'uploading' && (
                          <button
                            onClick={() => handleRemoveFile(uploadFile.id)}
                            disabled={isUploading}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Supprimer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Success Message */}
          <AnimatePresence>
            {successCount > 0 && errorCount === 0 && !isUploading && pendingCount === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
              >
                <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-green-900 mb-2">
                  Téléchargement réussi !
                </h3>
                <p className="text-green-700 mb-4">
                  {successCount} image{successCount > 1 ? 's ont été téléchargées' : ' a été téléchargée'} avec succès.
                </p>
                <p className="text-sm text-green-600">
                  Redirection vers la galerie...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
