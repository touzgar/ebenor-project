'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/Toast';
import {
  CheckCircleIcon,
  ArrowPathIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

/**
 * PAGE ADMIN ACCUEIL COMPLÈTE
 * 
 * Cette page permet de gérer TOUT LE CONTENU de la page d'accueil :
 * - Hero Video (titre, sous-titre, CTA)
 * - Factory Showcase (titre, description)
 * - Products (titre, sous-titre)
 * - Wood Catalog (titre, description)
 * - Gallery (titre, sous-titre)
 * - Process (étapes du processus)
 * - Call to Action (titre, description, CTA)
 * 
 * Les modifications sont sauvegardées dans localStorage et appliquées
 * en temps réel sur la page d'accueil.
 */

interface HomeContent {
  hero: {
    companyName: string;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    videoUrl: string;
    backgroundImage: string;
  };
  factory: {
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
  };
  products: {
    title: string;
    titleHighlight: string;
    subtitle: string;
  };
  woodCatalog: {
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
  };
  gallery: {
    title: string;
    titleHighlight: string;
    subtitle: string;
  };
  process: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    backgroundImage: string;
    steps: Array<{
      number: string;
      icon: string;
      title: string;
      description: string;
    }>;
  };
  cta: {
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
  };
}

const defaultContent: HomeContent = {
  hero: {
    companyName: "ÉBENOR CRÉATION",
    title: "L'élégance du bois, l'empreinte de l'art",
    subtitle: "Découvrez l'excellence de l'ébénisterie tunisienne avec ÉBÉNOR CRÉATION. Nous transformons vos espaces en œuvres d'art avec passion et savoir-faire depuis plus de 25 ans.",
    ctaText: "Demander un devis",
    ctaLink: "/contact",
    videoUrl: "/video/hero.mp4",
    backgroundImage: "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1920",
  },
  factory: {
    title: 'Notre Atelier',
    titleHighlight: 'de Fabrication',
    subtitle: 'Un Savoir-Faire Artisanal',
    description: 'Depuis notre atelier en Tunisie, nous créons des pièces uniques qui allient tradition et modernité. Chaque création est le fruit d\'un travail minutieux et passionné.',
    backgroundImage: 'https://images.unsplash.com/photo-1565183928294-7d22f75e6e37?w=1920',
    video1Url: '/video/demoTravail1.mp4',
    video1Title: 'Précision Artisanale',
    video1Description: 'Nos artisans qualifiés travaillent chaque pièce avec une précision millimétrique et une passion inégalée pour créer des œuvres d\'exception.',
    video2Url: '/video/demoTravail2.mp4',
    video2Title: 'Technologies Modernes',
    video2Description: 'Équipements de dernière génération pour garantir une qualité exceptionnelle et une finition parfaite sur chaque projet.',
    stats: [
      { icon: '🏆', value: '25+', label: 'Ans d\'expérience' },
      { icon: '👨‍🔧', value: '50+', label: 'Artisans qualifiés' },
      { icon: '🛋️', value: '1000+', label: 'Projets réalisés' },
      { icon: '⭐', value: '100%', label: 'Satisfaction client' },
    ],
  },
  products: {
    title: 'Nos',
    titleHighlight: 'Créations',
    subtitle: 'Découvrez notre sélection de meubles en bois massif, conçus et fabriqués avec passion dans notre atelier.',
  },
  woodCatalog: {
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
  },
  gallery: {
    title: 'Notre',
    titleHighlight: 'Galerie',
    subtitle: 'Explorez nos réalisations et laissez-vous inspirer par notre travail artisanal.',
  },
  process: {
    title: 'Notre',
    titleHighlight: 'Processus',
    subtitle: 'De la conception à la livraison, découvrez les étapes de création de votre mobilier sur mesure.',
    backgroundImage: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=1920',
    steps: [
      { number: '01', icon: '💬', title: 'Consultation', description: 'Échange sur vos besoins et vos envies pour définir votre projet.' },
      { number: '02', icon: '📐', title: 'Conception', description: 'Création de plans détaillés et choix des matériaux.' },
      { number: '03', icon: '🔨', title: 'Fabrication', description: 'Réalisation artisanale dans notre atelier par nos ébénistes.' },
      { number: '04', icon: '🚚', title: 'Installation', description: 'Livraison et installation professionnelle chez vous.' },
    ],
  },
  cta: {
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
  },
};

export default function AccueilAdminPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [content, setContent] = useState<HomeContent>(defaultContent);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [mounted, setMounted] = useState(false);
  
  // Separate upload states for each video section
  const [uploadStates, setUploadStates] = useState({
    hero: { isUploading: false, progress: 0 },
    factoryVideo1: { isUploading: false, progress: 0 },
    factoryVideo2: { isUploading: false, progress: 0 },
    woodCatalog: { isUploading: false, progress: 0 },
    ctaBackground: { isUploading: false, progress: 0 },
    footerBackground: { isUploading: false, progress: 0 },
  });
  
  // Footer content state
  const [footerContent, setFooterContent] = useState<any>({
    brand: {
      description: 'ÉBÉNOR CRÉATION - Votre partenaire de confiance pour la menuiserie et l\'ébénisterie d\'excellence en Tunisie. Depuis notre atelier, nous créons des pièces uniques alliant tradition artisanale et design contemporain.'
    },
    contact: {
      phone: '+216 70 123 456',
      email: 'contact@ebenor-creation.tn',
      address: 'Zone Industrielle Mghira 2, 2082 Fouchana, Tunis, Tunisie'
    },
    social: {
      facebook: 'https://www.facebook.com/ebenorcreation',
      instagram: 'https://www.instagram.com/ebenorcreation',
      linkedin: 'https://www.linkedin.com/company/ebenorcreation'
    },
    newsletter: {
      title: 'Restez informé',
      description: 'Recevez nos dernières réalisations et nouveautés en exclusivité.'
    },
    bottom: {
      copyright: 'ÉBÉNOR CRÉATION. Tous droits réservés.',
      additionalText: 'Artisanat tunisien d\'excellence'
    },
    backgroundImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=90'
  });

  // Helper function for image uploads
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = localStorage.getItem('auth_token');
    let csrfToken = sessionStorage.getItem('csrf_token');
    
    // Get CSRF token if not available
    if (!csrfToken) {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      try {
        const csrfResponse = await fetch(`${backendUrl}/csrf-token`, {
          method: 'GET',
          credentials: 'include',
        });
        if (csrfResponse.ok) {
          const csrfData = await csrfResponse.json();
          csrfToken = csrfData.data?.csrfToken;
          if (csrfToken) {
            sessionStorage.setItem('csrf_token', csrfToken);
          }
        }
      } catch (e) {
        console.warn('Could not fetch CSRF token:', e);
      }
    }
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
    const response = await fetch(`${backendUrl}/admin/upload/image`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Image upload failed:', response.status, errorText);
      throw new Error(`Upload failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data.url;
  };

  // Helper function for video uploads with progress
  const uploadVideo = async (file: File, section: keyof typeof uploadStates): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ebenor_videos'); // We'll create this
      formData.append('folder', 'ebenor/videos/homepage');
      
      const xhr = new XMLHttpRequest();
      
      // Track upload progress for specific section
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadStates(prev => ({
            ...prev,
            [section]: { isUploading: true, progress: percentComplete }
          }));
          console.log(`📊 Upload progress (${section}): ${percentComplete}%`);
        }
      });
      
      xhr.addEventListener('load', () => {
        setUploadStates(prev => ({
          ...prev,
          [section]: { isUploading: false, progress: 0 }
        }));
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            console.log('✅ Upload response:', data);
            // Cloudinary returns secure_url
            resolve(data.secure_url);
          } catch (e) {
            reject(new Error('Invalid response format'));
          }
        } else {
          console.error('❌ Upload failed:', xhr.status, xhr.responseText);
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        setUploadStates(prev => ({
          ...prev,
          [section]: { isUploading: false, progress: 0 }
        }));
        reject(new Error('Network error during upload'));
      });
      
      // Upload DIRECTLY to Cloudinary (no size limit!)
      const cloudName = 'dfaqnx5j3'; // Your Cloudinary cloud name
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
      
      xhr.send(formData);
    });
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('homepage_content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure woodCatalog has woodSamples array
        if (parsed.woodCatalog && !parsed.woodCatalog.woodSamples) {
          parsed.woodCatalog.woodSamples = defaultContent.woodCatalog.woodSamples;
        }
        // Ensure cta has stats array
        if (parsed.cta && !parsed.cta.stats) {
          parsed.cta.stats = defaultContent.cta.stats;
        }
        // Merge with defaults to ensure all fields exist
        setContent({
          ...defaultContent,
          ...parsed,
          cta: {
            ...defaultContent.cta,
            ...parsed.cta,
            stats: parsed.cta?.stats || defaultContent.cta.stats
          },
          woodCatalog: {
            ...defaultContent.woodCatalog,
            ...parsed.woodCatalog,
            woodSamples: parsed.woodCatalog?.woodSamples || defaultContent.woodCatalog.woodSamples
          }
        });
      } catch (error) {
        console.error('Error parsing saved content:', error);
        // Use default content on error
      }
    }
    
    // Load footer content
    const savedFooter = localStorage.getItem('footer_content');
    if (savedFooter) {
      try {
        setFooterContent(JSON.parse(savedFooter));
      } catch (error) {
        console.error('Error parsing footer content:', error);
      }
    }
  }, []);

  // AUTO-SAVE footer content whenever it changes
  useEffect(() => {
    if (!mounted) return; // Don't save during initial mount
    
    const timeoutId = setTimeout(() => {
      console.log('💾 Auto-saving footer content...');
      localStorage.setItem('footer_content', JSON.stringify(footerContent));
      
      // Trigger update events
      window.dispatchEvent(new Event('footer_content_updated'));
      
      // Trigger storage event
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'footer_content',
        newValue: JSON.stringify(footerContent),
        url: window.location.href,
        storageArea: localStorage
      }));
      
      // BroadcastChannel
      try {
        const channel = new BroadcastChannel('footer_updates');
        channel.postMessage({ type: 'update', data: footerContent });
        channel.close();
      } catch (e) {}
      
      console.log('✅ Footer auto-saved');
    }, 500); // Debounce 500ms
    
    return () => clearTimeout(timeoutId);
  }, [footerContent, mounted]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage first for immediate updates
      localStorage.setItem('homepage_content', JSON.stringify(content));
      
      // ALSO SAVE FOOTER CONTENT
      localStorage.setItem('footer_content', JSON.stringify(footerContent));
      console.log('💾 Saving both homepage and footer content');
      
      // Get auth token
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Vous devez être connecté pour sauvegarder');
      }
      
      // Get or fetch CSRF token
      let csrfToken = sessionStorage.getItem('csrf_token');
      
      // If no CSRF token, fetch it from backend
      if (!csrfToken) {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
        const csrfResponse = await fetch(`${backendUrl}/csrf-token`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if (csrfResponse.ok) {
          const csrfData = await csrfResponse.json();
          csrfToken = csrfData.data?.csrfToken;
          if (csrfToken) {
            sessionStorage.setItem('csrf_token', csrfToken);
          }
        }
      }
      
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      
      // Save ALL sections to database
      console.log('💾 Saving all sections to database...');
      
      // 1. Save hero section
      const heroResponse = await fetch(`${backendUrl}/admin/home/hero`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
        },
        body: JSON.stringify(content.hero),
      });

      if (!heroResponse.ok) {
        const errorData = await heroResponse.json();
        throw new Error(errorData.message || 'Erreur lors de la sauvegarde du hero');
      }
      console.log('✅ Hero section saved to database');
      
      // 2. Save factory section
      try {
        const factoryResponse = await fetch(`${backendUrl}/admin/home/factory`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
          },
          body: JSON.stringify(content.factory),
        });
        if (factoryResponse.ok) {
          console.log('✅ Factory section saved to database');
        }
      } catch (e) {
        console.warn('⚠️ Factory endpoint not available yet');
      }
      
      // 3. Save wood catalog section
      try {
        const woodResponse = await fetch(`${backendUrl}/admin/home/wood-catalog`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
          },
          body: JSON.stringify(content.woodCatalog),
        });
        if (woodResponse.ok) {
          console.log('✅ Wood catalog section saved to database');
        }
      } catch (e) {
        console.warn('⚠️ Wood catalog endpoint not available yet');
      }
      
      // 4. Save CTA section
      try {
        const ctaResponse = await fetch(`${backendUrl}/admin/home/cta`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
          },
          body: JSON.stringify(content.cta),
        });
        if (ctaResponse.ok) {
          console.log('✅ CTA section saved to database');
        }
      } catch (e) {
        console.warn('⚠️ CTA endpoint not available yet');
      }
      
      // Trigger update events for real-time sync
      window.dispatchEvent(new Event('homepage_content_updated'));
      
      // ALSO TRIGGER FOOTER UPDATE EVENTS
      window.dispatchEvent(new Event('footer_content_updated'));
      
      try {
        const channel = new BroadcastChannel('homepage_updates');
        channel.postMessage({ type: 'update', data: content });
        channel.close();
      } catch (e) {
        // BroadcastChannel not supported
      }
      
      // ALSO BROADCAST FOOTER UPDATES
      try {
        const footerChannel = new BroadcastChannel('footer_updates');
        footerChannel.postMessage({ type: 'update', data: footerContent });
        footerChannel.close();
      } catch (e) {
        // BroadcastChannel not supported
      }
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'homepage_content',
        newValue: JSON.stringify(content),
        url: window.location.href,
        storageArea: localStorage
      }));
      
      // ALSO TRIGGER STORAGE EVENT FOR FOOTER
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'footer_content',
        newValue: JSON.stringify(footerContent),
        url: window.location.href,
        storageArea: localStorage
      }));
      
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('✅ Page d\'accueil mise à jour!');
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || '❌ Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFooterSave = () => {
    try {
      console.log('💾 Saving footer content:', footerContent);
      
      // Save to localStorage
      localStorage.setItem('footer_content', JSON.stringify(footerContent));
      
      // Trigger update events
      window.dispatchEvent(new Event('footer_content_updated'));
      
      // Trigger storage event
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'footer_content',
        newValue: JSON.stringify(footerContent),
        url: window.location.href,
        storageArea: localStorage
      }));
      
      try {
        const channel = new BroadcastChannel('footer_updates');
        channel.postMessage({ type: 'update', data: footerContent });
        channel.close();
      } catch (e) {
        // BroadcastChannel not supported
      }
      
      console.log('✅ Footer saved successfully');
      toast.success('✅ Footer mis à jour!');
    } catch (error: any) {
      console.error('Footer save error:', error);
      toast.error('❌ Erreur lors de la sauvegarde');
    }
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tout le contenu de la page d\'accueil?')) {
      setContent(defaultContent);
      localStorage.removeItem('homepage_content');
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
    { id: 'hero', label: '🎬 Hero Section', icon: '🎬' },
    { id: 'factory', label: '🏭 Atelier', icon: '🏭' },
    { id: 'woodCatalog', label: '🌳 Palette Bois', icon: '🌳' },
    { id: 'cta', label: '📞 Call to Action', icon: '📞' },
    { id: 'footer', label: '📄 Footer', icon: '📄' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-6">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
                <HomeIcon className="h-8 w-8 text-amber-600" />
                Gestion Complète Page d'Accueil
              </h1>
              <p className="mt-2 text-neutral-600">
                Modifiez toutes les sections de la page d'accueil en temps réel
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
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeSection === tab.id
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          {/* HERO VIDEO SECTION */}
          {activeSection === 'hero' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">🎬 Section Hero (Bannière Principale)</h2>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  value={content.hero.companyName}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, companyName: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="ÉBENOR CRÉATION"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Le nom de votre entreprise affiché en haut de la bannière
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Titre Principal
                </label>
                <input
                  type="text"
                  value={content.hero.title}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, title: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="L'élégance du bois, l'empreinte de l'art"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Le titre principal affiché sur la bannière
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description / Sous-titre
                </label>
                <textarea
                  value={content.hero.subtitle}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, subtitle: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Découvrez l'excellence de l'ébénisterie tunisienne avec ÉBÉNOR CRÉATION..."
                />
                <p className="text-xs text-neutral-500 mt-1">
                  La description affichée sous le titre
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Texte du Bouton
                  </label>
                  <input
                    type="text"
                    value={content.hero.ctaText}
                    onChange={(e) => setContent({
                      ...content,
                      hero: { ...content.hero, ctaText: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Demander un devis"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Lien du Bouton
                  </label>
                  <input
                    type="text"
                    value={content.hero.ctaLink}
                    onChange={(e) => setContent({
                      ...content,
                      hero: { ...content.hero, ctaLink: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="/contact"
                  />
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">📹 Média de Fond</h3>
                
                <div className="grid grid-cols-1 gap-6">
                  {/* Video Upload Section */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      📹 Vidéo de fond (fichier MP4)
                    </label>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="video/mp4,video/webm"
                        disabled={uploadStates.hero.isUploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              setUploadStates(prev => ({
                                ...prev,
                                hero: { isUploading: true, progress: 0 }
                              }));
                              toast.info('⏳ Upload en cours...');
                              console.log('📤 Uploading video:', file.name, `(${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
                              
                              const url = await uploadVideo(file, 'hero');
                              console.log('✅ Video uploaded successfully! URL:', url);
                              
                              // Update state with new URL
                              const newContent = {
                                ...content,
                                hero: { ...content.hero, videoUrl: url }
                              };
                              setContent(newContent);
                              console.log('📝 State updated with new URL:', url);
                              
                              // Also save to localStorage immediately
                              localStorage.setItem('homepage_content', JSON.stringify(newContent));
                              console.log('💾 Saved to localStorage');
                              
                              // Trigger immediate update event
                              window.dispatchEvent(new Event('homepage_content_updated'));
                              
                              // Clear the file input
                              e.target.value = '';
                              
                              toast.success('✅ Vidéo uploadée! URL: ' + url);
                            } catch (error: any) {
                              console.error('❌ Video upload error:', error);
                              toast.error(error.message || '❌ Erreur lors de l\'upload');
                            }
                          }
                        }}
                        className="block w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      {uploadStates.hero.isUploading && uploadStates.hero.progress > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-amber-600 h-2.5 rounded-full transition-all duration-300" 
                            style={{ width: `${uploadStates.hero.progress}%` }}
                          />
                          <p className="text-xs text-amber-600 font-medium mt-1">
                            Upload en cours: {uploadStates.hero.progress}%
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-600">OU entrez une URL:</span>
                      </div>
                      <input
                        type="text"
                        value={content.hero.videoUrl}
                        onChange={(e) => setContent({
                          ...content,
                          hero: { ...content.hero, videoUrl: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="/video/hero.mp4 ou URL complète"
                      />
                      <p className="text-xs text-neutral-500">
                        📁 Uploadez directement votre vidéo (jusqu'à 100MB) ou entrez une URL
                      </p>
                      {content.hero.videoUrl && (
                        <p className="text-xs text-green-600 font-medium">
                          ✅ URL de la vidéo: {content.hero.videoUrl}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FACTORY SHOWCASE SECTION */}
          {activeSection === 'factory' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">🏭 Section Atelier de Fabrication</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Titre (Partie 1)
                  </label>
                  <input
                    type="text"
                    value={content.factory.title}
                    onChange={(e) => setContent({
                      ...content,
                      factory: { ...content.factory, title: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Notre Atelier"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Titre Mis en Évidence
                  </label>
                  <input
                    type="text"
                    value={content.factory.titleHighlight}
                    onChange={(e) => setContent({
                      ...content,
                      factory: { ...content.factory, titleHighlight: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="de Fabrication"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Sous-titre
                </label>
                <input
                  type="text"
                  value={content.factory.subtitle}
                  onChange={(e) => setContent({
                    ...content,
                    factory: { ...content.factory, subtitle: e.target.value }
                    })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Un Savoir-Faire Artisanal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  value={content.factory.description}
                  onChange={(e) => setContent({
                    ...content,
                    factory: { ...content.factory, description: e.target.value }
                  })}
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Description de votre atelier..."
                />
              </div>

              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">📊 Statistiques (4 blocs)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.factory.stats.map((stat, index) => (
                    <div key={index} className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...content.factory.stats];
                            newStats[index].value = e.target.value;
                            setContent({
                              ...content,
                              factory: { ...content.factory, stats: newStats }
                            });
                          }}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-bold text-lg"
                          placeholder="25+"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...content.factory.stats];
                            newStats[index].label = e.target.value;
                            setContent({
                              ...content,
                              factory: { ...content.factory, stats: newStats }
                            });
                          }}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                          placeholder="Label"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* VIDEO 1 SECTION */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">📹 Vidéo 1 - Atelier</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Uploader une vidéo
                    </label>
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      disabled={uploadStates.factoryVideo1.isUploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            setUploadStates(prev => ({
                              ...prev,
                              factoryVideo1: { isUploading: true, progress: 0 }
                            }));
                            toast.info('⏳ Upload vidéo 1...');
                            
                            const url = await uploadVideo(file, 'factoryVideo1');
                            
                            const newContent = {
                              ...content,
                              factory: { ...content.factory, video1Url: url }
                            };
                            setContent(newContent);
                            localStorage.setItem('homepage_content', JSON.stringify(newContent));
                            e.target.value = '';
                            
                            toast.success('✅ Vidéo 1 uploadée!');
                          } catch (error: any) {
                            console.error('Video upload error:', error);
                            toast.error(error.message || '❌ Erreur');
                          }
                        }
                      }}
                      className="block w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700 cursor-pointer mb-3 disabled:opacity-50"
                    />
                    {uploadStates.factoryVideo1.isUploading && uploadStates.factoryVideo1.progress > 0 && (
                      <div className="mb-3">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: `${uploadStates.factoryVideo1.progress}%` }} />
                        </div>
                        <p className="text-xs text-amber-600 mt-1">{uploadStates.factoryVideo1.progress}%</p>
                      </div>
                    )}
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      OU entrez une URL
                    </label>
                    <input
                      type="text"
                      value={content.factory.video1Url}
                      onChange={(e) => setContent({
                        ...content,
                        factory: { ...content.factory, video1Url: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="/video/demoTravail1.mp4"
                    />
                    {content.factory.video1Url && (
                      <p className="text-xs text-green-600 font-medium mt-2">
                        ✅ URL: {content.factory.video1Url}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Titre de la vidéo 1
                    </label>
                    <input
                      type="text"
                      value={content.factory.video1Title}
                      onChange={(e) => setContent({
                        ...content,
                        factory: { ...content.factory, video1Title: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Précision Artisanale"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Description de la vidéo 1
                    </label>
                    <textarea
                      value={content.factory.video1Description}
                      onChange={(e) => setContent({
                        ...content,
                        factory: { ...content.factory, video1Description: e.target.value }
                      })}
                      rows={3}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Description de la vidéo..."
                    />
                  </div>
                </div>
              </div>

              {/* VIDEO 2 SECTION */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">📹 Vidéo 2 - Atelier</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Uploader une vidéo
                    </label>
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      disabled={uploadStates.factoryVideo2.isUploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            setUploadStates(prev => ({
                              ...prev,
                              factoryVideo2: { isUploading: true, progress: 0 }
                            }));
                            toast.info('⏳ Upload vidéo 2...');
                            
                            const url = await uploadVideo(file, 'factoryVideo2');
                            
                            const newContent = {
                              ...content,
                              factory: { ...content.factory, video2Url: url }
                            };
                            setContent(newContent);
                            localStorage.setItem('homepage_content', JSON.stringify(newContent));
                            e.target.value = '';
                            
                            toast.success('✅ Vidéo 2 uploadée!');
                          } catch (error: any) {
                            console.error('Video upload error:', error);
                            toast.error(error.message || '❌ Erreur');
                          }
                        }
                      }}
                      className="block w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700 cursor-pointer mb-3 disabled:opacity-50"
                    />
                    {uploadStates.factoryVideo2.isUploading && uploadStates.factoryVideo2.progress > 0 && (
                      <div className="mb-3">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: `${uploadStates.factoryVideo2.progress}%` }} />
                        </div>
                        <p className="text-xs text-amber-600 mt-1">{uploadStates.factoryVideo2.progress}%</p>
                      </div>
                    )}
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      OU entrez une URL
                    </label>
                    <input
                      type="text"
                      value={content.factory.video2Url}
                      onChange={(e) => setContent({
                        ...content,
                        factory: { ...content.factory, video2Url: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="/video/demoTravail2.mp4"
                    />
                    {content.factory.video2Url && (
                      <p className="text-xs text-green-600 font-medium mt-2">
                        ✅ URL: {content.factory.video2Url}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Titre de la vidéo 2
                    </label>
                    <input
                      type="text"
                      value={content.factory.video2Title}
                      onChange={(e) => setContent({
                        ...content,
                        factory: { ...content.factory, video2Title: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Technologies Modernes"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Description de la vidéo 2
                    </label>
                    <textarea
                      value={content.factory.video2Description}
                      onChange={(e) => setContent({
                        ...content,
                        factory: { ...content.factory, video2Description: e.target.value }
                      })}
                      rows={3}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Description de la vidéo..."
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* PRODUCTS SECTION */}
          {activeSection === 'products' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Section Produits</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Titre (Partie 1)
                  </label>
                  <input
                    type="text"
                    value={content.products.title}
                    onChange={(e) => setContent({
                      ...content,
                      products: { ...content.products, title: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Nos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Titre Mis en Évidence
                  </label>
                  <input
                    type="text"
                    value={content.products.titleHighlight}
                    onChange={(e) => setContent({
                      ...content,
                      products: { ...content.products, titleHighlight: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Créations"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Sous-titre
                </label>
                <textarea
                  value={content.products.subtitle}
                  onChange={(e) => setContent({
                    ...content,
                    products: { ...content.products, subtitle: e.target.value }
                  })}
                  rows={2}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* WOOD CATALOG SECTION */}
          {activeSection === 'woodCatalog' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">🌳 Section Palette de Bois</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Titre (Partie 1)
                  </label>
                  <input
                    type="text"
                    value={content.woodCatalog.title}
                    onChange={(e) => setContent({
                      ...content,
                      woodCatalog: { ...content.woodCatalog, title: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Notre Palette"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Titre Mis en Évidence
                  </label>
                  <input
                    type="text"
                    value={content.woodCatalog.titleHighlight}
                    onChange={(e) => setContent({
                      ...content,
                      woodCatalog: { ...content.woodCatalog, titleHighlight: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="de Bois"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  value={content.woodCatalog.description}
                  onChange={(e) => setContent({
                    ...content,
                    woodCatalog: { ...content.woodCatalog, description: e.target.value }
                  })}
                  rows={2}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Explorez notre collection exclusive..."
                />
              </div>

              {/* VIDEO SECTION */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">📹 Vidéo Catalogue</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Uploader une vidéo
                    </label>
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      disabled={uploadStates.woodCatalog.isUploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            setUploadStates(prev => ({
                              ...prev,
                              woodCatalog: { isUploading: true, progress: 0 }
                            }));
                            toast.info('⏳ Upload vidéo catalogue...');
                            
                            const url = await uploadVideo(file, 'woodCatalog');
                            
                            const newContent = {
                              ...content,
                              woodCatalog: { ...content.woodCatalog, videoUrl: url }
                            };
                            setContent(newContent);
                            localStorage.setItem('homepage_content', JSON.stringify(newContent));
                            e.target.value = '';
                            
                            toast.success('✅ Vidéo catalogue uploadée!');
                          } catch (error: any) {
                            console.error('Video upload error:', error);
                            toast.error(error.message || '❌ Erreur');
                          }
                        }
                      }}
                      className="block w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700 cursor-pointer disabled:opacity-50"
                    />
                    {uploadStates.woodCatalog.isUploading && uploadStates.woodCatalog.progress > 0 && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: `${uploadStates.woodCatalog.progress}%` }} />
                        </div>
                        <p className="text-xs text-amber-600 mt-1">{uploadStates.woodCatalog.progress}%</p>
                      </div>
                    )}
                    <label className="block text-sm font-medium text-neutral-700 mb-2 mt-3">
                      OU entrez une URL
                    </label>
                    <input
                      type="text"
                      value={content.woodCatalog.videoUrl}
                      onChange={(e) => setContent({
                        ...content,
                        woodCatalog: { ...content.woodCatalog, videoUrl: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="/video/catalogBois.mp4"
                    />
                    {content.woodCatalog.videoUrl && (
                      <p className="text-xs text-green-600 font-medium mt-2">
                        ✅ URL: {content.woodCatalog.videoUrl}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* BADGE TEXT */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">🏷️ Badge</h3>
                <input
                  type="text"
                  value={content.woodCatalog.badgeText}
                  onChange={(e) => setContent({
                    ...content,
                    woodCatalog: { ...content.woodCatalog, badgeText: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Plus de 50 Essences Disponibles"
                />
              </div>

              {/* WOOD SAMPLES */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">🪵 Échantillons de Bois (4 types)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.woodCatalog.woodSamples.map((wood, index) => (
                    <div key={index} className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={wood.name}
                          onChange={(e) => {
                            const newSamples = [...content.woodCatalog.woodSamples];
                            newSamples[index].name = e.target.value;
                            setContent({
                              ...content,
                              woodCatalog: { ...content.woodCatalog, woodSamples: newSamples }
                            });
                          }}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-bold"
                          placeholder="Nom du bois"
                        />
                        <div className="flex gap-3">
                          <input
                            type="color"
                            value={wood.color}
                            onChange={(e) => {
                              const newSamples = [...content.woodCatalog.woodSamples];
                              newSamples[index].color = e.target.value;
                              setContent({
                                ...content,
                                woodCatalog: { ...content.woodCatalog, woodSamples: newSamples }
                              });
                            }}
                            className="w-20 h-10 border border-neutral-300 rounded-lg cursor-pointer"
                          />
                          <div 
                            className="flex-1 h-10 rounded-lg border border-neutral-300"
                            style={{ backgroundColor: wood.color }}
                          />
                        </div>
                        <input
                          type="text"
                          value={wood.description}
                          onChange={(e) => {
                            const newSamples = [...content.woodCatalog.woodSamples];
                            newSamples[index].description = e.target.value;
                            setContent({
                              ...content,
                              woodCatalog: { ...content.woodCatalog, woodSamples: newSamples }
                            });
                          }}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                          placeholder="Description"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* GALLERY SECTION */}
          {activeSection === 'gallery' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Section Galerie</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Titre (Partie 1)
                  </label>
                  <input
                    type="text"
                    value={content.gallery.title}
                    onChange={(e) => setContent({
                      ...content,
                      gallery: { ...content.gallery, title: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Titre Mis en Évidence
                  </label>
                  <input
                    type="text"
                    value={content.gallery.titleHighlight}
                    onChange={(e) => setContent({
                      ...content,
                      gallery: { ...content.gallery, titleHighlight: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Sous-titre
                </label>
                <textarea
                  value={content.gallery.subtitle}
                  onChange={(e) => setContent({
                    ...content,
                    gallery: { ...content.gallery, subtitle: e.target.value }
                  })}
                  rows={2}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* PROCESS SECTION */}
          {activeSection === 'process' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">⚙️ Section Processus</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Titre (Partie 1)
                  </label>
                  <input
                    type="text"
                    value={content.process.title}
                    onChange={(e) => setContent({
                      ...content,
                      process: { ...content.process, title: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Notre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Titre Mis en Évidence
                  </label>
                  <input
                    type="text"
                    value={content.process.titleHighlight}
                    onChange={(e) => setContent({
                      ...content,
                      process: { ...content.process, titleHighlight: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Processus"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Sous-titre
                </label>
                <textarea
                  value={content.process.subtitle}
                  onChange={(e) => setContent({
                    ...content,
                    process: { ...content.process, subtitle: e.target.value }
                  })}
                  rows={2}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="De la conception à la livraison..."
                />
              </div>

              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">🔢 Étapes du Processus (4 étapes)</h3>
                <div className="space-y-4">
                  {content.process.steps.map((step, index) => (
                    <div key={index} className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <input
                          type="text"
                          value={step.number}
                          onChange={(e) => {
                            const newSteps = [...content.process.steps];
                            newSteps[index].number = e.target.value;
                            setContent({
                              ...content,
                              process: { ...content.process, steps: newSteps }
                            });
                          }}
                          className="px-3 py-2 border border-neutral-300 rounded-lg text-center font-bold"
                          placeholder="01"
                        />
                        <input
                          type="text"
                          value={step.icon}
                          onChange={(e) => {
                            const newSteps = [...content.process.steps];
                            newSteps[index].icon = e.target.value;
                            setContent({
                              ...content,
                              process: { ...content.process, steps: newSteps }
                            });
                          }}
                          className="px-3 py-2 border border-neutral-300 rounded-lg text-center text-2xl"
                          placeholder="💬"
                        />
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const newSteps = [...content.process.steps];
                            newSteps[index].title = e.target.value;
                            setContent({
                              ...content,
                              process: { ...content.process, steps: newSteps }
                            });
                          }}
                          className="col-span-2 px-3 py-2 border border-neutral-300 rounded-lg font-medium"
                          placeholder="Titre de l'étape"
                        />
                      </div>
                      <textarea
                        value={step.description}
                        onChange={(e) => {
                          const newSteps = [...content.process.steps];
                          newSteps[index].description = e.target.value;
                          setContent({
                            ...content,
                            process: { ...content.process, steps: newSteps }
                          });
                        }}
                        rows={2}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                        placeholder="Description de l'étape"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">🖼️ Image de Fond</h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const url = await uploadImage(file);
                        setContent({
                          ...content,
                          process: { ...content.process, backgroundImage: url }
                        });
                        toast.success('Image uploadée avec succès!');
                      } catch (error: any) {
                        toast.error(error.message || 'Erreur lors de l\'upload de l\'image');
                      }
                    }
                  }}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent block text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Téléchargez une image (JPG, PNG, WebP)
                </p>
                {content.process.backgroundImage && (
                  <div className="mt-4 relative">
                    <img 
                      src={content.process.backgroundImage} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect fill="%23ddd" width="400" height="200"/><text x="50%" y="50%" text-anchor="middle" fill="%23999">Image non disponible</text></svg>';
                      }}
                    />
                    <button
                      onClick={() => setContent({
                        ...content,
                        process: { ...content.process, backgroundImage: '' }
                      })}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                      title="Supprimer l'image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CTA SECTION */}
          {activeSection === 'cta' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">📞 Section Call to Action</h2>
              
              {/* Badge */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Badge (Petit texte du haut)
                </label>
                <input
                  type="text"
                  value={content.cta.badge}
                  onChange={(e) => setContent({
                    ...content,
                    cta: { ...content.cta, badge: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Votre Projet Nous Attend"
                />
              </div>

              {/* Title */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Titre Principal
                  </label>
                  <input
                    type="text"
                    value={content.cta.title}
                    onChange={(e) => setContent({
                      ...content,
                      cta: { ...content.cta, title: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Créons ensemble"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Titre Mis en Évidence
                  </label>
                  <input
                    type="text"
                    value={content.cta.titleHighlight}
                    onChange={(e) => setContent({
                      ...content,
                      cta: { ...content.cta, titleHighlight: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="l'exception"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  value={content.cta.description}
                  onChange={(e) => setContent({
                    ...content,
                    cta: { ...content.cta, description: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Transformez vos espaces..."
                />
              </div>

              {/* Buttons */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">🔘 Boutons d'Action</h3>
                
                <div className="space-y-4">
                  {/* Button 1 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Bouton 1 - Texte
                      </label>
                      <input
                        type="text"
                        value={content.cta.button1Text}
                        onChange={(e) => setContent({
                          ...content,
                          cta: { ...content.cta, button1Text: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Devis gratuit en 24h"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Bouton 1 - Lien
                      </label>
                      <input
                        type="text"
                        value={content.cta.button1Link}
                        onChange={(e) => setContent({
                          ...content,
                          cta: { ...content.cta, button1Link: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="/contact"
                      />
                    </div>
                  </div>

                  {/* Button 2 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Bouton 2 - Texte
                      </label>
                      <input
                        type="text"
                        value={content.cta.button2Text}
                        onChange={(e) => setContent({
                          ...content,
                          cta: { ...content.cta, button2Text: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Visiter notre showroom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Bouton 2 - Lien
                      </label>
                      <input
                        type="text"
                        value={content.cta.button2Link}
                        onChange={(e) => setContent({
                          ...content,
                          cta: { ...content.cta, button2Link: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="/showroom"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">📞 Informations de Contact</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      📱 Téléphone
                    </label>
                    <input
                      type="text"
                      value={content.cta.phone}
                      onChange={(e) => setContent({
                        ...content,
                        cta: { ...content.cta, phone: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="+216 70 123 456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      📧 Email
                    </label>
                    <input
                      type="email"
                      value={content.cta.email}
                      onChange={(e) => setContent({
                        ...content,
                        cta: { ...content.cta, email: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="contact@ebenor-creation.tn"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      📍 Adresse
                    </label>
                    <textarea
                      value={content.cta.address}
                      onChange={(e) => setContent({
                        ...content,
                        cta: { ...content.cta, address: e.target.value }
                      })}
                      rows={2}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Zone Industrielle, Tunis, Tunisie"
                    />
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">📊 Statistiques (4 blocs)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(content.cta.stats || defaultContent.cta.stats).map((stat, index) => (
                    <div key={index} className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={stat.number}
                          onChange={(e) => {
                            const newStats = [...content.cta.stats];
                            newStats[index].number = e.target.value;
                            setContent({
                              ...content,
                              cta: { ...content.cta, stats: newStats }
                            });
                          }}
                          className="px-3 py-2 border border-neutral-300 rounded-lg font-bold"
                          placeholder="25+"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...content.cta.stats];
                            newStats[index].label = e.target.value;
                            setContent({
                              ...content,
                              cta: { ...content.cta, stats: newStats }
                            });
                          }}
                          className="px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                          placeholder="Label"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Background Image */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">🖼️ Image de Fond</h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        toast.info('⏳ Upload de l\'image...');
                        const url = await uploadImage(file);
                        
                        // Update state with new URL
                        const newContent = {
                          ...content,
                          cta: { ...content.cta, backgroundImage: url }
                        };
                        setContent(newContent);
                        
                        // Save to localStorage immediately
                        localStorage.setItem('homepage_content', JSON.stringify(newContent));
                        console.log('💾 CTA background image saved to localStorage:', url);
                        
                        // Trigger update events
                        window.dispatchEvent(new Event('homepage_content_updated'));
                        
                        try {
                          const channel = new BroadcastChannel('homepage_updates');
                          channel.postMessage({ type: 'update', data: newContent });
                          channel.close();
                        } catch (e) {
                          // BroadcastChannel not supported
                        }
                        
                        // Clear file input
                        e.target.value = '';
                        
                        toast.success('✅ Image uploadée avec succès!');
                      } catch (error: any) {
                        console.error('❌ Image upload error:', error);
                        toast.error(error.message || 'Erreur lors de l\'upload de l\'image');
                      }
                    }
                  }}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent block text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Téléchargez une image (JPG, PNG, WebP)
                </p>
                {content.cta.backgroundImage && (
                  <div className="mt-4 relative">
                    <img 
                      src={content.cta.backgroundImage} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect fill="%23ddd" width="400" height="200"/><text x="50%" y="50%" text-anchor="middle" fill="%23999">Image non disponible</text></svg>';
                      }}
                    />
                    <p className="text-xs text-green-600 font-medium mt-2">
                      ✅ URL de l'image: {content.cta.backgroundImage}
                    </p>
                    <button
                      onClick={() => {
                        const newContent = {
                          ...content,
                          cta: { ...content.cta, backgroundImage: '' }
                        };
                        setContent(newContent);
                        localStorage.setItem('homepage_content', JSON.stringify(newContent));
                        window.dispatchEvent(new Event('homepage_content_updated'));
                      }}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                      title="Supprimer l'image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FOOTER SECTION */}
          {activeSection === 'footer' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">📄 Section Footer</h2>
              
              {/* Brand Description */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  📝 Description de la Marque
                </label>
                <textarea
                  value={footerContent.brand.description}
                  onChange={(e) => setFooterContent({
                    ...footerContent,
                    brand: { ...footerContent.brand, description: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="ÉBÉNOR CRÉATION - Votre partenaire de confiance..."
                />
              </div>

              {/* Contact Information */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">📞 Informations de Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      📱 Téléphone
                    </label>
                    <input
                      type="text"
                      value={footerContent.contact.phone}
                      onChange={(e) => setFooterContent({
                        ...footerContent,
                        contact: { ...footerContent.contact, phone: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="+216 70 123 456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      📧 Email
                    </label>
                    <input
                      type="email"
                      value={footerContent.contact.email}
                      onChange={(e) => setFooterContent({
                        ...footerContent,
                        contact: { ...footerContent.contact, email: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="contact@ebenor-creation.tn"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      📍 Adresse
                    </label>
                    <textarea
                      value={footerContent.contact.address}
                      onChange={(e) => setFooterContent({
                        ...footerContent,
                        contact: { ...footerContent.contact, address: e.target.value }
                      })}
                      rows={2}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Zone Industrielle Mghira 2, 2082 Fouchana, Tunis, Tunisie"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">🌐 Réseaux Sociaux</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={footerContent.social.facebook}
                      onChange={(e) => setFooterContent({
                        ...footerContent,
                        social: { ...footerContent.social, facebook: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="https://www.facebook.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={footerContent.social.instagram}
                      onChange={(e) => setFooterContent({
                        ...footerContent,
                        social: { ...footerContent.social, instagram: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="https://www.instagram.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={footerContent.social.linkedin}
                      onChange={(e) => setFooterContent({
                        ...footerContent,
                        social: { ...footerContent.social, linkedin: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="https://www.linkedin.com/company/..."
                    />
                  </div>
                </div>
              </div>

              {/* Newsletter */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">📧 Newsletter</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Titre
                    </label>
                    <input
                      type="text"
                      value={footerContent.newsletter.title}
                      onChange={(e) => setFooterContent({
                        ...footerContent,
                        newsletter: { ...footerContent.newsletter, title: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Restez informé"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={footerContent.newsletter.description}
                      onChange={(e) => setFooterContent({
                        ...footerContent,
                        newsletter: { ...footerContent.newsletter, description: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Recevez nos dernières réalisations..."
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">©️ Barre du Bas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Copyright
                    </label>
                    <input
                      type="text"
                      value={footerContent.bottom.copyright}
                      onChange={(e) => setFooterContent({
                        ...footerContent,
                        bottom: { ...footerContent.bottom, copyright: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="ÉBÉNOR CRÉATION. Tous droits réservés."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Texte Additionnel
                    </label>
                    <input
                      type="text"
                      value={footerContent.bottom.additionalText}
                      onChange={(e) => setFooterContent({
                        ...footerContent,
                        bottom: { ...footerContent.bottom, additionalText: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Artisanat tunisien d'excellence"
                    />
                  </div>
                </div>
              </div>

              {/* Background Image */}
              <div className="border-t border-neutral-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-neutral-800">🖼️ Image de Fond du Footer</h3>
                  <button
                    onClick={() => {
                      const defaultImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=90';
                      setFooterContent({ ...footerContent, backgroundImage: defaultImage });
                      // Save immediately
                      localStorage.setItem('footer_content', JSON.stringify({ ...footerContent, backgroundImage: defaultImage }));
                      window.dispatchEvent(new Event('footer_content_updated'));
                      try {
                        const channel = new BroadcastChannel('footer_updates');
                        channel.postMessage({ type: 'update', data: { ...footerContent, backgroundImage: defaultImage } });
                        channel.close();
                      } catch (e) {}
                      toast.success('✅ Image par défaut restaurée!');
                    }}
                    className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                  >
                    🔄 Restaurer l'image par défaut
                  </button>
                </div>
                
                {footerContent.backgroundImage && (
                  <div className="mb-4 relative group">
                    <img
                      src={footerContent.backgroundImage}
                      alt="Footer Background"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setFooterContent({ ...footerContent, backgroundImage: '' });
                        handleFooterSave();
                      }}
                      className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ❌ Supprimer
                    </button>
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          setUploadStates(prev => ({
                            ...prev,
                            footerBackground: { isUploading: true, progress: 0 }
                          }));
                          toast.success('📤 Upload de l\'image en cours...');
                          const url = await uploadImage(file);
                          setFooterContent({ ...footerContent, backgroundImage: url });
                          // Save immediately
                          localStorage.setItem('footer_content', JSON.stringify({ ...footerContent, backgroundImage: url }));
                          window.dispatchEvent(new Event('footer_content_updated'));
                          try {
                            const channel = new BroadcastChannel('footer_updates');
                            channel.postMessage({ type: 'update', data: { ...footerContent, backgroundImage: url } });
                            channel.close();
                          } catch (e) {}
                          toast.success('✅ Image de fond mise à jour!');
                        } catch (error) {
                          console.error('Upload error:', error);
                          toast.error('❌ Erreur lors de l\'upload');
                        } finally {
                          setUploadStates(prev => ({
                            ...prev,
                            footerBackground: { isUploading: false, progress: 0 }
                          }));
                        }
                      }
                    }}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                    disabled={uploadStates.footerBackground.isUploading}
                  />
                  {uploadStates.footerBackground.isUploading && (
                    <div className="flex items-center gap-2 text-amber-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                      <span className="text-sm">Upload en cours...</span>
                    </div>
                  )}
                  <p className="text-xs text-neutral-500">
                    {footerContent.backgroundImage ? `URL: ${footerContent.backgroundImage}` : 'Aucune image sélectionnée'}
                  </p>
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
            {isSaving ? 'Enregistrement...' : 'Enregistrer & Appliquer'}
          </button>
        </div>
      </div>
    </div>
  );
}
