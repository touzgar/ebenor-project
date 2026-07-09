'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Homepage error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center border-4 border-red-500/20">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Oups ! Une erreur s'est produite
        </h1>
        
        <p className="text-lg text-gray-400 mb-8">
          Nous sommes désolés, quelque chose s'est mal passé. Notre équipe a été notifiée et travaille à résoudre le problème.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={reset}
            className="bg-gradient-to-r from-[#C9A14A] to-[#D4B55A] text-black px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
          >
            🔄 Réessayer
          </button>
          
          <Link
            href="/"
            className="border-2 border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 w-full sm:w-auto inline-block"
          >
            🏠 Retour à l'accueil
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 text-gray-500 text-sm space-y-2">
          <p>Si le problème persiste, vous pouvez :</p>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            <Link href="/produits" className="text-[#C9A14A] hover:text-[#D4B55A] transition-colors">
              Nos Produits
            </Link>
            <Link href="/galerie" className="text-[#C9A14A] hover:text-[#D4B55A] transition-colors">
              Galerie
            </Link>
            <Link href="/contact" className="text-[#C9A14A] hover:text-[#D4B55A] transition-colors">
              Contactez-nous
            </Link>
            <Link href="/a-propos" className="text-[#C9A14A] hover:text-[#D4B55A] transition-colors">
              À propos
            </Link>
          </div>
        </div>

        {/* Page précédente link */}
        <div className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Page précédente
          </button>
        </div>
      </div>
    </div>
  );
}
