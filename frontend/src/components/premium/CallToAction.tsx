'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';
import { useHomeContent } from '@/hooks/useHomeContent';

export function CallToAction() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { content } = useHomeContent();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default contact info for loading state
  const contactInfo = content?.contact || {
    phone: '+216 70 123 456',
    email: 'contact@ebenor-creation.tn',
    address: 'Zone Industrielle, Tunis, Tunisie'
  };

  return (
    <section className="relative py-32 lg:py-40 overflow-hidden" ref={ref}>
      {/* Background Image - Full Coverage */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=90')`
          }}
        />
        {/* Dark overlay replaced with a lighter simple overlay to keep text readable */}
        <div className="absolute inset-0 bg-black/60" />
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
              className="inline-block px-4 py-2 bg-[#C9A14A]/20 backdrop-blur-sm rounded-full border border-[#C9A14A]/30 text-[#C9A14A] font-semibold tracking-wider uppercase text-sm mb-6"
            >
              Votre Projet Nous Attend
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-6xl lg:text-7xl font-serif mb-6 leading-tight"
            >
              Créons ensemble
              <br />
              <span className="text-[#C9A14A]">l'exception</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-200 mb-10 leading-relaxed max-w-xl"
            >
              Transformez vos espaces avec l'expertise ÉBÉNOR CRÉATION. 
              Chaque projet est une œuvre unique, conçue avec passion et réalisée avec excellence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <button className="bg-gradient-to-r from-[#C9A14A] to-[#D4B55A] text-black px-10 py-5 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-[#C9A14A]/40 transition-all duration-300 transform hover:scale-105">
                Devis gratuit en 24h
              </button>
              
              <button className="border-2 border-white text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm">
                Visiter notre showroom
              </button>
            </motion.div>

            {/* Contact Info */}
            {mounted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="space-y-4 bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center text-gray-200 hover:text-white transition-colors">
                  <HiPhone className="w-6 h-6 text-[#C9A14A] mr-4" />
                  <span className="text-lg">{contactInfo.phone}</span>
                </div>
                <div className="flex items-center text-gray-200 hover:text-white transition-colors">
                  <HiMail className="w-6 h-6 text-[#C9A14A] mr-4" />
                  <span className="text-lg">{contactInfo.email}</span>
                </div>
                <div className="flex items-center text-gray-200 hover:text-white transition-colors">
                  <HiLocationMarker className="w-6 h-6 text-[#C9A14A] mr-4" />
                  <span className="text-lg">{contactInfo.address}</span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Stats/Features - Bigger */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              { number: '25+', label: 'Années d\'expérience', icon: '🏆' },
              { number: '500+', label: 'Projets réalisés', icon: '🏠' },
              { number: '100%', label: 'Satisfaction client', icon: '⭐' },
              { number: '24h', label: 'Délai de réponse', icon: '⚡' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6, type: "spring" }}
                className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/15 hover:border-[#C9A14A]/50 transition-all duration-300 hover:scale-105"
              >
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div className="text-5xl font-bold text-[#C9A14A] mb-3">{stat.number}</div>
                <div className="text-sm text-gray-200 uppercase tracking-wide font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 0.15, scale: 1 } : {}}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute top-20 right-20 w-64 h-64 border-2 border-[#C9A14A] rounded-full blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 0.15, scale: 1 } : {}}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-20 left-20 w-48 h-48 border-2 border-white rounded-full blur-sm"
      />
      
      {/* Additional blur effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#C9A14A]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#C9A14A]/5 rounded-full blur-3xl" />
    </section>
  );
}
