'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { HiArrowDown } from 'react-icons/hi';
import { useHomeContent } from '@/hooks';

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { content, loading } = useHomeContent();
  
  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
    layoutEffect: false
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const scrollToNext = () => {
    const nextSection = document.getElementById('about');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading || !content) {
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 tracking-tight">
            ÉBENOR<span className="text-[#C9A14A]"> CRÉATION</span>
          </h2>
          <div className="h-0.5 w-24 bg-amber-500 mx-auto mb-3" />
          <h1 className="text-2xl md:text-4xl font-serif font-light leading-tight mb-2">
            L'élégance du bois, l'empreinte de l'art
          </h1>
          <button className="px-12 py-3 border-2 border-[#C9A14A] text-white font-semibold text-lg rounded-full mt-2">
            Demander un devis
          </button>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Video Background with Cinematic Scale */}
      <motion.div
        style={{ scale }}
        className="absolute inset-0 w-full h-full"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onLoadedData={() => {
            // Video loaded successfully
          }}
        >
          <source src="/video/hero.mp4" type="video/mp4" />
          {/* Fallback image si la vidéo ne charge pas */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('${content.hero.backgroundImage}')`
            }}
          />
        </video>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      {/* Content Container */}
      <motion.div
        style={{ y }}
        className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
      >
        {/* Logo Premium et Nom de l'Usine */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.2,
            ease: "easeOut"
          }}
          className="mb-2"
        >
          {/* Nom de l'Usine */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 tracking-tight"
          >
            ÉBENOR<span className="text-[#C9A14A]"> CRÉATION</span>
          </motion.h2>
          
          {/* Ligne décorative */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"
          />
        </motion.div>

        {/* Texte Principal - Taille Réduite */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.9,
            ease: "easeOut"
          }}
          className="mb-2"
        >
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-light leading-tight tracking-wide mb-2">
            {content.hero.title}
          </h1>
          <p className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
            {content.hero.subtitle}
          </p>
        </motion.div>

        {/* Bouton CTA Premium */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 1.2,
            ease: "easeOut"
          }}
          className="mb-2"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "#C9A14A",
              color: "#000000"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="group relative px-12 py-2 border-2 border-[#C9A14A] text-white font-semibold text-lg rounded-full overflow-hidden backdrop-blur-sm"
          >
            {/* Background Gradient on Hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#C9A14A] to-[#D4B55A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            
            {/* Button Text */}
            <span className="relative z-10 tracking-wide">
              {content.hero.ctaText}
            </span>
            
            {/* Shine Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
              initial={false}
            />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator Animé */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
        onClick={scrollToNext}
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
          className="flex flex-col items-center text-white/80 hover:text-white transition-colors group"
        >
          <span className="text-sm mb-2 font-light tracking-[0.2em] uppercase opacity-80 group-hover:opacity-100 transition-opacity">
            Découvrir
          </span>
          
          {/* Animated Arrow with Glow */}
          <div className="relative">
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(201, 161, 74, 0)",
                  "0 0 20px 5px rgba(201, 161, 74, 0.3)",
                  "0 0 0 0 rgba(201, 161, 74, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm"
            >
              <HiArrowDown className="w-5 h-5" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="absolute top-1/4 right-10 w-32 h-32 border border-[#C9A14A]/30 rounded-full"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ delay: 3, duration: 1.5 }}
        className="absolute bottom-1/4 left-10 w-24 h-24 border border-white/20 rounded-full"
      />

      {/* Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { left: '15%', top: '20%', duration: 4.5, delay: 0 },
          { left: '35%', top: '60%', duration: 5.2, delay: 0.4 },
          { left: '55%', top: '30%', duration: 4.8, delay: 0.8 },
          { left: '70%', top: '75%', duration: 5.5, delay: 0.2 },
          { left: '85%', top: '45%', duration: 4.2, delay: 1.0 },
          { left: '25%', top: '85%', duration: 5.0, delay: 0.6 },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#C9A14A] rounded-full"
            style={{ left: p.left, top: p.top }}
            animate={{ y: [0, -100, 0], opacity: [0, 1, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>
    </section>
  );
}
