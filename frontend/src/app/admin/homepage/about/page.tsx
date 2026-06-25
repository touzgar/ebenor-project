'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  PhotoIcon, 
  CheckCircleIcon, 
  PlusIcon, 
  TrashIcon,
  SparklesIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { ModernLoader } from '@/components/admin/ModernLoader';

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

export default function AboutAdminPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [content, setContent] = useState<AboutPageContent>(defaultContent);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'stats' | 'history' | 'timeline' | 'values' | 'cta'>('hero');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load saved content from database
  useEffect(() => {
    const loadFromDatabase = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('/api/admin/about', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
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
            
            // Ensure history has image
            if (data.history && !data.history.image) {
              data.history.image = '/logo/logo.jpg';
            }
            
            // Ensure hero has backgroundImage
            if (data.hero && !data.hero.backgroundImage) {
              data.hero.backgroundImage = '/logo/logo.jpg';
            }
            
            // Ensure cta exists
            if (!data.cta) {
              data.cta = {
                title: 'Prêt à créer ensemble ?',
                description: 'Transformons vos rêves en réalité avec notre savoir-faire artisanal',
                primaryButton: 'Contactez-nous',
                secondaryButton: 'Voir nos créations',
              };
            }
            
            setContent(data);
          }
        }
      } catch (error) {
        console.error('Error loading about content:', error);
        // Fallback to localStorage
        const saved = localStorage.getItem('about_page_content');
        if (saved) {
          try {
            setContent(JSON.parse(saved));
          } catch (e) {}
        }
      }
    };
    
    loadFromDatabase();
  }, []);

  const handleImageUpload = (field: string, subfield?: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          if (subfield) {
            setContent(prev => ({
              ...prev,
              [field]: { ...(prev as any)[field], [subfield]: imageData }
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Also save to localStorage as backup
        localStorage.setItem('about_page_content', JSON.stringify(content));
        window.dispatchEvent(new Event('about_page_updated'));
        
        setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        console.error('Save error:', result.message);
        alert('Erreur: ' + (result.message || 'Erreur serveur'));
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  // Array manipulation functions
  const addStat = () => {
    setContent(prev => ({
      ...prev,
      stats: [...prev.stats, { label: 'Nouvelle statistique', value: '0', icon: 'trophy' }]
    }));
  };

  const removeStat = (index: number) => {
    setContent(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    }));
  };

  const addParagraph = () => {
    setContent(prev => ({
      ...prev,
      history: { ...prev.history, paragraphs: [...prev.history.paragraphs, 'Nouveau paragraphe'] }
    }));
  };

  const removeParagraph = (index: number) => {
    setContent(prev => ({
      ...prev,
      history: { ...prev.history, paragraphs: prev.history.paragraphs.filter((_, i) => i !== index) }
    }));
  };

  const addTimelineItem = () => {
    setContent(prev => ({
      ...prev,
      timeline: [...prev.timeline, { year: '2024', title: 'Nouveau', description: 'Description' }]
    }));
  };

  const removeTimelineItem = (index: number) => {
    setContent(prev => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index)
    }));
  };

  const addValue = () => {
    setContent(prev => ({
      ...prev,
      values: { ...prev.values, items: [...prev.values.items, { icon: 'sparkles', title: 'Nouvelle valeur', description: 'Description' }] }
    }));
  };

  const removeValue = (index: number) => {
    setContent(prev => ({
      ...prev,
      values: { ...prev.values, items: prev.values.items.filter((_, i) => i !== index) }
    }));
  };

  // Show loading with modern loader
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-amber-50/20 to-neutral-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          {/* Animated loader */}
          <div className="relative mb-8 w-20 h-20 mx-auto">
            {/* Outer rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient1)"
                  strokeWidth="3"
                  strokeDasharray="70 200"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Inner pulsing circle */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-lg" />
            </motion.div>
          </div>

          {/* Animated text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <p className="text-lg font-semibold text-neutral-800">
              Chargement en cours
            </p>
            
            {/* Animated dots */}
            <div className="flex items-center justify-center space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                  className="w-2 h-2 bg-amber-600 rounded-full"
                />
              ))}
            </div>
          </motion.div>

          {/* Progress bar effect */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-6 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full max-w-xs mx-auto"
          />
        </motion.div>
      </div>
    );
  }

  // Return null if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  const tabs = [
    { id: 'hero' as const, label: 'Hero' },
    { id: 'stats' as const, label: 'Statistiques' },
    { id: 'history' as const, label: 'Histoire' },
    { id: 'timeline' as const, label: 'Timeline' },
    { id: 'values' as const, label: 'Valeurs' },
    { id: 'cta' as const, label: 'Call-to-Action' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-white via-amber-50/30 to-white border-b border-neutral-200 sticky top-0 z-50 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/homepage"
                  className="flex items-center text-neutral-600 hover:text-amber-600 transition-colors group"
                >
                  <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Retour</span>
                </Link>
                <div className="w-px h-8 bg-neutral-300" />
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
                    <SparklesIcon className="w-8 h-8 text-amber-600" />
                    Page À Propos
                  </h1>
                  <p className="text-sm text-neutral-600 mt-1">
                    Gérez tout le contenu de votre page À Propos publique
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Link
                  href="/a-propos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg transition-all hover:shadow-md group"
                >
                  <EyeIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Aperçu
                </Link>
                
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-lg hover:from-amber-700 hover:to-amber-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {saving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Sauvegarde...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      Sauvegardé!
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Sauvegarder
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs with modern design */}
      <div className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-4 font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'text-amber-600'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                {tab.label}
                
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8"
          >

            {/* Hero Section */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900">
                    Section Hero
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Titre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={content.hero.title}
                      onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="L'Art du Bois"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Sous-titre
                    </label>
                    <input
                      type="text"
                      value={content.hero.subtitle}
                      onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="Depuis 1998"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={content.hero.description}
                    onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, description: e.target.value } }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="Plus de 25 ans d'excellence..."
                  />
                </div>

                <div className="border-t border-neutral-200 pt-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Image de fond
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleImageUpload('hero', 'backgroundImage')}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 rounded-lg hover:from-amber-200 hover:to-amber-100 transition-all border border-amber-300 group"
                    >
                      <PhotoIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Télécharger une image
                    </button>
                    {content.hero.backgroundImage && (
                      <span className="inline-flex items-center text-sm text-green-600 font-medium">
                        <CheckCircleIcon className="w-5 h-5 mr-1" />
                        Image chargée
                      </span>
                    )}
                  </div>
                  {content.hero.backgroundImage && (
                    <div className="mt-4 relative h-40 rounded-lg overflow-hidden border-2 border-neutral-200">
                      <img
                        src={content.hero.backgroundImage}
                        alt="Hero background"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stats Section */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900">
                    Statistiques
                  </h2>
                  <button
                    onClick={addStat}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-lg hover:from-amber-700 hover:to-amber-600 transition-all shadow-md group"
                  >
                    <PlusIcon className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                    Ajouter
                  </button>
                </div>

                <div className="grid gap-4">
                  {content.stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 border-2 border-neutral-200 rounded-xl hover:border-amber-300 transition-all bg-gradient-to-br from-white to-neutral-50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold text-neutral-900 text-lg">
                          Statistique {index + 1}
                        </span>
                        <button
                          onClick={() => removeStat(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all group"
                        >
                          <TrashIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Valeur</label>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = [...content.stats];
                              newStats[index].value = e.target.value;
                              setContent(prev => ({ ...prev, stats: newStats }));
                            }}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                            placeholder="25+"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Label</label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...content.stats];
                              newStats[index].label = e.target.value;
                              setContent(prev => ({ ...prev, stats: newStats }));
                            }}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                            placeholder="Années d'expérience"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Icône</label>
                          <select
                            value={stat.icon}
                            onChange={(e) => {
                              const newStats = [...content.stats];
                              newStats[index].icon = e.target.value;
                              setContent(prev => ({ ...prev, stats: newStats }));
                            }}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="trophy">🏆 Trophée</option>
                            <option value="check">✓ Check</option>
                            <option value="heart">❤️ Coeur</option>
                            <option value="users">👥 Utilisateurs</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* History Section */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Notre Histoire
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Titre</label>
                    <input
                      type="text"
                      value={content.history.title}
                      onChange={(e) => setContent(prev => ({ ...prev, history: { ...prev.history, title: e.target.value } }))}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="Notre Histoire"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Sous-titre</label>
                    <input
                      type="text"
                      value={content.history.subtitle}
                      onChange={(e) => setContent(prev => ({ ...prev, history: { ...prev.history, subtitle: e.target.value } }))}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="Une passion familiale..."
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-neutral-700">Paragraphes</label>
                    <button
                      onClick={addParagraph}
                      className="inline-flex items-center px-3 py-1 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all text-sm group"
                    >
                      <PlusIcon className="w-4 h-4 mr-1 group-hover:rotate-90 transition-transform" />
                      Ajouter
                    </button>
                  </div>
                  <div className="space-y-4">
                    {content.history.paragraphs && content.history.paragraphs.length > 0 ? (
                      content.history.paragraphs.map((paragraph, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex gap-2"
                        >
                          <textarea
                            value={paragraph}
                            onChange={(e) => {
                              const newParagraphs = [...content.history.paragraphs];
                              newParagraphs[index] = e.target.value;
                              setContent(prev => ({ ...prev, history: { ...prev.history, paragraphs: newParagraphs } }));
                          }}
                          rows={3}
                          className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                          placeholder={`Paragraphe ${index + 1}`}
                        />
                        <button
                          onClick={() => removeParagraph(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 rounded-lg transition-all"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-neutral-500">
                      <p>Aucun paragraphe. Cliquez sur "Ajouter" pour en créer un.</p>
                    </div>
                  )}
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-3">Image</label>
                  <button
                    onClick={() => handleImageUpload('history', 'image')}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 rounded-lg hover:from-amber-200 hover:to-amber-100 transition-all border border-amber-300 group"
                  >
                    <PhotoIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Télécharger une image
                  </button>
                  {content.history.image && (
                    <div className="mt-4 relative h-40 rounded-lg overflow-hidden border-2 border-neutral-200">
                      <img
                        src={content.history.image}
                        alt="History"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timeline Section */}
            {activeTab === 'timeline' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900">
                    Timeline
                  </h2>
                  <button
                    onClick={addTimelineItem}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-lg hover:from-amber-700 hover:to-amber-600 transition-all shadow-md group"
                  >
                    <PlusIcon className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                    Ajouter
                  </button>
                </div>

                <div className="grid gap-4">
                  {content.timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 border-2 border-neutral-200 rounded-xl hover:border-amber-300 transition-all bg-gradient-to-br from-white to-neutral-50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold text-neutral-900 text-lg">
                          Événement {index + 1}
                        </span>
                        <button
                          onClick={() => removeTimelineItem(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all group"
                        >
                          <TrashIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Année</label>
                          <input
                            type="text"
                            value={item.year}
                            onChange={(e) => {
                              const newTimeline = [...content.timeline];
                              newTimeline[index].year = e.target.value;
                              setContent(prev => ({ ...prev, timeline: newTimeline }));
                            }}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                            placeholder="1998"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Titre</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const newTimeline = [...content.timeline];
                              newTimeline[index].title = e.target.value;
                              setContent(prev => ({ ...prev, timeline: newTimeline }));
                            }}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                            placeholder="Les débuts"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => {
                            const newTimeline = [...content.timeline];
                            newTimeline[index].description = e.target.value;
                            setContent(prev => ({ ...prev, timeline: newTimeline }));
                          }}
                          rows={2}
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                          placeholder="Description de l'événement"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Values Section */}
            {activeTab === 'values' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Nos Valeurs
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Titre</label>
                    <input
                      type="text"
                      value={content.values.title}
                      onChange={(e) => setContent(prev => ({ ...prev, values: { ...prev.values, title: e.target.value } }))}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="Nos Valeurs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Sous-titre</label>
                    <input
                      type="text"
                      value={content.values.subtitle}
                      onChange={(e) => setContent(prev => ({ ...prev, values: { ...prev.values, subtitle: e.target.value } }))}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="Les principes qui guident..."
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 pt-4 border-t border-neutral-200">
                  <label className="block text-sm font-medium text-neutral-700">Valeurs</label>
                  <button
                    onClick={addValue}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-lg hover:from-amber-700 hover:to-amber-600 transition-all shadow-md group"
                  >
                    <PlusIcon className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                    Ajouter
                  </button>
                </div>

                <div className="grid gap-4">
                  {content.values.items.map((value, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 border-2 border-neutral-200 rounded-xl hover:border-amber-300 transition-all bg-gradient-to-br from-white to-neutral-50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold text-neutral-900 text-lg">
                          Valeur {index + 1}
                        </span>
                        <button
                          onClick={() => removeValue(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all group"
                        >
                          <TrashIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Titre</label>
                          <input
                            type="text"
                            value={value.title}
                            onChange={(e) => {
                              const newItems = [...content.values.items];
                              newItems[index].title = e.target.value;
                              setContent(prev => ({ ...prev, values: { ...prev.values, items: newItems } }));
                            }}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                            placeholder="Excellence"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Icône</label>
                          <select
                            value={value.icon}
                            onChange={(e) => {
                              const newItems = [...content.values.items];
                              newItems[index].icon = e.target.value;
                              setContent(prev => ({ ...prev, values: { ...prev.values, items: newItems } }));
                            }}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="sparkles">✨ Étincelles</option>
                            <option value="heart">❤️ Coeur</option>
                            <option value="shield">🛡️ Bouclier</option>
                            <option value="users">👥 Utilisateurs</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                        <textarea
                          value={value.description}
                          onChange={(e) => {
                            const newItems = [...content.values.items];
                            newItems[index].description = e.target.value;
                            setContent(prev => ({ ...prev, values: { ...prev.values, items: newItems } }));
                          }}
                          rows={2}
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                          placeholder="Description de la valeur"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section */}
            {activeTab === 'cta' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Call-to-Action Final
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Titre</label>
                  <input
                    type="text"
                    value={content.cta.title}
                    onChange={(e) => setContent(prev => ({ ...prev, cta: { ...prev.cta, title: e.target.value } }))}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="Prêt à créer ensemble ?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                  <textarea
                    value={content.cta.description}
                    onChange={(e) => setContent(prev => ({ ...prev, cta: { ...prev.cta, description: e.target.value } }))}
                    rows={2}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="Transformons vos rêves en réalité..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-200">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Bouton Principal
                    </label>
                    <input
                      type="text"
                      value={content.cta.primaryButton}
                      onChange={(e) => setContent(prev => ({ ...prev, cta: { ...prev.cta, primaryButton: e.target.value } }))}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="Contactez-nous"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Bouton Secondaire
                    </label>
                    <input
                      type="text"
                      value={content.cta.secondaryButton}
                      onChange={(e) => setContent(prev => ({ ...prev, cta: { ...prev.cta, secondaryButton: e.target.value } }))}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="Voir nos créations"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-8 p-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl text-white text-center">
                  <h3 className="text-3xl font-bold mb-4">{content.cta.title}</h3>
                  <p className="text-lg mb-6 text-amber-50">{content.cta.description}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <div className="px-6 py-3 bg-white text-amber-600 rounded-lg font-semibold">
                      {content.cta.primaryButton}
                    </div>
                    <div className="px-6 py-3 bg-neutral-900 text-white rounded-lg font-semibold">
                      {content.cta.secondaryButton}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
