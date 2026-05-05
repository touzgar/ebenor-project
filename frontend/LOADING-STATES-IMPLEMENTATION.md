# Loading States and Indicators Implementation

## Overview

This document describes the implementation of loading states and indicators across the ÉBENOR CRÉATION platform. The system provides comprehensive loading feedback for all asynchronous operations including data fetching, form submissions, and file uploads.

**Task**: Task 45 - Implement loading states and indicators  
**Requirement**: 24.5 - WHEN a network request is in progress, THE system SHALL display a loading indicator  
**Status**: ✅ Complete

---

## Components

### 1. LoadingSpinner Component

**Location**: `frontend/src/components/ui/LoadingSpinner.tsx`

A versatile loading spinner with multiple size and color variants.

#### Features
- **Size variants**: xs, sm, md, lg, xl
- **Color variants**: primary, secondary, white, neutral
- **Display modes**: inline, centered, with text
- **Accessibility**: ARIA labels and screen reader support

#### Usage Examples

```tsx
// Basic spinner
<LoadingSpinner />

// Large centered spinner with text
<LoadingSpinner size="lg" centered text="Chargement des données..." />

// Inline spinner in a button
<button disabled={isLoading}>
  {isLoading && <LoadingButton variant="white" />}
  Enregistrer
</button>
```

#### Exported Components

- **LoadingSpinner**: Base spinner component
- **LoadingPage**: Full-page loading spinner
- **LoadingOverlay**: Semi-transparent overlay with spinner
- **LoadingButton**: Inline spinner for buttons

---

### 2. LoadingSkeleton Component

**Location**: `frontend/src/components/ui/LoadingSkeleton.tsx`

Skeleton loaders for content placeholders during data fetching.

#### Features
- **Animation styles**: pulse, shimmer, none
- **Border radius**: none, sm, md, lg, xl, full
- **Specialized skeletons**: text, card, product, gallery, table, form, avatar, image
- **Grid layouts**: responsive skeleton grids

#### Usage Examples

```tsx
// Basic skeleton
<LoadingSkeleton width="w-32" height="h-4" />

// Text skeleton with multiple lines
<SkeletonText lines={3} />

// Product card skeleton
<SkeletonProductCard />

// Gallery grid skeleton
<SkeletonGrid count={8} type="gallery" columns={4} />

// Table skeleton
<SkeletonTable rows={5} columns={7} hasActions />
```

#### Specialized Skeleton Components

- **SkeletonText**: Multi-line text placeholder
- **SkeletonCard**: Generic card skeleton
- **SkeletonProductCard**: Product-specific card skeleton
- **SkeletonGalleryCard**: Gallery image card skeleton
- **SkeletonTable**: Table/list view skeleton
- **SkeletonForm**: Form layout skeleton
- **SkeletonAvatar**: Circular avatar skeleton
- **SkeletonImage**: Image placeholder with aspect ratios
- **SkeletonGrid**: Grid of skeleton cards

---

### 3. ProgressBar Component

**Location**: `frontend/src/components/ui/ProgressBar.tsx`

Progress indicators for file uploads and long-running operations.

#### Features
- **Determinate progress**: Shows specific percentage
- **Indeterminate progress**: Shows ongoing activity
- **Size variants**: sm, md, lg
- **Color variants**: primary, success, error, warning, info
- **Striped animation**: Optional striped pattern
- **Labels**: Percentage or custom text

#### Usage Examples

```tsx
// Determinate progress
<ProgressBar value={75} showLabel />

// Indeterminate progress
<ProgressBar />

// File upload with custom label
<ProgressBar 
  value={uploadProgress} 
  variant="success"
  label={`${uploadedFiles}/${totalFiles} fichiers`}
  showLabel
/>

// Circular progress
<CircularProgress value={75} size="lg" showLabel />

// Multi-step progress
<MultiStepProgress 
  steps={['Upload', 'Process', 'Complete']}
  currentStep={1}
/>

// File upload progress with details
<FileUploadProgress 
  fileName="image.jpg"
  progress={65}
  fileSize="2.5 MB"
  onCancel={() => cancelUpload()}
/>
```

#### Exported Components

- **ProgressBar**: Linear progress bar
- **CircularProgress**: Circular progress indicator
- **MultiStepProgress**: Multi-step process indicator
- **FileUploadProgress**: Specialized file upload progress

---

## Integration Examples

### Data Fetching Operations

#### Public Product Catalog

**File**: `frontend/src/app/(public)/produits/page.tsx`

```tsx
import { SkeletonGrid } from '@/components/ui/LoadingSkeleton';

// In component
{loading ? (
  <SkeletonGrid count={12} type="product" columns={3} />
) : (
  <ProductGrid products={products} loading={false} />
)}
```

#### Public Gallery

**File**: `frontend/src/app/(public)/galerie/page.tsx`

```tsx
import { SkeletonGrid } from '@/components/ui/LoadingSkeleton';

// In component
{loading ? (
  <SkeletonGrid count={8} type="gallery" columns={4} />
) : images.length === 0 ? (
  <EmptyState />
) : (
  <MasonryGrid images={images} />
)}
```

#### Admin Product List

**File**: `frontend/src/app/admin/products/page.tsx`

```tsx
import { LoadingSpinner, SkeletonTable } from '@/components/ui';

// Page loading
if (authLoading || (loading && products.length === 0)) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <LoadingSpinner size="xl" text="Chargement..." centered />
    </div>
  );
}

// Table loading
{loading ? (
  <div className="p-8">
    <SkeletonTable rows={5} columns={7} hasActions />
  </div>
) : products.length === 0 ? (
  <EmptyState />
) : (
  <ProductTable products={products} />
)}
```

---

### Form Submissions

#### Product Creation Form

**File**: `frontend/src/app/admin/products/new/page.tsx`

```tsx
import { LoadingSpinner, LoadingButton } from '@/components/ui';

// Page loading
if (authLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <LoadingSpinner size="xl" text="Chargement..." centered />
    </div>
  );
}

// Submit button
<button
  type="submit"
  disabled={isSubmitting}
  className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isSubmitting && <LoadingButton variant="white" />}
  {isSubmitting ? 'Création en cours...' : 'Créer le produit'}
</button>
```

---

### File Upload Operations

#### Product Image Manager

**File**: `frontend/src/components/admin/ProductImageManager.tsx`

The ProductImageManager component includes built-in upload progress tracking:

```tsx
export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  publicId?: string;
  file?: File;
  preview?: string;
  uploading?: boolean;      // Upload in progress flag
  uploadProgress?: number;  // Progress percentage (0-100)
  error?: string;           // Error message if upload fails
}
```

**Progress Display**:
```tsx
{image.uploading && (
  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="text-white text-xs">
      {image.uploadProgress || 0}%
    </div>
  </div>
)}
```

**Future Enhancement**: Replace with FileUploadProgress component for richer UI:

```tsx
import { FileUploadProgress } from '@/components/ui/ProgressBar';

<FileUploadProgress 
  fileName={image.file?.name || 'image'}
  progress={image.uploadProgress || 0}
  fileSize={formatFileSize(image.file?.size)}
  onCancel={() => cancelUpload(index)}
/>
```

---

## Design System Integration

### Color Variants

All loading components follow the ÉBENOR CRÉATION design system:

- **Primary**: `primary-600` (amber) - Default for most operations
- **Secondary**: `wood-600` - Wood-themed variant
- **Success**: `green-600` - Successful operations
- **Error**: `red-600` - Failed operations
- **Warning**: `amber-600` - Warning states
- **Info**: `blue-600` - Informational states
- **White**: White spinner for dark backgrounds
- **Neutral**: `neutral-600` - Neutral operations

### Accessibility

All loading components include:

- **ARIA labels**: `role="status"`, `aria-label`, `aria-live="polite"`
- **Screen reader text**: Hidden text for screen readers
- **Semantic HTML**: Proper use of semantic elements
- **Keyboard navigation**: All interactive elements are keyboard accessible

### Animation

- **Pulse animation**: Smooth pulsing effect for skeletons
- **Shimmer animation**: Gradient shimmer effect for premium feel
- **Spin animation**: Smooth rotation for spinners
- **Transition timing**: 300ms ease-out for smooth transitions

---

## Testing

### Manual Testing Checklist

#### LoadingSpinner
- [ ] Spinner displays correctly in all size variants
- [ ] Color variants match design system
- [ ] Inline mode works in buttons
- [ ] Centered mode centers properly
- [ ] Text displays below spinner
- [ ] Screen reader announces loading state

#### LoadingSkeleton
- [ ] Pulse animation is smooth
- [ ] Shimmer animation works correctly
- [ ] Product card skeleton matches actual card layout
- [ ] Gallery card skeleton matches actual gallery layout
- [ ] Table skeleton matches actual table structure
- [ ] Grid layouts are responsive

#### ProgressBar
- [ ] Determinate progress updates smoothly
- [ ] Indeterminate progress animates continuously
- [ ] Percentage label displays correctly
- [ ] Custom labels work
- [ ] Color variants display correctly
- [ ] Circular progress renders properly
- [ ] Multi-step progress shows correct step
- [ ] File upload progress shows file details

### Integration Testing

#### Data Fetching
- [ ] Skeleton displays while loading
- [ ] Content replaces skeleton smoothly
- [ ] Empty state shows when no data
- [ ] Error state displays on failure

#### Form Submission
- [ ] Button shows loading spinner when submitting
- [ ] Button is disabled during submission
- [ ] Loading text displays
- [ ] Success/error feedback after submission

#### File Upload
- [ ] Progress bar shows during upload
- [ ] Progress percentage updates
- [ ] Cancel button works
- [ ] Success state shows when complete
- [ ] Error state shows on failure

---

## Performance Considerations

### Skeleton Loading
- Use skeletons for perceived performance improvement
- Match skeleton layout to actual content layout
- Avoid layout shift when content loads

### Progress Indicators
- Update progress at reasonable intervals (not every byte)
- Use indeterminate progress for unknown durations
- Debounce rapid progress updates

### Animation Performance
- Use CSS transforms for animations (GPU-accelerated)
- Avoid animating expensive properties (width, height)
- Use `will-change` sparingly

---

## Future Enhancements

### Planned Improvements

1. **Enhanced File Upload Progress**
   - Replace basic progress display with FileUploadProgress component
   - Add upload speed indicator
   - Add estimated time remaining
   - Add retry functionality

2. **Optimistic UI Updates**
   - Show immediate feedback before server response
   - Revert on error with animation
   - Queue multiple operations

3. **Advanced Loading States**
   - Partial loading indicators for sections
   - Streaming content loading
   - Progressive image loading

4. **Analytics Integration**
   - Track loading times
   - Monitor slow operations
   - Identify performance bottlenecks

---

## API Reference

### LoadingSpinner Props

```typescript
interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white' | 'neutral';
  text?: string;
  centered?: boolean;
  inline?: boolean;
  className?: string;
  ariaLabel?: string;
}
```

### LoadingSkeleton Props

```typescript
interface LoadingSkeletonProps {
  width?: string;
  height?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  animation?: 'pulse' | 'shimmer' | 'none';
  className?: string;
}
```

### ProgressBar Props

```typescript
interface ProgressBarProps {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'error' | 'warning' | 'info';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  striped?: boolean;
  className?: string;
  barClassName?: string;
}
```

---

## Troubleshooting

### Common Issues

**Issue**: Skeleton doesn't match content layout  
**Solution**: Adjust skeleton component dimensions and structure to match actual content

**Issue**: Progress bar doesn't update  
**Solution**: Ensure progress value is being updated in state and passed to component

**Issue**: Loading spinner doesn't center  
**Solution**: Use `centered` prop or wrap in flex container with center alignment

**Issue**: Animation is janky  
**Solution**: Check for expensive operations during animation, use CSS transforms

---

## Conclusion

The loading states and indicators implementation provides comprehensive feedback for all asynchronous operations across the platform. The components are:

- ✅ **Accessible**: Full ARIA support and screen reader compatibility
- ✅ **Responsive**: Work across all device sizes
- ✅ **Performant**: GPU-accelerated animations
- ✅ **Consistent**: Follow design system guidelines
- ✅ **Flexible**: Multiple variants and customization options
- ✅ **Well-documented**: Clear examples and API reference

All requirements from Task 45 and Requirement 24.5 have been successfully implemented.
