import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  /**
   * Current progress value (0-100)
   * If undefined, shows indeterminate progress
   */
  value?: number;
  
  /**
   * Maximum value for progress calculation
   * @default 100
   */
  max?: number;
  
  /**
   * Size variant
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Color variant
   * @default 'primary'
   */
  variant?: 'primary' | 'success' | 'error' | 'warning' | 'info';
  
  /**
   * Whether to show percentage label
   * @default false
   */
  showLabel?: boolean;
  
  /**
   * Custom label text (overrides percentage)
   */
  label?: string;
  
  /**
   * Whether to animate the progress bar
   * @default true
   */
  animated?: boolean;
  
  /**
   * Whether to show striped pattern
   * @default false
   */
  striped?: boolean;
  
  /**
   * Additional CSS classes for container
   */
  className?: string;
  
  /**
   * Additional CSS classes for progress bar
   */
  barClassName?: string;
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const variantClasses = {
  primary: 'bg-primary-600',
  success: 'bg-green-600',
  error: 'bg-red-600',
  warning: 'bg-amber-600',
  info: 'bg-blue-600',
};

const variantBgClasses = {
  primary: 'bg-primary-100',
  success: 'bg-green-100',
  error: 'bg-red-100',
  warning: 'bg-amber-100',
  info: 'bg-blue-100',
};

/**
 * ProgressBar Component
 * 
 * A versatile progress bar component for showing upload progress,
 * loading states, and task completion.
 * 
 * @example
 * // Determinate progress
 * <ProgressBar value={75} showLabel />
 * 
 * @example
 * // Indeterminate progress
 * <ProgressBar />
 * 
 * @example
 * // File upload with custom label
 * <ProgressBar 
 *   value={uploadProgress} 
 *   variant="success"
 *   label={`${uploadedFiles}/${totalFiles} fichiers`}
 *   showLabel
 * />
 */
export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  label,
  animated = true,
  striped = false,
  className,
  barClassName,
}: ProgressBarProps) {
  // Calculate percentage
  const percentage = value !== undefined ? Math.min(Math.max((value / max) * 100, 0), 100) : undefined;
  const isIndeterminate = percentage === undefined;

  // Format label
  const displayLabel = label || (percentage !== undefined ? `${Math.round(percentage)}%` : 'Chargement...');

  return (
    <div className={cn('w-full', className)}>
      {/* Label */}
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-700">
            {displayLabel}
          </span>
          {!label && percentage !== undefined && (
            <span className="text-sm font-medium text-neutral-600">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar Container */}
      <div
        className={cn(
          'w-full rounded-full overflow-hidden',
          sizeClasses[size],
          variantBgClasses[variant]
        )}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={displayLabel}
      >
        {/* Progress Bar Fill */}
        <div
          className={cn(
            'h-full rounded-full',
            variantClasses[variant],
            animated && 'transition-all duration-300 ease-out',
            striped && 'bg-stripes',
            isIndeterminate && 'animate-indeterminate',
            barClassName
          )}
          style={{
            width: isIndeterminate ? '100%' : `${percentage}%`,
          }}
        >
          {striped && (
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * CircularProgress Component
 * 
 * Circular progress indicator for compact spaces.
 * 
 * @example
 * <CircularProgress value={75} size="lg" showLabel />
 */
export function CircularProgress({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  strokeWidth = 4,
  className,
}: {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: ProgressBarProps['variant'];
  showLabel?: boolean;
  strokeWidth?: number;
  className?: string;
}) {
  const percentage = value !== undefined ? Math.min(Math.max((value / max) * 100, 0), 100) : 0;
  const isIndeterminate = value === undefined;

  const sizeValues = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  };

  const circleSize = sizeValues[size];
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    primary: 'text-primary-600',
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-amber-600',
    info: 'text-blue-600',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={circleSize}
        height={circleSize}
        className={cn(
          isIndeterminate && 'animate-spin',
          colorClasses[variant]
        )}
      >
        {/* Background Circle */}
        <circle
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="opacity-20"
        />
        
        {/* Progress Circle */}
        <circle
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={isIndeterminate ? circumference * 0.75 : offset}
          strokeLinecap="round"
          className={cn(
            'transition-all duration-300 ease-out',
            !isIndeterminate && '-rotate-90 origin-center'
          )}
          style={{
            transform: !isIndeterminate ? 'rotate(-90deg)' : undefined,
            transformOrigin: !isIndeterminate ? '50% 50%' : undefined,
          }}
        />
      </svg>
      
      {/* Label */}
      {showLabel && !isIndeterminate && (
        <span className="absolute text-xs font-semibold text-neutral-700">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

/**
 * MultiStepProgress Component
 * 
 * Progress indicator for multi-step processes.
 * 
 * @example
 * <MultiStepProgress 
 *   steps={['Upload', 'Process', 'Complete']}
 *   currentStep={1}
 * />
 */
export function MultiStepProgress({
  steps,
  currentStep,
  variant = 'primary',
  className,
}: {
  steps: string[];
  currentStep: number;
  variant?: ProgressBarProps['variant'];
  className?: string;
}) {
  const colorClasses = {
    primary: {
      active: 'bg-primary-600 text-white',
      completed: 'bg-primary-600 text-white',
      pending: 'bg-neutral-200 text-neutral-500',
      line: 'bg-primary-600',
    },
    success: {
      active: 'bg-green-600 text-white',
      completed: 'bg-green-600 text-white',
      pending: 'bg-neutral-200 text-neutral-500',
      line: 'bg-green-600',
    },
    error: {
      active: 'bg-red-600 text-white',
      completed: 'bg-red-600 text-white',
      pending: 'bg-neutral-200 text-neutral-500',
      line: 'bg-red-600',
    },
    warning: {
      active: 'bg-amber-600 text-white',
      completed: 'bg-amber-600 text-white',
      pending: 'bg-neutral-200 text-neutral-500',
      line: 'bg-amber-600',
    },
    info: {
      active: 'bg-blue-600 text-white',
      completed: 'bg-blue-600 text-white',
      pending: 'bg-neutral-200 text-neutral-500',
      line: 'bg-blue-600',
    },
  };

  const colors = colorClasses[variant];

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div key={index} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                    isCompleted && colors.completed,
                    isActive && colors.active,
                    isPending && colors.pending
                  )}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                
                {/* Step Label */}
                <span
                  className={cn(
                    'mt-2 text-xs font-medium text-center',
                    (isCompleted || isActive) ? 'text-neutral-900' : 'text-neutral-500'
                  )}
                >
                  {step}
                </span>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 bg-neutral-200 relative">
                  <div
                    className={cn(
                      'absolute inset-0 transition-all duration-300',
                      colors.line
                    )}
                    style={{
                      width: isCompleted ? '100%' : '0%',
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * FileUploadProgress Component
 * 
 * Specialized progress bar for file uploads with file info.
 * 
 * @example
 * <FileUploadProgress 
 *   fileName="image.jpg"
 *   progress={65}
 *   fileSize="2.5 MB"
 * />
 */
export function FileUploadProgress({
  fileName,
  progress,
  fileSize,
  onCancel,
  variant = 'primary',
  className,
}: {
  fileName: string;
  progress: number;
  fileSize?: string;
  onCancel?: () => void;
  variant?: ProgressBarProps['variant'];
  className?: string;
}) {
  return (
    <div className={cn('bg-white rounded-lg border border-neutral-200 p-4', className)}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-900 truncate">
            {fileName}
          </p>
          {fileSize && (
            <p className="text-xs text-neutral-500 mt-0.5">
              {fileSize}
            </p>
          )}
        </div>
        
        {onCancel && progress < 100 && (
          <button
            onClick={onCancel}
            className="ml-2 text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Annuler le téléchargement"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      <ProgressBar
        value={progress}
        variant={progress === 100 ? 'success' : variant}
        size="sm"
        animated
      />
      
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-neutral-600">
          {progress === 100 ? 'Terminé' : `${Math.round(progress)}%`}
        </span>
        {progress === 100 && (
          <span className="text-xs text-green-600 font-medium">
            ✓ Téléchargé
          </span>
        )}
      </div>
    </div>
  );
}
