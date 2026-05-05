'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { SkeletonGrid } from '@/components/ui/LoadingSkeleton';
import { getGalleryImages, GalleryImage, GalleryFilters, getGalleryCategoryLabel } from '@/lib/api/gallery';
import { getBlurDataURL, getResponsiveSizes } from '@/lib/cloudinaryLoader';

// Dynamic import for Lightbox component (code splitting)
const Lightbox = dynamic(
  () => import('@/components/ui/Lightbox').then((mod) => mod.Lightbox),
  {
    loading: () => null,
    ssr: false,
  }
);

/**
 * Gallery Page with SEO optimization
 * Requirements: 23.6, 23.9, 23.10
 */
export default function GaleriePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Update document title and meta description
  useEffect(() => {
    document.title = 'Notre Galerie - Réalisations en Bois | ÉBENOR CRÉATION';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Découvrez nos réalisations et laissez-vous inspirer par notre savoir-faire artisanal. Galerie de créations en bois haut de gamme : cuisines, dressings, mobilier.');
    }
  }, []);
  
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const [filters, setFilters] = useState<GalleryFilters>({
    category: searchParams.get('category') || undefined,
  });

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getGalleryImages(currentPage, 20, filters);
      setImages(response.data);
      setTotalPages(response.pagination.pages);
      setTotal(response.pagination.total);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    const queryString = params.toString();
    router.push(`/galerie${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [filters, currentPage, router]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  const handleCategoryChange = (category: string) => {
    setFilters({
      category: category === 'all' ? undefined : category,
    });
    setCurrentPage(1);
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const currentImage = images[selectedImageIndex];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-wood text-white" role="banner">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-6 lg:text-5xl">
              Notre Galerie
            </h1>
            <p className="text-xl opacity-90">
              Découvrez nos réalisations et laissez-vous inspirer par notre savoir-faire artisanal.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section 
        className="py-8 bg-white border-b sticky top-0 z-10 shadow-sm"
        aria-label="Filtres de galerie"
      >
        <div className="container">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par catégorie">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors focus-visible-enhanced ${
                !filters.category
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              aria-pressed={!filters.category}
              aria-label="Afficher toutes les images"
            >
              Toutes
            </button>
            <button
              onClick={() => handleCategoryChange('cuisine')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors focus-visible-enhanced ${
                filters.category === 'cuisine'
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              aria-pressed={filters.category === 'cuisine'}
              aria-label={`Filtrer par ${getGalleryCategoryLabel('cuisine')}`}
            >
              {getGalleryCategoryLabel('cuisine')}
            </button>
            <button
              onClick={() => handleCategoryChange('dressing')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors focus-visible-enhanced ${
                filters.category === 'dressing'
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              aria-pressed={filters.category === 'dressing'}
              aria-label={`Filtrer par ${getGalleryCategoryLabel('dressing')}`}
            >
              {getGalleryCategoryLabel('dressing')}
            </button>
            <button
              onClick={() => handleCategoryChange('mobilier')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors focus-visible-enhanced ${
                filters.category === 'mobilier'
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              aria-pressed={filters.category === 'mobilier'}
              aria-label={`Filtrer par ${getGalleryCategoryLabel('mobilier')}`}
            >
              {getGalleryCategoryLabel('mobilier')}
            </button>
            <button
              onClick={() => handleCategoryChange('amenagement')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors focus-visible-enhanced ${
                filters.category === 'amenagement'
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              aria-pressed={filters.category === 'amenagement'}
              aria-label={`Filtrer par ${getGalleryCategoryLabel('amenagement')}`}
            >
              {getGalleryCategoryLabel('amenagement')}
            </button>
            <button
              onClick={() => handleCategoryChange('showroom')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors focus-visible-enhanced ${
                filters.category === 'showroom'
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              aria-pressed={filters.category === 'showroom'}
              aria-label={`Filtrer par ${getGalleryCategoryLabel('showroom')}`}
            >
              {getGalleryCategoryLabel('showroom')}
            </button>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section" aria-label="Galerie d'images">
        <div className="container">
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-neutral-600" role="status" aria-live="polite" aria-atomic="true">
              {loading ? (
                <span className="inline-block w-32 h-5 bg-neutral-200 animate-pulse rounded" />
              ) : (
                <>
                  <span className="font-semibold text-neutral-900">{total}</span> image{total !== 1 ? 's' : ''}
                </>
              )}
            </p>
          </div>

          {/* Masonry Grid */}
          {loading ? (
            <SkeletonGrid count={8} type="gallery" columns={4} />
          ) : images.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4" aria-hidden="true">🖼️</div>
              <h3 className="text-2xl font-semibold text-neutral-800 mb-2">
                Aucune image trouvée
              </h3>
              <p className="text-neutral-600">
                Essayez de modifier vos filtres
              </p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6" role="list">
              {images.map((image, index) => (
                <div
                  key={image._id}
                  className="mb-6 break-inside-avoid group cursor-pointer"
                  onClick={() => openLightbox(index)}
                  role="listitem"
                >
                  <button
                    className="relative rounded-lg overflow-hidden bg-neutral-100 shadow-md hover:shadow-xl transition-shadow w-full text-left focus-visible-enhanced"
                    aria-label={`Ouvrir ${image.title} en plein écran`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      width={image.dimensions.width}
                      height={image.dimensions.height}
                      sizes={getResponsiveSizes('gallery')}
                      className="w-full h-auto"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={getBlurDataURL(image.url)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                        <p className="text-sm opacity-90">{getGalleryCategoryLabel(image.category)}</p>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          {!loading && currentPage < totalPages && (
            <div className="text-center mt-12">
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="btn-primary focus-visible-enhanced"
                aria-label="Charger plus d'images"
              >
                Charger plus d'images
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && currentImage && (
        <Lightbox
          images={images.map((img) => ({
            url: img.url,
            alt: img.alt,
            title: img.title,
            description: img.description,
          }))}
          currentIndex={selectedImageIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrevious={prevImage}
        />
      )}
    </div>
  );
}
