'use client';

/**
 * ConfirmDialog Usage Examples
 * 
 * This file contains practical examples of using the ConfirmDialog component
 * in various scenarios throughout the ÉBENOR CRÉATION platform.
 */

import { useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { Button } from './Button';
import { toast } from './Toast';
import { Trash2, Archive, Eye, EyeOff } from 'lucide-react';

/**
 * Example 1: Delete Product
 * Most common use case - deleting a product with consequences
 */
export function DeleteProductExample() {
  const confirmDialog = useConfirmDialog();

  const handleDelete = async () => {
    const confirmed = await confirmDialog.openDialog({
      title: 'Supprimer le produit',
      message: 'Êtes-vous sûr de vouloir supprimer ce produit ?',
      variant: 'danger',
      confirmLabel: 'Supprimer',
      consequences: [
        'Le produit sera définitivement supprimé',
        'Il ne sera plus visible sur le site public',
        'Cette action ne peut pas être annulée',
        'Les images associées seront conservées dans la bibliothèque'
      ]
    });

    if (confirmed) {
      confirmDialog.setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success('Produit supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression du produit');
      } finally {
        confirmDialog.setLoading(false);
        confirmDialog.closeDialog();
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Example 1: Delete Product</h3>
      <Button
        variant="danger"
        onClick={handleDelete}
        leftIcon={<Trash2 />}
      >
        Supprimer le produit
      </Button>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.cancel}
        onConfirm={confirmDialog.confirm}
        isLoading={confirmDialog.isLoading}
        {...confirmDialog.options}
      />
    </div>
  );
}

/**
 * Example 2: Unpublish Product
 * Warning variant for non-destructive but important actions
 */
export function UnpublishProductExample() {
  const confirmDialog = useConfirmDialog();

  const handleUnpublish = async () => {
    const confirmed = await confirmDialog.openDialog({
      title: 'Dépublier le produit',
      message: 'Le produit ne sera plus visible sur le site public.',
      variant: 'warning',
      confirmLabel: 'Dépublier',
      cancelLabel: 'Annuler',
      consequences: [
        'Le produit sera masqué du site public',
        'Vous pourrez le republier à tout moment',
        'Les données du produit seront conservées'
      ]
    });

    if (confirmed) {
      confirmDialog.setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Produit dépublié avec succès');
      } catch (error) {
        toast.error('Erreur lors de la dépublication');
      } finally {
        confirmDialog.setLoading(false);
        confirmDialog.closeDialog();
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Example 2: Unpublish Product</h3>
      <Button
        variant="secondary"
        onClick={handleUnpublish}
        leftIcon={<EyeOff />}
      >
        Dépublier le produit
      </Button>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.cancel}
        onConfirm={confirmDialog.confirm}
        isLoading={confirmDialog.isLoading}
        {...confirmDialog.options}
      />
    </div>
  );
}

/**
 * Example 3: Delete Gallery Image
 * Simple deletion with minimal consequences
 */
export function DeleteGalleryImageExample() {
  const confirmDialog = useConfirmDialog();

  const handleDelete = async () => {
    const confirmed = await confirmDialog.openDialog({
      title: 'Supprimer l\'image',
      message: 'Êtes-vous sûr de vouloir supprimer cette image de la galerie ?',
      variant: 'danger',
      confirmLabel: 'Supprimer',
      consequences: [
        'L\'image sera définitivement supprimée',
        'Elle ne sera plus visible sur le site',
        'Cette action ne peut pas être annulée'
      ]
    });

    if (confirmed) {
      confirmDialog.setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Image supprimée avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      } finally {
        confirmDialog.setLoading(false);
        confirmDialog.closeDialog();
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Example 3: Delete Gallery Image</h3>
      <Button
        variant="danger"
        size="sm"
        onClick={handleDelete}
        leftIcon={<Trash2 />}
      >
        Supprimer l'image
      </Button>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.cancel}
        onConfirm={confirmDialog.confirm}
        isLoading={confirmDialog.isLoading}
        {...confirmDialog.options}
      />
    </div>
  );
}

/**
 * Example 4: Archive Message
 * Warning variant for archiving
 */
export function ArchiveMessageExample() {
  const confirmDialog = useConfirmDialog();

  const handleArchive = async () => {
    const confirmed = await confirmDialog.openDialog({
      title: 'Archiver le message',
      message: 'Le message sera déplacé vers les archives.',
      variant: 'warning',
      confirmLabel: 'Archiver',
      consequences: [
        'Le message ne sera plus visible dans la liste principale',
        'Vous pourrez le retrouver dans les archives',
        'Le message ne sera pas supprimé'
      ]
    });

    if (confirmed) {
      confirmDialog.setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Message archivé avec succès');
      } catch (error) {
        toast.error('Erreur lors de l\'archivage');
      } finally {
        confirmDialog.setLoading(false);
        confirmDialog.closeDialog();
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Example 4: Archive Message</h3>
      <Button
        variant="secondary"
        onClick={handleArchive}
        leftIcon={<Archive />}
      >
        Archiver le message
      </Button>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.cancel}
        onConfirm={confirmDialog.confirm}
        isLoading={confirmDialog.isLoading}
        {...confirmDialog.options}
      />
    </div>
  );
}

/**
 * Example 5: Publish Product
 * Info variant for informational confirmations
 */
export function PublishProductExample() {
  const confirmDialog = useConfirmDialog();

  const handlePublish = async () => {
    const confirmed = await confirmDialog.openDialog({
      title: 'Publier le produit',
      message: 'Le produit sera visible sur le site public.',
      variant: 'info',
      confirmLabel: 'Publier',
      consequences: [
        'Le produit sera visible par tous les visiteurs',
        'Il apparaîtra dans le catalogue',
        'Vous pourrez le dépublier à tout moment'
      ]
    });

    if (confirmed) {
      confirmDialog.setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Produit publié avec succès');
      } catch (error) {
        toast.error('Erreur lors de la publication');
      } finally {
        confirmDialog.setLoading(false);
        confirmDialog.closeDialog();
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Example 5: Publish Product</h3>
      <Button
        variant="primary"
        onClick={handlePublish}
        leftIcon={<Eye />}
      >
        Publier le produit
      </Button>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.cancel}
        onConfirm={confirmDialog.confirm}
        isLoading={confirmDialog.isLoading}
        {...confirmDialog.options}
      />
    </div>
  );
}

/**
 * Example 6: Simple State-Based Dialog
 * Without using the hook (for simpler cases)
 */
export function SimpleStateExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Action effectuée avec succès');
      setIsOpen(false);
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Example 6: Simple State-Based</h3>
      <Button
        variant="danger"
        onClick={() => setIsOpen(true)}
      >
        Supprimer
      </Button>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title="Confirmer la suppression"
        message="Cette action est irréversible."
        variant="danger"
        confirmLabel="Supprimer"
        isLoading={isLoading}
      />
    </div>
  );
}

/**
 * Example 7: With Rich Message Content
 * Using React nodes for complex messages
 */
export function RichMessageExample() {
  const confirmDialog = useConfirmDialog();

  const handleDelete = async () => {
    const productName = 'Table en chêne massif';
    const lastModified = '15 janvier 2024';

    const confirmed = await confirmDialog.openDialog({
      title: 'Supprimer le produit',
      message: (
        <div>
          <p className="mb-2">
            Vous êtes sur le point de supprimer <strong className="text-neutral-900">{productName}</strong>.
          </p>
          <p className="text-xs text-neutral-500">
            Dernière modification : {lastModified}
          </p>
        </div>
      ),
      variant: 'danger',
      confirmLabel: 'Supprimer',
      consequences: [
        'Le produit sera définitivement supprimé',
        'Cette action ne peut pas être annulée'
      ]
    });

    if (confirmed) {
      confirmDialog.setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Produit supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      } finally {
        confirmDialog.setLoading(false);
        confirmDialog.closeDialog();
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Example 7: Rich Message Content</h3>
      <Button
        variant="danger"
        onClick={handleDelete}
      >
        Supprimer avec détails
      </Button>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.cancel}
        onConfirm={confirmDialog.confirm}
        isLoading={confirmDialog.isLoading}
        {...confirmDialog.options}
      />
    </div>
  );
}

/**
 * All Examples Component
 * Displays all examples in a grid
 */
export function AllConfirmDialogExamples() {
  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">ConfirmDialog Examples</h1>
        <p className="text-neutral-600">
          Practical examples of using the ConfirmDialog component in various scenarios.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 border border-neutral-200 rounded-lg">
          <DeleteProductExample />
        </div>

        <div className="p-6 border border-neutral-200 rounded-lg">
          <UnpublishProductExample />
        </div>

        <div className="p-6 border border-neutral-200 rounded-lg">
          <DeleteGalleryImageExample />
        </div>

        <div className="p-6 border border-neutral-200 rounded-lg">
          <ArchiveMessageExample />
        </div>

        <div className="p-6 border border-neutral-200 rounded-lg">
          <PublishProductExample />
        </div>

        <div className="p-6 border border-neutral-200 rounded-lg">
          <SimpleStateExample />
        </div>

        <div className="p-6 border border-neutral-200 rounded-lg col-span-full">
          <RichMessageExample />
        </div>
      </div>
    </div>
  );
}
