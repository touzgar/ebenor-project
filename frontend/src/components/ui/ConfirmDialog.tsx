'use client';

import { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

/**
 * Confirmation dialog variants
 */
export type ConfirmDialogVariant = 'danger' | 'warning' | 'info';

/**
 * Props for the ConfirmDialog component
 */
export interface ConfirmDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback when the dialog is closed (cancel or backdrop click) */
  onClose: () => void;
  /** Callback when the confirm button is clicked */
  onConfirm: () => void;
  /** Dialog title */
  title: string;
  /** Dialog message/description */
  message: string | ReactNode;
  /** Variant determines the color scheme and icon */
  variant?: ConfirmDialogVariant;
  /** Custom label for the confirm button */
  confirmLabel?: string;
  /** Custom label for the cancel button */
  cancelLabel?: string;
  /** Whether the confirm action is loading */
  isLoading?: boolean;
  /** Additional consequences or warnings to display */
  consequences?: string[];
  /** Custom icon to override the default variant icon */
  icon?: ReactNode;
}

/**
 * Variant configuration for styling and icons
 */
const variantConfig = {
  danger: {
    icon: AlertCircle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    buttonVariant: 'danger' as const,
    focusRing: 'focus:ring-red-500',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    buttonVariant: 'primary' as const,
    focusRing: 'focus:ring-amber-500',
  },
  info: {
    icon: Info,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    buttonVariant: 'primary' as const,
    focusRing: 'focus:ring-blue-500',
  },
};

/**
 * ConfirmDialog Component
 * 
 * A reusable confirmation dialog for destructive or important actions.
 * Supports different variants (danger, warning, info) with appropriate styling.
 * Includes keyboard navigation (Escape to cancel, Enter to confirm).
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={handleDelete}
 *   title="Supprimer le produit"
 *   message="Êtes-vous sûr de vouloir supprimer ce produit ?"
 *   variant="danger"
 *   confirmLabel="Supprimer"
 *   consequences={[
 *     "Le produit sera définitivement supprimé",
 *     "Cette action ne peut pas être annulée"
 *   ]}
 * />
 * ```
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  variant = 'danger',
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  isLoading = false,
  consequences = [],
  icon,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];
  const IconComponent = config.icon;

  /**
   * Handle confirm action
   */
  const handleConfirm = () => {
    onConfirm();
  };

  /**
   * Handle keyboard events
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !isLoading) {
      event.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={onClose}
        onKeyDown={handleKeyDown}
      >
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Dialog container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-xl transition-all">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="p-6"
                >
                  {/* Close button */}
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className={cn(
                      'absolute top-4 right-4 p-1 rounded-md text-neutral-400',
                      'hover:text-neutral-600 hover:bg-neutral-100',
                      'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
                      config.focusRing,
                      isLoading && 'opacity-50 cursor-not-allowed'
                    )}
                    aria-label="Fermer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Icon */}
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full',
                        config.iconBg
                      )}
                    >
                      {icon || <IconComponent className={cn('w-6 h-6', config.iconColor)} />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      {/* Title */}
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold text-neutral-900 mb-2"
                      >
                        {title}
                      </Dialog.Title>

                      {/* Message */}
                      <div className="text-sm text-neutral-600 mb-4">
                        {typeof message === 'string' ? <p>{message}</p> : message}
                      </div>

                      {/* Consequences */}
                      {consequences.length > 0 && (
                        <div className="mb-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                          <p className="text-xs font-medium text-neutral-700 mb-2">
                            Conséquences :
                          </p>
                          <ul className="space-y-1">
                            {consequences.map((consequence, index) => (
                              <li
                                key={index}
                                className="text-xs text-neutral-600 flex items-start gap-2"
                              >
                                <span className="text-neutral-400 mt-0.5">•</span>
                                <span>{consequence}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center gap-3 mt-6">
                        <Button
                          variant="ghost"
                          size="md"
                          onClick={onClose}
                          disabled={isLoading}
                          className="flex-1"
                          aria-label={cancelLabel}
                        >
                          {cancelLabel}
                        </Button>
                        <Button
                          variant={config.buttonVariant}
                          size="md"
                          onClick={handleConfirm}
                          isLoading={isLoading}
                          disabled={isLoading}
                          className="flex-1"
                          aria-label={confirmLabel}
                        >
                          {confirmLabel}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
