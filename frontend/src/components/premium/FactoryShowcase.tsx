'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { HiSparkles, HiLightningBolt, HiCheckCircle, HiStar } from 'react-icons/hi';

interface FactoryContent {
  title: string;
  titleHighlight: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  video1Url: string;
  video1Title: string;
  video1Description: string;
  video2Url: string;
  video2Title: string;
  video2Description: string;
  stats: Array<{
    icon: string;
    value: string;
    label: string;
  }>;
}

const defaultContent: FactoryContent = {
  title: 'Notre Atelier',
  titleHighlight: 'de Fabrication',
  subtitle: 'Un Savoir-Faire Artisanal',
  description: 'Découvrez l\'excellence de notre savoir-faire artisanal combiné à des technologies de pointe pour créer des pièces uniques qui transforment vos espaces.',
  backgroundImage: '',
  video1Url: '/video/demoTravail1.mp4',
  video1Title: 'Précision Artisanale',
  video1Description: 'Nos artisans qualifiés travaillent chaque pièce avec une précision millimétrique et une passion inégalée pour créer des œuvres d\'exception.',
  video2Url: '/video/demoTravail2.mp4',
  video2Title: 'Technologies Modernes',
  video2Description: 'Équipements de dernière génération pour garantir une qualité exceptionnelle et une finition parfaite sur chaque projet.',
  stats: [
    { icon: '🏆', value: '25+', label: 'Années d\'Expérience' },
    { icon: '👨‍🔧', value: '50+', label: 'Artisans Qualifiés' },
    { icon: '🛋️', value: '1000+', label: 'Projets Réalisés' },
    { icon: '⭐', value: '100%', label: 'Satisfaction Client' },
  ],
};

// Optimize Cloudinary video URLs to reduce size and loading time
function optimizeCloudinaryVideo(url: string): string {
  if (!url) return url;
  
  // Check if it's a Cloudinary URL
  if (url.includes('cloudinary.com')) {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      // Apply transformations: low quality, auto format, limit size, reduce bitrate
      return `${parts[0]}/upload/q_auto:low,f_auto,w_1280,c_limit,br_500k/${parts[1]}`;
    }
  }
  
  return url;
}

export function FactoryShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [content, setContent] = useState<FactoryContent>(defaultContent);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load content from DATABASE first, then localStorage as fallback
    const loadContent = async () => {
      try {
        console.log('🏭 FactoryShowcase: Fetching from database...');
        const response = await fetch('/api/home', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.factory) {
            console.log('✅ FactoryShowcase: Loaded from database');
            setContent(data.data.factory);
            return; // Exit early - we got data from database
          }
        }
        
        // Fallback to localStorage only if database fetch failed
        console.log('⚠️ FactoryShowcase: Database fetch failed, trying localStorage');
        const saved = localStorage.getItem('homepage_content');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.factory) {
            console.log('📦 FactoryShowcase: Loaded from localStorage fallback');
            setContent(parsed.factory);
          }
        }
      } catch (error) {
        console.error('❌ Error loading factory content:', error);
        // Try localStorage as ultimate fallback
        try {
          const saved = localStorage.getItem('homepage_content');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.factory) {
              console.log('📦 FactoryShowcase: Loaded from localStorage (error fallback)');
              setContent(parsed.factory);
            }
          }
        } catch (e) {
          console.error('❌ localStorage fallback also failed:', e);
        }
      }
    };

    loadContent();

    // Listen for updates from admin panel
    const handleUpdate = () => {
      console.log('🔄 FactoryShowcase: Received update event, reloading...');
      loadContent();
    };

    window.addEventListener('homepage_content_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    // Listen to BroadcastChannel for cross-tab updates
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('homepage_updates');
      channel.addEventListener('message', (event) => {
        if (event.data.type === 'update' && event.data.data.factory) {
          console.log('📡 FactoryShowcase: Received BroadcastChannel update');
          setContent(event.data.data.factory);
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

  const iconMapping: { [key: string]: any } = {
    'HiStar': HiStar,
    'HiSparkles': HiSparkles,
    'HiLightningBolt': HiLightningBolt,
    'HiCheckCircle': HiCheckCircle,
  };

  const stats = content.stats.map((stat, index) => ({
    number: stat.value,
    label: stat.label,
    icon: iconMapping[`Hi${stat.icon.replace(/[^A-Za-z]/g, '')}`] || HiStar,
    color: ['from-amber-500 to-yellow-600', 'from-orange-500 to-amber-600', 'from-yellow-500 to-orange-600', 'from-amber-600 to-yellow-500'][index % 4]
  }));

  return (
    <section ref={ref} className="pt-16 sm:pt-20 lg:pt-24 xl:pt-32 pb-8 sm:pb-10 lg:pb-12 bg-gradient-to-b from-[#0D0D0D] via-[#1a1a1a] to-[#0D0D0D] relative overflow-hidden" suppressHydrationWarning>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A14A' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-12 lg:mb-16 xl:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
            className="inline-block mb-3 sm:mb-4"
          >
            <span className="px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-[#C9A14A]/20 to-transparent border border-[#C9A14A]/30 rounded-full text-[#C9A14A] font-semibold tracking-wider uppercase text-xs sm:text-sm">
              Notre Excellence
            </span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4 sm:mb-6 leading-tight px-4">
            {content.title} <span className="text-[#C9A14A]">{content.titleHighlight}</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            {content.description}
          </p>
        </motion.div>

        {/* Videos Grid - Bigger and Cleaner */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16 lg:mb-20">
          {/* Video 1 */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="group relative"
          >
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
              <video
                key={content.video1Url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              >
                <source src={optimizeCloudinaryVideo(content.video1Url)} type="video/mp4" />
              </video>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/70 transition-all duration-500" />
              
              {/* Content */}
              <div className="absolute inset-0 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-end">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#C9A14A]/20 backdrop-blur-sm rounded-full mb-3 sm:mb-4">
                    <HiSparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A14A]" />
                    <span className="text-[#C9A14A] font-semibold text-xs sm:text-sm">Artisanat d'Excellence</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-white mb-2 sm:mb-3 leading-tight">
                    {content.video1Title}
                  </h3>
                  <p className="text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed max-w-md">
                    {content.video1Description}
                  </p>
                </motion.div>
              </div>
              
              {/* Decorative Border */}
              <div className="absolute inset-0 border-4 border-transparent group-hover:border-[#C9A14A]/40 transition-all duration-500 rounded-3xl pointer-events-none" />
              
              {/* Shine Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
              </div>
            </div>
          </motion.div>

          {/* Video 2 */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="group relative"
          >
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
              <video
                key={content.video2Url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              >
                <source src={optimizeCloudinaryVideo(content.video2Url)} type="video/mp4" />
              </video>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/70 transition-all duration-500" />
              
              {/* Content */}
              <div className="absolute inset-0 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-end">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#C9A14A]/20 backdrop-blur-sm rounded-full mb-3 sm:mb-4">
                    <HiLightningBolt className="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A14A]" />
                    <span className="text-[#C9A14A] font-semibold text-xs sm:text-sm">Innovation Technologique</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-white mb-2 sm:mb-3 leading-tight">
                    {content.video2Title}
                  </h3>
                  <p className="text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed max-w-md">
                    {content.video2Description}
                  </p>
                </motion.div>
              </div>
              
              {/* Decorative Border */}
              <div className="absolute inset-0 border-4 border-transparent group-hover:border-[#C9A14A]/40 transition-all duration-500 rounded-3xl pointer-events-none" />
              
              {/* Shine Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats - Bigger and More Impactful */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5, type: "spring" }}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-white/10 hover:border-[#C9A14A]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#C9A14A]/20 hover:-translate-y-2">
                  {/* Icon */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  
                  {/* Number */}
                  <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent mb-2 sm:mb-3">
                    {stat.number}
                  </div>
                  
                  {/* Label */}
                  <div className="text-gray-400 uppercase tracking-wider text-xs sm:text-sm font-semibold leading-tight">
                    {stat.label}
                  </div>
                  
                  {/* Decorative Element */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-[#C9A14A]/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Decorative Blurs */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-[#C9A14A]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-[#C9A14A]/10 rounded-full blur-3xl" />
    </section>
  );
}
