'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { HiArrowDown } from 'react-icons/hi';
import Image from 'next/image';

interface HeroContent {
  companyName: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  videoUrl: string;
  backgroundImage: string;
}

const defaultContent: HeroContent = {
  companyName: "ÉBENOR CRÉATION",
  title: "L'élégance du bois, l'empreinte de l'art",
  subtitle: "Découvrez l'excellence de l'ébénisterie tunisienne avec ÉBÉNOR CRÉATION. Nous transformons vos espaces en œuvres d'art avec passion et savoir-faire depuis plus de 25 ans.",
  ctaText: "Demander un devis",
  ctaLink: "/contact",
  videoUrl: "/video/hero.mp4",
  backgroundImage: "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1920",
};

// Optimize Cloudinary video URLs
function optimizeCloudinaryVideo(url: string): string {
  if (!url) return url;
  
  // Check if it's a Cloudinary URL
  if (url.includes('cloudinary.com')) {
    // Add quality and format optimizations
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      // Apply transformations: quality auto, format auto, width limit
      return `${parts[0]}/upload/q_auto:low,f_auto,w_1920,c_limit/${parts[1]}`;
    }
  }
  
  return url;
}

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<HeroContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
    layoutEffect: false
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    setMounted(true);
    
    const loadContent = () => {
      try {
        // First try localStorage (admin updates)
        const saved = localStorage.getItem('homepage_content');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.hero) {
            console.log('🎬 HeroVideo: Loading from localStorage:', parsed.hero.videoUrl);
            setContent(parsed.hero);
            setLoading(false);
            return;
          }
        }
        
        // Fallback to API
        const fetchFromAPI = async () => {
          try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
            const timestamp = new Date().getTime();
            const response = await fetch(`${API_BASE_URL}/home?t=${timestamp}`, {
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              if (data.data?.hero) {
                console.log('🎬 HeroVideo: Loading from API:', data.data.hero.videoUrl);
                setContent(data.data.hero);
              }
            }
          } catch (error) {
            console.error('Error fetching hero content:', error);
          } finally {
            setLoading(false);
          }
        };
        
        fetchFromAPI();
      } catch (error) {
        console.error('Error loading hero content:', error);
        setLoading(false);
      }
    };

    loadContent();

    // Listen for updates from admin panel
    const handleUpdate = () => {
      console.log('🔄 HeroVideo: Received update event, reloading...');
      loadContent();
    };

    window.addEventListener('homepage_content_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    // Listen to BroadcastChannel for cross-tab updates
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('homepage_updates');
      channel.addEventListener('message', (event) => {
        if (event.data.type === 'update' && event.data.data.hero) {
          console.log('📡 HeroVideo: Received BroadcastChannel update:', event.data.data.hero.videoUrl);
          setContent(event.data.data.hero);
        }
      });
    } catch (e) {
      // BroadcastChannel not supported
    }

    return () => {
      window.removeEventListener('homepage_content_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      if (channel) {
        channel.close();
      }
    };
  }, []);

  const scrollToNext = () => {
    const nextSection = document.getElementById('about');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading || !mounted) {
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={defaultContent.videoUrl} type="video/mp4" />
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
          key={content?.videoUrl || defaultContent.videoUrl}
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          onLoadedData={() => {
            // Video loaded successfully
          }}
        >
          <source src={optimizeCloudinaryVideo(content?.videoUrl || defaultContent.videoUrl)} type="video/mp4" />
          {/* Fallback image si la vidéo ne charge pas */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('${content?.backgroundImage || defaultContent.backgroundImage}')`
            }}
          />
        </video>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      {/* Content Container */}
      <motion.div
        style={{ y }}
        className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6"
      >
        {/* Logo in Circle - TOP */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.2,
            ease: "easeOut"
          }}
          className="mb-8 sm:mb-10"
        >
          {/* Logo Circle with WHITE background */}
          <div className="inline-flex items-center justify-center w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border-2 border-[#C9A14A] bg-white p-4 mx-auto mb-8 shadow-2xl">
            <Image
              src="/logo/logo.jpg"
              alt="ÉBÉNOR CRÉATION Logo"
              width={160}
              height={160}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* Company Name - White + Gold */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight px-2">
            <span className="text-white">ÉBÉNOR</span>{' '}
            <span className="text-[#C9A14A]">CRÉATION</span>
          </h2>
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.9,
            ease: "easeOut"
          }}
          className="mb-6 sm:mb-8 px-2"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif font-light leading-tight tracking-wide mb-3 sm:mb-4 text-white">
            {content?.title || "L'élégance du bois, l'empreinte de l'art"}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed px-4">
            {content?.subtitle || "Découvrez l'excellence de l'ébénisterie tunisienne avec ÉBÉNOR CRÉATION. Nous transformons vos espaces en œuvres d'art avec passion et savoir-faire depuis plus de 25 ans."}
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
          className="mb-6 sm:mb-8"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "#C9A14A",
              color: "#000000"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="group relative px-8 sm:px-10 md:px-12 py-2.5 sm:py-3 md:py-3.5 border-2 border-[#C9A14A] text-white font-semibold text-base sm:text-lg rounded-full overflow-hidden backdrop-blur-sm"
          >
            {/* Background Gradient on Hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#C9A14A] to-[#D4B55A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            
            {/* Button Text */}
            <span className="relative z-10 tracking-wide">
              {content?.ctaText || "Demander un devis"}
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
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
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
          <span className="text-xs sm:text-sm mb-2 font-light tracking-[0.2em] uppercase opacity-80 group-hover:opacity-100 transition-opacity">
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
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm"
            >
              <HiArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative Elements - Hide on mobile */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="hidden md:block absolute top-1/4 right-10 w-32 h-32 border border-[#C9A14A]/30 rounded-full"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ delay: 3, duration: 1.5 }}
        className="hidden md:block absolute bottom-1/4 left-10 w-24 h-24 border border-white/20 rounded-full"
      />

      {/* Particles Effect - Reduce on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { left: '15%', top: '20%', duration: 4.5, delay: 0 },
          { left: '35%', top: '60%', duration: 5.2, delay: 0.4 },
          { left: '55%', top: '30%', duration: 4.8, delay: 0.8 },
          { left: '70%', top: '75%', duration: 5.5, delay: 0.2 },
          { left: '85%', top: '45%', duration: 4.2, delay: 1.0 },
          { left: '25%', top: '85%', duration: 5.0, delay: 0.6 },
        ].slice(0, window.innerWidth < 768 ? 3 : 6).map((p, i) => (
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
