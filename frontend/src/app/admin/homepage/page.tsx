'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

export default function HomepageManagementPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-amber-50/20 to-neutral-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          {/* Animated loader */}
          <div className="relative mb-8 w-20 h-20 mx-auto">
            {/* Outer rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient1)"
                  strokeWidth="3"
                  strokeDasharray="70 200"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Inner pulsing circle */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-lg" />
            </motion.div>
          </div>

          {/* Animated text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <p className="text-lg font-semibold text-neutral-800">
              Chargement en cours
            </p>
            
            {/* Animated dots */}
            <div className="flex items-center justify-center space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                  className="w-2 h-2 bg-amber-600 rounded-full"
                />
              ))}
            </div>
          </motion.div>

          {/* Progress bar effect */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-6 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full max-w-xs mx-auto"
          />
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const sections = [
    {
      name: 'Accueil',
      description: 'Gestion complète de la page d\'accueil : Hero, Atelier, Produits, Galerie, Processus, CTA',
      href: '/admin/homepage/accueil',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      color: 'from-sky-500 to-sky-600',
    },
    {
      name: 'Showroom',
      description: 'Contenu de la page Showroom/Produits: titre et sous-titre',
      href: '/admin/homepage/showroom',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      color: 'from-amber-500 to-amber-600',
    },
    {
      name: 'Page À Propos',
      description: 'Gestion complète de la page À Propos: Hero, Stats, Histoire, Timeline, Valeurs, CTA',
      href: '/admin/homepage/about',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
    },
    {
      name: 'Nos Projets',
      description: 'Gestion de la page Galerie: Hero et Call-to-Action',
      href: '/admin/homepage/projects',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      name: 'Contact',
      description: 'Informations de contact et horaires d\'ouverture',
      href: '/admin/homepage/contact',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-red-500 to-red-600',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="w-full px-3 sm:px-4 lg:px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900">
              Gestion de la page d'accueil
            </h1>
            <p className="mt-3 text-base lg:text-lg text-neutral-600">
              Personnalisez le contenu de votre page d'accueil section par section
            </p>
          </motion.div>
        </div>
      </div>

      {/* Sections Grid - Card Format */}
      <div className="w-full px-3 sm:px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                href={section.href}
                className="relative block h-full bg-white rounded-xl shadow-sm border border-neutral-200 hover:shadow-xl hover:border-amber-300 transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${section.color} text-white mb-4 group-hover:scale-105 transition-transform`}>
                    {section.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-amber-600 transition-colors">
                    {section.name}
                  </h3>
                  <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                    {section.description}
                  </p>
                  <div className="flex items-center justify-end">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium group-hover:bg-amber-600 group-hover:text-white transition-all">
                      Modifier
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
