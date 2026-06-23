'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';

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