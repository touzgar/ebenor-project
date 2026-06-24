'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface WoodCatalogContent {
  title: string;
  titleHighlight: string;
  description: string;
  videoUrl: string;
  badgeText: string;
  woodSamples: Array<{
    name: string;
    color: string;
    description: string;
  }>;
}

const defaultContent: WoodCatalogContent = {
  title: 'Notre Palette',
  titleHighlight: 'de Bois',
  description: 'Explorez notre collection exclusive de bois nobles et essences rares',
  videoUrl: '/video/catalogBois.mp4',
  badgeText: 'Plus de 50 Essences Disponibles',
  woodSamples: [
    { name: 'Chêne', color: '#8B7355', description: 'Noble et robuste' },
    { name: 'Noyer', color: '#5C4033', description: 'Élégant et chaleureux' },
    { name: 'Érable', color: '#D4A574', description: 'Clair et raffiné' },
    { name: 'Acajou', color: '#6F4E37', description: 'Luxueux et durable' },
  ],
};

// Optimize Cloudinary video URLs
function optimizeCloudinaryVideo(url: string): string {
  if (!url) return url;
  
  if (url.includes('cloudinary.com')) {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/q_auto:low,f_auto,w_1280,c_limit,br_500k/${parts[1]}`;
    }
  }
  
  return url;
}

export function WoodCatalog() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [content, setContent] = useState<WoodCatalogContent>(defaultContent);

  useEffect(() => {
    // Load content from DATABASE first, then localStorage as fallback
    const loadContent = async () => {
      try {
        console.log('🌳 WoodCatalog: Fetching from database...');
        const response = await fetch('/api/home', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.woodCatalog) {
            console.log('✅ WoodCatalog: Loaded from database');
            setContent({
              ...defaultContent,
              ...data.data.woodCatalog,
              woodSamples: data.data.woodCatalog.woodSamples || defaultContent.woodSamples
            });
            return; // Exit early - we got data from database
          }
        }
        
        // Fallback to localStorage only if database fetch failed
        console.log('⚠️ WoodCatalog: Database fetch failed, trying localStorage');
        const saved = localStorage.getItem('homepage_content');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.woodCatalog) {
            console.log('📦 WoodCatalog: Loaded from localStorage fallback');
            setContent({
              ...defaultContent,
              ...parsed.woodCatalog,
              woodSamples: parsed.woodCatalog.woodSamples || defaultContent.woodSamples
            });
          }
        }
      } catch (error) {
        console.error('❌ Error loading wood catalog content:', error);
        // Try localStorage as ultimate fallback
        try {
          const saved = localStorage.getItem('homepage_content');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.woodCatalog) {
              console.log('📦 WoodCatalog: Loaded from localStorage (error fallback)');
              setContent({
                ...defaultContent,
                ...parsed.woodCatalog,
                woodSamples: parsed.woodCatalog.woodSamples || defaultContent.woodSamples
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
      console.log('🔄 WoodCatalog: Received update event, reloading...');
      loadContent();
    };

    window.addEventListener('homepage_content_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('homepage_updates');
      channel.addEventListener('message', (event) => {
        if (event.data.type === 'update' && event.data.data.woodCatalog) {
          console.log('📡 WoodCatalog: Received BroadcastChannel update');
          setContent({
            ...defaultContent,
            ...event.data.data.woodCatalog,
            woodSamples: event.data.data.woodCatalog.woodSamples || defaultContent.woodSamples
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
    <section ref={ref} className="py-0 bg-[#F5F5F5] relative overflow-hidden" suppressHydrationWarning>
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
            {content.title} <span className="text-[#C9A14A]">{content.titleHighlight}</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {content.description}
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
                key={content.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={optimizeCloudinaryVideo(content.videoUrl)} type="video/mp4" />
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
                {content.badgeText}
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
          {(content.woodSamples || defaultContent.woodSamples).map((wood, index) => (
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
      </div>
    </section>
  );
}
