'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { Product, getPrimaryImage, getPrimaryImageAlt } from '@/lib/api/products';
import { ShoppingBagIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Props {
  products: Product[];
}

// Lightbox Component - Clean version like gallery
function Lightbox({ 
  products, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrevious 
}: { 
  products: Product[]; 
  currentIndex: number; 
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const currentProduct = products[currentIndex];
  const [showControls, setShowControls] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={onClose}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Blurred Background */}
      <div className="absolute inset-0 backdrop-blur-3xl bg-black/90" />

      {/* Close button - only visible on hover */}
      <button
        onClick={onClose}
        className={`absolute top-4 right-4 z-[10000] p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Fermer"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      {/* Previous button */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrevious(); }}
          className={`absolute left-4 z-[10000] p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Image précédente"
        >
          <ChevronLeftIcon className="w-8 h-8" />
        </button>
      )}

      {/* Next button */}
      {currentIndex < products.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className={`absolute right-4 z-[10000] p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Image suivante"
        >
          <ChevronRightIcon className="w-8 h-8" />
        </button>
      )}

      {/* Pure Image - NO TEXT, NO OVERLAYS */}
      <div
        className="relative z-[9999] w-[95vw] h-[95vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={getPrimaryImage(currentProduct)}
          alt={getPrimaryImageAlt(currentProduct)}
          fill
          sizes="95vw"
          className="object-contain"
          priority
        />
      </div>
    </motion.div>
  );
}

export default function ProductTable({ products }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setSelectedIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  // Handle keyboard navigation
  useState(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatDelay: 1
          }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 mb-6 shadow-xl"
        >
          <ShoppingBagIcon className="w-12 h-12 text-amber-600" />
        </motion.div>
        <h3 className="text-3xl font-bold text-neutral-800 mb-3">
          Aucun produit disponible
        </h3>
        <p className="text-neutral-600 text-lg">
          Vérifiez vos filtres ou revenez plus tard
        </p>
      </motion.div>
    );
  }

  return (
    <>
      {/* Gallery Grid - Pure Images */}
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="mb-6 break-inside-avoid group cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <div className="relative rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.03]">
              {/* Pure Image - No text overlay */}
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full"
                >
                  <Image
                    src={getPrimaryImage(product)}
                    alt={getPrimaryImageAlt(product)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    loading="lazy"
                  />
                </motion.div>

                {/* Subtle gradient overlay only on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Magnifying glass icon on hover */}
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  whileHover={{ scale: 1, rotate: 0 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center border-2 border-white/40 shadow-2xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </motion.div>

                {/* Subtle product name at bottom on hover */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <h3 className="text-lg font-bold text-white drop-shadow-lg line-clamp-1">
                    {product.name}
                  </h3>
                </motion.div>

                {/* Border glow effect on hover */}
                <div className="absolute inset-0 rounded-3xl border-4 border-amber-400/0 group-hover:border-amber-400/50 transition-all duration-300" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          products={products}
          currentIndex={selectedIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrevious={prevImage}
        />
      )}
    </>
  );
}
