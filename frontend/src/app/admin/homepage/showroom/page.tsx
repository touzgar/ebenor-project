'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  CheckCircleIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import { getShowroomContent, updateShowroomContent } from '@/lib/api/showroom';
import { useAuth } from '@/hooks/useAuth';

export default function ShowroomAdminPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    titleHighlight: '',
    subtitle: '',
    ctaTitle: '',
    ctaSubtitle: '',
    ctaButtonText: '',
  });

  // Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load current content
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const loadContent = async () => {
      try {
        setLoading(true);
        const response = await getShowroomContent();
        if (response.success && response.data) {
          setFormData({
            title: response.data.title || '',
            titleHighlight: response.data.titleHighlight || '',
            subtitle: response.data.subtitle || '',
            ctaTitle: response.data.ctaTitle || '',
            ctaSubtitle: response.data.ctaSubtitle || '',
            ctaButtonText: response.data.ctaButtonText || '',
          });
        }
      } catch (err) {
        setError('Erreur lors du chargement du contenu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setError('Aucun token trouvé. Veuillez vous reconnecter.');
        setTimeout(() => router.push('/admin/login'), 2000);
        return;
      }

      const response = await updateShowroomContent(formData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.message || 'Erreur lors de la sauvegarde');
      }
    } catch (err: any) {
      if (err.message?.includes('401') || 
          err.message?.includes('Session expirée') ||
          err.message?.includes('token') || 
          err.message?.includes('unauthorized') ||
          err.message?.includes('Unauthorized') ||
          err.message?.includes('Non authentifié')) {
        setError(`Session expirée ou invalide: ${err.message}`);
        localStorage.removeItem('auth_token');
        setTimeout(() => {
          router.push('/admin/login');
        }, 3000);
      } else if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        setError('Erreur de connexion au serveur. Vérifiez que le backend est en cours d\'exécution sur http://localhost:5000');
      } else {
        setError(err.message || 'Erreur lors de la sauvegarde. Veuillez réessayer.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Show loading while checking auth
  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Vérification...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-amber-50/20 to-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.push('/admin/homepage')}
            className="flex items-center gap-2 text-neutral-600 hover:text-amber-600 transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Retour</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/30">
              <Squares2X2Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-neutral-900">Section Showroom</h1>
              <p className="text-neutral-600 mt-1">Modifier le contenu de la page Showroom/Produits</p>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-3"
          >
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
            <p className="text-green-800 font-medium">Contenu mis à jour avec succès!</p>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
          >
            <p className="text-red-800">{error}</p>
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-8 space-y-6"
        >
          {/* Title (first part) */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-neutral-700 mb-2">
              Titre (première partie)
              <span className="text-neutral-400 font-normal ml-2">Ex: "Notre"</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none text-lg"
              placeholder="Notre"
              required
            />
          </div>

          {/* Title Highlight (second part - colored) */}
          <div>
            <label htmlFor="titleHighlight" className="block text-sm font-semibold text-neutral-700 mb-2">
              Titre (partie colorée)
              <span className="text-neutral-400 font-normal ml-2">Ex: "Collection"</span>
            </label>
            <input
              type="text"
              id="titleHighlight"
              value={formData.titleHighlight}
              onChange={(e) => setFormData({ ...formData, titleHighlight: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none text-lg"
              placeholder="Collection"
              required
            />
            <p className="mt-2 text-sm text-neutral-500">
              Cette partie sera affichée en couleur ambre
            </p>
          </div>

          {/* Subtitle */}
          <div>
            <label htmlFor="subtitle" className="block text-sm font-semibold text-neutral-700 mb-2">
              Sous-titre
            </label>
            <textarea
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none resize-none"
              placeholder="Découvrez nos créations en bois d'exception..."
              required
            />
          </div>

          {/* Divider */}
          <div className="border-t-2 border-neutral-200 my-8">
            <p className="text-lg font-bold text-neutral-900 -mt-4 bg-white inline-block px-4">
              Section CTA (Bas de page)
            </p>
          </div>

          {/* CTA Title */}
          <div>
            <label htmlFor="ctaTitle" className="block text-sm font-semibold text-neutral-700 mb-2">
              Titre CTA
            </label>
            <input
              type="text"
              id="ctaTitle"
              value={formData.ctaTitle}
              onChange={(e) => setFormData({ ...formData, ctaTitle: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none text-lg"
              placeholder="Vous ne trouvez pas ce que vous cherchez ?"
              required
            />
          </div>

          {/* CTA Subtitle */}
          <div>
            <label htmlFor="ctaSubtitle" className="block text-sm font-semibold text-neutral-700 mb-2">
              Sous-titre CTA
            </label>
            <textarea
              id="ctaSubtitle"
              value={formData.ctaSubtitle}
              onChange={(e) => setFormData({ ...formData, ctaSubtitle: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none resize-none"
              placeholder="Nous créons également des pièces sur mesure..."
              required
            />
          </div>

          {/* CTA Button Text */}
          <div>
            <label htmlFor="ctaButtonText" className="block text-sm font-semibold text-neutral-700 mb-2">
              Texte du bouton CTA
            </label>
            <input
              type="text"
              id="ctaButtonText"
              value={formData.ctaButtonText}
              onChange={(e) => setFormData({ ...formData, ctaButtonText: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none text-lg"
              placeholder="Demander un Devis Gratuit"
              required
            />
          </div>

          {/* Preview */}
          <div className="mt-8 space-y-6">
            {/* Hero Preview */}
            <div className="p-6 bg-gradient-to-br from-neutral-50 to-amber-50/20 rounded-xl border-2 border-neutral-200">
              <p className="text-sm font-semibold text-neutral-700 mb-4">Aperçu Hero:</p>
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                  {formData.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">{formData.titleHighlight}</span>
                </h2>
                <p className="text-lg text-neutral-600">
                  {formData.subtitle}
                </p>
              </div>
            </div>

            {/* CTA Preview */}
            <div className="p-6 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl border-2 border-neutral-700">
              <p className="text-sm font-semibold text-white mb-4">Aperçu CTA:</p>
              <div className="text-center text-white">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  {formData.ctaTitle}
                </h3>
                <p className="text-lg text-neutral-300 mb-6">
                  {formData.ctaSubtitle}
                </p>
                <button className="px-8 py-4 bg-white text-neutral-900 font-bold rounded-xl">
                  {formData.ctaButtonText}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.push('/admin/homepage')}
              className="flex-1 px-6 py-3 border-2 border-neutral-300 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-50 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
