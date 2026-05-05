'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { homeService } from '@/lib/api';
import type { HomeContent } from '@/types';
import { PublishToggle } from '@/components/admin/PublishToggle';

export default function ContactEditorPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Form state
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [workingHours, setWorkingHours] = useState('');

  // UI state
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load current contact content
  useEffect(() => {
    const loadContent = async () => {
      if (!isAuthenticated || authLoading) {
        return;
      }

      setIsLoadingContent(true);
      setLoadError(null);

      try {
        const response = await homeService.getContent();

        if (response.success && response.data) {
          const content = response.data as HomeContent;
          
          if (content.contact) {
            setAddress(content.contact.address || '');
            setPhone(content.contact.phone || '');
            setEmail(content.contact.email || '');
            setWhatsapp(content.contact.whatsapp || '');
            setWorkingHours(content.contact.workingHours || '');
          }
        } else {
          throw new Error(response.message || 'Impossible de charger le contenu');
        }
      } catch (error: any) {
        console.error('Error loading content:', error);
        setLoadError(error.message || 'Une erreur est survenue lors du chargement du contenu');
      } finally {
        setIsLoadingContent(false);
      }
    };

    loadContent();
  }, [isAuthenticated, authLoading]);

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone format (matches backend pattern)
  const validatePhone = (phone: string): boolean => {
    // Backend pattern: /^[\+]?[0-9\s\-\(\)]{8,20}$/
    // Allows: +, digits, spaces, hyphens, parentheses
    // Total length: 8-20 characters
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,20}$/;
    return phoneRegex.test(phone);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Address validation
    if (!address.trim()) {
      newErrors.address = 'L\'adresse est requise';
    } else if (address.length < 10) {
      newErrors.address = 'L\'adresse doit contenir au moins 10 caractères';
    } else if (address.length > 300) {
      newErrors.address = 'L\'adresse ne peut pas dépasser 300 caractères';
    }

    // Phone validation
    if (!phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Le numéro de téléphone n\'est pas valide. Utilisez uniquement +, chiffres, espaces, tirets et parenthèses (8-20 caractères)';
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(email)) {
      newErrors.email = 'L\'email n\'est pas valide (ex: contact@example.com)';
    }

    // WhatsApp validation
    if (!whatsapp.trim()) {
      newErrors.whatsapp = 'Le numéro WhatsApp est requis';
    } else if (!validatePhone(whatsapp)) {
      newErrors.whatsapp = 'Le numéro WhatsApp n\'est pas valide. Utilisez uniquement +, chiffres, espaces, tirets et parenthèses (8-20 caractères)';
    }

    // Working hours validation
    if (!workingHours.trim()) {
      newErrors.workingHours = 'Les horaires d\'ouverture sont requis';
    } else if (workingHours.length < 5) {
      newErrors.workingHours = 'Les horaires doivent contenir au moins 5 caractères';
    } else if (workingHours.length > 200) {
      newErrors.workingHours = 'Les horaires ne peuvent pas dépasser 200 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      setSubmitError('Veuillez corriger les erreurs dans le formulaire');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare payload
      const payload = {
        contact: {
          address: address.trim(),
          phone: phone.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim(),
          workingHours: workingHours.trim(),
        },
      };

      const response = await homeService.updateContact(payload.contact);

      if (response.success) {
        // Show success notification
        alert('Section contact mise à jour avec succès !');

        // Redirect to dashboard
        router.push('/admin/dashboard');
      } else {
        throw new Error(response.message || 'Erreur lors de la mise à jour');
      }
    } catch (error: any) {
      console.error('Error updating contact section:', error);

      let errorMessage = 'Une erreur est survenue lors de la mise à jour';

      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setSubmitError(errorMessage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (authLoading || isLoadingContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">
            {authLoading ? 'Chargement...' : 'Chargement du contenu...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Error state
  if (loadError) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="bg-white border-b border-neutral-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-neutral-900">
              Modifier la section Contact
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-8 text-center"
          >
            <svg className="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              Erreur de chargement
            </h2>
            <p className="text-red-700 mb-6">{loadError}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Réessayer
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  Modifier la section Contact
                </h1>
                <p className="mt-2 text-neutral-600">
                  Gérez les informations de contact affichées sur votre site
                </p>
              </div>

              <Link
                href="/admin/dashboard"
                className="inline-flex items-center px-4 py-2 text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Annuler
              </Link>
            </div>

            {/* Publish Toggle */}
            <PublishToggle section="contact" initialPublished={false} />
          </motion.div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error Message */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                  <p className="mt-1 text-sm text-red-700">{submitError}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Contact Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">
              Informations de contact
            </h2>

            <div className="space-y-6">
              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-2">
                  Adresse <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  placeholder="Ex: 123 Rue de l'Artisan, 75001 Paris, France"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none ${
                    errors.address ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  maxLength={300}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.address && (
                    <p className="text-sm text-red-600">{errors.address}</p>
                  )}
                  <p className="text-xs text-neutral-500 ml-auto">
                    {address.length}/300 caractères
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: +33 1 23 45 67 89"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                    errors.phone ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                )}
                <p className="text-xs text-neutral-500 mt-2">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Format: +, chiffres, espaces, tirets, parenthèses (8-20 caractères). Ex: +33 1 23 45 67 89
                </p>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: contact@ebenor-creation.com"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              {/* WhatsApp */}
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-neutral-700 mb-2">
                  WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Ex: +33 6 12 34 56 78"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                    errors.whatsapp ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.whatsapp && (
                  <p className="text-sm text-red-600 mt-1">{errors.whatsapp}</p>
                )}
                <p className="text-xs text-neutral-500 mt-2">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Format: +, chiffres, espaces, tirets, parenthèses (8-20 caractères). Ex: +33 6 12 34 56 78
                </p>
              </div>

              {/* Working Hours */}
              <div>
                <label htmlFor="workingHours" className="block text-sm font-medium text-neutral-700 mb-2">
                  Horaires d'ouverture <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="workingHours"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  rows={3}
                  placeholder="Ex: Lundi - Vendredi: 9h00 - 18h00&#10;Samedi: 10h00 - 16h00&#10;Dimanche: Fermé"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none ${
                    errors.workingHours ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  maxLength={200}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.workingHours && (
                    <p className="text-sm text-red-600">{errors.workingHours}</p>
                  )}
                  <p className="text-xs text-neutral-500 ml-auto">
                    {workingHours.length}/200 caractères
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">
              Aperçu
            </h2>

            <div className="bg-neutral-50 rounded-lg p-8">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
                  Contactez-nous
                </h3>

                <div className="space-y-6">
                  {/* Address Preview */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-neutral-900 mb-1">Adresse</h4>
                      <p className="text-neutral-700 whitespace-pre-wrap">
                        {address || 'Votre adresse ici'}
                      </p>
                    </div>
                  </div>

                  {/* Phone Preview */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-neutral-900 mb-1">Téléphone</h4>
                      <p className="text-neutral-700">
                        {phone || 'Votre numéro de téléphone ici'}
                      </p>
                    </div>
                  </div>

                  {/* Email Preview */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-neutral-900 mb-1">Email</h4>
                      <p className="text-neutral-700">
                        {email || 'Votre email ici'}
                      </p>
                    </div>
                  </div>

                  {/* WhatsApp Preview */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-neutral-900 mb-1">WhatsApp</h4>
                      <p className="text-neutral-700">
                        {whatsapp || 'Votre numéro WhatsApp ici'}
                      </p>
                    </div>
                  </div>

                  {/* Working Hours Preview */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-neutral-900 mb-1">Horaires d'ouverture</h4>
                      <p className="text-neutral-700 whitespace-pre-wrap">
                        {workingHours || 'Vos horaires d\'ouverture ici'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-500 mt-3 text-center">
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Ceci est un aperçu de la section contact telle qu'elle apparaîtra sur votre site
            </p>
          </motion.div>

          {/* Form Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex items-center justify-end gap-4"
          >
            <Link
              href="/admin/dashboard"
              className="px-6 py-3 text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Enregistrer les modifications
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
