'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function WoodCatalog() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-0 bg-[#F5F5F5] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#C9A14A]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C9A14A]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-2"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "80px" } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-transparent via-[#C9A14A] to-transparent mx-auto mb-2"
          />
          
          <h2 className="text-4xl md:text-5xl font-bold text-[#0D0D0D] mb-2">
            Notre Palette de Bois
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explorez notre collection exclusive de bois nobles et essences rares
          </p>
        </motion.div>

        {/* Video Catalog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Premium Frame */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#C9A14A]/20">
            {/* Video */}
            <div className="relative aspect-video bg-black">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/video/catalogBois.mp4" type="video/mp4" />
              </video>
              
              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            {/* Decorative Corners */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#C9A14A]" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#C9A14A]" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#C9A14A]" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#C9A14A]" />
          </div>

          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
          >
            <div className="bg-gradient-to-r from-[#C9A14A] to-[#D4B55A] text-black px-8 py-0 rounded-full shadow-xl">
              <p className="font-semibold text-sm tracking-wide">
                Plus de 50 Essences Disponibles
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Wood Types Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-0"
        >
          {[
            { name: 'Chêne', color: '#8B7355', description: 'Noble et robuste' },
            { name: 'Noyer', color: '#5C4033', description: 'Élégant et chaleureux' },
            { name: 'Érable', color: '#D4A574', description: 'Clair et raffiné' },
            { name: 'Acajou', color: '#6F4E37', description: 'Luxueux et durable' },
          ].map((wood, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-[#C9A14A]/50">
                {/* Color Sample */}
                <div 
                  className="w-full h-24 rounded-lg mb-2 shadow-inner"
                  style={{ backgroundColor: wood.color }}
                />
                
                {/* Wood Info */}
                <h3 className="text-lg font-bold text-[#0D0D0D] mb-2">
                  {wood.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {wood.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-0"
        >
          <button className="group relative px-10 py-0 bg-gradient-to-r from-[#C9A14A] to-[#D4B55A] text-black font-semibold rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <span className="relative z-10">Télécharger le Catalogue Complet</span>
            
            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
