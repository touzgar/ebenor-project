'use client';

import { createContext, useContext, ReactNode } from 'react';
import { toast as toastFunctions, ToastOptions } from '@/components/ui/Toast';

/**
 * Toast context type
 */
interface ToastContextType {
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  warning: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
  dismiss: (toastId?: string) => void;
  dismissAll: () => void;
}

/**
 * Toast context
 */
const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Toast provider component
 * Wraps the app to provide toast functionality throughout
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const contextValue: ToastContextType = {
    success: toastFunctions.success,
    error: toastFunctions.error,
    warning: toastFunctions.warning,
    info: toastFunctions.info,
    dismiss: toastFunctions.dismiss,
    dismissAll: toastFunctions.dismissAll,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
}

/**
 * Hook to use toast notifications
 * 
 * @example
 * ```tsx
 * const toast = useToast();
 * 
 * // Success notification (auto-dismisses after 5s)
 * toast.success('Product saved successfully!');
 * 
 * // Error notification (stays until dismissed)
 * toast.error('Failed to save product. Please try again.');
 * 
 * // Warning notification
 * toast.warning('This action cannot be undone.');
 * 
 * // Info notification
 * toast.info('New features are available!');
 * 
 * // Custom duration
 * toast.success('Saved!', { duration: 3000 });
 * 
 * // Custom position
 * toast.error('Error!', { position: 'bottom-center' });
 * 
 * // Dismiss specific toast
 * const toastId = toast.success('Processing...');
 * toast.dismiss(toastId);
 * 
 * // Dismiss all toasts
 * toast.dismissAll();
 * ```
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
