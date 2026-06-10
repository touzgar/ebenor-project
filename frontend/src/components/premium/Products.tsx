'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { HiArrowRight } from 'react-icons/hi';
import { useHomeContent, useFeaturedProducts } from '@/hooks';
import { getBlurDataURL, getResponsiveSizes } from '@/lib/cloudinaryLoader';

export function Products() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { content: homeContent, loading: homeLoading } = useHomeContent();
  const { products, loading: productsLoading } = useFeaturedProducts(4);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  // Utiliser les services du contenu home si disponible, sinon les produits de l'API
  const displayItems = homeContent?.services || products.map(product => ({
    title: product.name,
    description: product.shortDescription,
    image: product.images[0]?.url || '',
    category: product.category,
    icon: product.category
  }));

  if (homeLoading && productsLoading) return null;

  return (
    <section className="py-0 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-2"
        >
          <span className="text-[#C9A14A] font-semibold tracking-wider uppercase text-sm">
            Nos Créations
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#0D0D0D] mt-0 mb-2 leading-tight">
            Excellence & <span className="text-[#C9A14A]">Savoir-faire</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Découvrez nos réalisations d'exception, chaque projet étant unique et 
            conçu selon vos désirs les plus exigeants.
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {displayItems.slice(0, 4).map((item: any, index: number) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group cursor-pointer"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes={getResponsiveSizes('product')}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  loading={index < 2 ? 'eager' : 'lazy'}
                  placeholder="blur"
                  blurDataURL={getBlurDataURL(item.image)}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-[#C9A14A] text-sm font-semibold tracking-wider uppercase">
                      {item.category || 'Création'}
                    </span>
                    <h3 className="text-xl font-serif mt-0 mb-2 group-hover:text-[#C9A14A] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-300 mb-2 leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center text-sm font-semibold group-hover:text-[#C9A14A] transition-colors">
                      <span>Découvrir</span>
                      <HiArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
                    </div>
                  </motion.div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-[#C9A14A] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-0"
        >
          <button className="bg-gradient-to-r from-[#C9A14A] to-[#D4B55A] text-black px-8 py-0 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-[#C9A14A]/30 transition-all duration-300 transform hover:scale-105">
            Voir tous nos produits
          </button>
        </motion.div>
      </div>
    </section>
  );
}
