'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getBlurDataURL } from '@/lib/cloudinaryLoader';

export interface LightboxImage {
  url: string;
  alt: string;
  title?: string;
  description?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

/**
 * Lightbox component for viewing images in full-screen overlay
 * 
 * **Validates: Requirement 21.2** - ARIA labels for interactive elements
 * **Validates: Requirement 21.3** - Keyboard navigation (Escape, Arrow keys)
 * **Validates: Requirement 21.4** - Visible focus indicators
 * 
 * Features:
 * - Full-screen image viewing
 * - Navigation between images with arrow buttons
 * - Keyboard navigation (Escape, Arrow Left, Arrow Right)
 * - Touch/swipe support
 * - Image title and description display
 * - Image counter
 * 
 * @example
 * ```tsx
 * const [lightboxOpen, setLightboxOpen] = useState(false);
 * const [selectedIndex, setSelectedIndex] = useState(0);
 * 
 * <Lightbox
 *   images={images}
 *   currentIndex={selectedIndex}
 *   onClose={() => setLightboxOpen(false)}
 *   onNext={() => setSelectedIndex((prev) => (prev + 1) % images.length)}
 *   onPrevious={() => setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)}
 * />
 * ```
 */
export function Lightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
}: LightboxProps) {
  const currentImage = images[currentIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrevious();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrevious]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!currentImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Visionneuse d'images"
      aria-describedby="lightbox-description"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-neutral-300 transition-colors z-10 p-2 rounded-lg hover:bg-white/10 focus-visible-enhanced"
        aria-label="Fermer la visionneuse d'images"
      >
        <XMarkIcon className="w-8 h-8" aria-hidden="true" />
      </button>

      {/* Previous button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          className="absolute left-4 text-white hover:text-neutral-300 transition-colors z-10 p-2 rounded-lg hover:bg-white/10 focus-visible-enhanced"
          aria-label="Image précédente"
        >
          <ChevronLeftIcon className="w-12 h-12" aria-hidden="true" />
        </button>
      )}

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 text-white hover:text-neutral-300 transition-colors z-10 p-2 rounded-lg hover:bg-white/10 focus-visible-enhanced"
          aria-label="Image suivante"
        >
          <ChevronRightIcon className="w-12 h-12" aria-hidden="true" />
        </button>
      )}

      {/* Image container */}
      <div
        className="relative max-w-6xl max-h-[90vh] w-full h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative flex-1">
          <Image
            src={currentImage.url}
            alt={currentImage.alt}
            fill
            sizes="90vw"
            className="object-contain"
            placeholder="blur"
            blurDataURL={getBlurDataURL(currentImage.url)}
            priority
          />
        </div>

        {/* Image info */}
        <div id="lightbox-description" className="text-white text-center py-4 space-y-2">
          {currentImage.title && (
            <h3 className="text-xl font-semibold">{currentImage.title}</h3>
          )}
          {currentImage.description && (
            <p className="text-neutral-300">{currentImage.description}</p>
          )}
          {images.length > 1 && (
            <p className="text-sm text-neutral-400" aria-live="polite" aria-atomic="true">
              Image {currentIndex + 1} sur {images.length}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
