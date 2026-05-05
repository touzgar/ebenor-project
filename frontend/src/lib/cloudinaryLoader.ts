/**
 * Cloudinary Image Loader for Next.js
 * 
 * This loader automatically optimizes images served through Cloudinary CDN:
 * - Converts to WebP format with JPEG fallback
 * - Applies responsive sizing based on requested width
 * - Implements quality optimization
 * - Enables lazy loading
 */

export interface CloudinaryLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

/**
 * Custom image loader for Cloudinary CDN
 * Automatically applies format conversion (WebP with JPEG fallback) and quality optimization
 */
export default function cloudinaryLoader({ src, width, quality }: CloudinaryLoaderParams): string {
  // If the image is not from Cloudinary, return as-is
  if (!src.includes('res.cloudinary.com')) {
    return src;
  }

  // Extract the Cloudinary URL parts
  const cloudinaryRegex = /https?:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(.*)/;
  const match = src.match(cloudinaryRegex);

  if (!match) {
    return src;
  }

  const [, cloudName, assetPath] = match;

  // Build transformation parameters
  const transformations = [
    `w_${width}`, // Width
    `q_${quality || 'auto'}`, // Quality (auto for automatic optimization)
    'f_auto', // Format auto (WebP with JPEG fallback)
    'c_limit', // Limit to prevent upscaling
    'dpr_auto', // Device pixel ratio auto
  ];

  // Construct the optimized URL
  const optimizedUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${transformations.join(',')}/${assetPath}`;

  return optimizedUrl;
}

/**
 * Generate a blur data URL for image placeholders
 * Uses Cloudinary's blur transformation for smooth loading experience
 */
export function getBlurDataURL(src: string): string {
  // If the image is not from Cloudinary, return a default blur placeholder
  if (!src.includes('res.cloudinary.com')) {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
  }

  const cloudinaryRegex = /https?:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(.*)/;
  const match = src.match(cloudinaryRegex);

  if (!match) {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
  }

  const [, cloudName, assetPath] = match;

  // Create a tiny blurred version for placeholder
  const transformations = [
    'w_10', // Very small width
    'q_auto:low', // Low quality
    'f_auto', // Format auto
    'e_blur:1000', // Heavy blur
  ];

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations.join(',')}/${assetPath}`;
}

/**
 * Get responsive image sizes configuration
 * Used for srcset generation
 */
export function getResponsiveSizes(type: 'product' | 'gallery' | 'hero' | 'thumbnail'): string {
  switch (type) {
    case 'product':
      return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
    case 'gallery':
      return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw';
    case 'hero':
      return '100vw';
    case 'thumbnail':
      return '(max-width: 768px) 150px, 200px';
    default:
      return '100vw';
  }
}
