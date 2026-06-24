'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';
import Link from 'next/link';

interface CTAContent {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
  phone: string;
  email: string;
  address: string;
  backgroundImage: string;
  stats: Array<{
    icon: string;
    number: string;
    label: string;
  }>;
}

const defaultContent: CTAContent = {
  badge: 'Votre Projet Nous Attend',
  title: 'Créons ensemble',
  titleHighlight: 'l\'exception',
  description: 'Transformez vos espaces avec l\'expertise ÉBÉNOR CRÉATION. Chaque projet est une œuvre unique, conçue avec passion et réalisée avec excellence.',
  button1Text: 'Devis gratuit en 24h',
  button1Link: '/contact',
  button2Text: 'Visiter notre showroom',
  button2Link: '/showroom',
  phone: '+216 70 123 456',
  email: 'contact@ebenor-creation.tn',
  address: 'Zone Industrielle Mghira 2, 2082 Fouchana, Tunis, Tunisie',
  backgroundImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=90',
  stats: [
    { icon: '🏆', number: '25+', label: 'Années d\'expérience' },
    { icon: '🏠', number: '500+', label: 'Projets réalisés' },
    { icon: '⭐', number: '100%', label: 'Satisfaction client' },
    { icon: '⚡', number: '24h', label: 'Délai de réponse' },
  ],
};

export function CallToAction() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [content, setContent] = useState<CTAContent>(defaultContent);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load content from DATABASE first, then localStorage as fallback
    const loadContent = async () => {
      try {
        console.log('📞 CallToAction: Fetching from database...');
        const response = await fetch('/api/home', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.cta) {
            console.log('✅ CallToAction: Loaded from database');
            setContent({
              ...defaultContent,
              ...data.data.cta,
              stats: data.data.cta.stats || defaultContent.stats
            });
            return; // Exit early - we got data from database
          }
        }
        
        // Fallback to localStorage only if database fetch failed
        console.log('⚠️ CallToAction: Database fetch failed, trying localStorage');
        const saved = localStorage.getItem('homepage_content');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.cta) {
            console.log('📦 CallToAction: Loaded from localStorage fallback');
            setContent({
              ...defaultContent,
              ...parsed.cta,
              stats: parsed.cta.stats || defaultContent.stats
            });
          }
        }
      } catch (error) {
        console.error('❌ Error loading CTA content:', error);
        // Try localStorage as ultimate fallback
        try {
          const saved = localStorage.getItem('homepage_content');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.cta) {
              console.log('📦 CallToAction: Loaded from localStorage (error fallback)');
              setContent({
                ...defaultContent,
                ...parsed.cta,
                stats: parsed.cta.stats || defaultContent.stats
              });
            }
          }
        } catch (e) {
          console.error('❌ localStorage fallback also failed:', e);
        }
      }
    };

    loadContent();

    // Listen for updates
    const handleUpdate = () => {
      console.log('🔄 CallToAction: Received update event, reloading...');
      loadContent();
    };

    window.addEventListener('homepage_content_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('homepage_updates');
      channel.addEventListener('message', (event) => {
        if (event.data.type === 'update' && event.data.data.cta) {
          console.log('📡 CallToAction: Received BroadcastChannel update');
          setContent({
            ...defaultContent,
            ...event.data.data.cta,
            stats: event.data.data.cta.stats || defaultContent.stats
          });
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

  return (
    <section className="relative py-32 lg:py-40 overflow-hidden" ref={ref} suppressHydrationWarning>
      {/* Background Image - Full Coverage */}
      <div className="absolute inset-0" key={content.backgroundImage}>
        <div
          className="w-full h-full bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('${content.backgroundImage}')`
          }}
        />
        {/* Dark overlay */}
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
              {content.badge}
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-6xl lg:text-7xl font-serif mb-6 leading-tight"
            >
              {content.title}
              <br />
              <span className="text-[#C9A14A]">{content.titleHighlight}</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-200 mb-10 leading-relaxed max-w-xl"
            >
              {content.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <Link href={content.button1Link}>
                <button className="bg-gradient-to-r from-[#C9A14A] to-[#D4B55A] text-black px-10 py-5 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-[#C9A14A]/40 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                  {content.button1Text}
                </button>
              </Link>
              
              <Link href={content.button2Link}>
                <button className="border-2 border-white text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm w-full sm:w-auto">
                  {content.button2Text}
                </button>
              </Link>
            </motion.div>

            {/* Contact Info */}
            {mounted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="space-y-4 bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10"
              >
                <a href={`tel:${content.phone}`} className="flex items-center text-gray-200 hover:text-white transition-colors">
                  <HiPhone className="w-6 h-6 text-[#C9A14A] mr-4" />
                  <span className="text-lg">{content.phone}</span>
                </a>
                <a href={`mailto:${content.email}`} className="flex items-center text-gray-200 hover:text-white transition-colors">
                  <HiMail className="w-6 h-6 text-[#C9A14A] mr-4" />
                  <span className="text-lg">{content.email}</span>
                </a>
                <div className="flex items-center text-gray-200 hover:text-white transition-colors">
                  <HiLocationMarker className="w-6 h-6 text-[#C9A14A] mr-4 flex-shrink-0" />
                  <span className="text-lg">{content.address}</span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Stats/Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="grid grid-cols-2 gap-6"
          >
            {(content.stats || defaultContent.stats).map((stat, index) => (
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
