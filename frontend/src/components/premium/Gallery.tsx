'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useFeaturedGallery } from '@/hooks';
import { getBlurDataURL, getResponsiveSizes } from '@/lib/cloudinaryLoader';

export function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const { images, loading } = useFeaturedGallery(6);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  // Fonction pour déterminer la hauteur basée sur l'aspect ratio
  const getImageHeight = (image: any, index: number) => {
    if (image.dimensions) {
      const aspectRatio = image.dimensions.width / image.dimensions.height;
      if (aspectRatio > 1.5) return 'h-72'; // Paysage
      if (aspectRatio < 0.8) return 'h-96'; // Portrait
      return 'h-80'; // Carré ou proche
    }
    // Fallback pattern pour varier les hauteurs
    const heights = ['h-72', 'h-80', 'h-88', 'h-96'];
    return heights[index % heights.length];
  };

  if (loading && images.length === 0) return null;

  return (
    <>
      <section className="py-0 bg-[#F5F5F5]" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-2"
          >
            <span className="text-[#C9A14A] font-semibold tracking-wider uppercase text-sm">
              Galerie
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#0D0D0D] mt-0 mb-2 leading-tight">
              Nos <span className="text-[#C9A14A]">Réalisations</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Plongez dans l'univers ÉBÉNOR CRÉATION à travers une sélection 
              de nos plus belles réalisations.
            </p>
          </motion.div>

          {/* Masonry Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-2"
          >
            {images.map((image, index) => (
              <motion.div
                key={image._id}
                variants={itemVariants}
                className="break-inside-avoid group cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <div className={`relative ${getImageHeight(image, index)} rounded-2xl overflow-hidden shadow-lg`}>
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes={getResponsiveSizes('gallery')}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading={index < 3 ? 'eager' : 'lazy'}
                    placeholder="blur"
                    blurDataURL={getBlurDataURL(image.url)}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                  
                  {/* Content on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-center text-white">
                      <span className="text-[#C9A14A] text-sm font-semibold tracking-wider uppercase block mb-2">
                        {image.category}
                      </span>
                      <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center mx-auto">
                        <span className="text-2xl">+</span>
                      </div>
                    </div>
                  </div>

                  {/* Border effect */}
                  <div className="absolute inset-0 border-2 border-[#C9A14A] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-center mt-0"
          >
            <button className="bg-[#0D0D0D] text-white px-8 py-0 rounded-full font-semibold hover:bg-[#C9A14A] hover:text-black transition-all duration-300 transform hover:scale-105">
              Voir toute la galerie
            </button>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage !== null && images.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={images[selectedImage].url}
              alt={images[selectedImage].alt}
              width={800}
              height={600}
              sizes="90vw"
              className="object-contain max-h-[80vh] rounded-lg"
              onClick={(e) => e.stopPropagation()}
              placeholder="blur"
              blurDataURL={getBlurDataURL(images[selectedImage].url)}
            />
            
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-[#C9A14A] transition-colors"
            >
              <HiX className="w-8 h-8" />
            </button>
            
            {/* Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-[#C9A14A] transition-colors"
            >
              <HiChevronLeft className="w-8 h-8" />
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-[#C9A14A] transition-colors"
            >
              <HiChevronRight className="w-8 h-8" />
            </button>
            
            {/* Image info */}
            <div className="absolute bottom-4 left-4 text-white">
              <span className="text-[#C9A14A] text-sm font-semibold tracking-wider uppercase">
                {images[selectedImage].category}
              </span>
              <p className="text-lg font-serif mt-0">
                {images[selectedImage].title}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
