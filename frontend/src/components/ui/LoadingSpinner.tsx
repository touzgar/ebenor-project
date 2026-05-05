import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  /**
   * Size of the spinner
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Color variant of the spinner
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'white' | 'neutral';
  
  /**
   * Optional text to display below the spinner
   */
  text?: string;
  
  /**
   * Whether to center the spinner in its container
   * @default false
   */
  centered?: boolean;
  
  /**
   * Whether to display inline with text
   * @default false
   */
  inline?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Accessible label for screen readers
   * @default 'Chargement en cours'
   */
  ariaLabel?: string;
}

const sizeClasses = {
  xs: 'w-3 h-3 border',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-2',
  xl: 'w-12 h-12 border-[3px]',
};

const variantClasses = {
  primary: 'border-primary-200 border-t-primary-600',
  secondary: 'border-wood-200 border-t-wood-600',
  white: 'border-white/30 border-t-white',
  neutral: 'border-neutral-200 border-t-neutral-600',
};

const textSizeClasses = {
  xs: 'text-xs',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

/**
 * LoadingSpinner Component
 * 
 * A versatile loading spinner with multiple size and color variants.
 * Supports inline display, centered positioning, and optional loading text.
 * 
 * @example
 * // Basic spinner
 * <LoadingSpinner />
 * 
 * @example
 * // Large centered spinner with text
 * <LoadingSpinner size="lg" centered text="Chargement des données..." />
 * 
 * @example
 * // Inline spinner in a button
 * <button>
 *   <LoadingSpinner size="sm" inline variant="white" />
 *   Chargement...
 * </button>
 */
export function LoadingSpinner({
  size = 'md',
  variant = 'primary',
  text,
  centered = false,
  inline = false,
  className,
  ariaLabel = 'Chargement en cours',
}: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={cn(
        'animate-spin rounded-full',
        sizeClasses[size],
        variantClasses[variant],
        inline && 'inline-block',
        className
      )}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );

  if (text) {
    return (
      <div
        className={cn(
          'flex flex-col items-center gap-3',
          centered && 'justify-center',
          inline && 'flex-row gap-2'
        )}
      >
        {spinner}
        <p
          className={cn(
            'text-neutral-600 font-medium',
            textSizeClasses[size]
          )}
        >
          {text}
        </p>
      </div>
    );
  }

  if (centered) {
    return (
      <div className="flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}

/**
 * LoadingPage Component
 * 
 * Full-page loading spinner with optional text.
 * Centers the spinner vertically and horizontally on the page.
 * 
 * @example
 * <LoadingPage text="Chargement de la page..." />
 */
export function LoadingPage({ 
  text = 'Chargement...', 
  variant = 'primary' 
}: { 
  text?: string;
  variant?: LoadingSpinnerProps['variant'];
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <LoadingSpinner size="xl" variant={variant} text={text} centered />
    </div>
  );
}

/**
 * LoadingOverlay Component
 * 
 * Semi-transparent overlay with centered spinner.
 * Useful for blocking interactions during async operations.
 * 
 * @example
 * {isLoading && <LoadingOverlay text="Enregistrement..." />}
 */
export function LoadingOverlay({ 
  text,
  variant = 'white'
}: { 
  text?: string;
  variant?: LoadingSpinnerProps['variant'];
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8">
        <LoadingSpinner size="lg" variant={variant === 'white' ? 'primary' : variant} text={text} centered />
      </div>
    </div>
  );
}

/**
 * LoadingButton Component
 * 
 * Inline spinner specifically designed for buttons.
 * Automatically sized and colored for button contexts.
 * 
 * @example
 * <button disabled={isLoading}>
 *   {isLoading && <LoadingButton />}
 *   Enregistrer
 * </button>
 */
export function LoadingButton({ 
  variant = 'white',
  className 
}: { 
  variant?: LoadingSpinnerProps['variant'];
  className?: string;
}) {
  return (
    <LoadingSpinner 
      size="sm" 
      variant={variant} 
      inline 
      className={cn('mr-2', className)}
      ariaLabel="Traitement en cours"
    />
  );
}
