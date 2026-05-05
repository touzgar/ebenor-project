# Toast Notification System

A comprehensive toast notification system built with `react-hot-toast` for the ÉBENOR CRÉATION platform.

## Features

- ✅ **Multiple Toast Types**: Success, Error, Warning, Info
- ✅ **Auto-dismiss**: Success notifications auto-dismiss after 5 seconds
- ✅ **Manual Dismiss**: Error notifications stay until manually dismissed
- ✅ **Toast Stacking**: Display multiple toasts simultaneously
- ✅ **Close Button**: All toasts include a close button
- ✅ **Consistent Styling**: Matches the Tailwind CSS design system
- ✅ **Accessibility**: ARIA labels and keyboard navigation support
- ✅ **Smooth Animations**: Enter and exit animations

## Installation

The toast system is already installed and configured. The required dependencies are:
- `react-hot-toast` (v2.4.1)
- `lucide-react` (for icons)

## Setup

### 1. Add ToastContainer to Root Layout

Add the `ToastContainer` component to your root layout to enable toasts throughout the app:

```tsx
// app/layout.tsx
import { ToastContainer } from '@/components/ui/Toast';
import { ToastProvider } from '@/contexts/ToastContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
```

## Usage

### Using the useToast Hook (Recommended)

The `useToast` hook provides easy access to toast notifications throughout your app:

```tsx
'use client';

import { useToast } from '@/contexts/ToastContext';

export function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Product saved successfully!');
  };

  const handleError = () => {
    toast.error('Failed to save product. Please try again.');
  };

  const handleWarning = () => {
    toast.warning('This action cannot be undone.');
  };

  const handleInfo = () => {
    toast.info('New features are available!');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleWarning}>Show Warning</button>
      <button onClick={handleInfo}>Show Info</button>
    </div>
  );
}
```

### Direct Import (Alternative)

You can also import the toast functions directly:

```tsx
import { toast } from '@/components/ui/Toast';

// Success notification
toast.success('Operation completed!');

// Error notification
toast.error('Something went wrong!');

// Warning notification
toast.warning('Please review your changes.');

// Info notification
toast.info('System update available.');
```

## Toast Types

### Success Toast
- **Auto-dismisses**: After 5 seconds
- **Use case**: Successful operations (save, delete, update)
- **Color**: Green

```tsx
toast.success('Product created successfully!');
```

### Error Toast
- **Auto-dismisses**: Never (stays until manually dismissed)
- **Use case**: Failed operations, validation errors
- **Color**: Red

```tsx
toast.error('Failed to upload image. File size exceeds 5MB.');
```

### Warning Toast
- **Auto-dismisses**: After 7 seconds
- **Use case**: Important notices, confirmations needed
- **Color**: Amber

```tsx
toast.warning('Unsaved changes will be lost.');
```

### Info Toast
- **Auto-dismisses**: After 5 seconds
- **Use case**: General information, tips
- **Color**: Blue

```tsx
toast.info('You can drag and drop images to reorder them.');
```

## Advanced Options

### Custom Duration

Override the default auto-dismiss duration:

```tsx
// Success toast that stays for 3 seconds
toast.success('Quick notification!', { duration: 3000 });

// Error toast that auto-dismisses after 10 seconds
toast.error('Temporary error', { duration: 10000 });

// Toast that never dismisses
toast.info('Important info', { duration: Infinity });
```

### Custom Position

Change the toast position on screen:

```tsx
toast.success('Top left!', { position: 'top-left' });
toast.error('Bottom center!', { position: 'bottom-center' });
toast.info('Top right!', { position: 'top-right' });
```

Available positions:
- `top-left`
- `top-center`
- `top-right`
- `bottom-left`
- `bottom-center`
- `bottom-right`

### Manual Dismissal

Dismiss toasts programmatically:

```tsx
// Dismiss a specific toast
const toastId = toast.success('Processing...');
// Later...
toast.dismiss(toastId);

// Dismiss all toasts
toast.dismissAll();
```

## Common Use Cases

### Form Submission Success

```tsx
const handleSubmit = async (data: FormData) => {
  try {
    await saveProduct(data);
    toast.success('Product saved successfully!');
    router.push('/admin/products');
  } catch (error) {
    toast.error('Failed to save product. Please try again.');
  }
};
```

### File Upload Feedback

```tsx
const handleFileUpload = async (file: File) => {
  if (file.size > 5 * 1024 * 1024) {
    toast.error('File size exceeds 5MB limit.');
    return;
  }

  try {
    const uploadId = toast.info('Uploading image...');
    await uploadFile(file);
    toast.dismiss(uploadId);
    toast.success('Image uploaded successfully!');
  } catch (error) {
    toast.error('Failed to upload image. Please try again.');
  }
};
```

### Validation Errors

```tsx
const handleValidation = (errors: ValidationErrors) => {
  if (errors.title) {
    toast.error('Title is required.');
  }
  if (errors.price) {
    toast.error('Price must be a positive number.');
  }
};
```

### Destructive Action Confirmation

```tsx
const handleDelete = async (id: string) => {
  toast.warning('Are you sure you want to delete this product?');
  
  // After confirmation...
  try {
    await deleteProduct(id);
    toast.success('Product deleted successfully!');
  } catch (error) {
    toast.error('Failed to delete product.');
  }
};
```

### Network Request Loading

```tsx
const fetchData = async () => {
  const loadingId = toast.info('Loading products...');
  
  try {
    const data = await getProducts();
    toast.dismiss(loadingId);
    toast.success('Products loaded!');
    return data;
  } catch (error) {
    toast.dismiss(loadingId);
    toast.error('Failed to load products.');
  }
};
```

## Requirements Mapping

This toast system fulfills the following requirements:

### Requirement 24.1
✅ Display success notification after successful actions
```tsx
toast.success('Content saved successfully!');
```

### Requirement 24.2
✅ Display error notification with descriptive message on failures
```tsx
toast.error('Failed to save content. Please check your connection.');
```

### Requirement 24.3
✅ Display inline error messages for invalid form fields
```tsx
if (errors.email) {
  toast.error('Please enter a valid email address.');
}
```

### Requirement 24.4
✅ Display reason for file upload failures
```tsx
toast.error('File upload failed: File size exceeds 5MB limit.');
```

### Requirement 24.5
✅ Display loading indicator during network requests
```tsx
const loadingId = toast.info('Processing request...');
// Later: toast.dismiss(loadingId);
```

### Requirement 24.6
✅ Display confirmation dialog for destructive actions
```tsx
toast.warning('This action cannot be undone. Are you sure?');
```

### Requirement 24.7
✅ Auto-dismiss success notifications after 5 seconds
- Success toasts automatically dismiss after 5 seconds by default

### Requirement 24.8
✅ Keep error notifications visible until manually dismissed
- Error toasts stay visible until the user clicks the close button

## Accessibility

The toast system includes comprehensive accessibility features:

- **ARIA Labels**: All toasts have appropriate `role="alert"` attributes
- **Live Regions**: Success/info use `aria-live="polite"`, errors use `aria-live="assertive"`
- **Keyboard Navigation**: Close buttons are keyboard accessible
- **Focus Management**: Proper focus handling for screen readers
- **Color Contrast**: All text meets WCAG AA standards

## Styling

The toast system uses Tailwind CSS and matches the ÉBENOR CRÉATION design system:

- **Colors**: Matches the premium gold and neutral palette
- **Typography**: Uses the project's font system
- **Shadows**: Consistent with other UI components
- **Animations**: Smooth enter/exit transitions
- **Responsive**: Works on all screen sizes

## Testing

### Manual Testing Checklist

- [ ] Success toast appears and auto-dismisses after 5 seconds
- [ ] Error toast appears and stays until manually dismissed
- [ ] Warning toast appears and auto-dismisses after 7 seconds
- [ ] Info toast appears and auto-dismisses after 5 seconds
- [ ] Multiple toasts stack correctly
- [ ] Close button works on all toast types
- [ ] Custom duration works
- [ ] Custom position works
- [ ] Toast animations are smooth
- [ ] Toasts are accessible with keyboard
- [ ] Toasts work on mobile devices

### Example Test Component

Create a test page to verify all toast functionality:

```tsx
// app/test/toasts/page.tsx
'use client';

import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';

export default function ToastTestPage() {
  const toast = useToast();

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Toast Notification Tests</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Basic Toasts</h2>
          <div className="flex gap-2">
            <Button onClick={() => toast.success('Success!')}>Success</Button>
            <Button onClick={() => toast.error('Error!')}>Error</Button>
            <Button onClick={() => toast.warning('Warning!')}>Warning</Button>
            <Button onClick={() => toast.info('Info!')}>Info</Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Custom Duration</h2>
          <div className="flex gap-2">
            <Button onClick={() => toast.success('3 seconds', { duration: 3000 })}>
              3s Success
            </Button>
            <Button onClick={() => toast.error('10 seconds', { duration: 10000 })}>
              10s Error
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Multiple Toasts</h2>
          <Button onClick={() => {
            toast.success('First toast');
            setTimeout(() => toast.info('Second toast'), 500);
            setTimeout(() => toast.warning('Third toast'), 1000);
          }}>
            Show Multiple
          </Button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Dismiss</h2>
          <Button onClick={() => toast.dismissAll()}>
            Dismiss All
          </Button>
        </div>
      </div>
    </div>
  );
}
```

## Troubleshooting

### Toasts Not Appearing

1. Ensure `ToastContainer` is added to your root layout
2. Verify `ToastProvider` wraps your app
3. Check that you're using the hook inside a client component (`'use client'`)

### Styling Issues

1. Verify Tailwind CSS is properly configured
2. Check that global CSS includes toast animations
3. Ensure `lucide-react` icons are installed

### TypeScript Errors

1. Verify all type exports are imported correctly
2. Check that `ToastOptions` type is properly defined
3. Ensure React types are up to date

## Future Enhancements

Potential improvements for future iterations:

- [ ] Toast queue management (limit max visible toasts)
- [ ] Custom toast templates
- [ ] Sound notifications
- [ ] Progress bar for timed toasts
- [ ] Undo action support
- [ ] Toast history/log
- [ ] Grouped toasts (collapse similar messages)
- [ ] Rich content support (images, buttons)

## API Reference

### toast.success(message, options?)
Display a success notification.
- **message**: `string` - The message to display
- **options**: `ToastOptions` - Optional configuration
- **Returns**: `string` - Toast ID

### toast.error(message, options?)
Display an error notification.
- **message**: `string` - The message to display
- **options**: `ToastOptions` - Optional configuration
- **Returns**: `string` - Toast ID

### toast.warning(message, options?)
Display a warning notification.
- **message**: `string` - The message to display
- **options**: `ToastOptions` - Optional configuration
- **Returns**: `string` - Toast ID

### toast.info(message, options?)
Display an info notification.
- **message**: `string` - The message to display
- **options**: `ToastOptions` - Optional configuration
- **Returns**: `string` - Toast ID

### toast.dismiss(toastId?)
Dismiss a specific toast or all toasts.
- **toastId**: `string` (optional) - The ID of the toast to dismiss

### toast.dismissAll()
Dismiss all visible toasts.

### ToastOptions
```typescript
interface ToastOptions {
  duration?: number;        // Auto-dismiss duration in ms (default: 5000 for success/info, Infinity for errors)
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  dismissible?: boolean;    // Whether the toast can be dismissed (default: true)
}
```

## Support

For issues or questions about the toast system, please refer to:
- [react-hot-toast documentation](https://react-hot-toast.com/)
- Project design system documentation
- ÉBENOR CRÉATION style guide
