'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/contexts/AuthContext';

const navigationItems = [
  { name: 'Accueil', href: '/' },
  { name: 'Produits', href: '/produits' },
  { name: 'Galerie', href: '/galerie' },
  { name: 'Contact', href: '/contact' },
];

/**
 * Navigation Component
 * 
 * **Validates: Requirement 21.2** - ARIA labels for interactive elements
 * **Validates: Requirement 21.3** - Keyboard navigation support
 * **Validates: Requirement 21.10** - Semantic HTML (nav element)
 */
export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <nav 
      id="navigation" 
      className="bg-white shadow-elegant sticky top-0 z-50"
      aria-label="Navigation principale"
    >
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center focus-visible-enhanced rounded"
            aria-label="ÉBENOR CRÉATION - Retour à l'accueil"
          >
            <Logo size="md" className="hover:opacity-80 transition-opacity" />
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary-600 focus-visible-enhanced rounded px-2 py-1',
                  pathname === item.href
                    ? 'text-primary-600'
                    : 'text-neutral-600'
                )}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Show loading, Mon Espace when logged in, or nothing when not logged in */}
            {isLoading ? (
              <div className="text-sm font-medium text-neutral-400 px-4 py-2 rounded-lg flex items-center gap-2 opacity-50">
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            ) : isAuthenticated ? (
              <Link
                href="/admin/dashboard"
                className="text-sm font-medium text-amber-600 hover:text-amber-700 border border-amber-600 hover:border-amber-700 px-4 py-2 rounded-lg transition-colors focus-visible-enhanced flex items-center gap-2"
                aria-label="Accéder à l'espace administrateur"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Mon Espace
              </Link>
            ) : null}
            
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary focus-visible-enhanced"
              aria-label="Contactez-nous sur WhatsApp (ouvre dans un nouvel onglet)"
            >
              <span aria-hidden="true">📱</span> WhatsApp
            </a>
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-600 hover:text-neutral-800 focus-visible-enhanced rounded p-2"
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Mobile Ouvert */}
        {isOpen && (
          <div 
            id="mobile-menu" 
            className="md:hidden border-t border-neutral-200"
            role="navigation"
            aria-label="Menu mobile"
          >
            <div className="py-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block px-4 py-2 text-sm font-medium rounded-lg transition-colors focus-visible-enhanced',
                    pathname === item.href
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  )}
                  onClick={() => setIsOpen(false)}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Show loading, Mon Espace when logged in, or nothing when not logged in */}
              {isLoading ? (
                <div className="block mx-4 px-4 py-2 text-sm font-medium text-neutral-400 border border-neutral-300 rounded-lg text-center flex items-center justify-center space-x-2 opacity-50">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Chargement...</span>
                </div>
              ) : isAuthenticated ? (
                <Link
                  href="/admin/dashboard"
                  className="block mx-4 px-4 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 border border-amber-600 hover:border-amber-700 rounded-lg transition-colors focus-visible-enhanced text-center"
                  onClick={() => setIsOpen(false)}
                  aria-label="Accéder à l'espace administrateur"
                >
                  <span className="inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Mon Espace
                  </span>
                </Link>
              ) : null}
              
              <div className="px-4 pt-2">
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full focus-visible-enhanced"
                  aria-label="Contactez-nous sur WhatsApp (ouvre dans un nouvel onglet)"
                >
                  <span aria-hidden="true">📱</span> WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}