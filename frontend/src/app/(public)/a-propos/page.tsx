'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  CheckCircleIcon, 
  SparklesIcon, 
  TrophyIcon,
  UsersIcon,
  HeartIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Header } from '@/components/premium/Header';

interface AboutPageContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    backgroundImage: string;
  };
  stats: Array<{
    label: string;
    value: string;
    icon: string;
  }>;
  history: {
    title: string;
    subtitle: string;
    paragraphs: string[];
    image: string;
  };
  timeline: Array<{
    year: string;
    title: string;
    description: string;
  }>;
  values: {
    title: string;
    subtitle: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
  };
}

const defaultContent: AboutPageContent = {
  hero: {
    title: 'L\'Art du Bois',
    subtitle: 'Depuis 1998',
    description: 'Plus de 25 ans d\'excellence dans la création de mobilier sur mesure en Tunisie',
    backgroundImage: '/logo/logo.jpg',
  },
  stats: [
    { label: 'Années d\'expérience', value: '25+', icon: 'trophy' },
    { label: 'Projets réalisés', value: '500+', icon: 'check' },
    { label: 'Clients satisfaits', value: '98%', icon: 'heart' },
    { label: 'Artisans qualifiés', value: '15', icon: 'users' },
  ],
  history: {
    title: 'Notre Histoire',
    subtitle: 'Une passion familiale transmise de génération en génération',
    paragraphs: [
      'Fondée en 1998, ÉBENOR CRÉATION est née de la passion d\'artisans tunisiens pour le travail du bois noble. Notre atelier familial s\'est rapidement imposé comme une référence dans la création de mobilier sur mesure haut de gamme.',
      'Aujourd\'hui, nous combinons savoir-faire traditionnel et technologies modernes pour créer des pièces uniques qui transforment vos espaces de vie en véritables œuvres d\'art.',
      'Chaque projet est une nouvelle opportunité de repousser les limites de la créativité, tout en respectant les traditions qui font notre renommée.',
    ],
    image: '/logo/logo.jpg',
  },
  timeline: [
    { year: '1998', title: 'Les débuts', description: 'Création de l\'atelier avec une vision: allier tradition et modernité.' },
    { year: '2005', title: 'Expansion', description: 'Agrandissement de l\'atelier et diversification des services.' },
    { year: '2015', title: 'Innovation', description: 'Intégration de technologies modernes tout en préservant le savoir-faire artisanal.' },
    { year: '2024', title: 'Excellence', description: 'Leader en Tunisie pour les créations sur mesure haut de gamme.' },
  ],
  values: {
    title: 'Nos Valeurs',
    subtitle: 'Les principes qui guident chacune de nos créations',
    items: [
      { icon: 'sparkles', title: 'Excellence', description: 'Nous visons l\'excellence dans chaque projet, du design à la réalisation finale.' },
      { icon: 'heart', title: 'Passion', description: 'Notre passion pour le bois et l\'artisanat se reflète dans chaque création.' },
      { icon: 'shield', title: 'Qualité', description: 'Nous utilisons uniquement des matériaux nobles et des techniques éprouvées.' },
      { icon: 'users', title: 'Service', description: 'Un accompagnement personnalisé du premier contact à la livraison finale.' },
    ],
  },
  cta: {
    title: 'Prêt à créer ensemble ?',
    description: 'Transformons vos rêves en réalité avec notre savoir-faire artisanal',
    primaryButton: 'Contactez-nous',
    secondaryButton: 'Voir nos créations',
  },
};

// Icon mapping
const iconMap: Record<string, any> = {
  trophy: TrophyIcon,
  check: CheckCircleIcon,
  heart: HeartIcon,
  users: UsersIcon,
  sparkles: SparklesIcon,
  shield: ShieldCheckIcon,
};

export default function AboutPage() {
  const [content, setContent] = useState<AboutPageContent>(defaultContent);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // Load content from database first
    const loadFromDatabase = async () => {
      try {
        const response = await fetch('/api/about');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // Migrate old data structure to new structure if needed
            const data = result.data;
            
            // Fix stats: if has 'number' field, convert to 'value'
            if (data.stats && data.stats[0]?.number) {
              data.stats = data.stats.map((stat: any) => ({
                label: stat.label,
                value: stat.number,
                icon: stat.icon,
              }));
            }
            
            // Fix history: if has 'description' string, convert to 'paragraphs' array
            if (data.history && typeof data.history.description === 'string') {
              data.history.paragraphs = [data.history.description];
              delete data.history.description;
            }
            
            // Ensure history has paragraphs array
            if (data.history && !data.history.paragraphs) {
              data.history.paragraphs = [
                'Fondée en 1998, ÉBENOR CRÉATION est née de la passion d\'artisans tunisiens pour le travail du bois noble.'
              ];
            }
            
            setContent(data);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error('Error loading about content from database:', error);
      }
      
      // Fallback to localStorage if database fails
      const saved = localStorage.getItem('about_page_content');
      if (saved) {
        try {
          setContent(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading about page content:', error);
        }
      }
      
      setIsLoading(false);
    };
    
    loadFromDatabase();
  }, []);

  // Listen for storage changes (when admin saves in another tab/window)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'about_page_content' && e.newValue) {
        try {
          setContent(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error updating about page content:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Also listen for custom event (same tab updates)
  useEffect(() => {
    const handleCustomUpdate = () => {
      const saved = localStorage.getItem('about_page_content');
      if (saved) {
        try {
          setContent(JSON.parse(saved));
        } catch (error) {
          console.error('Error updating about page content:', error);
        }
      }
    };

    window.addEventListener('about_page_updated', handleCustomUpdate);
    return () => window.removeEventListener('about_page_updated', handleCustomUpdate);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Chargement...</p>
        </div>
      </div>
    ); // Prevent SSR mismatch and flash of default content
  }

  // Map stats with icons
  const stats = content.stats.map(stat => ({
    ...stat,
    icon: iconMap[stat.icon] || TrophyIcon,
  }));

  // Map values with icons
  const values = content.values.items.map(value => ({
    ...value,
    icon: iconMap[value.icon] || SparklesIcon,
  }));

  return (
    <>
      <Header />
      <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-neutral-900/90 z-10" />
        {content.hero.backgroundImage.startsWith('data:') ? (
          <img
            src={content.hero.backgroundImage}
            alt="ÉBENOR CRÉATION"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        ) : (
          <Image
            src={content.hero.backgroundImage}
            alt="ÉBENOR CRÉATION"
            fill
            className="object-cover opacity-30"
            priority
          />
        )}
        <div className="relative z-20 h-full flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
              {content.hero.title}
              <span className="block text-amber-400 mt-2">{content.hero.subtitle}</span>
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-200 max-w-3xl mx-auto">
              {content.hero.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative -mt-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-2xl shadow-lg text-center border border-amber-100 hover:shadow-xl transition-shadow"
                >
                  <Icon className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <div className="text-4xl font-bold text-neutral-900 mb-2">{stat.value}</div>
                  <div className="text-neutral-600 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
              {content.history.title}
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              {content.history.subtitle}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {content.history.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-lg text-neutral-700 leading-relaxed">
                  {index === 0 ? (
                    <>
                      {paragraph.split('ÉBENOR CRÉATION')[0]}
                      <span className="font-bold text-amber-600">ÉBENOR CRÉATION</span>
                      {paragraph.split('ÉBENOR CRÉATION')[1]}
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl"
            >
              {content.history.image.startsWith('data:') ? (
                <img
                  src={content.history.image}
                  alt="Atelier ÉBENOR CRÉATION"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={content.history.image}
                  alt="Atelier ÉBENOR CRÉATION"
                  fill
                  className="object-cover"
                />
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
              Notre Évolution
            </h2>
            <p className="text-xl text-neutral-600">
              Plus de deux décennies d'innovation et de croissance
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-amber-600 to-amber-400" />

            <div className="space-y-12">
              {content.timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-2xl shadow-lg border border-amber-100">
                      <div className="text-3xl font-bold text-amber-600 mb-3">{item.year}</div>
                      <h3 className="text-2xl font-bold text-neutral-900 mb-3">{item.title}</h3>
                      <p className="text-neutral-700 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  <div className="hidden lg:block w-6 h-6 rounded-full bg-amber-600 border-4 border-white shadow-lg z-10" />

                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">{content.values.title}</h2>
            <p className="text-xl text-neutral-300">
              {content.values.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 mb-6 group-hover:scale-110 transition-transform shadow-xl">
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                  <p className="text-neutral-300 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              {content.cta.title}
            </h2>
            <p className="text-xl mb-10 text-amber-50">
              {content.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-8 py-4 bg-white text-amber-600 rounded-full font-bold text-lg hover:bg-neutral-100 transition-colors shadow-xl hover:shadow-2xl"
              >
                {content.cta.primaryButton}
              </a>
              <a
                href="/produits"
                className="px-8 py-4 bg-neutral-900 text-white rounded-full font-bold text-lg hover:bg-neutral-800 transition-colors shadow-xl hover:shadow-2xl"
              >
                {content.cta.secondaryButton}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
}
