'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';

export function CallToAction() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative py-24 overflow-hidden" ref={ref}>
      {/* Background Image with Parallax */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-white"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-[#C9A14A] font-semibold tracking-wider uppercase text-sm"
            >
              Votre Projet Nous Attend
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif mt-4 mb-6 leading-tight"
            >
              Créons ensemble
              <br />
              <span className="text-[#C9A14A]">l'exception</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg"
            >
              Transformez vos espaces avec l'expertise ÉBÉNOR CRÉATION. 
              Chaque projet est une œuvre unique, conçue avec passion et réalisée avec excellence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <button className="bg-gradient-to-r from-[#C9A14A] to-[#D4B55A] text-black px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-[#C9A14A]/30 transition-all duration-300 transform hover:scale-105">
                Devis gratuit en 24h
              </button>
              
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300">
                Visiter notre showroom
              </button>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center text-gray-300">
                <HiPhone className="w-5 h-5 text-[#C9A14A] mr-3" />
                <span>+216 70 123 456</span>
              </div>
              <div className="flex items-center text-gray-300">
                <HiMail className="w-5 h-5 text-[#C9A14A] mr-3" />
                <span>contact@ebenor-creation.tn</span>
              </div>
              <div className="flex items-center text-gray-300">
                <HiLocationMarker className="w-5 h-5 text-[#C9A14A] mr-3" />
                <span>Zone Industrielle, Tunis, Tunisie</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Stats/Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="grid grid-cols-2 gap-8"
          >
            {[
              { number: '25+', label: 'Années d\'expérience', icon: '🏆' },
              { number: '500+', label: 'Projets réalisés', icon: '🏠' },
              { number: '100%', label: 'Satisfaction client', icon: '⭐' },
              { number: '24h', label: 'Délai de réponse', icon: '⚡' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-[#C9A14A] mb-2">{stat.number}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 0.1, scale: 1 } : {}}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute top-20 right-20 w-40 h-40 border border-[#C9A14A] rounded-full"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 0.1, scale: 1 } : {}}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-20 left-20 w-32 h-32 border border-white rounded-full"
      />
    </section>
  );
}