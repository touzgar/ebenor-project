'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ProductVideo {
  url: string;
  publicId?: string;
  file?: File;
  preview?: string;
  uploading?: boolean;
  uploadProgress?: number;
  error?: string;
  thumbnail?: string;
}

interface ProductVideoManagerProps {
  video: ProductVideo | null;
  onChange: (video: ProductVideo | null) => void;
  maxFileSize?: number; // in MB
  acceptedFormats?: string[];
}

const DEFAULT_MAX_FILE_SIZE = 100; // MB
const DEFAULT_ACCEPTED_FORMATS = ['video/mp4', 'video/webm'];

export function ProductVideoManager({
  video,
  onChange,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
}: ProductVideoManagerProps) {
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [videoUrl, setVideoUrl] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate file
  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return {
        isValid: false,
        error: `Format non autorisé. Formats acceptés: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`,
      };
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      return {
        isValid: false,
        error: `Fichier trop volumineux. Taille maximale: ${maxFileSize}MB`,
      };
    }

    return { isValid: true };
  };

  // Validate URL
  const validateUrl = (url: string): { isValid: boolean; error?: string } => {
    if (!url.trim()) {
      return { isValid: false, error: 'URL requise' };
    }

    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { isValid: false, error: 'URL doit commencer par http:// ou https://' };
      }
      return { isValid: true };
    } catch {
      return { isValid: false, error: 'URL invalide' };
    }
  };

  // Handle file selection
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setValidationError(null);

    const validation = validateFile(file);

    if (!validation.isValid) {
      setValidationError(validation.error || 'Fichier invalide');
      return;
    }

    // Create preview URL
    const preview = URL.createObjectURL(file);

    onChange({
      url: preview,
      file,
      preview,
      uploading: false,
    });
  };

  // Handle URL submission
  const handleUrlSubmit = () => {
    setValidationError(null);

    const validation = validateUrl(videoUrl);

    if (!validation.isValid) {
      setValidationError(validation.error || 'URL invalide');
      return;
    }

    onChange({
      url: videoUrl,
      uploading: false,
    });

    setVideoUrl('');
  };

  // Handle click on upload zone
  const handleUploadZoneClick = () => {
    if (inputMode === 'upload') {
      fileInputRef.current?.click();
    }
  };

  // Delete video
  const handleDeleteVideo = () => {
    if (video?.preview) {
      URL.revokeObjectURL(video.preview);
    }
    onChange(null);
    setVideoUrl('');
    setValidationError(null);
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      {!video && (
        <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-lg w-fit">
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              inputMode === 'upload'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Télécharger un fichier
          </button>
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              inputMode === 'url'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            URL de vidéo
          </button>
        </div>
      )}

      {/* Upload Zone or URL Input */}
      {!video && (
        <AnimatePresence mode="wait">
          {inputMode === 'upload' ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div
                onClick={handleUploadZoneClick}
                className="relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all border-neutral-300 hover:border-amber-400 hover:bg-neutral-50"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={acceptedFormats.join(',')}
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="space-y-4">
                  {/* Upload Icon */}
                  <div className="flex justify-center">
                    <svg
                      className="w-16 h-16 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  {/* Upload Text */}
                  <div>
                    <p className="text-lg font-medium text-neutral-900">
                      Cliquez pour sélectionner une vidéo
                    </p>
                    <p className="text-sm text-neutral-600 mt-1">
                      ou glissez-déposez un fichier vidéo
                    </p>
                  </div>

                  {/* Upload Info */}
                  <div className="text-xs text-neutral-500 space-y-1">
                    <p>Formats acceptés: MP4, WebM</p>
                    <p>Taille maximale: {maxFileSize}MB</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="url"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                  URL de la vidéo
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    id="videoUrl"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://example.com/video.mp4"
                    className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleUrlSubmit();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleUrlSubmit}
                    className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Ajouter
                  </button>
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Entrez l'URL complète d'une vidéo hébergée (YouTube, Vimeo, ou lien direct)
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Validation Error */}
      {validationError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
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
            <div>
              <h3 className="text-sm font-medium text-red-800">Erreur de validation</h3>
              <p className="mt-1 text-sm text-red-700">{validationError}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Video Preview */}
      {video && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex gap-4">
            {/* Video Thumbnail */}
            <div className="relative w-48 h-32 flex-shrink-0 bg-neutral-900 rounded-lg overflow-hidden group">
              {video.preview || video.thumbnail ? (
                <video
                  src={video.preview || video.url}
                  className="w-full h-full object-cover"
                  preload="metadata"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-neutral-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              {/* Play Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all">
                <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-amber-600 ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Upload Progress */}
              {video.uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <div className="text-white text-sm font-medium">
                      {video.uploadProgress || 0}%
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Video Details */}
            <div className="flex-1 space-y-3">
              {/* Video Info */}
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  {video.file ? video.file.name : 'Vidéo externe'}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {video.file
                    ? `${(video.file.size / (1024 * 1024)).toFixed(2)} MB`
                    : video.url}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDeleteVideo}
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-1"
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

              {/* Error Message */}
              {video.error && (
                <p className="text-sm text-red-600">{video.error}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!video && (
        <div className="text-center py-8 bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-200">
          <svg
            className="w-12 h-12 mx-auto text-neutral-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-neutral-500">Aucune vidéo ajoutée</p>
          <p className="text-xs text-neutral-400 mt-1">
            Ajoutez une vidéo pour présenter votre produit
          </p>
        </div>
      )}
    </div>
  );
}
