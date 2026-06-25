'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/lib/toast';
import {
  CheckCircleIcon,
  PencilIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface ContactPageContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  contactInfo: {
    address: {
      line1: string;
      line2: string;
    };
    phone: string;
    email: string;
    hours: {
      weekdays: string;
      weekdaysTime: string;
      saturday: string;
      saturdayTime: string;
      sunday: string;
      sundayStatus: string;
    };
  };
  whatsapp: {
    title: string;
    description: string;
    buttonText: string;
    phoneNumber: string;
  };
  map: {
    title: string;
    subtitle: string;
    embedUrl: string;
  };
  faq: {
    title: string;
    subtitle: string;
    questions: Array<{
      question: string;
      answer: string;
    }>;
  };
}

const defaultContent: ContactPageContent = {
  hero: {
    title: 'Contactez-Nous',
    subtitle: 'Contact',
    description: 'Prêt à donner vie à votre projet ? Notre équipe d\'artisans passionnés est à votre écoute pour transformer vos idées en réalité.',
  },
  contactInfo: {
    address: {
      line1: 'Zone Industrielle',
      line2: 'Tunis, Tunisie',
    },
    phone: '+216 XX XXX XXX',
    email: 'contact@ebenor-creation.tn',
    hours: {
      weekdays: 'Lun - Ven',
      weekdaysTime: '8h00 - 17h00',
      saturday: 'Samedi',
      saturdayTime: '8h00 - 12h00',
      sunday: 'Dimanche',
      sundayStatus: 'Fermé',
    },
  },
  whatsapp: {
    title: 'Contact Rapide',
    description: 'Besoin d\'une réponse immédiate ? Contactez-nous via WhatsApp pour un échange instantané !',
    buttonText: 'Ouvrir WhatsApp',
    phoneNumber: '+216XXXXXXXX',
  },
  map: {
    title: 'Notre Localisation',
    subtitle: 'Zone Industrielle, Tunis - Tunisie',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102948.82073654844!2d10.08080475!3d36.8064948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd34cf7c5f06b1%3A0x6b94f7608db567e!2sZone%20Industrielle%2C%20Tunis%2C%20Tunisia!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s',
  },
  faq: {
    title: 'Questions Fréquentes',
    subtitle: 'Trouvez rapidement les réponses aux questions les plus courantes',
    questions: [
      {
        question: 'Quel est le délai de fabrication ?',
        answer: 'Les délais varient selon la complexité du projet, généralement entre 2 à 8 semaines pour les créations sur mesure.',
      },
      {
        question: 'Proposez-vous la livraison ?',
        answer: 'Oui, nous assurons la livraison et l\'installation dans toute la Tunisie. Les frais dépendent de la distance et du volume.',
      },
      {
        question: 'Quelles essences de bois utilisez-vous ?',
        answer: 'Nous travaillons avec diverses essences : chêne, hêtre, noyer, acajou, selon vos préférences et le budget.',
      },
      {
        question: 'Comment obtenir un devis ?',
        answer: 'Contactez-nous avec les détails de votre projet. Nous vous fournirons un devis détaillé gratuit sous 48h.',
      },
    ],
  },
};

function ContactEditorPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [content, setContent] = useState<ContactPageContent>(defaultContent);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Load from database instead of localStorage
    const loadFromDatabase = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('/api/admin/contact', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setContent(result.data);
          }
        }
      } catch (error) {
        console.error('Error loading contact content from database:', error);
        // Fallback to localStorage if database fails
        const saved = localStorage.getItem('contact_page_content');
        if (saved) {
          try {
            setContent(JSON.parse(saved));
          } catch (e) {
            console.error('Error parsing localStorage:', e);
          }
        }
      }
    };
    
    loadFromDatabase();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/contact', {
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
        localStorage.setItem('contact_page_content', JSON.stringify(content));
        
        // Dispatch custom event to notify other tabs/windows
        window.dispatchEvent(new Event('contact_page_updated'));
        
        toast.success('✅ Page Contact mise à jour avec succès!');
      } else {
        toast.error('❌ Erreur lors de la sauvegarde: ' + (result.message || 'Erreur serveur'));
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('❌ Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tout le contenu?')) {
      setContent(defaultContent);
      localStorage.removeItem('contact_page_content');
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
    { id: 'hero', label: 'Hero' },
    { id: 'info', label: 'Coordonnées' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'map', label: 'Carte' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-6">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
                <PencilIcon className="h-8 w-8 text-amber-600" />
                Page Contact - Gestion Complète
              </h1>
              <p className="mt-2 text-neutral-600">
                Modifiez tout le contenu de la page Contact
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
          {activeSection === 'hero' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Section Hero</h2>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Titre</label>
                <input
                  type="text"
                  value={content.hero.title}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Contactez-Nous"
                />
                <p className="text-sm text-neutral-500 mt-2">
                  💡 Le titre s'affichera exactement comme vous le tapez
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                <textarea
                  value={content.hero.description}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Prêt à donner vie à votre projet ?..."
                />
              </div>
            </div>
          )}

          {activeSection === 'info' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Nos Coordonnées</h2>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Adresse - Ligne 1</label>
                <input
                  type="text"
                  value={content.contactInfo.address.line1}
                  onChange={(e) => setContent({ ...content, contactInfo: { ...content.contactInfo, address: { ...content.contactInfo.address, line1: e.target.value } } })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Adresse - Ligne 2</label>
                <input
                  type="text"
                  value={content.contactInfo.address.line2}
                  onChange={(e) => setContent({ ...content, contactInfo: { ...content.contactInfo, address: { ...content.contactInfo.address, line2: e.target.value } } })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Téléphone</label>
                  <input
                    type="text"
                    value={content.contactInfo.phone}
                    onChange={(e) => setContent({ ...content, contactInfo: { ...content.contactInfo, phone: e.target.value } })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={content.contactInfo.email}
                    onChange={(e) => setContent({ ...content, contactInfo: { ...content.contactInfo, email: e.target.value } })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Horaires</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Jours Semaine (Label)</label>
                    <select
                      value={content.contactInfo.hours.weekdays}
                      onChange={(e) => setContent({ ...content, contactInfo: { ...content.contactInfo, hours: { ...content.contactInfo.hours, weekdays: e.target.value } } })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                    >
                      <option value="Lun - Ven">Lun - Ven</option>
                      <option value="Lundi - Vendredi">Lundi - Vendredi</option>
                      <option value="Du Lundi au Vendredi">Du Lundi au Vendredi</option>
                      <option value="Semaine">Semaine</option>
                      <option value="Jours ouvrables">Jours ouvrables</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Horaires Semaine</label>
                    <input
                      type="text"
                      value={content.contactInfo.hours.weekdaysTime}
                      onChange={(e) => setContent({ ...content, contactInfo: { ...content.contactInfo, hours: { ...content.contactInfo.hours, weekdaysTime: e.target.value } } })}
                      placeholder="Ex: 8h00 - 17h00"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Samedi (Label)</label>
                    <select
                      value={content.contactInfo.hours.saturday}
                      onChange={(e) => setContent({ ...content, contactInfo: { ...content.contactInfo, hours: { ...content.contactInfo.hours, saturday: e.target.value } } })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                    >
                      <option value="Samedi">Samedi</option>
                      <option value="Sam">Sam</option>
                      <option value="Samedi matin">Samedi matin</option>
                      <option value="Weekend">Weekend</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Horaires Samedi</label>
                    <input
                      type="text"
                      value={content.contactInfo.hours.saturdayTime}
                      onChange={(e) => setContent({ ...content, contactInfo: { ...content.contactInfo, hours: { ...content.contactInfo.hours, saturdayTime: e.target.value } } })}
                      placeholder="Ex: 8h00 - 12h00"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Dimanche (Label)</label>
                    <select
                      value={content.contactInfo.hours.sunday}
                      onChange={(e) => setContent({ ...content, contactInfo: { ...content.contactInfo, hours: { ...content.contactInfo.hours, sunday: e.target.value } } })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                    >
                      <option value="Dimanche">Dimanche</option>
                      <option value="Dim">Dim</option>
                      <option value="Dimanche & Jours fériés">Dimanche & Jours fériés</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Status Dimanche</label>
                    <select
                      value={content.contactInfo.hours.sundayStatus}
                      onChange={(e) => setContent({ ...content, contactInfo: { ...content.contactInfo, hours: { ...content.contactInfo.hours, sundayStatus: e.target.value } } })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                    >
                      <option value="Fermé">Fermé</option>
                      <option value="Ouvert">Ouvert</option>
                      <option value="Sur rendez-vous">Sur rendez-vous</option>
                      <option value="Uniquement sur RDV">Uniquement sur RDV</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'whatsapp' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Contact WhatsApp</h2>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Titre</label>
                <input
                  type="text"
                  value={content.whatsapp.title}
                  onChange={(e) => setContent({ ...content, whatsapp: { ...content.whatsapp, title: e.target.value } })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                <textarea
                  value={content.whatsapp.description}
                  onChange={(e) => setContent({ ...content, whatsapp: { ...content.whatsapp, description: e.target.value } })}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Texte du Bouton</label>
                <input
                  type="text"
                  value={content.whatsapp.buttonText}
                  onChange={(e) => setContent({ ...content, whatsapp: { ...content.whatsapp, buttonText: e.target.value } })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Numéro WhatsApp (avec code pays)</label>
                <input
                  type="text"
                  value={content.whatsapp.phoneNumber}
                  onChange={(e) => setContent({ ...content, whatsapp: { ...content.whatsapp, phoneNumber: e.target.value } })}
                  placeholder="+216XXXXXXXX"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <p className="text-sm text-neutral-500 mt-2">Format: +216XXXXXXXX (sans espaces)</p>
              </div>
            </div>
          )}

          {activeSection === 'map' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Carte Google Maps</h2>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Titre</label>
                <input
                  type="text"
                  value={content.map.title}
                  onChange={(e) => setContent({ ...content, map: { ...content.map, title: e.target.value } })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Sous-titre</label>
                <input
                  type="text"
                  value={content.map.subtitle}
                  onChange={(e) => setContent({ ...content, map: { ...content.map, subtitle: e.target.value } })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">URL d'intégration Google Maps</label>
                <textarea
                  value={content.map.embedUrl}
                  onChange={(e) => setContent({ ...content, map: { ...content.map, embedUrl: e.target.value } })}
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm"
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
                <p className="text-sm text-neutral-500 mt-2">
                  Allez sur Google Maps → Cliquez sur "Partager" → "Intégrer une carte" → Copiez l'URL
                </p>
              </div>
            </div>
          )}

          {activeSection === 'faq' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Questions Fréquentes (FAQ)</h2>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Titre</label>
                <input
                  type="text"
                  value={content.faq.title}
                  onChange={(e) => setContent({ ...content, faq: { ...content.faq, title: e.target.value } })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Sous-titre</label>
                <input
                  type="text"
                  value={content.faq.subtitle}
                  onChange={(e) => setContent({ ...content, faq: { ...content.faq, subtitle: e.target.value } })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-4">
                {content.faq.questions.map((faq, index) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-4 space-y-3 bg-neutral-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 font-semibold rounded-full text-sm">
                        Question #{index + 1}
                      </span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Question</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => {
                          const newQuestions = [...content.faq.questions];
                          newQuestions[index].question = e.target.value;
                          setContent({ ...content, faq: { ...content.faq, questions: newQuestions } });
                        }}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-semibold"
                        placeholder="Votre question..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Réponse</label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => {
                          const newQuestions = [...content.faq.questions];
                          newQuestions[index].answer = e.target.value;
                          setContent({ ...content, faq: { ...content.faq, questions: newQuestions } });
                        }}
                        rows={3}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Votre réponse..."
                      />
                    </div>
                  </div>
                ))}
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

export default ContactEditorPage;
