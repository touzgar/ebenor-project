'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/lib/toast';
import {
  CheckCircleIcon,
  ArrowPathIcon,
  Squares2X2Icon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface ProjectsPageContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

const defaultContent: ProjectsPageContent = {
  hero: {
    title: 'Nos Projets',
    subtitle: 'Projets',
    description: 'Découvrez nos réalisations et laissez-vous inspirer par notre savoir-faire artisanal.',
  },
  cta: {
    title: 'Vous avez un projet en tête ?',
    description: 'Transformons ensemble votre vision en réalité. Notre équipe d\'artisans qualifiés est prête à créer la pièce unique qui sublimera votre espace.',
    buttonText: 'Demander un Devis Gratuit',
    buttonLink: '/contact',
  },
};

function ProjectsEditorPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [content, setContent] = useState<ProjectsPageContent>(defaultContent);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const saved = localStorage.getItem('projects_page_content');
    if (saved) {
      try {
        setContent(JSON.parse(saved));
      } catch (error) {
        // Error loading saved content
      }
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('projects_page_content', JSON.stringify(content));
      
      // Method 1: Dispatch custom event for same tab
      window.dispatchEvent(new Event('projects_page_updated'));
      
      // Method 2: BroadcastChannel for cross-tab communication
      try {
        const channel = new BroadcastChannel('projects_page_updates');
        channel.postMessage({ type: 'update', data: content });
        channel.close();
      } catch (e) {
        // BroadcastChannel not supported, fallback to storage event
      }
      
      // Method 3: Trigger storage event manually
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'projects_page_content',
        newValue: JSON.stringify(content),
        url: window.location.href,
        storageArea: localStorage
      }));
      
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('✅ Page Nos Projets mise à jour avec succès!');
    } catch (error) {
      toast.error('❌ Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tout le contenu?')) {
      setContent(defaultContent);
      localStorage.removeItem('projects_page_content');
      toast.success('Contenu réinitialisé');
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: Squares2X2Icon },
    { id: 'cta', label: 'Call-to-Action', icon: SparklesIcon },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-6">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
                <Squares2X2Icon className="h-8 w-8 text-amber-600" />
                Page Nos Projets - Gestion du Contenu
              </h1>
              <p className="mt-2 text-neutral-600">
                Modifiez le contenu de la page galerie (Hero et Call-to-Action)
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors flex items-center gap-2"
              >
                <ArrowPathIcon className="h-5 w-5" />
                Réinitialiser
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                    activeSection === tab.id
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          {activeSection === 'hero' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Squares2X2Icon className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">Section Hero</h2>
                  <p className="text-sm text-neutral-600">Le contenu principal en haut de la page galerie</p>
                </div>
              </div>

              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Titre principal
                  </label>
                  <input
                    type="text"
                    value={content.hero.title}
                    onChange={(e) => setContent({ 
                      ...content, 
                      hero: { ...content.hero, title: e.target.value } 
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-2xl font-bold"
                    placeholder="Ex: Nos Projets"
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    💡 Le mot après "Nos" sera coloré en doré
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Sous-titre
                  </label>
                  <input
                    type="text"
                    value={content.hero.subtitle}
                    onChange={(e) => setContent({ 
                      ...content, 
                      hero: { ...content.hero, subtitle: e.target.value } 
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Ex: Projets"
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    ℹ️ Ce texte peut être caché ou utilisé pour le SEO
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={content.hero.description}
                    onChange={(e) => setContent({ 
                      ...content, 
                      hero: { ...content.hero, description: e.target.value } 
                    })}
                    rows={3}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Ex: Découvrez nos réalisations et laissez-vous inspirer..."
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    📝 Description affichée sous le titre principal
                  </p>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-8 p-6 bg-gradient-to-br from-neutral-50 to-amber-50 rounded-xl border-2 border-amber-200">
                <h3 className="text-sm font-semibold text-amber-900 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Aperçu
                </h3>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg mb-4">
                    <Squares2X2Icon className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold text-neutral-900 mb-3">
                    {content.hero.title.split(' ').map((word, i) => 
                      i === content.hero.title.split(' ').length - 1 ? (
                        <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">
                          {word}
                        </span>
                      ) : (
                        <span key={i}>{word} </span>
                      )
                    )}
                  </h1>
                  <p className="text-lg text-neutral-600">{content.hero.description}</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'cta' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">Section Call-to-Action</h2>
                  <p className="text-sm text-neutral-600">L'appel à l'action en bas de la page galerie</p>
                </div>
              </div>

              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Titre du CTA
                  </label>
                  <input
                    type="text"
                    value={content.cta.title}
                    onChange={(e) => setContent({ 
                      ...content, 
                      cta: { ...content.cta, title: e.target.value } 
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-xl font-bold"
                    placeholder="Ex: Vous avez un projet en tête ?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description du CTA
                  </label>
                  <textarea
                    value={content.cta.description}
                    onChange={(e) => setContent({ 
                      ...content, 
                      cta: { ...content.cta, description: e.target.value } 
                    })}
                    rows={3}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Ex: Transformons ensemble votre vision en réalité..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Texte du bouton
                    </label>
                    <input
                      type="text"
                      value={content.cta.buttonText}
                      onChange={(e) => setContent({ 
                        ...content, 
                        cta: { ...content.cta, buttonText: e.target.value } 
                      })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Ex: Demander un Devis Gratuit"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Lien du bouton
                    </label>
                    <input
                      type="text"
                      value={content.cta.buttonLink}
                      onChange={(e) => setContent({ 
                        ...content, 
                        cta: { ...content.cta, buttonLink: e.target.value } 
                      })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Ex: /contact"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      💡 Peut être un chemin relatif (/contact) ou une URL complète
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-8 p-8 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl">
                <h3 className="text-sm font-semibold text-amber-400 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Aperçu
                </h3>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl mb-6">
                    <SparklesIcon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {content.cta.title}
                  </h2>
                  <p className="text-lg text-neutral-300 mb-6 max-w-2xl mx-auto">
                    {content.cta.description}
                  </p>
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 font-bold rounded-xl">
                    <span>{content.cta.buttonText}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-4 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-all shadow-2xl flex items-center gap-3 disabled:opacity-50 transform hover:scale-105"
          >
            <CheckCircleIcon className="h-6 w-6" />
            {isSaving ? 'Enregistrement...' : 'Enregistrer tout'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectsEditorPage;
