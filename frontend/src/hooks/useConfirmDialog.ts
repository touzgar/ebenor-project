'use client';

import { useState, useCallback } from 'react';
import { ConfirmDialogVariant } from '@/components/ui/ConfirmDialog';

/**
 * Options for the confirmation dialog
 */
export interface UseConfirmDialogOptions {
  /** Dialog title */
  title: string;
  /** Dialog message/description */
  message: string;
  /** Variant determines the color scheme and icon */
  variant?: ConfirmDialogVariant;
  /** Custom label for the confirm button */
  confirmLabel?: string;
  /** Custom label for the cancel button */
  cancelLabel?: string;
  /** Additional consequences or warnings to display */
  consequences?: string[];
}

/**
 * State returned by the useConfirmDialog hook
 */
export interface UseConfirmDialogState {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Whether the confirm action is loading */
  isLoading: boolean;
  /** Dialog configuration options */
  options: UseConfirmDialogOptions;
  /** Open the dialog with the given options */
  openDialog: (options: UseConfirmDialogOptions) => Promise<boolean>;
  /** Close the dialog */
  closeDialog: () => void;
  /** Confirm the action */
  confirm: () => void;
  /** Cancel the action */
  cancel: () => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
}

/**
 * Custom hook for managing confirmation dialogs
 * 
 * Provides a simple API for showing confirmation dialogs and handling user responses.
 * Returns a promise that resolves to true if confirmed, false if cancelled.
 * 
 * @example
 * ```tsx
 * const confirmDialog = useConfirmDialog();
 * 
 * const handleDelete = async () => {
 *   const confirmed = await confirmDialog.openDialog({
 *     title: 'Supprimer le produit',
 *     message: 'Êtes-vous sûr de vouloir supprimer ce produit ?',
 *     variant: 'danger',
 *     confirmLabel: 'Supprimer',
 *     consequences: [
 *       'Le produit sera définitivement supprimé',
 *       'Cette action ne peut pas être annulée'
 *     ]
 *   });
 * 
 *   if (confirmed) {
 *     // Perform delete action
 *     confirmDialog.setLoading(true);
 *     await deleteProduct();
 *     confirmDialog.setLoading(false);
 *     confirmDialog.closeDialog();
 *   }
 * };
 * 
 * // In your JSX:
 * <ConfirmDialog
 *   isOpen={confirmDialog.isOpen}
 *   onClose={confirmDialog.cancel}
 *   onConfirm={confirmDialog.confirm}
 *   isLoading={confirmDialog.isLoading}
 *   {...confirmDialog.options}
 * />
 * ```
 */
export function useConfirmDialog(): UseConfirmDialogState {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<UseConfirmDialogOptions>({
    title: '',
    message: '',
    variant: 'danger',
    confirmLabel: 'Confirmer',
    cancelLabel: 'Annuler',
    consequences: [],
  });
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  /**
   * Open the dialog and return a promise that resolves when user confirms or cancels
   */
  const openDialog = useCallback((dialogOptions: UseConfirmDialogOptions): Promise<boolean> => {
    setOptions({
      variant: 'danger',
      confirmLabel: 'Confirmer',
      cancelLabel: 'Annuler',
      consequences: [],
      ...dialogOptions,
    });
    setIsOpen(true);
    setIsLoading(false);

    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
    });
  }, []);

  /**
   * Close the dialog
   */
  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setIsLoading(false);
  }, []);

  /**
   * Confirm the action
   */
  const confirm = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
  }, [resolvePromise]);

  /**
   * Cancel the action
   */
  const cancel = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
    closeDialog();
  }, [resolvePromise, closeDialog]);

  /**
   * Set loading state
   */
  const setLoadingState = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return {
    isOpen,
    isLoading,
    options,
    openDialog,
    closeDialog,
    confirm,
    cancel,
    setLoading: setLoadingState,
  };
}
