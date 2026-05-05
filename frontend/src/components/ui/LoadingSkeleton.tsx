import { cn } from '@/lib/utils';

export interface LoadingSkeletonProps {
  /**
   * Width of the skeleton
   * Can be a Tailwind class or 'full'
   * @default 'full'
   */
  width?: string;
  
  /**
   * Height of the skeleton
   * Can be a Tailwind class
   * @default 'h-4'
   */
  height?: string;
  
  /**
   * Border radius variant
   * @default 'md'
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /**
   * Animation style
   * @default 'pulse'
   */
  animation?: 'pulse' | 'shimmer' | 'none';
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

const animationClasses = {
  pulse: 'animate-pulse',
  shimmer: 'animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]',
  none: '',
};

/**
 * LoadingSkeleton Component
 * 
 * Base skeleton loader component for creating loading placeholders.
 * 
 * @example
 * <LoadingSkeleton width="w-32" height="h-4" />
 */
export function LoadingSkeleton({
  width = 'w-full',
  height = 'h-4',
  rounded = 'md',
  animation = 'pulse',
  className,
}: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        'bg-neutral-200',
        width,
        height,
        roundedClasses[rounded],
        animation !== 'shimmer' && animationClasses[animation],
        animation === 'shimmer' && 'relative overflow-hidden',
        className
      )}
      role="status"
      aria-label="Chargement en cours"
    >
      {animation === 'shimmer' && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      )}
      <span className="sr-only">Chargement en cours</span>
    </div>
  );
}

/**
 * SkeletonText Component
 * 
 * Skeleton for text content with multiple lines.
 * 
 * @example
 * <SkeletonText lines={3} />
 */
export function SkeletonText({
  lines = 1,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <LoadingSkeleton
          key={i}
          width={i === lines - 1 ? 'w-3/4' : 'w-full'}
          height="h-4"
        />
      ))}
    </div>
  );
}

/**
 * SkeletonCard Component
 * 
 * Skeleton for card-based content (products, gallery items).
 * 
 * @example
 * <SkeletonCard />
 */
export function SkeletonCard({
  hasImage = true,
  hasTitle = true,
  hasDescription = true,
  hasActions = false,
  className,
}: {
  hasImage?: boolean;
  hasTitle?: boolean;
  hasDescription?: boolean;
  hasActions?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('bg-white rounded-xl shadow-md overflow-hidden', className)}>
      {hasImage && (
        <LoadingSkeleton
          width="w-full"
          height="h-48"
          rounded="none"
          className="rounded-t-xl"
        />
      )}
      <div className="p-6 space-y-4">
        {hasTitle && (
          <LoadingSkeleton width="w-3/4" height="h-6" />
        )}
        {hasDescription && (
          <SkeletonText lines={3} />
        )}
        {hasActions && (
          <div className="flex gap-2 pt-2">
            <LoadingSkeleton width="w-24" height="h-10" rounded="lg" />
            <LoadingSkeleton width="w-24" height="h-10" rounded="lg" />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * SkeletonProductCard Component
 * 
 * Skeleton specifically for product cards.
 * 
 * @example
 * <SkeletonProductCard />
 */
export function SkeletonProductCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-xl shadow-elegant overflow-hidden', className)}>
      {/* Product Image */}
      <LoadingSkeleton
        width="w-full"
        height="h-64"
        rounded="none"
        className="rounded-t-xl"
      />
      
      {/* Product Info */}
      <div className="p-6 space-y-4">
        {/* Category */}
        <LoadingSkeleton width="w-24" height="h-4" rounded="full" />
        
        {/* Title */}
        <LoadingSkeleton width="w-full" height="h-6" />
        
        {/* Description */}
        <SkeletonText lines={2} />
        
        {/* Price and Button */}
        <div className="flex items-center justify-between pt-2">
          <LoadingSkeleton width="w-20" height="h-8" />
          <LoadingSkeleton width="w-32" height="h-10" rounded="lg" />
        </div>
      </div>
    </div>
  );
}

/**
 * SkeletonGalleryCard Component
 * 
 * Skeleton for gallery image cards.
 * 
 * @example
 * <SkeletonGalleryCard />
 */
export function SkeletonGalleryCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-xl shadow-md overflow-hidden', className)}>
      {/* Gallery Image */}
      <LoadingSkeleton
        width="w-full"
        height="h-72"
        rounded="none"
        className="rounded-t-xl"
      />
      
      {/* Image Info */}
      <div className="p-4 space-y-2">
        <LoadingSkeleton width="w-3/4" height="h-5" />
        <LoadingSkeleton width="w-1/2" height="h-4" />
      </div>
    </div>
  );
}

/**
 * SkeletonTable Component
 * 
 * Skeleton for table/list views in admin panels.
 * 
 * @example
 * <SkeletonTable rows={5} columns={4} />
 */
export function SkeletonTable({
  rows = 5,
  columns = 4,
  hasActions = true,
  className,
}: {
  rows?: number;
  columns?: number;
  hasActions?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('bg-white rounded-xl shadow-md overflow-hidden', className)}>
      {/* Table Header */}
      <div className="border-b border-neutral-200 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr) ${hasActions ? 'auto' : ''}` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <LoadingSkeleton key={i} width="w-24" height="h-4" />
          ))}
          {hasActions && <LoadingSkeleton width="w-20" height="h-4" />}
        </div>
      </div>
      
      {/* Table Rows */}
      <div className="divide-y divide-neutral-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr) ${hasActions ? 'auto' : ''}` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <LoadingSkeleton key={colIndex} width="w-full" height="h-4" />
              ))}
              {hasActions && (
                <div className="flex gap-2">
                  <LoadingSkeleton width="w-8" height="h-8" rounded="md" />
                  <LoadingSkeleton width="w-8" height="h-8" rounded="md" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * SkeletonForm Component
 * 
 * Skeleton for form layouts.
 * 
 * @example
 * <SkeletonForm fields={5} />
 */
export function SkeletonForm({
  fields = 3,
  hasSubmitButton = true,
  className,
}: {
  fields?: number;
  hasSubmitButton?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('space-y-6', className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          {/* Label */}
          <LoadingSkeleton width="w-32" height="h-4" />
          {/* Input */}
          <LoadingSkeleton width="w-full" height="h-12" rounded="lg" />
        </div>
      ))}
      
      {hasSubmitButton && (
        <div className="pt-4">
          <LoadingSkeleton width="w-full" height="h-12" rounded="lg" />
        </div>
      )}
    </div>
  );
}

/**
 * SkeletonAvatar Component
 * 
 * Skeleton for circular avatars or profile images.
 * 
 * @example
 * <SkeletonAvatar size="lg" />
 */
export function SkeletonAvatar({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <LoadingSkeleton
      width={sizeClasses[size]}
      height={sizeClasses[size]}
      rounded="full"
      className={className}
    />
  );
}

/**
 * SkeletonImage Component
 * 
 * Skeleton for image placeholders.
 * 
 * @example
 * <SkeletonImage aspectRatio="video" />
 */
export function SkeletonImage({
  aspectRatio = 'square',
  className,
}: {
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape';
  className?: string;
}) {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
  };

  return (
    <LoadingSkeleton
      width="w-full"
      height={aspectClasses[aspectRatio]}
      rounded="lg"
      className={className}
    />
  );
}

/**
 * SkeletonGrid Component
 * 
 * Grid of skeleton cards for list views.
 * 
 * @example
 * <SkeletonGrid count={6} type="product" />
 */
export function SkeletonGrid({
  count = 6,
  type = 'card',
  columns = 3,
  className,
}: {
  count?: number;
  type?: 'card' | 'product' | 'gallery';
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const SkeletonComponent = {
    card: SkeletonCard,
    product: SkeletonProductCard,
    gallery: SkeletonGalleryCard,
  }[type];

  const columnClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-6', columnClasses[columns], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
}
