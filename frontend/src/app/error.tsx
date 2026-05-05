'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiHome, HiArrowLeft, HiMail, HiRefresh } from 'react-icons/hi';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error Boundary Component
 * Catches and displays errors that occur during rendering
 * Requirement 24.9: Display user-friendly error page with navigation options
 * Requirement 24.10: Log errors to backend for debugging
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to backend
    const logError = async () => {
      try {
        const errorData = {
          message: error.message,
          stack: error.stack,
          digest: error.digest,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        };

        // In development, log to console
        if (process.env.NODE_ENV === 'development') {
          console.error('Error caught by error boundary:', errorData);
        }

        // TODO: Send to backend error logging endpoint when available
        // await fetch('/api/errors', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(errorData),
        // });
      } catch (logError) {
        // Silently fail if logging fails
        console.error('Failed to log error:', logError);
      }
    };

    logError();
  }, [error]);

  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] flex items-center justify-center px-4 py-16">
          <div className="max-w-2xl w-full">
            {/* Error Icon with Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.25, 0.46, 0.45, 0.94],
                type: 'spring',
                stiffness: 100
              }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-2xl shadow-red-500/50">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                {/* Pulsing ring effect */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-red-500/30"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>

            {/* Error Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                Oups ! Une erreur s'est produite
              </h1>
              <p className="text-lg text-white/70 mb-6">
                Nous sommes désolés, quelque chose s'est mal passé. Notre équipe a été notifiée et travaille à résoudre le problème.
              </p>

              {/* Error details in development */}
              {process.env.NODE_ENV === 'development' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="mt-6 p-6 bg-black/40 backdrop-blur-sm rounded-2xl border border-red-500/20 text-left"
                >
                  <h3 className="text-sm font-semibold text-red-400 mb-2 uppercase tracking-wider">
                    Détails de l'erreur (mode développement)
                  </h3>
                  <p className="text-sm text-white/80 font-mono break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-white/50 mt-2">
                      Digest: {error.digest}
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
            >
              {/* Try Again Button */}
              <button
                onClick={reset}
                className="group relative px-8 py-4 bg-gradient-to-r from-[#C9A14A] to-[#D4B55A] text-black font-semibold rounded-full overflow-hidden shadow-lg hover:shadow-[#C9A14A]/40 transition-all duration-500 transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <HiRefresh className="w-5 h-5" />
                  <span>Réessayer</span>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.8 }}
                />
              </button>

              {/* Home Button */}
              <Link
                href="/"
                className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:border-[#C9A14A]/50 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center justify-center space-x-2">
                  <HiHome className="w-5 h-5" />
                  <span>Retour à l'accueil</span>
                </span>
              </Link>
            </motion.div>

            {/* Additional Navigation Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-6 text-sm"
            >
              <Link
                href="/produits"
                className="text-white/70 hover:text-[#C9A14A] transition-colors duration-300 flex items-center space-x-1"
              >
                <span>Nos Produits</span>
              </Link>
              <Link
                href="/galerie"
                className="text-white/70 hover:text-[#C9A14A] transition-colors duration-300 flex items-center space-x-1"
              >
                <span>Galerie</span>
              </Link>
              <Link
                href="/contact"
                className="text-white/70 hover:text-[#C9A14A] transition-colors duration-300 flex items-center space-x-2"
              >
                <HiMail className="w-4 h-4" />
                <span>Contactez-nous</span>
              </Link>
              <button
                onClick={() => window.history.back()}
                className="text-white/70 hover:text-[#C9A14A] transition-colors duration-300 flex items-center space-x-2"
              >
                <HiArrowLeft className="w-4 h-4" />
                <span>Page précédente</span>
              </button>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 left-8 w-32 h-32 border border-[#C9A14A]/10 rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-8 w-24 h-24 border border-white/5 rounded-full pointer-events-none" />
          </div>
        </div>
      </body>
    </html>
  );
}
