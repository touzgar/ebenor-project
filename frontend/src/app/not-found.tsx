'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiHome, HiSearch, HiArrowLeft, HiMail } from 'react-icons/hi';

/**
 * 404 Not Found Page
 * Displays when a page is not found
 * Requirement 24.9: Display user-friendly error page with navigation options
 */
export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/produits?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const popularPages = [
    { name: 'Accueil', href: '/', icon: HiHome },
    { name: 'Nos Produits', href: '/produits', icon: null },
    { name: 'Galerie', href: '/galerie', icon: null },
    { name: 'Contact', href: '/contact', icon: HiMail },
  ];

  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] flex items-center justify-center px-4 py-16">
          <div className="max-w-3xl w-full">
            {/* 404 Number with Animation */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.25, 0.46, 0.45, 0.94],
                type: 'spring',
                stiffness: 100
              }}
              className="text-center mb-8"
            >
              <h1 className="text-[150px] md:text-[200px] font-serif font-bold leading-none">
                <span className="bg-gradient-to-r from-[#C9A14A] to-[#D4B55A] bg-clip-text text-transparent">
                  404
                </span>
              </h1>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                Page introuvable
              </h2>
              <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
                Désolé, la page que vous recherchez n'existe pas ou a été déplacée. 
                Utilisez la recherche ci-dessous ou explorez nos sections populaires.
              </p>

              {/* Search Bar */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                onSubmit={handleSearch}
                className="max-w-md mx-auto mb-12"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un produit..."
                    className="w-full px-6 py-4 pr-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-[#C9A14A] focus:ring-2 focus:ring-[#C9A14A]/50 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-[#C9A14A] to-[#D4B55A] rounded-full flex items-center justify-center text-black hover:shadow-lg hover:shadow-[#C9A14A]/40 transition-all duration-300 transform hover:scale-105"
                  >
                    <HiSearch className="w-5 h-5" />
                  </button>
                </div>
              </motion.form>
            </motion.div>

            {/* Popular Pages Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mb-12"
            >
              <h3 className="text-xl font-semibold text-white text-center mb-6">
                Pages populaires
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {popularPages.map((page, index) => {
                  const Icon = page.icon;
                  return (
                    <motion.div
                      key={page.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                    >
                      <Link
                        href={page.href}
                        className="group relative block p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-[#C9A14A]/50 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="flex items-center space-x-3">
                          {Icon && (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A14A] to-[#D4B55A] flex items-center justify-center">
                              <Icon className="w-5 h-5 text-black" />
                            </div>
                          )}
                          <span className="text-white font-medium group-hover:text-[#C9A14A] transition-colors duration-300">
                            {page.name}
                          </span>
                        </div>
                        {/* Arrow indicator */}
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30 group-hover:text-[#C9A14A] group-hover:translate-x-1 transition-all duration-300">
                          →
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
            >
              {/* Home Button */}
              <Link
                href="/"
                className="group relative px-8 py-4 bg-gradient-to-r from-[#C9A14A] to-[#D4B55A] text-black font-semibold rounded-full overflow-hidden shadow-lg hover:shadow-[#C9A14A]/40 transition-all duration-500 transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <HiHome className="w-5 h-5" />
                  <span>Retour à l'accueil</span>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.8 }}
                />
              </Link>

              {/* Back Button */}
              <button
                onClick={() => window.history.back()}
                className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:border-[#C9A14A]/50 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center justify-center space-x-2">
                  <HiArrowLeft className="w-5 h-5" />
                  <span>Page précédente</span>
                </span>
              </button>
            </motion.div>

            {/* Help Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-center"
            >
              <p className="text-white/50 text-sm mb-4">
                Besoin d'aide ? Notre équipe est là pour vous.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center space-x-2 text-[#C9A14A] hover:text-[#D4B55A] transition-colors duration-300"
              >
                <HiMail className="w-4 h-4" />
                <span className="text-sm font-medium">Contactez-nous</span>
              </Link>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 left-8 w-32 h-32 border border-[#C9A14A]/10 rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-8 w-24 h-24 border border-white/5 rounded-full pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-[#C9A14A]/5 rounded-full pointer-events-none" />
          </div>
        </div>
      </body>
    </html>
  );
}
