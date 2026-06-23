'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, formatPrice, getAvailabilityLabel, getCategoryLabel, getPrimaryImage, getPrimaryImageAlt } from '@/lib/api/products';
import { getBlurDataURL } from '@/lib/cloudinaryLoader';
import { 
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  SparklesIcon,
  XMarkIcon,
  ShoppingBagIcon,
  CheckBadgeIcon,
  TagIcon,
  PlayIcon,
  InformationCircleIcon,
  CubeIcon,
  SwatchIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import VideoLightbox from '@/components/ui/VideoLightbox';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  categoryNameMap?: Record<string, string>;
}

export default function ProductCard({ product, priority = false, categoryNameMap = {} }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideoLightbox, setShowVideoLightbox] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const primaryImageUrl = getPrimaryImage(product);
  const primaryImageAlt = getPrimaryImageAlt(product);
  const hasVideo = product.video && product.video.url;
  const primaryVideo = hasVideo ? product.video : null;
  const allImages = product.images || [];
  
  // Get REAL category name from map, fallback to getCategoryLabel
  const categoryDisplayName = categoryNameMap[product.category] || getCategoryLabel(product.category);

  // Video autoplay on hover
  useEffect(() => {
    if (videoRef.current && hasVideo) {
      if (isHovered) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, hasVideo]);

  return (
    <>
      {/* Product Card - Modern Shadcn Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="h-full"
      >
        <Card 
          className={cn(
            "h-full overflow-hidden transition-all duration-500 cursor-pointer group",
            "border-2 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20",
            "bg-gradient-to-br from-white via-white to-amber-50/30"
          )}
          onClick={() => setShowModal(true)}
        >
          {/* Image/Video Section with Gradient Overlay */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200">
            {hasVideo && isHovered ? (
              <video
                ref={videoRef}
                src={primaryVideo.url}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
              />
            ) : (
              <Image
                src={primaryImageUrl}
                alt={primaryImageAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority={priority}
                placeholder="blur"
                blurDataURL={getBlurDataURL(primaryImageUrl)}
              />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Video Indicator - Instagram Reel Style */}
            {hasVideo && !isHovered && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-2xl border-2 border-white/50 group-hover:scale-110 transition-transform duration-300">
                  <PlayIcon className="w-8 h-8 text-amber-600 ml-1" />
                </div>
              </motion.div>
            )}

            {/* Expand / Open Reel Button */}
            {hasVideo && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowVideoLightbox(true); }}
                aria-label="Ouvrir la vidéo en grand"
                className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-2 bg-white/90 text-neutral-900 px-3 py-2 rounded-full shadow-lg backdrop-blur-sm hover:scale-105 transition-transform"
              >
                <ArrowsPointingOutIcon className="w-4 h-4" />
                <span className="text-sm">Reel</span>
              </button>
            )}

            {/* Top Badges - Floating Style */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2 z-10">
              {product.featured && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm"
                >
                  <SparklesIcon className="w-4 h-4" />
                  Vedette
                </motion.div>
              )}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={cn(
                  "ml-auto text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm shadow-lg",
                  product.availability === 'in-stock' ? 'bg-green-500/90 text-white' :
                  product.availability === 'pre-order' ? 'bg-blue-500/90 text-white' :
                  'bg-red-500/90 text-white'
                )}
              >
                {product.availability === 'in-stock' && <CheckBadgeIcon className="w-4 h-4" />}
                {getAvailabilityLabel(product.availability)}
              </motion.div>
            </div>

            {/* Hover Info Overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <p className="text-white text-sm font-medium line-clamp-2">
                {product.shortDescription}
              </p>
            </motion.div>

            {/* Animated Border on Hover */}
            <div className="absolute inset-0 border-4 border-amber-400/0 group-hover:border-amber-400/40 transition-all duration-500 pointer-events-none rounded-[inherit]" />
          </div>

          {/* Content - Enhanced Typography */}
          <CardContent className="p-5 space-y-3">
            {/* Category Badge */}
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                {categoryDisplayName}
              </span>
            </div>
            
            {/* Product Name */}
            <h3 className="font-bold text-lg leading-tight line-clamp-2 min-h-[3.5rem] text-neutral-900 group-hover:text-amber-600 transition-colors duration-300">
              {product.name}
            </h3>
            
            {/* Tags Preview */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-md font-medium"
                  >
                    #{tag}
                  </span>
                ))}
                {product.tags.length > 2 && (
                  <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-md font-medium">
                    +{product.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </CardContent>

          {/* Footer - Enhanced CTA */}
          <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-neutral-100 mt-auto">
            <div>
              <p className="text-xs text-neutral-500 font-medium mb-1">À partir de</p>
              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">
                {formatPrice(product.price)}
              </p>
            </div>
            <Link
              href={`/produits/${product.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl font-bold text-sm group-hover:scale-105"
            >
              Voir
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>

              {/* FULL Detail Modal - Perfect Image Display */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-7xl max-h-[95vh] overflow-hidden bg-white rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - Floating */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 z-20 p-3 bg-white rounded-full hover:bg-neutral-100 transition-all shadow-xl hover:scale-110"
              >
                <XMarkIcon className="w-6 h-6 text-neutral-900" />
              </button>

              <div className="grid lg:grid-cols-2 h-full max-h-[95vh]">
                {/* Left: Perfect Image Display - 50% width */}
                <div className="bg-neutral-50 p-8 flex flex-col justify-center overflow-y-auto">
                  <div className="space-y-4">
                    {/* Main Large Image/Video - Perfect Display */}
                    <div className="relative w-full rounded-2xl overflow-hidden bg-white shadow-xl border-2 border-neutral-200" style={{ aspectRatio: '1/1' }}>
                      {hasVideo && currentImageIndex === 0 ? (
                        <div className="w-full h-full relative">
                          <video
                            src={primaryVideo.url}
                            controls
                            autoPlay
                            loop
                            className="w-full h-full object-contain bg-white"
                          />
                        </div>
                      ) : (
                        <div className="relative w-full h-full p-4">
                          <Image
                            src={allImages[hasVideo ? currentImageIndex - 1 : currentImageIndex]?.url || primaryImageUrl}
                            alt={allImages[hasVideo ? currentImageIndex - 1 : currentImageIndex]?.alt || primaryImageAlt}
                            fill
                            className="object-contain"
                            priority
                          />
                        </div>
                      )}
                    </div>

                    {/* Thumbnails - Perfect Grid */}
                    {(hasVideo || allImages.length > 1) && (
                      <div className="grid grid-cols-5 gap-3">
                        {hasVideo && (
                          <button
                            onClick={() => setCurrentImageIndex(0)}
                            className={cn(
                              "relative aspect-square rounded-xl overflow-hidden border-3 transition-all shadow-lg hover:shadow-xl",
                              currentImageIndex === 0 ? "border-amber-500 ring-4 ring-amber-500/30 scale-105" : "border-neutral-300 hover:border-amber-400"
                            )}
                          >
                            <video src={primaryVideo.url} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <PlayIcon className="w-8 h-8 text-white drop-shadow-2xl" />
                            </div>
                          </button>
                        )}
                        {allImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(hasVideo ? idx + 1 : idx)}
                            className={cn(
                              "relative aspect-square rounded-xl overflow-hidden border-3 transition-all shadow-lg hover:shadow-xl",
                              (hasVideo ? idx + 1 : idx) === currentImageIndex 
                                ? "border-amber-500 ring-4 ring-amber-500/30 scale-105" 
                                : "border-neutral-300 hover:border-amber-400"
                            )}
                          >
                            <div className="relative w-full h-full p-1 bg-white">
                              <Image src={img.url} alt={img.alt || ''} fill className="object-contain" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Product Details - 50% width, scrollable */}
                <div className="p-8 overflow-y-auto bg-gradient-to-br from-white to-amber-50/30">
                  <div className="space-y-6">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-4 py-2 bg-amber-100 text-amber-700 text-sm font-bold rounded-full border-2 border-amber-200">
                        {categoryDisplayName}
                      </span>
                      {product.featured && (
                        <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-full flex items-center gap-1.5 shadow-lg">
                          <SparklesIcon className="w-5 h-5" />
                          Vedette
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 leading-tight">
                        {product.name}
                      </h2>
                      
                      {/* Price & Stock */}
                      <div className="flex items-center gap-4 flex-wrap">
                        <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">
                          {formatPrice(product.price)}
                        </p>
                        <span className={cn(
                          "px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm",
                          product.availability === 'in-stock' ? 'bg-green-100 text-green-700 border-2 border-green-200' :
                          product.availability === 'pre-order' ? 'bg-blue-100 text-blue-700 border-2 border-blue-200' :
                          'bg-red-100 text-red-700 border-2 border-red-200'
                        )}>
                          {product.availability === 'in-stock' && <CheckCircleIcon className="w-5 h-5" />}
                          {getAvailabilityLabel(product.availability)}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {(product.longDescription || product.shortDescription) && (
                      <div className="p-5 bg-white rounded-2xl border-2 border-neutral-200 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 mb-3">
                          <InformationCircleIcon className="w-6 h-6 text-amber-600" />
                          Description
                        </div>
                        <p className="text-neutral-700 leading-relaxed">
                          {product.longDescription || product.shortDescription}
                        </p>
                      </div>
                    )}

                    {/* Specifications */}
                    {(product.specifications && Object.keys(product.specifications).length > 0) || product.dimensions || (product.materials && product.materials.length > 0) || (product.finishes && product.finishes.length > 0) ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-base font-bold text-neutral-900">
                          <CubeIcon className="w-6 h-6 text-amber-600" />
                          Spécifications Techniques
                        </div>

                        <div className="p-5 bg-white rounded-2xl border-2 border-neutral-200 shadow-sm space-y-4">
                          {/* Dimensions */}
                          {product.dimensions && (
                            <div>
                              <div className="text-xs font-bold text-neutral-500 mb-2">Dimensions</div>
                              <div className="text-base text-neutral-900 font-semibold">
                                {product.dimensions.length && `L: ${product.dimensions.length}${product.dimensions.unit}`}
                                {product.dimensions.width && ` × l: ${product.dimensions.width}${product.dimensions.unit}`}
                                {product.dimensions.height && ` × H: ${product.dimensions.height}${product.dimensions.unit}`}
                              </div>
                            </div>
                          )}

                          {/* Materials */}
                          {product.materials && product.materials.length > 0 && (
                            <div>
                              <div className="text-xs font-bold text-neutral-500 mb-2">Matériaux</div>
                              <div className="flex flex-wrap gap-2">
                                {product.materials.map((m) => (
                                  <span key={m} className="px-3 py-1.5 bg-neutral-100 rounded-lg text-sm font-semibold text-neutral-700 border border-neutral-200">
                                    {m}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Finishes */}
                          {product.finishes && product.finishes.length > 0 && (
                            <div>
                              <div className="text-xs font-bold text-neutral-500 mb-2">Finitions</div>
                              <div className="flex flex-wrap gap-2">
                                {product.finishes.map((f) => (
                                  <span key={f} className="px-3 py-1.5 bg-neutral-100 rounded-lg text-sm font-semibold text-neutral-700 border border-neutral-200">
                                    {f}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Other Specs */}
                          {product.specifications && Object.keys(product.specifications).length > 0 && (
                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-200">
                              {Object.entries(product.specifications).map(([k, v]) => (
                                <div key={k} className="flex flex-col">
                                  <span className="text-xs text-neutral-500 font-semibold mb-1">{k}</span>
                                  <span className="text-sm text-neutral-900 font-bold">{v}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                      <div>
                        <div className="text-sm font-bold text-neutral-900 mb-3">Tags</div>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1.5 bg-neutral-100 text-neutral-600 text-sm rounded-lg font-medium border border-neutral-200"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA Button - Prominent */}
                    <Link
                      href={`/produits/${product.slug}`}
                      className="flex items-center justify-center gap-3 w-full px-8 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-lg rounded-2xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] mt-8"
                    >
                      <ShoppingBagIcon className="w-6 h-6" />
                      Voir la Page Complète
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {showVideoLightbox && primaryVideo && (
        <VideoLightbox src={primaryVideo.url} poster={primaryImageUrl} onClose={() => setShowVideoLightbox(false)} />
      )}
    </>
  );
}
