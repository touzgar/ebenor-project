/**
 * PREMIUM FOOTER COMPONENT
 * 
 * Footer élaboré utilisé sur la page d'accueil avec :
 * - Image de fond avec overlay
 * - Design premium avec animations
 * - Toutes les sections configurables
 * 
 * 🔄 SYNCHRONISÉ avec le Footer Public via localStorage (clé: 'footer_content')
 * 📝 Géré depuis : /admin/homepage/footer
 * 
 * Mise à jour automatique en temps réel :
 * - Custom events pour le même onglet
 * - BroadcastChannel pour les autres onglets
 * - Storage events pour la synchronisation cross-tab
 */

"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useHomeContent } from '@/hooks/useHomeContent';

const navigation = {
  company: [
    { name: 'À propos', href: '/a-propos' },
    { name: 'Notre histoire', href: '/histoire' },
    { name: 'Équipe', href: '/equipe' },
    { name: 'Carrières', href: '/carrieres' },
  ],
  services: [
    { name: 'Cuisines sur mesure', href: '/cuisines' },
    { name: 'Dressings', href: '/dressings' },
    { name: 'Mobilier', href: '/mobilier' },
    { name: 'Aménagements', href: '/amenagements' },
  ],
  support: [
    { name: 'Contact', href: '/contact' },
    { name: 'Devis gratuit', href: '/devis' },
    { name: 'SAV', href: '/sav' },
    { name: 'Garantie', href: '/garantie' },
  ],
  legal: [
    { name: 'Mentions légales', href: '/mentions-legales' },
    { name: 'Politique de confidentialité', href: '/confidentialite' },
    { name: 'CGV', href: '/cgv' },
    { name: 'Cookies', href: '/cookies' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: FaFacebook, href: '#' },
  { name: 'Instagram', icon: FaInstagram, href: '#' },
  { name: 'LinkedIn', icon: FaLinkedin, href: '#' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { content } = useHomeContent();
  
  // Load custom footer content
  const [footerContent, setFooterContent] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  // Wait for client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const loadFooterContent = () => {
      const saved = localStorage.getItem('footer_content');
      if (saved) {
        try {
          setFooterContent(JSON.parse(saved));
        } catch (error) {
          // Use default content
        }
      }
    };

    loadFooterContent();

    // Method 1: Listen for custom event (same tab)
    const handleUpdate = () => loadFooterContent();
    window.addEventListener('footer_content_updated', handleUpdate);
    
    // Method 2: Listen for storage events (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'footer_content') {
        loadFooterContent();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Method 3: BroadcastChannel for real-time updates
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('footer_updates');
      channel.onmessage = (event) => {
        if (event.data.type === 'update') {
          setFooterContent(event.data.data);
        }
      };
    } catch (e) {
      // BroadcastChannel not supported
    }

    return () => {
      window.removeEventListener('footer_content_updated', handleUpdate);
      window.removeEventListener('storage', handleStorageChange);
      if (channel) {
        channel.close();
      }
    };
  }, [mounted]);

  // Use custom content if available, otherwise use defaults from admin page
  const brandDescription = mounted && footerContent?.brand?.description 
    ? footerContent.brand.description 
    : 'ÉBÉNOR CRÉATION - Votre partenaire de confiance pour la menuiserie et l\'ébénisterie d\'excellence en Tunisie. Depuis notre atelier, nous créons des pièces uniques alliant tradition artisanale et design contemporain.';
  
  const contactInfo = mounted && footerContent?.contact 
    ? {
        phone: footerContent.contact.phone || '+216 70147470',
        email: footerContent.contact.email || 'Ebenorcreation@gmail.com',
        address: footerContent.contact.address || 'HMADA KEBIRA RTE TUNIS, Akouda, Sousse, 4022',
        whatsapp: footerContent.contact.whatsapp || '+216 56767801'
      }
    : {
        phone: '+216 70147470',
        email: 'Ebenorcreation@gmail.com',
        address: 'HMADA KEBIRA RTE TUNIS, Akouda, Sousse, 4022',
        whatsapp: '+216 56767801'
      };
  
  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, href: mounted && footerContent?.social?.facebook ? footerContent.social.facebook : 'https://www.facebook.com/ebenorcreation' },
    { name: 'Instagram', icon: FaInstagram, href: mounted && footerContent?.social?.instagram ? footerContent.social.instagram : 'https://www.instagram.com/ebenorcreation' },
    { name: 'LinkedIn', icon: FaLinkedin, href: mounted && footerContent?.social?.linkedin ? footerContent.social.linkedin : 'https://www.linkedin.com/company/ebenorcreation' },
  ];
  
  const defaultNavigation = {
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
    ]
  };
  
  const navigationData = mounted && footerContent?.navigation 
    ? footerContent.navigation 
    : defaultNavigation;
  
  const newsletterData = mounted && footerContent?.newsletter 
    ? footerContent.newsletter 
    : {
      title: 'Restez informé',
      description: 'Recevez nos dernières réalisations et nouveautés en exclusivité.'
    };
  
  const bottomData = mounted && footerContent?.bottom 
    ? footerContent.bottom 
    : {
      copyright: 'ÉBÉNOR CRÉATION. Tous droits réservés.',
      additionalText: 'Artisanat tunisien d\'excellence'
    };
  
  // Get background image from footer content or use default
  const backgroundImage = mounted && footerContent?.backgroundImage 
    ? footerContent.backgroundImage 
    : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=90';

  return (
    <footer className="relative text-white overflow-hidden" role="contentinfo" aria-label="Pied de page du site">
      {/* Background Image - FULL COVERAGE - Dynamic from Admin */}
      <div className="absolute inset-0 z-0">
        <div
          key={backgroundImage}
          className="w-full h-full bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('${backgroundImage}')`
          }}
        />
        {/* Simple overlay for text readability */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Section - Takes 2 columns */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link href="/" className="inline-block mb-6 focus-visible-enhanced rounded" aria-label="ÉBÉNOR CRÉATION - Retour à l'accueil">
                  <img
                    src="/logo/logo.jpg"
                    alt="ÉBÉNOR CRÉATION - Logo"
                    width={180}
                    height={60}
                    className="h-12 w-auto object-contain"
                  />
                </Link>
                
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {brandDescription}
                </p>

                {/* Contact Info - Dynamic */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-400">
                    <HiPhone className="w-5 h-5 text-[#C9A14A] mr-3 flex-shrink-0" aria-hidden="true" />
                    <div className="flex flex-col">
                      <a href={`https://wa.me/${contactInfo.whatsapp.replace(/\s/g, '')}`} className="hover:text-white transition-colors focus-visible-enhanced rounded" target="_blank" rel="noopener noreferrer">
                        Contact WhatsApp : {contactInfo.whatsapp}
                      </a>
                      <a href={`tel:${contactInfo.phone}`} className="hover:text-white transition-colors focus-visible-enhanced rounded mt-1">
                        Num fixe : {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <HiMail className="w-5 h-5 text-[#C9A14A] mr-3 flex-shrink-0" aria-hidden="true" />
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors focus-visible-enhanced rounded">
                      {contactInfo.email}
                    </a>
                  </div>
                  <div className="flex items-start text-gray-400">
                    <HiLocationMarker className="w-5 h-5 text-[#C9A14A] mr-3 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <address className="not-italic">
                      Adresse : {contactInfo.address}
                    </address>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4" role="list" aria-label="Réseaux sociaux">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#C9A14A] hover:text-black transition-all duration-300 focus-visible-enhanced"
                        aria-label={`Suivez-nous sur ${social.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconComponent className="w-5 h-5" aria-hidden="true" />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Navigation Sections - Takes 3 columns */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* Navigation */}
              {navigationData.company && navigationData.company.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-lg font-semibold mb-6 text-[#C9A14A]">Navigation</h3>
                  <ul className="space-y-3" role="list">
                    {navigationData.company.map((item: any) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-gray-400 hover:text-white transition-colors duration-300 focus-visible-enhanced rounded"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Services */}
              {navigationData.services && navigationData.services.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-lg font-semibold mb-6 text-[#C9A14A]">Services</h3>
                  <ul className="space-y-3" role="list">
                    {navigationData.services.map((item: any) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-gray-400 hover:text-white transition-colors duration-300 focus-visible-enhanced rounded"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Business Hours */}
              {mounted && footerContent?.businessHours?.enabled && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-lg font-semibold mb-6 text-[#C9A14A]">
                    {footerContent.businessHours.title}
                  </h3>
                  <ul className="space-y-3" role="list">
                    {footerContent.businessHours.schedule.map((item: any, idx: number) => (
                      <li key={idx} className="text-gray-400 text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-300">{item.days}</span>
                          <span className="text-[#C9A14A]">{item.hours}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Certifications */}
              {mounted && footerContent?.certifications?.enabled && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-lg font-semibold mb-6 text-[#C9A14A]">
                    {footerContent.certifications.title}
                  </h3>
                  <ul className="space-y-3" role="list">
                    {footerContent.certifications.items.map((item: any, idx: number) => (
                      <li key={idx} className="text-gray-400 flex items-center gap-2">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-sm">{item.name}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Payment Methods */}
              {mounted && footerContent?.paymentMethods?.enabled && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-lg font-semibold mb-6 text-[#C9A14A]">
                    {footerContent.paymentMethods.title}
                  </h3>
                  <ul className="space-y-2" role="list">
                    {footerContent.paymentMethods.methods.map((method: string, idx: number) => (
                      <li key={idx} className="text-gray-400 text-sm flex items-center gap-2">
                        <span className="text-[#C9A14A]">✓</span>
                        <span>{method}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Support */}
              {navigationData.support && navigationData.support.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-lg font-semibold mb-6 text-[#C9A14A]">Support</h3>
                  <ul className="space-y-3" role="list">
                    {navigationData.support.map((item: any) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-gray-400 hover:text-white transition-colors duration-300 focus-visible-enhanced rounded"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-white/10 py-12 backdrop-blur-sm"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-serif mb-2">{newsletterData.title}</h3>
              <p className="text-gray-300">
                {newsletterData.description}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <label htmlFor="newsletter-email" className="sr-only">Votre adresse email</label>
              <input
                type="email"
                id="newsletter-email"
                name="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-gray-300 focus:outline-none focus:border-[#C9A14A] focus-visible-enhanced transition-colors"
                aria-label="Adresse email pour la newsletter"
                required
              />
              <button 
                className="bg-gradient-to-r from-[#C9A14A] to-[#D4B55A] text-black px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-[#C9A14A]/30 transition-all duration-300 whitespace-nowrap focus-visible-enhanced"
                aria-label="S'abonner à la newsletter"
              >
                S'abonner
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-white/10 py-8 backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © {currentYear} {bottomData.copyright}
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-300 text-sm">{bottomData.additionalText}</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-300 text-sm">Service client disponible</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}