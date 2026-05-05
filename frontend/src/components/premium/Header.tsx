'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiMenu, HiX } from 'react-icons/hi';

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Produits', href: '/produits' },
  { name: 'Réalisations', href: '/galerie' },
  { name: 'À propos', href: '/a-propos' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const isScrolledState = scrollY > 50;
      setIsScrolled(isScrolledState);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Navbar principale */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.25, 0.46, 0.45, 0.94] // Courbe de Bézier premium
        }}
        className="fixed top-0 left-0 right-0 z-50"
        role="banner"
        style={{
          backgroundColor: 'rgba(13, 13, 13, 0.95)', // Fond noir permanent
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(201, 161, 74, 0.1)',
          boxShadow: isScrolled 
            ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
            : '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            
            {/* Logo Premium avec effet circulaire */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center flex-shrink-0"
            >
              <Link href="/" className="group relative focus-visible-enhanced rounded-full" aria-label="ÉBÉNOR CRÉATION - Retour à l'accueil">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 shadow-2xl shadow-amber-600/50 relative p-1">
                  <Image
                    src="/logo/logo.jpg"
                    alt="ÉBÉNOR CRÉATION - Logo"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                    priority
                  />
                  
                  {/* Effet glow au hover */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            </motion.div>

            {/* Navigation Desktop avec animations premium */}
            <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center" aria-label="Navigation principale" id="navigation">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href;
                
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.1 + 0.4,
                      duration: 0.6,
                      ease: 'easeOut'
                    }}
                    className="relative group"
                  >
                    <Link
                      href={item.href}
                      className={`relative text-sm font-medium tracking-wide transition-all duration-300 focus-visible-enhanced rounded px-2 py-1 ${
                        isActive 
                          ? 'text-[#C9A14A]' 
                          : 'text-white/90 hover:text-white'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.name}
                      
                      {/* Underline animé */}
                      <motion.div
                        className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#C9A14A] to-[#D4B55A] rounded-full"
                        initial={{ width: isActive ? '100%' : '0%' }}
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      />
                      
                      {/* Effet glow subtil */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-[#C9A14A]/10 rounded-lg -z-10"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* CTA Buttons Premium */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="hidden lg:flex items-center space-x-4 flex-shrink-0"
            >
              <Link
                href="/admin/login"
                className="group relative px-6 py-2.5 text-white/90 hover:text-[#C9A14A] font-medium text-sm rounded-full border border-white/20 hover:border-[#C9A14A]/50 transition-all duration-300 transform hover:scale-105 focus-visible-enhanced"
                aria-label="Connexion administrateur"
              >
                <span className="relative z-10 tracking-wide flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Admin</span>
                </span>
              </Link>
              
              <Link
                href="/contact"
                className="group relative px-8 py-3 bg-gradient-to-r from-[#C9A14A] to-[#D4B55A] text-black font-semibold text-sm rounded-full overflow-hidden shadow-lg hover:shadow-[#C9A14A]/40 transition-all duration-500 transform hover:scale-105 focus-visible-enhanced"
                aria-label="Demander un devis - Aller à la page de contact"
              >
                <span className="relative z-10 tracking-wide">
                  Demander un devis
                </span>
                
                {/* Effet shine au hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.8 }}
                />
              </Link>
            </motion.div>

            {/* Mobile Menu Button avec animation */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center text-white hover:text-[#C9A14A] transition-colors duration-300 focus-visible-enhanced rounded"
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? (
                  <HiX className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <HiMenu className="w-6 h-6" aria-hidden="true" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Menu Mobile Fullscreen Premium */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop avec blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Contenu du menu */}
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative flex flex-col items-center justify-center h-full px-8"
              role="navigation"
              aria-label="Menu mobile"
            >
              {/* Logo centré Premium */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-12"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 shadow-2xl shadow-amber-600/50 relative group p-1" aria-hidden="true">
                  <Image
                    src="/logo/logo.jpg"
                    alt=""
                    width={72}
                    height={72}
                    className="w-[4.5rem] h-[4.5rem] rounded-full object-cover"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>

              {/* Navigation mobile */}
              <nav className="flex flex-col items-center space-y-8 mb-12">
                {navigation.map((item, index) => {
                  const isActive = pathname === item.href;
                  
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: index * 0.1 + 0.3,
                        duration: 0.6,
                        ease: 'easeOut'
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-2xl font-light tracking-wider transition-all duration-300 focus-visible-enhanced rounded px-4 py-2 ${
                          isActive 
                            ? 'text-[#C9A14A]' 
                            : 'text-white hover:text-[#C9A14A]'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* CTA Button mobile */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex flex-col items-center space-y-4"
              >
                <Link
                  href="/admin/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-10 py-3 border-2 border-[#C9A14A] text-[#C9A14A] font-semibold rounded-full hover:bg-[#C9A14A] hover:text-black transition-all duration-300 focus-visible-enhanced"
                  aria-label="Connexion administrateur"
                >
                  Connexion Admin
                </Link>
                
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-10 py-4 bg-gradient-to-r from-[#C9A14A] to-[#D4B55A] text-black font-semibold rounded-full shadow-2xl hover:shadow-[#C9A14A]/50 transition-all duration-500 transform hover:scale-105 focus-visible-enhanced"
                  aria-label="Demander un devis - Aller à la page de contact"
                >
                  Demander un devis
                </Link>
              </motion.div>

              {/* Éléments décoratifs */}
              <div className="absolute top-1/4 left-8 w-24 h-24 border border-[#C9A14A]/20 rounded-full" />
              <div className="absolute bottom-1/4 right-8 w-16 h-16 border border-white/10 rounded-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}