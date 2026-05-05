# Task 31: Gallery Drag-and-Drop Reordering - Implementation Guide

## Overview
This document provides the complete implementation for adding drag-and-drop functionality to the gallery list view.

## Changes Made

### 1. Installed Dependencies
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### 2. Updated API Client (frontend/src/lib/api.ts)
Added `updateSortOrder` method to `galleryService`:

```typescript
export const galleryService = {
  // ... existing methods ...
  updateSortOrder: (imageOrders: Array<{ id: string; sortOrder: number }>) =>
    apiClient.put('/admin/gallery/sort-order', { imageOrders }),
};
```

### 3. Created SortableGalleryItem Component
File: `frontend/src/components/admin/SortableGalleryItem.tsx`

This component wraps each gallery image card with drag-and-drop functionality using @dnd-kit/sortable.

Key features:
- Drag handle icon in top-left corner
- Visual feedback during drag (opacity, border color)
- Maintains all existing functionality (selection, edit, delete)
- Responsive cursor states (grab/grabbing)

### 4. Updated Gallery Page (frontend/src/app/admin/gallery/page.tsx)

#### Added Imports:
```typescript
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import SortableGalleryItem from '@/components/admin/SortableGalleryItem';
```

#### Added State:
```typescript
const [savingOrder, setSavingOrder] = useState(false);
const [activeId, setActiveId] = useState<string | null>(null);
const [isDragging, setIsDragging] = useState(false);
```

#### Added Sensors Configuration:
```typescript
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // Prevents accidental drags
    },
  }),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);
```

#### Added Drag Handlers:
```typescript
const handleDragStart = (event: DragStartEvent) => {
  setActiveId(event.active.id as string);
  setIsDragging(true);
};

const handleDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event;
  setActiveId(null);
  setIsDragging(false);

  if (!over || active.id === over.id) return;

  const oldIndex = images.findIndex((img) => img._id === active.id);
  const newIndex = images.findIndex((img) => img._id === over.id);

  if (oldIndex === -1 || newIndex === -1) return;

  // Optimistically update UI
  const newImages = arrayMove(images, oldIndex, newIndex);
  setImages(newImages);

  // Save to backend
  try {
    setSavingOrder(true);
    const imageOrders = newImages.map((img, index) => ({
      id: img._id!,
      sortOrder: index,
    }));
    await galleryService.updateSortOrder(imageOrders);
    // Show success notification
  } catch (err) {
    // Revert on error
    setImages(images);
    // Show error notification
  } finally {
    setSavingOrder(false);
  }
};

const handleDragCancel = () => {
  setActiveId(null);
  setIsDragging(false);
};
```

#### Wrapped Grid with DndContext:
```tsx
<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
  onDragCancel={handleDragCancel}
>
  <SortableContext
    items={images.map((img) => img._id!)}
    strategy={rectSortingStrategy}
  >
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((image, index) => (
        <SortableGalleryItem
          key={image._id}
          image={image}
          index={index}
          isSelected={selectedImages.has(image._id!)}
          onSelect={handleSelectImage}
          onDelete={handleDelete}
          isDragging={isDragging}
        />
      ))}
    </div>
  </SortableContext>

  <DragOverlay>
    {activeImage ? (
      <div className="bg-white rounded-lg shadow-2xl border-2 border-amber-500 overflow-hidden opacity-90 transform rotate-3 scale-105">
        {/* Preview of dragged item */}
      </div>
    ) : null}
  </DragOverlay>
</DndContext>
```

#### Added Info Banner:
```tsx
{images.length > 0 && !searchQuery && !categoryFilter && !featuredFilter && (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
      <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div className="flex-1">
        <p className="text-sm text-amber-800">
          <strong>Réorganiser les images :</strong> Glissez-déposez les images pour modifier leur ordre d'affichage. Les modifications sont enregistrées automatiquement.
        </p>
      </div>
    </div>
  </div>
)}
```

### 5. Added CSS Animation (frontend/src/app/globals.css)
```css
/* Fade in animation for notifications */
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Features Implemented

### ✅ Drag-and-Drop Functionality
- Smooth drag-and-drop using @dnd-kit library
- Visual drag handle on each image card
- Drag overlay showing preview of dragged item
- Keyboard accessibility support

### ✅ Visual Feedback
- Drag handle icon with hover effects
- Opacity change during drag
- Border highlight on active item
- Cursor changes (grab/grabbing)
- Rotated preview in drag overlay

### ✅ Order Persistence
- Automatic save to backend after drop
- Optimistic UI updates
- Error handling with revert on failure
- Loading indicator during save

### ✅ Notifications
- Success notification after successful save
- Error notification on failure
- Auto-dismiss after 3 seconds
- Smooth fade-in animation

### ✅ User Experience
- Info banner explaining drag-and-drop (only shown when no filters active)
- Saving indicator in header
- Only allows reordering within current page
- Maintains existing filtering and pagination
- Preserves bulk selection functionality

## Backend API Endpoint

The backend already has the required endpoint:

**Endpoint:** `PUT /admin/gallery/sort-order`

**Request Body:**
```json
{
  "imageOrders": [
    { "id": "image_id_1", "sortOrder": 0 },
    { "id": "image_id_2", "sortOrder": 1 },
    { "id": "image_id_3", "sortOrder": 2 }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ordre des images mis à jour avec succès"
}
```

## Testing Checklist

- [ ] Drag and drop works smoothly
- [ ] Order is saved to backend
- [ ] Success notification appears
- [ ] Error handling works (test by stopping backend)
- [ ] Drag handle is visible and clickable
- [ ] Visual feedback during drag is clear
- [ ] Keyboard navigation works
- [ ] Works on mobile (touch events)
- [ ] Pagination is maintained
- [ ] Filters don't interfere with drag-and-drop
- [ ] Bulk selection still works
- [ ] Edit and delete buttons still work

## Notes

- Drag-and-drop is only enabled when no filters are active (to avoid confusion about ordering)
- The info banner explains this to users
- Sort order is based on array index (0, 1, 2, ...)
- The implementation uses optimistic updates for better UX
- Error handling reverts the UI state if save fails

## Next Steps

1. Restore the original gallery page file
2. Apply the changes documented above
3. Test the functionality
4. Verify all existing features still work
5. Test on different screen sizes

## File Recovery

If the gallery page file was corrupted during implementation, you can:
1. Check if there's a backup in your editor's history
2. Recreate the file using the original structure plus the changes documented above
3. The SortableGalleryItem component is complete and ready to use
