'use client';

import React, { useState, useEffect } from 'react';
import VideoLightbox from '@/components/ui/VideoLightbox';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/premium/Header';
import { Footer } from '@/components/public/Footer';
import { 
  getProductBySlug, 
  getSimilarProducts,
  Product, 
  formatPrice, 
  getAvailabilityLabel,
  getCategoryLabel 
} from '@/lib/api/products';
import ProductCard from '@/components/public/ProductCard';
import { getBlurDataURL } from '@/lib/cloudinaryLoader';
import { 
  SparklesIcon,
  CheckCircleIcon,
  CubeIcon,
  SwatchIcon,
  TagIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  ArrowsPointingOutIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showVideoLightbox, setShowVideoLightbox] = useState(false);
  const [showImageLightbox, setShowImageLightbox] = useState(false);
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const mainVideoRef = React.useRef<HTMLVideoElement>(null);

  // Auto-play video on hover - MUST be before any early returns
  React.useEffect(() => {
    if (mainVideoRef.current && product?.video?.url) {
      if (isVideoHovered) {
        const playPromise = mainVideoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log('Video play prevented:', error);
          });
        }
      } else {
        mainVideoRef.current.pause();
        mainVideoRef.current.currentTime = 0;
      }
    }
  }, [isVideoHovered, product]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductBySlug(slug);
        setProduct(response.data);
        
        // DEBUG: Log product data to console
        console.log('Product loaded:', response.data);
        console.log('Video:', response.data?.video);
        console.log('Images:', response.data?.images);
        console.log('Materials:', response.data?.materials);
        console.log('Dimensions:', response.data?.dimensions);
        
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
      <>
        <Header />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-600">Chargement...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">Produit non trouvé</h1>
            <p className="text-neutral-600 mb-8">Le produit que vous recherchez n'existe pas.</p>
            <Link href="/produits" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-all">
              <ArrowLeftIcon className="w-5 h-5" />
              Retour aux produits
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const hasVideo = product.video && product.video.url;
  const allImages = product.images || [];
  
  // Get current image index adjusted for video
  const getCurrentImageIndex = () => {
    if (hasVideo && selectedImageIndex > 0) {
      return selectedImageIndex - 1;
    }
    return hasVideo ? 0 : selectedImageIndex;
  };
  
  const currentImage = allImages[getCurrentImageIndex()];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
        {/* Breadcrumb - Modern */}
        <div className="bg-white border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-neutral-600 hover:text-amber-600 transition-colors">Accueil</Link>
              <ChevronRightIcon className="w-4 h-4 text-neutral-400" />
              <Link href="/produits" className="text-neutral-600 hover:text-amber-600 transition-colors">Produits</Link>
              <ChevronRightIcon className="w-4 h-4 text-neutral-400" />
              <Link href={`/produits?category=${product.category}`} className="text-neutral-600 hover:text-amber-600 transition-colors">
                {getCategoryLabel(product.category)}
              </Link>
              <ChevronRightIcon className="w-4 h-4 text-neutral-400" />
              <span className="text-neutral-900 font-semibold truncate">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Detail - Improved Layout */}
        <section className="py-12">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-16">
              {/* Left: Image Gallery - LARGER & Better Display */}
              <div className="space-y-6">
                {/* Main Image - MUCH LARGER */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative w-full rounded-2xl overflow-hidden bg-neutral-900 shadow-xl group"
                  style={{ height: '700px' }}
                >
                  {hasVideo && selectedImageIndex === 0 ? (
                    <div 
                      className="relative w-full h-full bg-neutral-900"
                      onMouseEnter={() => setIsVideoHovered(true)}
                      onMouseLeave={() => setIsVideoHovered(false)}
                    >
                      <video
                        ref={mainVideoRef}
                        src={product.video?.url || ''}
                        className="w-full h-full object-cover"
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        onClick={() => setShowVideoLightbox(true)}
                        style={{ cursor: 'pointer' }}
                      />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {!isVideoHovered && (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-8 bg-white/95 rounded-full shadow-2xl pointer-events-auto cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowVideoLightbox(true);
                            }}
                          >
                            <PlayIcon className="w-16 h-16 text-amber-600" />
                          </motion.div>
                        )}
                      </div>

                      {/* Playing Indicator */}
                      {isVideoHovered && (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute top-6 left-6 px-4 py-2 bg-green-500 rounded-full shadow-xl pointer-events-none"
                        >
                          <span className="text-white text-sm font-bold">▶ En lecture...</span>
                        </motion.div>
                      )}

                      {/* Click to Expand Hint */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-full pointer-events-none"
                      >
                        <span className="text-white text-sm font-semibold">Cliquez pour agrandir</span>
                      </motion.div>
                    </div>
                  ) : (
                    <div 
                      className="relative w-full h-full cursor-zoom-in"
                      onClick={() => setShowImageLightbox(true)}
                    >
                      <Image
                        src={currentImage?.url || '/placeholder-product.jpg'}
                        alt={currentImage?.alt || product.name}
                        fill
                        className="object-cover"
                        priority
                        placeholder="blur"
                        blurDataURL={getBlurDataURL(currentImage?.url || '/placeholder-product.jpg')}
                      />
                    </div>
                  )}

                  {/* Expand Button - Always Visible */}
                  <button
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      hasVideo && selectedImageIndex === 0 ? setShowVideoLightbox(true) : setShowImageLightbox(true); 
                    }}
                    className="absolute top-6 right-6 p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-xl hover:bg-white transition-all hover:scale-110 z-10"
                  >
                    <ArrowsPointingOutIcon className="w-6 h-6 text-neutral-900" />
                  </button>

                  {/* Featured Badge */}
                  {product.featured && (
                    <div className="absolute top-6 left-6 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-xl flex items-center gap-2 z-10">
                      <SparklesIcon className="w-5 h-5" />
                      En vedette
                    </div>
                  )}
                </motion.div>

                {/* Thumbnails Grid - Larger */}
                {(hasVideo || allImages.length > 1) && (
                  <div className="grid grid-cols-6 gap-4">
                    {hasVideo && (
                      <button
                        onClick={() => setSelectedImageIndex(0)}
                        className={`relative aspect-square rounded-xl overflow-hidden transition-all shadow-md hover:shadow-xl ${
                          selectedImageIndex === 0 ? 'ring-4 ring-amber-500 scale-105' : 'ring-2 ring-neutral-200 hover:ring-amber-400'
                        }`}
                      >
                        <video src={product.video?.url || ''} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <PlayIcon className="w-10 h-10 text-white drop-shadow-2xl" />
                        </div>
                      </button>
                    )}
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(hasVideo ? idx + 1 : idx)}
                        className={`relative aspect-square rounded-xl overflow-hidden transition-all shadow-md hover:shadow-xl ${
                          (hasVideo ? idx + 1 : idx) === selectedImageIndex
                            ? 'ring-4 ring-amber-500 scale-105'
                            : 'ring-2 ring-neutral-200 hover:ring-amber-400'
                        }`}
                      >
                        <div className="relative w-full h-full bg-white">
                          <Image src={img.url} alt={img.alt || ''} fill className="object-cover" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Product Info - Cleaner Cards */}
              <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                {/* Header Card - Simplified & Cleaner */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  {/* Category Badge */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Link 
                      href={`/produits?category=${product.category}`}
                      className="px-4 py-1.5 bg-amber-50 text-amber-700 text-sm font-semibold rounded-full hover:bg-amber-100 transition-colors"
                    >
                      {getCategoryLabel(product.category)}
                    </Link>
                    {product.featured && (
                      <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5">
                        <SparklesIcon className="w-4 h-4" />
                        Vedette
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-3 leading-tight">
                    {product.name}
                  </h1>

                  {/* Short Description */}
                  {product.shortDescription && (
                    <p className="text-base text-neutral-600 mb-6 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  )}

                  {/* Price & Availability */}
                  <div className="flex items-center gap-4 flex-wrap mb-6">
                    <div className="text-4xl font-black text-amber-600">
                      {formatPrice(product.price)}
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${
                      product.availability === 'in_stock' ? 'bg-green-50 text-green-700' :
                      product.availability === 'made_to_order' ? 'bg-blue-50 text-blue-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {product.availability === 'in_stock' && <CheckCircleIcon className="w-5 h-5" />}
                      {getAvailabilityLabel(product.availability)}
                    </span>
                  </div>
                </motion.div>

                {/* Description Card - Cleaner */}
                {(product.description || product.longDescription) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <InformationCircleIcon className="w-6 h-6 text-amber-600" />
                      <h2 className="text-xl font-bold text-neutral-900">Description</h2>
                    </div>
                    <div 
                      className="prose prose-neutral prose-sm max-w-none text-neutral-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: product.longDescription || product.description }}
                    />
                  </motion.div>
                )}

                {/* Specifications Card - Cleaner */}
                {(product.dimensions || (product.materials && product.materials.length > 0) || (product.finishes && product.finishes.length > 0) || (product.specifications && Object.keys(product.specifications).length > 0)) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                  >
                    <div className="flex items-center gap-2 mb-5">
                      <CubeIcon className="w-6 h-6 text-amber-600" />
                      <h2 className="text-xl font-bold text-neutral-900">Caractéristiques</h2>
                    </div>

                    <div className="space-y-5">
                      {/* Dimensions - Cleaner Display */}
                      {product.dimensions && (
                        <div className="grid grid-cols-3 gap-3">
                          {product.dimensions.length && (
                            <div className="p-3 bg-amber-50 rounded-xl text-center">
                              <div className="text-xs font-semibold text-amber-600 mb-1">Longueur</div>
                              <div className="text-xl font-bold text-amber-700">
                                {product.dimensions.length}<span className="text-sm ml-0.5">{product.dimensions.unit}</span>
                              </div>
                            </div>
                          )}
                          {product.dimensions.width && (
                            <div className="p-3 bg-amber-50 rounded-xl text-center">
                              <div className="text-xs font-semibold text-amber-600 mb-1">Largeur</div>
                              <div className="text-xl font-bold text-amber-700">
                                {product.dimensions.width}<span className="text-sm ml-0.5">{product.dimensions.unit}</span>
                              </div>
                            </div>
                          )}
                          {product.dimensions.height && (
                            <div className="p-3 bg-amber-50 rounded-xl text-center">
                              <div className="text-xs font-semibold text-amber-600 mb-1">Hauteur</div>
                              <div className="text-xl font-bold text-amber-700">
                                {product.dimensions.height}<span className="text-sm ml-0.5">{product.dimensions.unit}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Materials */}
                      {product.materials && product.materials.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <SwatchIcon className="w-5 h-5 text-neutral-500" />
                            <h3 className="text-sm font-bold text-neutral-700">Matériaux</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {product.materials.map((material) => (
                              <span key={material} className="px-3 py-1.5 bg-neutral-50 text-neutral-700 rounded-lg text-sm font-medium">
                                {material}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Finishes */}
                      {product.finishes && product.finishes.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <SparklesIcon className="w-5 h-5 text-neutral-500" />
                            <h3 className="text-sm font-bold text-neutral-700">Finitions</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {product.finishes.map((finish) => (
                              <span key={finish} className="px-3 py-1.5 bg-neutral-50 text-neutral-700 rounded-lg text-sm font-medium">
                                {finish}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Other Specifications */}
                      {product.specifications && Object.keys(product.specifications).length > 0 && (
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-100">
                          {Object.entries(product.specifications).map(([key, value]) => (
                            <div key={key} className="p-3 bg-neutral-50 rounded-lg">
                              <div className="text-xs font-semibold text-neutral-500 mb-1">{key}</div>
                              <div className="text-sm font-bold text-neutral-900">{value}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Tags Card - Cleaner */}
                {product.tags && product.tags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <TagIcon className="w-6 h-6 text-amber-600" />
                      <h2 className="text-xl font-bold text-neutral-900">Tags</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* CTA Buttons - Fixed at Bottom */}
            <div className="mt-12 pt-8 border-t border-neutral-200">
              <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-lg rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Demander un Devis Gratuit
                </Link>
                <button
                  onClick={() => window.history.back()}
                  className="px-8 py-4 bg-neutral-100 text-neutral-700 font-bold text-lg rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  ← Retour
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section className="py-16 bg-white border-t border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-neutral-900 mb-8">Produits Similaires</h2>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {similarProducts.map((similarProduct) => (
                  <ProductCard key={similarProduct._id} product={similarProduct} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Video Lightbox */}
        {showVideoLightbox && product.video && product.video.url && (
          <VideoLightbox 
            src={product.video.url} 
            poster={product.video.thumbnail || product.images[0]?.url} 
            onClose={() => setShowVideoLightbox(false)} 
          />
        )}

        {/* Image Lightbox */}
        <AnimatePresence>
          {showImageLightbox && currentImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
              onClick={() => setShowImageLightbox(false)}
            >
              <button
                onClick={() => setShowImageLightbox(false)}
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20"
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hasVideo) {
                        // With video: indices are 0 (video), 1,2,3... (images)
                        setSelectedImageIndex((prev) => {
                          if (prev === 1) return allImages.length; // First image -> last image
                          if (prev === 0) return allImages.length; // Video -> last image
                          return prev - 1;
                        });
                      } else {
                        setSelectedImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
                      }
                    }}
                    className="absolute left-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20"
                  >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hasVideo) {
                        // With video: indices are 0 (video), 1,2,3... (images)
                        setSelectedImageIndex((prev) => {
                          if (prev === allImages.length) return 1; // Last image -> first image
                          return prev + 1;
                        });
                      } else {
                        setSelectedImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
                      }
                    }}
                    className="absolute right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20"
                  >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              <div className="relative max-w-6xl max-h-[90vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
                <Image
                  src={currentImage.url}
                  alt={currentImage.alt || product.name}
                  fill
                  sizes="90vw"
                  className="object-contain"
                  placeholder="blur"
                  blurDataURL={getBlurDataURL(currentImage.url)}
                />
              </div>

              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold z-20">
                {hasVideo ? getCurrentImageIndex() + 1 : selectedImageIndex + 1} / {allImages.length}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
}
