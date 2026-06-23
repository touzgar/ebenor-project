'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, getPrimaryImage, getPrimaryImageAlt } from '@/lib/api/products';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ProductImageGridProps {
  products: Product[];
}

export default function ProductImageGrid({ products }: ProductImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string; name: string } | null>(null);

  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-neutral-900 mb-3">
          Aucun produit trouvé
        </h3>
        <p className="text-neutral-600 max-w-md mx-auto">
          Aucun produit ne correspond aux filtres sélectionnés.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => {
          const imageUrl = getPrimaryImage(product);
          const imageAlt = getPrimaryImageAlt(product);

          return (
            <div
              key={product._id}
              className="group relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden bg-neutral-100 cursor-zoom-in hover:shadow-2xl transition-all duration-300"
              onClick={() => setSelectedImage({ url: imageUrl, alt: imageAlt, name: product.name })}
            >
              <img
                src={imageUrl}
                alt={imageAlt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-sm line-clamp-2">
                    {product.name}
                  </h3>
                </div>
              </div>

              {/* Zoom indicator */}
              <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-5 h-5 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <XMarkIcon className="w-8 h-8 text-white" />
            </button>

            <div className="relative max-w-6xl max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedImage.url}
                alt={selectedImage.alt}
                className="max-w-full max-h-[90vh] object-contain"
              />
            </div>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white text-base font-semibold">
              {selectedImage.name}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
