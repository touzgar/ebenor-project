/**
 * Validation schemas and utilities
 * 
 * This module exports all validation schemas and helper functions
 * for form validation throughout the application.
 */

// Product validation
export {
  productFormSchema,
  productUpdateSchema,
  productDimensionsSchema,
  productPriceSchema,
  productImageSchema,
  generateSlug,
  generateSeoTitle,
  generateSeoDescription,
  prepareProductFormData,
  validateSlugUniqueness,
  productFormToApiPayload,
  PRODUCT_CATEGORIES,
  PRODUCT_AVAILABILITY,
  DIMENSION_UNITS,
  CURRENCIES,
  type ProductFormData,
  type ProductUpdateData,
} from './product';

// Re-export existing validations from the main validations file
export {
  contactFormSchema,
  loginSchema,
  galleryImageSchema,
  homeContentSchema,
  validateFile,
  validateEmail,
  validatePhone,
  sanitizeInput,
  type ContactFormData,
  type LoginFormData,
  type GalleryImageFormData,
  type HomeContentFormData,
} from '../validations';
