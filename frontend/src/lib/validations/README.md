# Product Form Validation

This directory contains the validation schemas and utilities for product forms using Zod and React Hook Form.

## Overview

The product validation system provides:
- ✅ Comprehensive Zod validation schema
- ✅ React Hook Form integration
- ✅ Auto-generation of slug and SEO fields
- ✅ Helper hooks for managing array fields (tags, materials, finishes, images)
- ✅ Type-safe form data with TypeScript

## Files

- `product.ts` - Main validation schema and helper functions
- `index.ts` - Barrel export for easy imports
- `__tests__/product.test.ts` - Comprehensive test suite

## Usage

### Basic Form Setup

```tsx
import { useProductForm } from '@/hooks/useProductForm';
import { ProductFormData } from '@/lib/validations/product';

function ProductForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useProductForm({
    defaultValues: {}, // Optional initial data
    onSubmit: async (data) => {
      // Handle form submission
      await saveProduct(data);
    },
    autoGenerateSlug: true, // Auto-generate slug from name
    autoGenerateSeo: true,  // Auto-generate SEO fields
  });

  return (
    <form onSubmit={handleSubmit}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        Save
      </button>
    </form>
  );
}
```

### Managing Array Fields

#### Tags

```tsx
import { useProductTags } from '@/hooks/useProductForm';

const form = useProductForm({ ... });
const { tags, addTag, removeTag, clearTags } = useProductTags(form);

// Add a tag
addTag('moderne');

// Remove a tag by index
removeTag(0);

// Clear all tags
clearTags();
```

#### Materials

```tsx
import { useProductMaterials } from '@/hooks/useProductForm';

const { materials, addMaterial, removeMaterial } = useProductMaterials(form);

addMaterial('Bois de chêne');
removeMaterial(0);
```

#### Finishes

```tsx
import { useProductFinishes } from '@/hooks/useProductForm';

const { finishes, addFinish, removeFinish } = useProductFinishes(form);

addFinish('Vernis mat');
removeFinish(0);
```

#### Images

```tsx
import { useProductImages } from '@/hooks/useProductForm';

const { images, addImage, removeImage, setPrimaryImage, reorderImages } = useProductImages(form);

// Add an image
addImage({
  url: 'https://example.com/image.jpg',
  alt: 'Product image',
  isPrimary: false,
});

// Set primary image
setPrimaryImage(0);

// Reorder images
reorderImages(0, 2); // Move image from index 0 to index 2
```

### Manual Field Generation

```tsx
const { generateSlugFromName, generateSeoFromContent } = useProductForm({ ... });

// Manually generate slug from current name value
generateSlugFromName();

// Manually generate SEO fields from current content
generateSeoFromContent();
```

### Helper Functions

```tsx
import {
  generateSlug,
  generateSeoTitle,
  generateSeoDescription,
  prepareProductFormData,
} from '@/lib/validations/product';

// Generate URL-friendly slug
const slug = generateSlug('Table en Bois Massif');
// Result: 'table-en-bois-massif'

// Generate SEO title
const seoTitle = generateSeoTitle('Table en Bois', 'mobilier');
// Result: 'Table en Bois - Mobilier'

// Generate SEO description
const seoDesc = generateSeoDescription('Belle table en bois', 'mobilier');
// Result: 'Belle table en bois | ÉBENOR CRÉATION'

// Prepare form data with auto-generated fields
const prepared = prepareProductFormData({
  name: 'Table en Bois',
  // ... other fields
});
// Auto-generates: slug, seoTitle, seoDescription, marks first image as primary
```

## Validation Rules

### Required Fields
- `name` (max 200 chars)
- `slug` (lowercase, alphanumeric + hyphens only)
- `category` (enum: cuisine, dressing, mobilier, amenagement, autre)
- `shortDescription` (max 300 chars)
- `description` (max 5000 chars)
- `availability` (enum: in_stock, made_to_order, out_of_stock)

### Optional Fields
- `subcategory` (max 100 chars)
- `specifications` (object with string key-value pairs)
- `dimensions` (length, width, height as positive numbers, unit: cm or m)
- `materials` (array of strings, max 100 chars each)
- `finishes` (array of strings, max 100 chars each)
- `price` (amount as positive number, currency, optional unit)
- `featured` (boolean, default: false)
- `seoTitle` (max 60 chars)
- `seoDescription` (max 160 chars)
- `tags` (array of strings, max 50 chars each)
- `images` (array of image objects)

### Default Values
- `availability`: 'made_to_order'
- `featured`: false
- `images`: []
- `tags`: []
- `materials`: []
- `finishes`: []
- `specifications`: {}

## Constants

```tsx
import {
  PRODUCT_CATEGORIES,
  PRODUCT_AVAILABILITY,
  DIMENSION_UNITS,
  CURRENCIES,
} from '@/lib/validations/product';

// PRODUCT_CATEGORIES: ['cuisine', 'dressing', 'mobilier', 'amenagement', 'autre']
// PRODUCT_AVAILABILITY: ['in_stock', 'made_to_order', 'out_of_stock']
// DIMENSION_UNITS: ['cm', 'm']
// CURRENCIES: ['TND', 'EUR', 'USD']
```

## Type Safety

All form data is fully typed with TypeScript:

```tsx
import type { ProductFormData } from '@/lib/validations/product';

const data: ProductFormData = {
  name: 'Table',
  slug: 'table',
  category: 'mobilier',
  shortDescription: 'Belle table',
  description: 'Description complète',
  availability: 'made_to_order',
  featured: false,
  images: [],
  tags: [],
  materials: [],
  finishes: [],
  specifications: {},
};
```

## Testing

Run the test suite:

```bash
npm test -- product.test.ts
```

All validation rules are covered by 37 comprehensive tests.

## Example Component

See `frontend/src/components/admin/ProductForm.example.tsx` for a complete reference implementation.

## Requirements Mapping

This implementation satisfies requirements 8.5-8.12:
- ✅ 8.5: Form validation with Zod
- ✅ 8.6: React Hook Form integration
- ✅ 8.7: Auto-generation of slug
- ✅ 8.8: Auto-generation of SEO fields
- ✅ 8.9: Category and availability validation
- ✅ 8.10: Dimension and price validation
- ✅ 8.11: Array field management (materials, finishes, tags)
- ✅ 8.12: Image management with primary selection
