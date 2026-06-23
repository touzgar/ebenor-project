'use client';

import { motion } from 'framer-motion';

interface ModernLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'creative';
}

export function ModernLoader({ 
  message = 'Chargement...', 
  size = 'md',
  variant = 'creative'
}: ModernLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  if (variant === 'creative') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-amber-50/30 to-neutral-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          {/* Animated Logo/Icon */}
          <div className="relative mb-8">
            {/* Outer rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className={`${sizeClasses[size]} mx-auto`}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient1)"
                  strokeWidth="4"
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
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-lg" />
            </motion.div>

            {/* Decorative particles */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [-10, 10, -10],
                  x: [0, i % 2 === 0 ? 5 : -5, 0],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                className="absolute w-2 h-2 bg-amber-400 rounded-full"
                style={{
                  top: `${20 + i * 20}%`,
                  left: i % 2 === 0 ? '-10px' : 'calc(100% + 10px)',
                }}
              />
            ))}
          </div>

          {/* Animated text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-lg font-medium text-neutral-700 mb-2">
              {message}
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
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
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
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mt-8 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full max-w-xs mx-auto"
          />
        </motion.div>
      </div>
    );
  }

  // Default variant - simpler loader
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <div className={`${sizeClasses[size]} border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4`} />
        <p className="text-neutral-600">{message}</p>
      </div>
    </div>
  );
}
