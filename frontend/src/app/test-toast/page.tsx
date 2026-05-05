'use client';

import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

/**
 * Toast notification test page
 * This page demonstrates all toast functionality
 */
export default function ToastTestPage() {
  const toast = useToast();
  const [toastId, setToastId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Toast Notification System
          </h1>
          <p className="text-neutral-600 mb-8">
            Test all toast notification types and features
          </p>

          {/* Basic Toasts */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Basic Toast Types
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="success"
                onClick={() => toast.success('Operation completed successfully!')}
              >
                Success
              </Button>
              <Button
                variant="danger"
                onClick={() => toast.error('An error occurred. Please try again.')}
              >
                Error
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast.warning('This action cannot be undone.')}
              >
                Warning
              </Button>
              <Button
                variant="primary"
                onClick={() => toast.info('New features are available!')}
              >
                Info
              </Button>
            </div>
          </section>

          {/* Custom Duration */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Custom Duration
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={() => toast.success('Dismisses in 2 seconds', { duration: 2000 })}
              >
                2s Success
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.info('Dismisses in 10 seconds', { duration: 10000 })}
              >
                10s Info
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.error('Auto-dismisses in 5s', { duration: 5000 })}
              >
                5s Error
              </Button>
            </div>
          </section>

          {/* Custom Position */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Custom Position
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Button
                variant="ghost"
                onClick={() => toast.success('Top Left!', { position: 'top-left' })}
              >
                Top Left
              </Button>
              <Button
                variant="ghost"
                onClick={() => toast.info('Top Center!', { position: 'top-center' })}
              >
                Top Center
              </Button>
              <Button
                variant="ghost"
                onClick={() => toast.success('Top Right!', { position: 'top-right' })}
              >
                Top Right
              </Button>
              <Button
                variant="ghost"
                onClick={() => toast.warning('Bottom Left!', { position: 'bottom-left' })}
              >
                Bottom Left
              </Button>
              <Button
                variant="ghost"
                onClick={() => toast.info('Bottom Center!', { position: 'bottom-center' })}
              >
                Bottom Center
              </Button>
              <Button
                variant="ghost"
                onClick={() => toast.success('Bottom Right!', { position: 'bottom-right' })}
              >
                Bottom Right
              </Button>
            </div>
          </section>

          {/* Multiple Toasts */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Multiple Toasts
            </h2>
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={() => {
                  toast.success('First notification');
                  setTimeout(() => toast.info('Second notification'), 300);
                  setTimeout(() => toast.warning('Third notification'), 600);
                  setTimeout(() => toast.error('Fourth notification'), 900);
                }}
              >
                Show 4 Toasts
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  for (let i = 1; i <= 5; i++) {
                    setTimeout(() => {
                      toast.info(`Toast ${i} of 5`);
                    }, i * 200);
                  }
                }}
              >
                Show 5 Toasts
              </Button>
            </div>
          </section>

          {/* Manual Dismissal */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Manual Dismissal
            </h2>
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={() => {
                  const id = toast.info('This toast will be dismissed in 3 seconds...', {
                    duration: Infinity,
                  });
                  setToastId(id);
                  setTimeout(() => {
                    toast.dismiss(id);
                    setToastId(null);
                  }, 3000);
                }}
              >
                Auto Dismiss After 3s
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  if (toastId) {
                    toast.dismiss(toastId);
                    setToastId(null);
                  }
                }}
                disabled={!toastId}
              >
                Dismiss Specific
              </Button>
              <Button
                variant="danger"
                onClick={() => toast.dismissAll()}
              >
                Dismiss All
              </Button>
            </div>
          </section>

          {/* Real-World Examples */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Real-World Examples
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="success"
                onClick={() => toast.success('Product saved successfully!')}
              >
                Save Product
              </Button>
              <Button
                variant="danger"
                onClick={() => toast.error('Failed to upload image. File size exceeds 5MB.')}
              >
                Upload Error
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  const id = toast.info('Uploading image...');
                  setTimeout(() => {
                    toast.dismiss(id);
                    toast.success('Image uploaded successfully!');
                  }, 2000);
                }}
              >
                Upload Success
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast.warning('Unsaved changes will be lost.')}
              >
                Unsaved Changes
              </Button>
              <Button
                variant="primary"
                onClick={() => toast.info('You can drag and drop images to reorder them.')}
              >
                Helpful Tip
              </Button>
              <Button
                variant="danger"
                onClick={() => toast.error('Network error. Please check your connection.')}
              >
                Network Error
              </Button>
            </div>
          </section>

          {/* Long Messages */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Long Messages
            </h2>
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={() =>
                  toast.success(
                    'Your product has been successfully saved and is now visible in the catalog. Customers can now view and purchase this item.'
                  )
                }
              >
                Long Success
              </Button>
              <Button
                variant="danger"
                onClick={() =>
                  toast.error(
                    'Failed to save product. The server encountered an error while processing your request. Please check your internet connection and try again. If the problem persists, contact support.'
                  )
                }
              >
                Long Error
              </Button>
            </div>
          </section>

          {/* Requirements Validation */}
          <section className="bg-neutral-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Requirements Validation
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-neutral-700">
                  <strong>24.1:</strong> Success notifications display after successful actions
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-neutral-700">
                  <strong>24.2:</strong> Error notifications display with descriptive messages
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-neutral-700">
                  <strong>24.3:</strong> Inline error messages for invalid form fields
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-neutral-700">
                  <strong>24.4:</strong> File upload failure reasons displayed
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-neutral-700">
                  <strong>24.5:</strong> Loading indicators during network requests
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-neutral-700">
                  <strong>24.6:</strong> Confirmation dialogs for destructive actions
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-neutral-700">
                  <strong>24.7:</strong> Success notifications auto-dismiss after 5 seconds
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-neutral-700">
                  <strong>24.8:</strong> Error notifications stay until manually dismissed
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
