/**
 * PUBLIC FOOTER COMPONENT
 * 
 * Footer simple utilisé sur toutes les pages (sauf page d'accueil) :
 * - Showroom / Nos Projets
 * - À propos
 * - Produits
 * - Galerie
 * - Contact
 * - Etc.
 * 
 * 🔄 SYNCHRONISÉ avec le Footer Premium via localStorage (clé: 'footer_content')
 * 📝 Géré depuis : /admin/homepage/footer
 * 
 * Mise à jour automatique en temps réel :
 * - Custom events pour le même onglet
 * - BroadcastChannel pour les autres onglets
 * - Storage events pour la synchronisation cross-tab
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { APP_CONFIG } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Load custom footer content
  const [footerContent, setFooterContent] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0); // Force re-render trigger

  // Wait for client-side mounting to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const loadFooterContent = () => {
      const saved = localStorage.getItem('footer_content');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          console.log('🔄 Public Footer loaded:', parsed);
          setFooterContent(parsed);
          setUpdateTrigger(prev => prev + 1); // Force re-render
        } catch (error) {
          console.error('Error parsing footer content:', error);
        }
      } else {
        console.log('⚠️ No footer_content in localStorage');
      }
    };

    loadFooterContent();

    // Method 1: Listen for custom event (same tab)
    const handleUpdate = () => {
      console.log('🔔 footer_content_updated event received');
      loadFooterContent();
    };
    window.addEventListener('footer_content_updated', handleUpdate);
    
    // Method 2: Listen for storage events (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'footer_content') {
        console.log('🔔 Storage event received');
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
          console.log('🔔 BroadcastChannel update received');
          setFooterContent(event.data.data);
          setUpdateTrigger(prev => prev + 1); // Force re-render
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

  // Default values for server-side rendering
  const defaultNavLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'À propos', href: '/a-propos' },
    { name: 'Nos Produits', href: '/produits' },
    { name: 'Galerie', href: '/galerie' },
    { name: 'Contact', href: '/contact' }
  ];

  // Use custom content only after mounting (client-side only)
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
  
  const socialLinks = {
    facebook: mounted && footerContent?.social?.facebook ? footerContent.social.facebook : 'https://www.facebook.com/ebenorcreation',
    instagram: mounted && footerContent?.social?.instagram ? footerContent.social.instagram : 'https://www.instagram.com/ebenorcreation',
    linkedin: mounted && footerContent?.social?.linkedin ? footerContent.social.linkedin : 'https://www.linkedin.com/company/ebenorcreation'
  };
  
  const navigationLinks = mounted && footerContent?.navigation?.company 
    ? footerContent.navigation.company 
    : defaultNavLinks;
  
  const servicesLinks = mounted && footerContent?.navigation?.services 
    ? footerContent.navigation.services 
    : [
      { name: 'Cuisines équipées', href: '/produits' },
      { name: 'Dressings & Placards', href: '/produits' },
      { name: 'Mobilier sur mesure', href: '/produits' },
      { name: 'Aménagements intérieurs', href: '/produits' },
    ];
  
  const legalLinks = mounted && footerContent?.navigation?.legal 
    ? footerContent.navigation.legal 
    : [
      { name: 'Mentions légales', href: '/contact' },
      { name: 'Conditions générales', href: '/contact' },
    ];
  
  const copyrightText = mounted && footerContent?.bottom?.copyright 
    ? footerContent.bottom.copyright 
    : 'ÉBÉNOR CRÉATION. Tous droits réservés.';
  
  const additionalText = mounted && footerContent?.bottom?.additionalText 
    ? footerContent.bottom.additionalText 
    : 'Artisanat tunisien d\'excellence';
  
  const newsletterData = mounted && footerContent?.newsletter 
    ? footerContent.newsletter 
    : {
      title: 'Restez informé',
      description: 'Recevez nos dernières réalisations et nouveautés en exclusivité.'
    };

  return (
    <footer key={`footer-${updateTrigger}`} className="bg-neutral-800 text-white">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* À propos */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-luxury rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">É</span>
              </div>
              <span className="font-serif font-bold text-lg">
                ÉBÉNOR CRÉATION
              </span>
            </div>
            <p className="text-neutral-300 text-sm mb-4">
              {brandDescription}
            </p>
            <div className="flex space-x-4">
              <a
                href={socialLinks.facebook}
                className="text-neutral-400 hover:text-primary-400 transition-colors"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={socialLinks.instagram}
                className="text-neutral-400 hover:text-primary-400 transition-colors"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297L3.182 17.635l1.935-1.935c.807.807 1.958 1.297 3.323 1.297 2.58 0 4.677-2.097 4.677-4.677S11.029 7.643 8.449 7.643 3.772 9.74 3.772 12.32s2.097 4.668 4.677 4.668z"/>
                </svg>
              </a>
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  className="text-neutral-400 hover:text-primary-400 transition-colors"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Navigation */}
          {navigationLinks && navigationLinks.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-4">Navigation</h3>
              <ul className="space-y-2 text-sm">
                {navigationLinks.map((link: any) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-neutral-300 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Business Hours */}
          {mounted && footerContent?.businessHours?.enabled && (
            <div>
              <h3 className="font-semibold text-lg mb-4">{footerContent.businessHours.title}</h3>
              <ul className="space-y-2 text-sm text-neutral-300">
                {footerContent.businessHours.schedule.map((item: any, idx: number) => (
                  <li key={idx}>
                    <div className="flex flex-col">
                      <span className="font-medium text-neutral-200">{item.days}</span>
                      <span className="text-xs">{item.hours}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certifications */}
          {mounted && footerContent?.certifications?.enabled && (
            <div>
              <h3 className="font-semibold text-lg mb-4">{footerContent.certifications.title}</h3>
              <ul className="space-y-2 text-sm text-neutral-300">
                {footerContent.certifications.items.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Services */}
          {servicesLinks && servicesLinks.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-4">Nos Services</h3>
              <ul className="space-y-2 text-sm text-neutral-300">
                {servicesLinks.map((service: any, idx: number) => (
                  <li key={idx}>{typeof service === 'string' ? service : service.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-neutral-300">
              <div className="flex items-start">
                <span className="text-primary-400 mr-2">📍</span>
                <span>{contactInfo.address}</span>
              </div>
              <div className="flex items-center">
                <span className="text-primary-400 mr-2">📞</span>
                <a 
                  href={`tel:${contactInfo.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center">
                <span className="text-primary-400 mr-2">📧</span>
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-white transition-colors"
                >
                  {contactInfo.email}
                </a>
              </div>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${contactInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm"
                >
                  📱 WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p className="text-neutral-400 text-sm">
              © {currentYear} {copyrightText}
            </p>
            {additionalText && (
              <span className="hidden md:inline text-neutral-500">•</span>
            )}
            {additionalText && (
              <p className="text-neutral-400 text-sm">
                {additionalText}
              </p>
            )}
          </div>
          {legalLinks && legalLinks.length > 0 && (
            <div className="flex space-x-6 mt-4 md:mt-0">
              {legalLinks.map((link: any) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-neutral-400 hover:text-white text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
