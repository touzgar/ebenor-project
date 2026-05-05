'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

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

  return (
    <footer className="bg-[#0D0D0D] text-white" role="contentinfo" aria-label="Pied de page du site">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link href="/" className="inline-block mb-6 focus-visible-enhanced rounded" aria-label="ÉBÉNOR CRÉATION - Retour à l'accueil">
                  <Image
                    src="/logo/logo.png"
                    alt="ÉBÉNOR CRÉATION - Logo"
                    width={180}
                    height={60}
                    className="h-12 w-auto object-contain"
                  />
                </Link>
                
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Créateur d'espaces d'exception en Tunisie depuis plus de 25 ans. 
                  Nous transformons vos rêves en réalité avec passion et savoir-faire.
                </p>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-400">
                    <HiPhone className="w-5 h-5 text-[#C9A14A] mr-3 flex-shrink-0" aria-hidden="true" />
                    <a href="tel:+21670123456" className="hover:text-white transition-colors focus-visible-enhanced rounded">
                      +216 70 123 456
                    </a>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <HiMail className="w-5 h-5 text-[#C9A14A] mr-3 flex-shrink-0" aria-hidden="true" />
                    <a href="mailto:contact@ebenor-creation.tn" className="hover:text-white transition-colors focus-visible-enhanced rounded">
                      contact@ebenor-creation.tn
                    </a>
                  </div>
                  <div className="flex items-start text-gray-400">
                    <HiLocationMarker className="w-5 h-5 text-[#C9A14A] mr-3 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <address className="not-italic">
                      Zone Industrielle<br />
                      Tunis, Tunisie
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

            {/* Navigation Sections */}
            <div className="lg:col-span-3 grid md:grid-cols-3 gap-8">
              {/* Company */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-6 text-[#C9A14A]">Entreprise</h3>
                <ul className="space-y-3" role="list">
                  {navigation.company.map((item) => (
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

              {/* Services */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-6 text-[#C9A14A]">Services</h3>
                <ul className="space-y-3" role="list">
                  {navigation.services.map((item) => (
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

              {/* Support & Legal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-lg font-semibold mb-6 text-[#C9A14A]">Support</h3>
                  <ul className="space-y-3" role="list">
                    {navigation.support.map((item) => (
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
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-6 text-[#C9A14A]">Légal</h3>
                  <ul className="space-y-3" role="list">
                    {navigation.legal.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-gray-400 hover:text-white transition-colors duration-300 text-sm focus-visible-enhanced rounded"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 py-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-serif mb-2">Restez informé</h3>
              <p className="text-gray-400">
                Recevez nos dernières créations et actualités directement dans votre boîte mail.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <label htmlFor="newsletter-email" className="sr-only">Votre adresse email</label>
              <input
                type="email"
                id="newsletter-email"
                name="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 bg-white/5 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-[#C9A14A] focus-visible-enhanced transition-colors"
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
          className="border-t border-gray-800 py-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} ÉBÉNOR CRÉATION. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Fait avec ❤️ en Tunisie</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-400 text-sm">Service client disponible</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}