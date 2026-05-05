'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import Image from 'next/image';

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  publicId?: string;
  file?: File;
  preview?: string;
  uploading?: boolean;
  uploadProgress?: number;
  error?: string;
}

interface ProductImageManagerProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxImages?: number;
  maxFileSize?: number; // in MB
  acceptedFormats?: string[];
}

const DEFAULT_MAX_IMAGES = 10;
const DEFAULT_MAX_FILE_SIZE = 10; // MB
const DEFAULT_ACCEPTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function ProductImageManager({
  images,
  onChange,
  maxImages = DEFAULT_MAX_IMAGES,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
}: ProductImageManagerProps) {
  const [isDragging, setIsDragging] = useState(false);
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

  // Handle file selection
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setValidationError(null);

    // Check max images limit
    if (images.length + files.length > maxImages) {
      setValidationError(`Vous ne pouvez ajouter que ${maxImages} images maximum`);
      return;
    }

    const newImages: ProductImage[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      const validation = validateFile(file);

      if (!validation.isValid) {
        errors.push(`${file.name}: ${validation.error}`);
        return;
      }

      // Create preview URL
      const preview = URL.createObjectURL(file);

      newImages.push({
        url: preview,
        alt: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
        isPrimary: images.length === 0 && newImages.length === 0, // First image is primary
        file,
        preview,
        uploading: false,
      });
    });

    if (errors.length > 0) {
      setValidationError(errors.join('; '));
    }

    if (newImages.length > 0) {
      onChange([...images, ...newImages]);
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

  // Set image as primary
  const handleSetPrimary = (index: number) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(updatedImages);
  };

  // Update alt text
  const handleAltTextChange = (index: number, alt: string) => {
    const updatedImages = [...images];
    updatedImages[index] = { ...updatedImages[index], alt };
    onChange(updatedImages);
  };

  // Delete image
  const handleDeleteImage = (index: number) => {
    const imageToDelete = images[index];
    
    // Revoke preview URL if it exists
    if (imageToDelete.preview) {
      URL.revokeObjectURL(imageToDelete.preview);
    }

    const updatedImages = images.filter((_, i) => i !== index);

    // If deleted image was primary, set first image as primary
    if (imageToDelete.isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }

    onChange(updatedImages);
  };

  // Handle reorder
  const handleReorder = (newOrder: ProductImage[]) => {
    onChange(newOrder);
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadZoneClick}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-amber-500 bg-amber-50'
            : 'border-neutral-300 hover:border-amber-400 hover:bg-neutral-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="space-y-4">
          {/* Upload Icon */}
          <div className="flex justify-center">
            <svg
              className={`w-16 h-16 transition-colors ${
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
            <p className="text-lg font-medium text-neutral-900">
              {isDragging ? 'Déposez les images ici' : 'Glissez-déposez des images'}
            </p>
            <p className="text-sm text-neutral-600 mt-1">
              ou cliquez pour sélectionner des fichiers
            </p>
          </div>

          {/* Upload Info */}
          <div className="text-xs text-neutral-500 space-y-1">
            <p>Formats acceptés: JPG, PNG, WebP</p>
            <p>Taille maximale: {maxFileSize}MB par image</p>
            <p>Maximum {maxImages} images</p>
          </div>
        </div>
      </div>

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

      {/* Images List */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-neutral-900">
              Images ({images.length}/{maxImages})
            </h3>
            <p className="text-sm text-neutral-600">
              Glissez-déposez pour réorganiser
            </p>
          </div>

          <Reorder.Group
            axis="y"
            values={images}
            onReorder={handleReorder}
            className="space-y-3"
          >
            <AnimatePresence>
              {images.map((image, index) => (
                <Reorder.Item
                  key={image.url}
                  value={image}
                  className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-move"
                >
                  <div className="flex gap-4">
                    {/* Drag Handle */}
                    <div className="flex items-center text-neutral-400 hover:text-neutral-600">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 8h16M4 16h16"
                        />
                      </svg>
                    </div>

                    {/* Image Preview */}
                    <div className="relative w-24 h-24 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.alt || 'Product image'}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                      {image.isPrimary && (
                        <div className="absolute top-1 left-1 bg-amber-600 text-white text-xs px-2 py-1 rounded">
                          Principale
                        </div>
                      )}
                      {image.uploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="text-white text-xs">
                            {image.uploadProgress || 0}%
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Image Details */}
                    <div className="flex-1 space-y-3">
                      {/* Alt Text Input */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Texte alternatif
                        </label>
                        <input
                          type="text"
                          value={image.alt}
                          onChange={(e) => handleAltTextChange(index, e.target.value)}
                          placeholder="Description de l'image"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors text-sm"
                          maxLength={200}
                        />
                        <p className="text-xs text-neutral-500 mt-1">
                          {image.alt.length}/200 caractères
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {!image.isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(index)}
                            className="inline-flex items-center px-3 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
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
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                              />
                            </svg>
                            Définir comme principale
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteImage(index)}
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
                      {image.error && (
                        <p className="text-sm text-red-600">{image.error}</p>
                      )}
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-neutral-500">Aucune image ajoutée</p>
          <p className="text-xs text-neutral-400 mt-1">
            Ajoutez des images pour votre produit
          </p>
        </div>
      )}
    </div>
  );
}
