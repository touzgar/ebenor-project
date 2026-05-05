'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  getProductBySlug, 
  getSimilarProducts,
  Product, 
  formatPrice, 
  getAvailabilityLabel, 
  getAvailabilityColor,
  getCategoryLabel 
} from '@/lib/api/products';
import ProductCard from '@/components/public/ProductCard';
import { getBlurDataURL, getResponsiveSizes } from '@/lib/cloudinaryLoader';
import { useProductSEO } from '@/hooks/useProductSEO';

/**
 * Product Detail Page with SEO optimization
 * Requirements: 23.1, 23.2, 23.3, 23.4, 23.5, 23.9, 23.10
 */
export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Apply SEO optimizations for product
  useProductSEO(product);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductBySlug(slug);
        setProduct(response.data);
        
        // Fetch similar products
        if (response.data._id) {
          const similarResponse = await getSimilarProducts(response.data._id, 4);
          setSimilarProducts(similarResponse.data);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Produit non trouvé');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="container py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-1/4 mb-8" />
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="aspect-square bg-neutral-200 rounded-lg" />
              <div className="space-y-4">
                <div className="h-10 bg-neutral-200 rounded w-3/4" />
                <div className="h-6 bg-neutral-200 rounded w-1/2" />
                <div className="h-32 bg-neutral-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold text-neutral-800 mb-4">
            Produit non trouvé
          </h1>
          <p className="text-neutral-600 mb-8">
            Le produit que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Link href="/produits" className="btn-primary">
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  const currentImage = product.images[selectedImageIndex];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container py-4">
          <nav className="flex items-center gap-2 text-sm text-neutral-600">
            <Link href="/" className="hover:text-primary-600">Accueil</Link>
            <span>/</span>
            <Link href="/produits" className="hover:text-primary-600">Produits</Link>
            <span>/</span>
            <Link 
              href={`/produits?category=${product.category}`} 
              className="hover:text-primary-600"
            >
              {getCategoryLabel(product.category)}
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <section className="section">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Image Gallery */}
            <div>
              {/* Main Image */}
              <div 
                className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100 mb-4 cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
              >
                <Image
                  src={currentImage?.url || '/placeholder-product.jpg'}
                  alt={currentImage?.alt || product.name}
                  fill
                  sizes={getResponsiveSizes('product')}
                  className="object-cover"
                  priority
                  placeholder="blur"
                  blurDataURL={getBlurDataURL(currentImage?.url || '/placeholder-product.jpg')}
                />
                {product.featured && (
                  <div className="absolute top-4 left-4 bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-full">
                    En vedette
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        index === selectedImageIndex
                          ? 'border-primary-600 ring-2 ring-primary-200'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        sizes={getResponsiveSizes('thumbnail')}
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={getBlurDataURL(image.url)}
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Title and Category */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-medium text-primary-600">
                    {getCategoryLabel(product.category)}
                  </span>
                  {product.subcategory && (
                    <>
                      <span className="text-neutral-300">•</span>
                      <span className="text-sm text-neutral-600">{product.subcategory}</span>
                    </>
                  )}
                </div>
                <h1 className="text-4xl font-bold text-neutral-900 mb-4">
                  {product.name}
                </h1>
                <p className="text-xl text-neutral-600">
                  {product.shortDescription}
                </p>
              </div>

              {/* Price and Availability */}
              <div className="flex items-center gap-4 mb-8 pb-8 border-b">
                <div className="text-3xl font-bold text-primary-600">
                  {formatPrice(product.price)}
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${getAvailabilityColor(product.availability)}`}>
                  {getAvailabilityLabel(product.availability)}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                  Description
                </h2>
                <div 
                  className="prose prose-neutral max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                    Spécifications
                  </h2>
                  <dl className="grid grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="border-b border-neutral-200 pb-2">
                        <dt className="text-sm text-neutral-600 mb-1">{key}</dt>
                        <dd className="font-medium text-neutral-900">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Dimensions */}
              {product.dimensions && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                    Dimensions
                  </h2>
                  <div className="flex gap-6">
                    {product.dimensions.length && (
                      <div>
                        <div className="text-sm text-neutral-600 mb-1">Longueur</div>
                        <div className="font-medium text-neutral-900">
                          {product.dimensions.length} {product.dimensions.unit}
                        </div>
                      </div>
                    )}
                    {product.dimensions.width && (
                      <div>
                        <div className="text-sm text-neutral-600 mb-1">Largeur</div>
                        <div className="font-medium text-neutral-900">
                          {product.dimensions.width} {product.dimensions.unit}
                        </div>
                      </div>
                    )}
                    {product.dimensions.height && (
                      <div>
                        <div className="text-sm text-neutral-600 mb-1">Hauteur</div>
                        <div className="font-medium text-neutral-900">
                          {product.dimensions.height} {product.dimensions.unit}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Materials */}
              {product.materials && product.materials.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                    Matériaux
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((material, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg text-sm font-medium"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Finishes */}
              {product.finishes && product.finishes.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                    Finitions
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {product.finishes.map((finish, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg text-sm font-medium"
                      >
                        {finish}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="flex gap-4">
                <Link href="/contact" className="btn-primary flex-1">
                  Demander un devis
                </Link>
                <button
                  onClick={() => window.history.back()}
                  className="btn-ghost"
                >
                  Retour
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="section bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-neutral-900 mb-8">
              Produits similaires
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {similarProducts.map((similarProduct) => (
                <ProductCard key={similarProduct._id} product={similarProduct} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-neutral-300 transition-colors"
            aria-label="Fermer"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {product.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
                }}
                className="absolute left-4 text-white hover:text-neutral-300 transition-colors"
                aria-label="Image précédente"
              >
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-4 text-white hover:text-neutral-300 transition-colors"
                aria-label="Image suivante"
              >
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div className="relative max-w-6xl max-h-[90vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={currentImage?.url || '/placeholder-product.jpg'}
              alt={currentImage?.alt || product.name}
              fill
              sizes="90vw"
              className="object-contain"
              placeholder="blur"
              blurDataURL={getBlurDataURL(currentImage?.url || '/placeholder-product.jpg')}
            />
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {selectedImageIndex + 1} / {product.images.length}
          </div>
        </div>
      )}
    </div>
  );
}
