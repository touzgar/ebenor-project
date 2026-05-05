'use client';

import { Toaster, toast as hotToast, Toast as HotToast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react';

/**
 * Toast notification types
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast notification options
 */
export interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  dismissible?: boolean;
}

/**
 * Custom toast component with consistent styling
 */
function ToastComponent({ t, type, message }: { t: HotToast; type: ToastType; message: string }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const textColors = {
    success: 'text-green-900',
    error: 'text-red-900',
    warning: 'text-amber-900',
    info: 'text-blue-900',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md w-full',
        'transform transition-all duration-300 ease-in-out',
        bgColors[type],
        t.visible ? 'animate-enter' : 'animate-leave'
      )}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <div className="flex-shrink-0 mt-0.5">
        {icons[type]}
      </div>
      
      <div className={cn('flex-1 text-sm font-medium', textColors[type])}>
        {message}
      </div>

      <button
        onClick={() => hotToast.dismiss(t.id)}
        className={cn(
          'flex-shrink-0 p-1 rounded-md transition-colors',
          'hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2',
          type === 'success' && 'focus:ring-green-500',
          type === 'error' && 'focus:ring-red-500',
          type === 'warning' && 'focus:ring-amber-500',
          type === 'info' && 'focus:ring-blue-500'
        )}
        aria-label="Fermer la notification"
      >
        <X className={cn('w-4 h-4', textColors[type])} />
      </button>
    </div>
  );
}

/**
 * Toast notification functions
 */
export const toast = {
  /**
   * Display a success notification
   * Auto-dismisses after 5 seconds by default
   */
  success: (message: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => <ToastComponent t={t} type="success" message={message} />,
      {
        duration: options?.duration ?? 5000, // 5 seconds default for success
        position: options?.position ?? 'top-right',
        ...options,
      }
    );
  },

  /**
   * Display an error notification
   * Stays visible until manually dismissed by default
   */
  error: (message: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => <ToastComponent t={t} type="error" message={message} />,
      {
        duration: options?.duration ?? Infinity, // Stay until dismissed for errors
        position: options?.position ?? 'top-right',
        ...options,
      }
    );
  },

  /**
   * Display a warning notification
   * Auto-dismisses after 7 seconds by default
   */
  warning: (message: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => <ToastComponent t={t} type="warning" message={message} />,
      {
        duration: options?.duration ?? 7000, // 7 seconds for warnings
        position: options?.position ?? 'top-right',
        ...options,
      }
    );
  },

  /**
   * Display an info notification
   * Auto-dismisses after 5 seconds by default
   */
  info: (message: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => <ToastComponent t={t} type="info" message={message} />,
      {
        duration: options?.duration ?? 5000, // 5 seconds for info
        position: options?.position ?? 'top-right',
        ...options,
      }
    );
  },

  /**
   * Dismiss a specific toast by ID
   */
  dismiss: (toastId?: string) => {
    hotToast.dismiss(toastId);
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    hotToast.dismiss();
  },
};

/**
 * Toast container component
 * Add this to your root layout to enable toasts throughout the app
 */
export function ToastContainer() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName="toast-container"
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        className: '',
        duration: 5000,
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
        },
      }}
    />
  );
}

// Add custom animations to global CSS
export const toastStyles = `
  @keyframes enter {
    0% {
      transform: translateX(100%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes leave {
    0% {
      transform: translateX(0);
      opacity: 1;
    }
    100% {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  .animate-enter {
    animation: enter 0.3s ease-out;
  }

  .animate-leave {
    animation: leave 0.2s ease-in forwards;
  }
`;
