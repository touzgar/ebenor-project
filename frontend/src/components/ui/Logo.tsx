import { HTMLAttributes } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark';
  useCustomLogo?: boolean; // Pour utiliser vos logos personnalisés
}

export function Logo({ 
  variant = 'full', 
  size = 'md', 
  theme = 'light',
  useCustomLogo = true, // Par défaut, utilise vos logos personnalisés
  className,
  ...props 
}: LogoProps) {
  const sizes = {
    sm: { container: 'h-8', width: 80, height: 32, icon: 'w-6 h-6', text: 'text-lg' },
    md: { container: 'h-10', width: 120, height: 40, icon: 'w-8 h-8', text: 'text-xl' },
    lg: { container: 'h-12', width: 150, height: 48, icon: 'w-10 h-10', text: 'text-2xl' },
    xl: { container: 'h-16', width: 200, height: 64, icon: 'w-12 h-12', text: 'text-3xl' },
  };

  // Si vous avez vos propres logos, utilisez-les
  if (useCustomLogo) {
    const logoSrc = theme === 'dark' 
      ? '/logo/logo-white.svg' 
      : '/logo/logo-full.svg';
    
    const iconSrc = theme === 'dark'
      ? '/logo/logo-icon-white.svg'
      : '/logo/logo-icon.svg';

    if (variant === 'full') {
      return (
        <div className={cn('flex items-center', sizes[size].container, className)} {...props}>
          <Image
            src={logoSrc}
            alt="ÉBENOR CRÉATION"
            width={sizes[size].width}
            height={sizes[size].height}
            className="object-contain"
            priority
            unoptimized
            onError={(e) => {
              // Fallback vers le logo par défaut si l'image personnalisée n'existe pas
              console.warn('Logo personnalisé non trouvé, utilisation du logo par défaut');
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      );
    }

    if (variant === 'icon') {
      return (
        <div className={cn('flex items-center', sizes[size].container, className)} {...props}>
          <Image
            src={iconSrc}
            alt="ÉBENOR CRÉATION"
            width={sizes[size].height}
            height={sizes[size].height}
            className="object-contain"
            priority
            unoptimized
            onError={(e) => {
              console.warn('Icône personnalisée non trouvée, utilisation de l\'icône par défaut');
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      );
    }
  }

  // Fallback vers le logo par défaut (SVG intégré)
  const colors = {
    light: {
      icon: 'text-primary-600',
      text: 'text-neutral-800',
      gradient: 'from-primary-500 to-wood-500',
    },
    dark: {
      icon: 'text-primary-400',
      text: 'text-white',
      gradient: 'from-primary-400 to-wood-400',
    },
  };

  const LogoIcon = () => (
    <div className={cn(
      'relative flex items-center justify-center rounded-lg bg-gradient-to-br',
      `bg-gradient-to-br from-primary-500 to-wood-500`,
      sizes[size].icon
    )}>
      {/* Motif bois stylisé */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-3/4 h-3/4 text-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Forme principale - E stylisé */}
        <path
          d="M4 4h12v3H8v3h6v3H8v3h8v3H4V4z"
          fill="currentColor"
          className="opacity-90"
        />
        {/* Détails décoratifs - motif bois */}
        <path
          d="M6 6h2v1H6V6zM6 10h2v1H6v-1zM6 14h2v1H6v-1z"
          fill="currentColor"
          className="opacity-60"
        />
        {/* Accent doré */}
        <circle
          cx="18"
          cy="6"
          r="2"
          fill="currentColor"
          className="opacity-80"
        />
      </svg>
    </div>
  );

  const LogoText = () => (
    <div className="flex flex-col leading-none">
      <span className={cn(
        'font-serif font-bold tracking-wide',
        colors[theme].text,
        sizes[size].text
      )}>
        ÉBENOR
      </span>
      <span className={cn(
        'font-sans text-xs font-medium tracking-widest opacity-75',
        colors[theme].text,
        size === 'sm' ? 'text-[10px]' : 
        size === 'md' ? 'text-xs' :
        size === 'lg' ? 'text-sm' : 'text-base'
      )}>
        CRÉATION
      </span>
    </div>
  );

  return (
    <div 
      className={cn(
        'flex items-center gap-3',
        sizes[size].container,
        className
      )}
      {...props}
    >
      {(variant === 'full' || variant === 'icon') && <LogoIcon />}
      {(variant === 'full' || variant === 'text') && <LogoText />}
    </div>
  );
}

// Composant Logo SVG pour usage avancé
export function LogoSVG({ 
  width = 120, 
  height = 40, 
  theme = 'light' 
}: { 
  width?: number; 
  height?: number; 
  theme?: 'light' | 'dark';
}) {
  const colors = {
    light: {
      primary: '#e8bc45',
      wood: '#b8904f',
      text: '#262626',
      accent: '#d4a332',
    },
    dark: {
      primary: '#f0d068',
      wood: '#c8a670',
      text: '#ffffff',
      accent: '#f6e397',
    },
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Dégradé pour l'icône */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors[theme].primary} />
          <stop offset="100%" stopColor={colors[theme].wood} />
        </linearGradient>
      </defs>
      
      {/* Icône - E stylisé dans un cercle */}
      <circle cx="20" cy="20" r="16" fill="url(#logoGradient)" />
      
      {/* Lettre E */}
      <path
        d="M12 12h12v2.5H15.5v3h6v2.5h-6v3H24V28H12V12z"
        fill="white"
        opacity="0.95"
      />
      
      {/* Détails décoratifs */}
      <rect x="13.5" y="14" width="1.5" height="1" fill="white" opacity="0.7" />
      <rect x="13.5" y="18.5" width="1.5" height="1" fill="white" opacity="0.7" />
      <rect x="13.5" y="23" width="1.5" height="1" fill="white" opacity="0.7" />
      
      {/* Accent doré */}
      <circle cx="30" cy="14" r="2" fill={colors[theme].accent} opacity="0.8" />
      
      {/* Texte ÉBENOR */}
      <text
        x="42"
        y="18"
        fontFamily="serif"
        fontSize="14"
        fontWeight="bold"
        fill={colors[theme].text}
        letterSpacing="0.5px"
      >
        ÉBENOR
      </text>
      
      {/* Texte CRÉATION */}
      <text
        x="42"
        y="30"
        fontFamily="sans-serif"
        fontSize="8"
        fontWeight="500"
        fill={colors[theme].text}
        opacity="0.8"
        letterSpacing="2px"
      >
        CRÉATION
      </text>
      
      {/* Ligne décorative */}
      <line
        x1="42"
        y1="22"
        x2="110"
        y2="22"
        stroke={colors[theme].primary}
        strokeWidth="0.5"
        opacity="0.6"
      />
    </svg>
  );
}

// Favicon component pour usage dans le head
export function LogoFavicon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="faviconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8bc45" />
          <stop offset="100%" stopColor="#b8904f" />
        </linearGradient>
      </defs>
      
      {/* Fond circulaire */}
      <circle cx="16" cy="16" r="15" fill="url(#faviconGradient)" />
      
      {/* Lettre E stylisée */}
      <path
        d="M8 8h12v3H12v2h6v3h-6v2h8v3H8V8z"
        fill="white"
        opacity="0.95"
      />
      
      {/* Détails */}
      <rect x="9" y="10" width="2" height="1" fill="white" opacity="0.7" />
      <rect x="9" y="15" width="2" height="1" fill="white" opacity="0.7" />
      <rect x="9" y="20" width="2" height="1" fill="white" opacity="0.7" />
    </svg>
  );
}