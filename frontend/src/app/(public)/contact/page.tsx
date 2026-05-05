'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { motion } from 'framer-motion';

/**
 * Contact Page with Functional Form
 * Sends message to database AND sends email notification
 */
export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    consent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.consent) {
      setSubmitStatus({
        type: 'error',
        message: 'Vous devez accepter la politique de confidentialité',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Prepare data - only include phone if it has a value
      const requestData: any = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      };
      
      // Only add phone if it's not empty
      if (formData.phone && formData.phone.trim()) {
        requestData.phone = formData.phone.trim();
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.',
        });
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          consent: false,
        });
      } else {
        throw new Error(data.message || 'Erreur lors de l\'envoi du message');
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement par email.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-wood text-white" role="banner">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-6 lg:text-5xl">
              Contactez-Nous
            </h1>
            <p className="text-xl opacity-90">
              Prêt à donner vie à votre projet ? Notre équipe est là pour vous accompagner 
              de la conception à la réalisation de vos créations en bois.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Formulaire de contact et informations">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Formulaire de Contact */}
            <div>
              <div className="card-luxury">
                <h2 className="text-2xl font-bold text-neutral-800 mb-6">
                  Envoyez-nous un Message
                </h2>
                
                {/* Status Messages */}
                {submitStatus.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-4 rounded-lg ${
                      submitStatus.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                    }`}
                  >
                    {submitStatus.message}
                  </motion.div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6" aria-label="Formulaire de contact">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">
                        Prénom <span aria-label="requis">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="input focus-visible-enhanced"
                        placeholder="Votre prénom"
                        aria-required="true"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-2">
                        Nom <span aria-label="requis">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="input focus-visible-enhanced"
                        placeholder="Votre nom"
                        aria-required="true"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                      Email <span aria-label="requis">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input focus-visible-enhanced"
                      placeholder="votre.email@exemple.com"
                      aria-required="true"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input focus-visible-enhanced"
                      placeholder="+216 XX XXX XXX"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">
                      Sujet <span aria-label="requis">*</span>
                    </label>
                    <select 
                      id="subject" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required 
                      className="input focus-visible-enhanced"
                      aria-required="true"
                      disabled={isSubmitting}
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="Demande de devis">Demande de devis</option>
                      <option value="Nouveau projet">Nouveau projet</option>
                      <option value="Demande d'information">Demande d'information</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                      Message <span aria-label="requis">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="textarea focus-visible-enhanced"
                      placeholder="Décrivez votre projet ou votre demande en détail..."
                      aria-required="true"
                      disabled={isSubmitting}
                    ></textarea>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      required
                      className="mt-1 mr-3 focus-visible-enhanced"
                      aria-required="true"
                      disabled={isSubmitting}
                    />
                    <label htmlFor="consent" className="text-sm text-neutral-600">
                      J'accepte que mes données personnelles soient utilisées pour traiter ma demande. <span aria-label="requis">*</span>
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary w-full focus-visible-enhanced disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Envoyer le message de contact"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer le Message'}
                  </button>
                </form>
              </div>
            </div>

            {/* Informations de Contact */}
            <div className="space-y-8">
              {/* Coordonnées */}
              <div className="card">
                <h3 className="text-xl font-semibold text-neutral-800 mb-4">
                  Nos Coordonnées
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-primary-600 text-xl mr-3 mt-1" aria-hidden="true">📍</span>
                    <div>
                      <p className="font-medium text-neutral-800">Adresse</p>
                      <address className="text-neutral-600 not-italic">
                        Zone Industrielle<br />
                        Tunis, Tunisie
                      </address>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-primary-600 text-xl mr-3 mt-1" aria-hidden="true">📞</span>
                    <div>
                      <p className="font-medium text-neutral-800">Téléphone</p>
                      <a 
                        href="tel:+216XXXXXXXX" 
                        className="text-primary-600 hover:text-primary-700 focus-visible-enhanced rounded"
                        aria-label="Appeler ÉBENOR CRÉATION"
                      >
                        +216 XX XXX XXX
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-primary-600 text-xl mr-3 mt-1" aria-hidden="true">📧</span>
                    <div>
                      <p className="font-medium text-neutral-800">Email</p>
                      <a 
                        href="mailto:contact@ebenor-creation.tn" 
                        className="text-primary-600 hover:text-primary-700 focus-visible-enhanced rounded"
                        aria-label="Envoyer un email à ÉBENOR CRÉATION"
                      >
                        contact@ebenor-creation.tn
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-primary-600 text-xl mr-3 mt-1" aria-hidden="true">🕒</span>
                    <div>
                      <p className="font-medium text-neutral-800">Horaires</p>
                      <p className="text-neutral-600">
                        Lun - Ven : 8h00 - 17h00<br />
                        Sam : 8h00 - 12h00<br />
                        Dim : Fermé
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Rapide */}
              <div className="card bg-primary-50 border-primary-200">
                <h3 className="text-xl font-semibold text-neutral-800 mb-4">
                  Contact Rapide
                </h3>
                <p className="text-neutral-600 mb-6">
                  Besoin d'une réponse immédiate ? Contactez-nous directement via WhatsApp 
                  pour un échange en temps réel.
                </p>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Bonjour, je souhaiterais obtenir des informations sur vos services.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full focus-visible-enhanced"
                  aria-label="Ouvrir WhatsApp pour contacter ÉBENOR CRÉATION (ouvre dans un nouvel onglet)"
                >
                  📱 Ouvrir WhatsApp
                </a>
              </div>

              {/* Email Direct */}
              <div className="card bg-amber-50 border-amber-200">
                <h3 className="text-xl font-semibold text-neutral-800 mb-4">
                  Email Direct
                </h3>
                <p className="text-neutral-600 mb-6">
                  Vous préférez utiliser votre client email ? Cliquez ci-dessous pour ouvrir 
                  votre application email avec notre adresse pré-remplie.
                </p>
                <a
                  href="mailto:contact@ebenor-creation.tn?subject=Demande d'information&body=Bonjour,%0D%0A%0D%0AJe souhaiterais obtenir des informations sur vos services.%0D%0A%0D%0ACordialement,"
                  className="btn-secondary w-full focus-visible-enhanced"
                  aria-label="Ouvrir votre client email pour contacter ÉBENOR CRÉATION"
                >
                  📧 Ouvrir mon Email
                </a>
              </div>

              {/* Carte (Placeholder) */}
              <div className="card">
                <h3 className="text-xl font-semibold text-neutral-800 mb-4">
                  Notre Localisation
                </h3>
                <div className="aspect-video rounded-lg bg-neutral-200 flex items-center justify-center">
                  <div className="text-center text-neutral-500">
                    <span className="text-4xl mb-2 block">🗺️</span>
                    <p>Carte interactive à venir</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section FAQ */}
      <section className="section bg-white" aria-label="Questions fréquemment posées">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Trouvez rapidement les réponses aux questions les plus courantes
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <article className="card">
              <h3 className="font-semibold text-neutral-800 mb-2">
                Quel est le délai de fabrication ?
              </h3>
              <p className="text-neutral-600 text-sm">
                Les délais varient selon la complexité du projet, généralement entre 2 à 8 semaines 
                pour les créations sur mesure.
              </p>
            </article>
            
            <article className="card">
              <h3 className="font-semibold text-neutral-800 mb-2">
                Proposez-vous la livraison ?
              </h3>
              <p className="text-neutral-600 text-sm">
                Oui, nous assurons la livraison et l'installation dans toute la Tunisie. 
                Les frais dépendent de la distance et du volume.
              </p>
            </article>
            
            <article className="card">
              <h3 className="font-semibold text-neutral-800 mb-2">
                Quelles essences de bois utilisez-vous ?
              </h3>
              <p className="text-neutral-600 text-sm">
                Nous travaillons avec diverses essences : chêne, hêtre, noyer, acajou, 
                selon vos préférences et le budget.
              </p>
            </article>
            
            <article className="card">
              <h3 className="font-semibold text-neutral-800 mb-2">
                Comment obtenir un devis ?
              </h3>
              <p className="text-neutral-600 text-sm">
                Contactez-nous avec les détails de votre projet. Nous vous fournirons 
                un devis détaillé gratuit sous 48h.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
