'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function FactoryShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-[#0D0D0D] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "80px" } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-transparent via-[#C9A14A] to-transparent mx-auto mb-6"
          />
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Notre Atelier de Fabrication
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Découvrez l'excellence de notre savoir-faire artisanal et nos installations modernes
          </p>
        </motion.div>

        {/* Videos Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Video 1 - Demo Travail 1 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group relative overflow-hidden rounded-2xl shadow-2xl"
          >
            <div className="relative aspect-video">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/video/demoTravail1.mp4" type="video/mp4" />
              </video>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Précision Artisanale
                </h3>
                <p className="text-gray-200 text-sm">
                  Nos artisans qualifiés travaillent avec précision et passion
                </p>
              </div>
              
              {/* Decorative Border */}
              <div className="absolute inset-0 border-2 border-[#C9A14A]/0 group-hover:border-[#C9A14A]/50 transition-all duration-300 rounded-2xl" />
            </div>
          </motion.div>

          {/* Video 2 - Demo Travail 2 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="group relative overflow-hidden rounded-2xl shadow-2xl"
          >
            <div className="relative aspect-video">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/video/demoTravail2.mp4" type="video/mp4" />
              </video>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Technologies Modernes
                </h3>
                <p className="text-gray-200 text-sm">
                  Équipements de pointe pour une qualité exceptionnelle
                </p>
              </div>
              
              {/* Decorative Border */}
              <div className="absolute inset-0 border-2 border-[#C9A14A]/0 group-hover:border-[#C9A14A]/50 transition-all duration-300 rounded-2xl" />
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
        >
          {[
            { number: '25+', label: 'Années d\'Expérience' },
            { number: '50+', label: 'Artisans Qualifiés' },
            { number: '1000+', label: 'Projets Réalisés' },
            { number: '100%', label: 'Satisfaction Client' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#C9A14A] mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
