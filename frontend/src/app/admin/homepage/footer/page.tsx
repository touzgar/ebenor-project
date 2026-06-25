/**
 * FOOTER GLOBAL ADMIN PAGE
 * 
 * Cette page permet de gérer le footer qui apparaît sur TOUTES les pages du site :
 * - Page d'accueil (Premium Footer avec fond image)
 * - Page Showroom / Nos Projets (Footer simple)
 * - Toutes les autres pages (À propos, Produits, Galerie, Contact, etc.)
 * 
 * 📍 URL Admin : /admin/homepage/footer
 * 
 * Les modifications sont sauvegardées dans localStorage et appliquées 
 * immédiatement sur toutes les pages sans rechargement nécessaire.
 * 
 * Composants concernés :
 * - frontend/src/components/premium/Footer.tsx (Page d'accueil)
 * - frontend/src/components/public/Footer.tsx (Autres pages)
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/lib/toast';
import {
  CheckCircleIcon,
  ArrowPathIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

interface FooterContent {
  brand: {
    description: string;
    tagline: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    whatsapp: string;
  };
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
  navigation: {
    company: Array<{ name: string; href: string }>;
    services: Array<{ name: string; href: string }>;
    support: Array<{ name: string; href: string }>;
    legal: Array<{ name: string; href: string }>;
  };
  businessHours: {
    enabled: boolean;
    title: string;
    schedule: Array<{ days: string; hours: string }>;
  };
  certifications: {
    enabled: boolean;
    title: string;
    items: Array<{ name: string; icon: string }>;
  };
  paymentMethods: {
    enabled: boolean;
    title: string;
    methods: string[];
  };
  newsletter: {
    title: string;
    description: string;
  };
  bottom: {
    copyright: string;
    additionalText: string;
  };
}

const defaultContent: FooterContent = {
  brand: {
    description: 'ÉBÉNOR CRÉATION - Votre partenaire de confiance pour la menuiserie et l\'ébénisterie d\'excellence en Tunisie. Depuis notre atelier, nous créons des pièces uniques alliant tradition artisanale et design contemporain.',
    tagline: 'Artisan menuisier-ébéniste en Tunisie. Fabrication sur mesure de cuisines, dressings, mobilier et aménagements intérieurs haut de gamme.',
  },
  contact: {
    phone: '+216 XX XXX XXX',
    email: 'contact@ebenor-creation.tn',
    address: 'Tunisie',
    whatsapp: '+216XXXXXXXX',
  },
  social: {
    facebook: 'https://www.facebook.com/ebenorcreation',
    instagram: 'https://www.instagram.com/ebenorcreation',
    linkedin: 'https://www.linkedin.com/company/ebenorcreation',
  },
  navigation: {
    company: [
      { name: 'Accueil', href: '/' },
      { name: 'À propos', href: '/a-propos' },
      { name: 'Nos Produits', href: '/produits' },
      { name: 'Galerie', href: '/galerie' },
      { name: 'Contact', href: '/contact' },
    ],
    services: [
      { name: 'Cuisines équipées', href: '/produits' },
      { name: 'Dressings & Placards', href: '/produits' },
      { name: 'Mobilier sur mesure', href: '/produits' },
      { name: 'Aménagements intérieurs', href: '/produits' },
    ],
    support: [
      { name: 'Demander un devis gratuit', href: '/contact' },
      { name: 'Nous contacter', href: '/contact' },
    ],
    legal: [
      { name: 'Mentions légales', href: '/contact' },
      { name: 'Conditions générales', href: '/contact' },
    ],
  },
  businessHours: {
    enabled: true,
    title: 'Horaires d\'ouverture',
    schedule: [
      { days: 'Lundi - Vendredi', hours: '8h00 - 18h00' },
      { days: 'Samedi', hours: '8h00 - 13h00' },
      { days: 'Dimanche', hours: 'Fermé' },
    ],
  },
  certifications: {
    enabled: true,
    title: 'Nos Garanties',
    items: [
      { name: 'Garantie qualité', icon: '🛡️' },
      { name: 'Artisan qualifié', icon: '⚒️' },
      { name: 'Bois certifié', icon: '🌳' },
      { name: 'Installation incluse', icon: '🔧' },
    ],
  },
  paymentMethods: {
    enabled: true,
    title: 'Moyens de paiement',
    methods: [
      'Espèces',
      'Virement bancaire',
      'Chèque',
      'Paiement en plusieurs fois',
    ],
  },
  newsletter: {
    title: 'Restez informé',
    description: 'Recevez nos dernières réalisations et nouveautés en exclusivité.',
  },
  bottom: {
    copyright: 'ÉBÉNOR CRÉATION. Tous droits réservés.',
    additionalText: 'Artisanat tunisien d\'excellence',
  },
};

function FooterEditorPage() {
  const router = useRouter();
  const [content, setContent] = useState<FooterContent>(defaultContent);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('brand');
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      setIsAuthenticated(!!token);
      setIsLoading(false);
      
      if (!token) {
        router.push('/admin/login');
      }
    };
    
    checkAuth();
    setMounted(true);
  }, [router]);

  useEffect(() => {
    if (!mounted) return;
    
    const saved = localStorage.getItem('footer_content');
    if (saved) {
      try {
        setContent(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading footer content:', error);
      }
    }
  }, [mounted]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('footer_content', JSON.stringify(content));
      
      // Method 1: Dispatch custom event for same tab
      window.dispatchEvent(new Event('footer_content_updated'));
      
      // Method 2: BroadcastChannel for cross-tab communication
      try {
        const channel = new BroadcastChannel('footer_updates');
        channel.postMessage({ type: 'update', data: content });
        channel.close();
      } catch (e) {
        // BroadcastChannel not supported
      }
      
      // Method 3: Trigger storage event manually
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'footer_content',
        newValue: JSON.stringify(content),
        url: window.location.href,
        storageArea: localStorage
      }));
      
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('✅ Footer mis à jour sur toutes les pages!');
    } catch (error) {
      toast.error('❌ Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tout le contenu du footer?')) {
      setContent(defaultContent);
      localStorage.removeItem('footer_content');
      toast.success('Footer réinitialisé');
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
    { id: 'brand', label: 'Marque & Description' },
    { id: 'contact', label: 'Contact' },
    { id: 'social', label: 'Réseaux Sociaux' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'hours', label: 'Horaires' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'payment', label: 'Paiements' },
    { id: 'newsletter', label: 'Newsletter' },
    { id: 'bottom', label: 'Bas de page' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-6">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
                <GlobeAltIcon className="h-8 w-8 text-amber-600" />
                Gestion du Footer Global
              </h1>
              <p className="mt-2 text-neutral-600">
                Modifiez le footer ici et il sera automatiquement mis à jour sur <strong>TOUTES les pages</strong> : Page d'accueil, Showroom, Nos Projets, et toutes les autres pages du site.
              </p>
              <p className="mt-1 text-sm text-amber-600 font-medium">
                💡 Un seul endroit pour gérer le footer de tout le site !
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
          {activeSection === 'brand' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Marque & Description</h2>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description principale (Footer Premium)
                </label>
                <textarea
                  value={content.brand.description}
                  onChange={(e) => setContent({
                    ...content,
                    brand: { ...content.brand, description: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Description de votre entreprise..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Tagline (Footer Simple)
                </label>
                <textarea
                  value={content.brand.tagline}
                  onChange={(e) => setContent({
                    ...content,
                    brand: { ...content.brand, tagline: e.target.value }
                  })}
                  rows={2}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Slogan court..."
                />
              </div>
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Informations de Contact</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4 text-amber-600" />
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={content.contact.phone}
                    onChange={(e) => setContent({
                      ...content,
                      contact: { ...content.contact, phone: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="+216 XX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4 text-amber-600" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={content.contact.email}
                    onChange={(e) => setContent({
                      ...content,
                      contact: { ...content.contact, email: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="contact@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-amber-600" />
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={content.contact.address}
                    onChange={(e) => setContent({
                      ...content,
                      contact: { ...content.contact, address: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Votre adresse..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    value={content.contact.whatsapp}
                    onChange={(e) => setContent({
                      ...content,
                      contact: { ...content.contact, whatsapp: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="+216XXXXXXXX"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'social' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Liens Réseaux Sociaux</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={content.social.facebook}
                    onChange={(e) => setContent({
                      ...content,
                      social: { ...content.social, facebook: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="https://facebook.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={content.social.instagram}
                    onChange={(e) => setContent({
                      ...content,
                      social: { ...content.social, instagram: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="https://instagram.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={content.social.linkedin}
                    onChange={(e) => setContent({
                      ...content,
                      social: { ...content.social, linkedin: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'navigation' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Liens de Navigation</h2>
              
              {(['company', 'services', 'support', 'legal'] as const).map((section) => (
                <div key={section} className="border border-neutral-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 capitalize">{section}</h3>
                  <div className="space-y-3">
                    {content.navigation[section].map((item, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const newNav = { ...content.navigation };
                            newNav[section][index].name = e.target.value;
                            setContent({ ...content, navigation: newNav });
                          }}
                          className="px-3 py-2 border border-neutral-300 rounded-lg"
                          placeholder="Nom du lien"
                        />
                        <input
                          type="text"
                          value={item.href}
                          onChange={(e) => {
                            const newNav = { ...content.navigation };
                            newNav[section][index].href = e.target.value;
                            setContent({ ...content, navigation: newNav });
                          }}
                          className="px-3 py-2 border border-neutral-300 rounded-lg"
                          placeholder="/lien"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'hours' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-neutral-900">Horaires d'ouverture</h2>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={content.businessHours.enabled}
                    onChange={(e) => setContent({
                      ...content,
                      businessHours: { ...content.businessHours, enabled: e.target.checked }
                    })}
                    className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-neutral-700">Afficher cette section</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Titre de la section
                </label>
                <input
                  type="text"
                  value={content.businessHours.title}
                  onChange={(e) => setContent({
                    ...content,
                    businessHours: { ...content.businessHours, title: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Horaires d'ouverture"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-neutral-700">Horaires</label>
                {content.businessHours.schedule.map((item, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 p-4 border border-neutral-200 rounded-lg">
                    <input
                      type="text"
                      value={item.days}
                      onChange={(e) => {
                        const newSchedule = [...content.businessHours.schedule];
                        newSchedule[index].days = e.target.value;
                        setContent({
                          ...content,
                          businessHours: { ...content.businessHours, schedule: newSchedule }
                        });
                      }}
                      className="px-3 py-2 border border-neutral-300 rounded-lg"
                      placeholder="Jours"
                    />
                    <input
                      type="text"
                      value={item.hours}
                      onChange={(e) => {
                        const newSchedule = [...content.businessHours.schedule];
                        newSchedule[index].hours = e.target.value;
                        setContent({
                          ...content,
                          businessHours: { ...content.businessHours, schedule: newSchedule }
                        });
                      }}
                      className="px-3 py-2 border border-neutral-300 rounded-lg"
                      placeholder="Heures"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'certifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-neutral-900">Certifications & Garanties</h2>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={content.certifications.enabled}
                    onChange={(e) => setContent({
                      ...content,
                      certifications: { ...content.certifications, enabled: e.target.checked }
                    })}
                    className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-neutral-700">Afficher cette section</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Titre de la section
                </label>
                <input
                  type="text"
                  value={content.certifications.title}
                  onChange={(e) => setContent({
                    ...content,
                    certifications: { ...content.certifications, title: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Certifications & Garanties"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-neutral-700">Items</label>
                {content.certifications.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 p-4 border border-neutral-200 rounded-lg">
                    <input
                      type="text"
                      value={item.icon}
                      onChange={(e) => {
                        const newItems = [...content.certifications.items];
                        newItems[index].icon = e.target.value;
                        setContent({
                          ...content,
                          certifications: { ...content.certifications, items: newItems }
                        });
                      }}
                      className="px-3 py-2 border border-neutral-300 rounded-lg text-center text-2xl"
                      placeholder="🛡️"
                    />
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const newItems = [...content.certifications.items];
                        newItems[index].name = e.target.value;
                        setContent({
                          ...content,
                          certifications: { ...content.certifications, items: newItems }
                        });
                      }}
                      className="col-span-2 px-3 py-2 border border-neutral-300 rounded-lg"
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'payment' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-neutral-900">Moyens de paiement</h2>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={content.paymentMethods.enabled}
                    onChange={(e) => setContent({
                      ...content,
                      paymentMethods: { ...content.paymentMethods, enabled: e.target.checked }
                    })}
                    className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-neutral-700">Afficher cette section</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Titre de la section
                </label>
                <input
                  type="text"
                  value={content.paymentMethods.title}
                  onChange={(e) => setContent({
                    ...content,
                    paymentMethods: { ...content.paymentMethods, title: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Moyens de paiement"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-neutral-700">Méthodes acceptées</label>
                {content.paymentMethods.methods.map((method, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <input
                      type="text"
                      value={method}
                      onChange={(e) => {
                        const newMethods = [...content.paymentMethods.methods];
                        newMethods[index] = e.target.value;
                        setContent({
                          ...content,
                          paymentMethods: { ...content.paymentMethods, methods: newMethods }
                        });
                      }}
                      className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Méthode de paiement"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'newsletter' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Newsletter</h2>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={content.newsletter.title}
                  onChange={(e) => setContent({
                    ...content,
                    newsletter: { ...content.newsletter, title: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Restez informé"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  value={content.newsletter.description}
                  onChange={(e) => setContent({
                    ...content,
                    newsletter: { ...content.newsletter, description: e.target.value }
                  })}
                  rows={2}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Description..."
                />
              </div>
            </div>
          )}

          {activeSection === 'bottom' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Bas de Page</h2>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Copyright
                </label>
                <input
                  type="text"
                  value={content.bottom.copyright}
                  onChange={(e) => setContent({
                    ...content,
                    bottom: { ...content.bottom, copyright: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="© 2024 Votre Entreprise"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  L'année sera ajoutée automatiquement
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Texte additionnel
                </label>
                <input
                  type="text"
                  value={content.bottom.additionalText}
                  onChange={(e) => setContent({
                    ...content,
                    bottom: { ...content.bottom, additionalText: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Fait avec ❤️ en Tunisie"
                />
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
            {isSaving ? 'Enregistrement...' : 'Enregistrer & Appliquer Partout'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FooterEditorPage;
