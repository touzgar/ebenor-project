import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import {
  productFormSchema,
  ProductFormData,
  generateSlug,
  generateSeoTitle,
  generateSeoDescription,
  prepareProductFormData,
} from '@/lib/validations/product';

/**
 * Options for useProductForm hook
 */
export interface UseProductFormOptions {
  defaultValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void | Promise<void>;
  autoGenerateSlug?: boolean;
  autoGenerateSeo?: boolean;
}

/**
 * Return type for useProductForm hook
 */
export interface UseProductFormReturn extends UseFormReturn<ProductFormData> {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  generateSlugFromName: () => void;
  generateSeoFromContent: () => void;
}

/**
 * Custom hook for managing product form state with React Hook Form
 * 
 * Features:
 * - Zod validation schema integration
 * - Auto-generation of slug from name
 * - Auto-generation of SEO fields
 * - Form state management
 * - Error handling
 * 
 * @param options - Configuration options for the form
 * @returns Form methods and utilities
 * 
 * @example
 * ```tsx
 * const { register, handleSubmit, formState: { errors } } = useProductForm({
 *   defaultValues: existingProduct,
 *   onSubmit: async (data) => {
 *     await saveProduct(data);
 *   },
 *   autoGenerateSlug: true,
 *   autoGenerateSeo: true,
 * });
 * ```
 */
export function useProductForm({
  defaultValues,
  onSubmit,
  autoGenerateSlug = true,
  autoGenerateSeo = true,
}: UseProductFormOptions): UseProductFormReturn {
  // Initialize form with Zod resolver
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      category: 'mobilier',
      shortDescription: '',
      description: '',
      images: [],
      specifications: {},
      materials: [],
      finishes: [],
      availability: 'made_to_order',
      featured: false,
      tags: [],
      ...defaultValues,
    },
    mode: 'onBlur', // Validate on blur for better UX
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  // Watch name field for auto-slug generation
  const nameValue = watch('name');
  const slugValue = watch('slug');
  const shortDescriptionValue = watch('shortDescription');
  const categoryValue = watch('category');
  const seoTitleValue = watch('seoTitle');
  const seoDescriptionValue = watch('seoDescription');

  /**
   * Auto-generate slug when name changes
   */
  useEffect(() => {
    if (autoGenerateSlug && nameValue && !slugValue) {
      const newSlug = generateSlug(nameValue);
      setValue('slug', newSlug, { shouldValidate: true });
    }
  }, [nameValue, slugValue, autoGenerateSlug, setValue]);

  /**
   * Auto-generate SEO fields when content changes
   */
  useEffect(() => {
    if (autoGenerateSeo) {
      // Auto-generate SEO title if empty
      if (nameValue && !seoTitleValue) {
        const newSeoTitle = generateSeoTitle(nameValue, categoryValue);
        setValue('seoTitle', newSeoTitle, { shouldValidate: true });
      }

      // Auto-generate SEO description if empty
      if (shortDescriptionValue && !seoDescriptionValue) {
        const newSeoDescription = generateSeoDescription(
          shortDescriptionValue,
          categoryValue
        );
        setValue('seoDescription', newSeoDescription, { shouldValidate: true });
      }
    }
  }, [
    nameValue,
    shortDescriptionValue,
    categoryValue,
    seoTitleValue,
    seoDescriptionValue,
    autoGenerateSeo,
    setValue,
  ]);

  /**
   * Manually trigger slug generation from current name
   */
  const generateSlugFromName = () => {
    const name = watch('name');
    if (name) {
      const newSlug = generateSlug(name);
      setValue('slug', newSlug, { shouldValidate: true });
    }
  };

  /**
   * Manually trigger SEO field generation from current content
   */
  const generateSeoFromContent = () => {
    const name = watch('name');
    const shortDescription = watch('shortDescription');
    const category = watch('category');

    if (name) {
      const newSeoTitle = generateSeoTitle(name, category);
      setValue('seoTitle', newSeoTitle, { shouldValidate: true });
    }

    if (shortDescription) {
      const newSeoDescription = generateSeoDescription(
        shortDescription,
        category
      );
      setValue('seoDescription', newSeoDescription, { shouldValidate: true });
    }
  };

  /**
   * Handle form submission with data preparation
   */
  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      // Prepare data with auto-generated fields
      const preparedData = prepareProductFormData(data);
      
      // Call the provided onSubmit handler
      await onSubmit(preparedData);
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  });

  return {
    ...form,
    onSubmit: handleFormSubmit,
    isSubmitting,
    generateSlugFromName,
    generateSeoFromContent,
  };
}

/**
 * Helper hook for managing product image array in the form
 */
export function useProductImages(
  form: UseFormReturn<ProductFormData>
) {
  const { watch, setValue } = form;
  const images = watch('images') || [];

  const addImage = (image: ProductFormData['images'][0]) => {
    const currentImages = watch('images') || [];
    const newImages = [...currentImages, image];
    
    // If this is the first image, make it primary
    if (newImages.length === 1) {
      newImages[0].isPrimary = true;
    }
    
    setValue('images', newImages, { shouldValidate: true });
  };

  const removeImage = (index: number) => {
    const currentImages = watch('images') || [];
    const wasPrimary = currentImages[index]?.isPrimary;
    const newImages = currentImages.filter((_, i) => i !== index);
    
    // If we removed the primary image, make the first one primary
    if (wasPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    
    setValue('images', newImages, { shouldValidate: true });
  };

  const setPrimaryImage = (index: number) => {
    const currentImages = watch('images') || [];
    const newImages = currentImages.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    setValue('images', newImages, { shouldValidate: true });
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const currentImages = watch('images') || [];
    const newImages = [...currentImages];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    setValue('images', newImages, { shouldValidate: true });
  };

  return {
    images,
    addImage,
    removeImage,
    setPrimaryImage,
    reorderImages,
  };
}

/**
 * Helper hook for managing product tags array in the form
 */
export function useProductTags(form: UseFormReturn<ProductFormData>) {
  const { watch, setValue } = form;
  const tags = watch('tags') || [];

  const addTag = (tag: string) => {
    const currentTags = watch('tags') || [];
    const normalizedTag = tag.toLowerCase().trim();
    
    // Avoid duplicates
    if (!currentTags.includes(normalizedTag)) {
      setValue('tags', [...currentTags, normalizedTag], { shouldValidate: true });
    }
  };

  const removeTag = (index: number) => {
    const currentTags = watch('tags') || [];
    const newTags = currentTags.filter((_, i) => i !== index);
    setValue('tags', newTags, { shouldValidate: true });
  };

  const clearTags = () => {
    setValue('tags', [], { shouldValidate: true });
  };

  return {
    tags,
    addTag,
    removeTag,
    clearTags,
  };
}

/**
 * Helper hook for managing product materials array in the form
 */
export function useProductMaterials(form: UseFormReturn<ProductFormData>) {
  const { watch, setValue } = form;
  const materials = watch('materials') || [];

  const addMaterial = (material: string) => {
    const currentMaterials = watch('materials') || [];
    const trimmedMaterial = material.trim();
    
    if (trimmedMaterial && !currentMaterials.includes(trimmedMaterial)) {
      setValue('materials', [...currentMaterials, trimmedMaterial], {
        shouldValidate: true,
      });
    }
  };

  const removeMaterial = (index: number) => {
    const currentMaterials = watch('materials') || [];
    const newMaterials = currentMaterials.filter((_, i) => i !== index);
    setValue('materials', newMaterials, { shouldValidate: true });
  };

  return {
    materials,
    addMaterial,
    removeMaterial,
  };
}

/**
 * Helper hook for managing product finishes array in the form
 */
export function useProductFinishes(form: UseFormReturn<ProductFormData>) {
  const { watch, setValue } = form;
  const finishes = watch('finishes') || [];

  const addFinish = (finish: string) => {
    const currentFinishes = watch('finishes') || [];
    const trimmedFinish = finish.trim();
    
    if (trimmedFinish && !currentFinishes.includes(trimmedFinish)) {
      setValue('finishes', [...currentFinishes, trimmedFinish], {
        shouldValidate: true,
      });
    }
  };

  const removeFinish = (index: number) => {
    const currentFinishes = watch('finishes') || [];
    const newFinishes = currentFinishes.filter((_, i) => i !== index);
    setValue('finishes', newFinishes, { shouldValidate: true });
  };

  return {
    finishes,
    addFinish,
    removeFinish,
  };
}
