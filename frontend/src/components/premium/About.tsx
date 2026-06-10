'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { useHomeContent } from '@/hooks';
import { getBlurDataURL, getResponsiveSizes } from '@/lib/cloudinaryLoader';

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { content, loading } = useHomeContent();

  if (loading || !content) return null;

  return (
    <section id="about" className="py-0 bg-[#F5F5F5]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-4 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={content.about.image}
                alt="Artisan ÉBÉNOR CRÉATION au travail"
                fill
                sizes={getResponsiveSizes('hero')}
                className="object-cover"
                priority
                placeholder="blur"
                blurDataURL={getBlurDataURL(content.about.image)}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            
            {/* Decorative element */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -top-6 -right-6 w-24 h-24 bg-[#C9A14A] rounded-full flex items-center justify-center shadow-xl"
            >
              <span className="text-black font-bold text-lg">25+</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl"
            >
              <p className="text-sm text-gray-600 mb-2">Années d'expérience</p>
              <p className="font-bold text-[#C9A14A] text-lg">Savoir-faire artisanal</p>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="space-y-2"
          >
            <div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-[#C9A14A] font-semibold tracking-wider uppercase text-sm"
              >
                Notre Histoire
              </motion.span>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-4xl md:text-5xl font-serif text-[#0D0D0D] mt-0 leading-tight"
              >
                {content.about.title}
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg text-gray-600 leading-relaxed"
            >
              {content.about.description}
            </motion.p>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-2"
            >
              {content.about.highlights.map((highlight: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-2 h-2 bg-[#C9A14A] rounded-full" />
                  <span className="text-gray-700">{highlight}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="grid grid-cols-3 gap-4 pt-0"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-[#C9A14A] mb-2">500+</div>
                <div className="text-sm text-gray-600">Projets réalisés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#C9A14A] mb-2">25+</div>
                <div className="text-sm text-gray-600">Années d'expérience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#C9A14A] mb-2">100%</div>
                <div className="text-sm text-gray-600">Satisfaction client</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="pt-0"
            >
              <button className="bg-[#0D0D0D] text-white px-8 py-0 rounded-full font-semibold hover:bg-[#C9A14A] hover:text-black transition-all duration-300 transform hover:scale-105">
                Découvrir notre atelier
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
