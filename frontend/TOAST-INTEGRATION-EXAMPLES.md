# Toast Integration Examples

This document shows how to integrate the toast notification system into existing components.

## Example 1: Admin Login Page

**File**: `frontend/src/app/admin/login/page.tsx`

### Before (using console.log or alerts)
```tsx
const handleSubmit = async (data: LoginFormData) => {
  try {
    const result = await login(data.email, data.password);
    if (!result.success) {
      console.error('Login failed:', result.error);
      // or alert(result.error);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

### After (using toast)
```tsx
'use client';

import { useToast } from '@/contexts/ToastContext';

export default function LoginPage() {
  const toast = useToast();
  const { login } = useAuth();

  const handleSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data.email, data.password);
      if (!result.success) {
        toast.error(result.error || 'Login failed. Please try again.');
      } else {
        toast.success('Login successful! Redirecting...');
      }
    } catch (error) {
      toast.error('An error occurred. Please check your connection.');
    }
  };

  return (
    // ... form JSX
  );
}
```

## Example 2: Product Creation/Edit

**File**: `frontend/src/app/admin/products/new/page.tsx`

### Integration
```tsx
'use client';

import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async (data: ProductFormData) => {
    // Validation
    if (!data.name) {
      toast.error('Product name is required.');
      return;
    }

    if (!data.category) {
      toast.error('Please select a category.');
      return;
    }

    if (data.images.length === 0) {
      toast.warning('Consider adding at least one image.');
    }

    // Save product
    const savingId = toast.info('Saving product...');
    
    try {
      await productService.create(data);
      toast.dismiss(savingId);
      toast.success('Product created successfully!');
      router.push('/admin/products');
    } catch (error) {
      toast.dismiss(savingId);
      toast.error('Failed to create product. Please try again.');
    }
  };

  return (
    // ... form JSX
  );
}
```

## Example 3: Image Upload

**File**: `frontend/src/app/admin/gallery/upload/page.tsx`

### Integration
```tsx
'use client';

import { useToast } from '@/contexts/ToastContext';

export default function GalleryUploadPage() {
  const toast = useToast();

  const handleFileSelect = (files: FileList) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    Array.from(files).forEach(file => {
      // Validate file size
      if (file.size > maxSize) {
        toast.error(`${file.name}: File size exceeds 5MB limit.`);
        return;
      }

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name}: Only JPEG, PNG, and WebP images are allowed.`);
        return;
      }

      // Upload file
      uploadFile(file);
    });
  };

  const uploadFile = async (file: File) => {
    const uploadId = toast.info(`Uploading ${file.name}...`);

    try {
      await galleryService.upload(file);
      toast.dismiss(uploadId);
      toast.success(`${file.name} uploaded successfully!`);
    } catch (error) {
      toast.dismiss(uploadId);
      toast.error(`Failed to upload ${file.name}. Please try again.`);
    }
  };

  return (
    // ... upload form JSX
  );
}
```

## Example 4: Delete Confirmation

**File**: `frontend/src/app/admin/products/[id]/page.tsx`

### Integration
```tsx
'use client';

import { useToast } from '@/contexts/ToastContext';
import { useState } from 'react';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const toast = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    toast.warning('This action cannot be undone. Are you sure?');
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    const deletingId = toast.info('Deleting product...');

    try {
      await productService.delete(params.id);
      toast.dismiss(deletingId);
      toast.success('Product deleted successfully!');
      router.push('/admin/products');
    } catch (error) {
      toast.dismiss(deletingId);
      toast.error('Failed to delete product. Please try again.');
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    // ... product detail JSX
  );
}
```

## Example 5: Bulk Operations

**File**: `frontend/src/components/admin/ProductBulkActions.tsx`

### Integration
```tsx
'use client';

import { useToast } from '@/contexts/ToastContext';

export function ProductBulkActions({ selectedIds }: { selectedIds: string[] }) {
  const toast = useToast();

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.warning('Please select at least one product.');
      return;
    }

    toast.warning(`You are about to delete ${selectedIds.length} product(s). This cannot be undone.`);

    // After confirmation...
    const deletingId = toast.info(`Deleting ${selectedIds.length} product(s)...`);

    try {
      await productService.bulkDelete(selectedIds);
      toast.dismiss(deletingId);
      toast.success(`${selectedIds.length} product(s) deleted successfully!`);
    } catch (error) {
      toast.dismiss(deletingId);
      toast.error('Failed to delete products. Please try again.');
    }
  };

  const handleBulkPublish = async () => {
    if (selectedIds.length === 0) {
      toast.warning('Please select at least one product.');
      return;
    }

    const publishingId = toast.info(`Publishing ${selectedIds.length} product(s)...`);

    try {
      await productService.bulkPublish(selectedIds);
      toast.dismiss(publishingId);
      toast.success(`${selectedIds.length} product(s) published successfully!`);
    } catch (error) {
      toast.dismiss(publishingId);
      toast.error('Failed to publish products. Please try again.');
    }
  };

  return (
    // ... bulk actions JSX
  );
}
```

## Example 6: Form Validation

**File**: Any form component

### Integration
```tsx
'use client';

import { useToast } from '@/contexts/ToastContext';
import { useForm } from 'react-hook-form';

export function ProductForm() {
  const toast = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Show toast for validation errors
  useEffect(() => {
    if (errors.name) {
      toast.error('Product name is required.');
    }
    if (errors.price) {
      toast.error('Price must be a positive number.');
    }
    if (errors.category) {
      toast.error('Please select a category.');
    }
  }, [errors, toast]);

  const onSubmit = async (data: FormData) => {
    try {
      await saveProduct(data);
      toast.success('Product saved successfully!');
    } catch (error) {
      toast.error('Failed to save product. Please try again.');
    }
  };

  return (
    // ... form JSX
  );
}
```

## Example 7: Network Error Handling

**File**: `frontend/src/lib/api.ts` (API client)

### Integration
```tsx
import { toast } from '@/components/ui/Toast';

export const apiClient = {
  async request(url: string, options?: RequestInit) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please login again.');
          // Redirect to login
        } else if (response.status === 403) {
          toast.error('You do not have permission to perform this action.');
        } else if (response.status === 404) {
          toast.error('Resource not found.');
        } else if (response.status >= 500) {
          toast.error('Server error. Please try again later.');
        } else {
          toast.error('An error occurred. Please try again.');
        }
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        toast.error('Network error. Please check your connection.');
      }
      throw error;
    }
  }
};
```

## Example 8: Auto-save with Toast

**File**: Any editor component

### Integration
```tsx
'use client';

import { useToast } from '@/contexts/ToastContext';
import { useEffect, useState } from 'react';
import { debounce } from '@/lib/utils';

export function ContentEditor() {
  const toast = useToast();
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save with debounce
  const autoSave = debounce(async (value: string) => {
    setIsSaving(true);
    
    try {
      await saveContent(value);
      toast.success('Changes saved automatically.', { duration: 2000 });
    } catch (error) {
      toast.error('Failed to auto-save. Please save manually.');
    } finally {
      setIsSaving(false);
    }
  }, 2000);

  useEffect(() => {
    if (content) {
      autoSave(content);
    }
  }, [content]);

  return (
    // ... editor JSX
  );
}
```

## Example 9: Copy to Clipboard

**File**: Any component with copy functionality

### Integration
```tsx
'use client';

import { useToast } from '@/contexts/ToastContext';
import { copyToClipboard } from '@/lib/utils';

export function ShareButton({ url }: { url: string }) {
  const toast = useToast();

  const handleCopy = async () => {
    const success = await copyToClipboard(url);
    
    if (success) {
      toast.success('Link copied to clipboard!');
    } else {
      toast.error('Failed to copy link. Please try again.');
    }
  };

  return (
    <button onClick={handleCopy}>
      Copy Link
    </button>
  );
}
```

## Example 10: Multi-step Process

**File**: Any component with multi-step operations

### Integration
```tsx
'use client';

import { useToast } from '@/contexts/ToastContext';

export function ProductImporter() {
  const toast = useToast();

  const handleImport = async (file: File) => {
    // Step 1: Validate file
    toast.info('Validating file...');
    const validation = await validateFile(file);
    
    if (!validation.valid) {
      toast.error(`Validation failed: ${validation.error}`);
      return;
    }
    
    toast.success('File validated successfully!');

    // Step 2: Parse data
    const parsingId = toast.info('Parsing data...');
    const data = await parseFile(file);
    toast.dismiss(parsingId);
    toast.success(`Found ${data.length} products.`);

    // Step 3: Import products
    const importingId = toast.info(`Importing ${data.length} products...`);
    
    try {
      const result = await importProducts(data);
      toast.dismiss(importingId);
      toast.success(`Successfully imported ${result.success} products!`);
      
      if (result.failed > 0) {
        toast.warning(`${result.failed} products failed to import.`);
      }
    } catch (error) {
      toast.dismiss(importingId);
      toast.error('Import failed. Please try again.');
    }
  };

  return (
    // ... import form JSX
  );
}
```

## Best Practices

### 1. Use Appropriate Toast Types
- **Success**: Completed actions (save, delete, update)
- **Error**: Failed operations, validation errors
- **Warning**: Important notices, confirmations
- **Info**: Loading states, helpful tips

### 2. Keep Messages Clear and Concise
```tsx
// Good
toast.success('Product saved!');
toast.error('Failed to upload image. File size exceeds 5MB.');

// Avoid
toast.success('The product has been successfully saved to the database.');
toast.error('Error');
```

### 3. Use Loading States
```tsx
const loadingId = toast.info('Processing...');
try {
  await operation();
  toast.dismiss(loadingId);
  toast.success('Done!');
} catch (error) {
  toast.dismiss(loadingId);
  toast.error('Failed!');
}
```

### 4. Provide Context in Error Messages
```tsx
// Good
toast.error('Failed to save product. Please check your connection.');

// Avoid
toast.error('Error occurred.');
```

### 5. Don't Overuse Toasts
```tsx
// Avoid showing toast for every minor action
// Only show for important user feedback
```

### 6. Handle Network Errors Gracefully
```tsx
try {
  await apiCall();
} catch (error) {
  if (error.message === 'Network error') {
    toast.error('Please check your internet connection.');
  } else {
    toast.error('An error occurred. Please try again.');
  }
}
```

## Testing Your Integration

After integrating toasts into a component:

1. Test success scenarios
2. Test error scenarios
3. Test validation errors
4. Test network errors
5. Test loading states
6. Verify auto-dismiss timing
7. Verify manual dismiss works
8. Test on mobile devices
9. Test with keyboard navigation
10. Test with screen readers

## Common Patterns

### Pattern 1: Try-Catch with Toast
```tsx
try {
  await operation();
  toast.success('Success!');
} catch (error) {
  toast.error('Failed!');
}
```

### Pattern 2: Loading with Dismiss
```tsx
const id = toast.info('Loading...');
await operation();
toast.dismiss(id);
toast.success('Done!');
```

### Pattern 3: Validation Before Action
```tsx
if (!isValid) {
  toast.error('Validation failed.');
  return;
}
await operation();
toast.success('Success!');
```

### Pattern 4: Confirmation Before Destructive Action
```tsx
toast.warning('This cannot be undone. Are you sure?');
// Show modal or get confirmation
await deleteOperation();
toast.success('Deleted!');
```

---

These examples should help you integrate the toast notification system throughout the application. Remember to always use the `useToast` hook in client components and provide clear, helpful messages to users.
