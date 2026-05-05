# ConfirmDialog Component

A reusable confirmation dialog component for destructive or important actions in the ÉBENOR CRÉATION platform.

## Features

- ✅ **Multiple Variants**: Danger (red), Warning (amber), Info (blue)
- ✅ **Keyboard Navigation**: Escape to cancel, Enter to confirm
- ✅ **Accessible**: ARIA labels, focus management, screen reader support
- ✅ **Smooth Animations**: Framer Motion animations for professional UX
- ✅ **Loading States**: Built-in loading state for async operations
- ✅ **Customizable**: Custom messages, button labels, and consequences
- ✅ **Responsive**: Works on all screen sizes
- ✅ **Design System**: Matches ÉBENOR CRÉATION design system

## Installation

The component is already installed and exported from `@/components/ui`.

```tsx
import { ConfirmDialog } from '@/components/ui';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
```

## Basic Usage

### Simple Confirmation Dialog

```tsx
'use client';

import { useState } from 'react';
import { ConfirmDialog } from '@/components/ui';

export function DeleteProductButton({ productId }: { productId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    // Perform delete action
    await deleteProduct(productId);
    setIsDialogOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsDialogOpen(true)}>
        Supprimer
      </button>

      <ConfirmDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer le produit"
        message="Êtes-vous sûr de vouloir supprimer ce produit ?"
        variant="danger"
        confirmLabel="Supprimer"
      />
    </>
  );
}
```

### Using the Hook (Recommended)

The `useConfirmDialog` hook provides a cleaner API with promise-based confirmation:

```tsx
'use client';

import { ConfirmDialog } from '@/components/ui';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';

export function DeleteProductButton({ productId }: { productId: string }) {
  const confirmDialog = useConfirmDialog();

  const handleDelete = async () => {
    const confirmed = await confirmDialog.openDialog({
      title: 'Supprimer le produit',
      message: 'Êtes-vous sûr de vouloir supprimer ce produit ?',
      variant: 'danger',
      confirmLabel: 'Supprimer',
      consequences: [
        'Le produit sera définitivement supprimé',
        'Cette action ne peut pas être annulée',
        'Les images associées seront conservées dans la bibliothèque'
      ]
    });

    if (confirmed) {
      confirmDialog.setLoading(true);
      try {
        await deleteProduct(productId);
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
    <>
      <button onClick={handleDelete}>
        Supprimer
      </button>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.cancel}
        onConfirm={confirmDialog.confirm}
        isLoading={confirmDialog.isLoading}
        {...confirmDialog.options}
      />
    </>
  );
}
```

## Variants

### Danger (Default)

Use for destructive actions like deleting content:

```tsx
<ConfirmDialog
  variant="danger"
  title="Supprimer le produit"
  message="Cette action est irréversible."
  confirmLabel="Supprimer"
  // ... other props
/>
```

### Warning

Use for actions that require caution but aren't destructive:

```tsx
<ConfirmDialog
  variant="warning"
  title="Dépublier le produit"
  message="Le produit ne sera plus visible sur le site public."
  confirmLabel="Dépublier"
  // ... other props
/>
```

### Info

Use for informational confirmations:

```tsx
<ConfirmDialog
  variant="info"
  title="Sauvegarder les modifications"
  message="Voulez-vous sauvegarder vos modifications avant de quitter ?"
  confirmLabel="Sauvegarder"
  // ... other props
/>
```

## Advanced Usage

### With Consequences

Display a list of consequences to help users understand the impact:

```tsx
<ConfirmDialog
  isOpen={isOpen}
  onClose={onClose}
  onConfirm={onConfirm}
  title="Supprimer la galerie"
  message="Êtes-vous sûr de vouloir supprimer cette galerie ?"
  variant="danger"
  confirmLabel="Supprimer"
  consequences={[
    'Toutes les images de la galerie seront supprimées',
    'Les images ne seront plus disponibles sur le site',
    'Cette action ne peut pas être annulée',
    'Les sauvegardes seront conservées pendant 30 jours'
  ]}
/>
```

### With Loading State

Show loading state during async operations:

```tsx
const [isLoading, setIsLoading] = useState(false);

const handleConfirm = async () => {
  setIsLoading(true);
  try {
    await performAction();
    onClose();
  } catch (error) {
    toast.error('Une erreur est survenue');
  } finally {
    setIsLoading(false);
  }
};

<ConfirmDialog
  isOpen={isOpen}
  onClose={onClose}
  onConfirm={handleConfirm}
  isLoading={isLoading}
  // ... other props
/>
```

### With Custom Icon

Override the default variant icon:

```tsx
import { Trash2 } from 'lucide-react';

<ConfirmDialog
  icon={<Trash2 className="w-6 h-6 text-red-600" />}
  // ... other props
/>
```

### With Rich Message Content

Use React nodes for complex messages:

```tsx
<ConfirmDialog
  message={
    <div>
      <p className="mb-2">
        Vous êtes sur le point de supprimer <strong>{productName}</strong>.
      </p>
      <p className="text-xs text-neutral-500">
        Dernière modification : {lastModified}
      </p>
    </div>
  }
  // ... other props
/>
```

## Props

### ConfirmDialog Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Whether the dialog is open (required) |
| `onClose` | `() => void` | - | Callback when dialog is closed (required) |
| `onConfirm` | `() => void` | - | Callback when confirm button is clicked (required) |
| `title` | `string` | - | Dialog title (required) |
| `message` | `string \| ReactNode` | - | Dialog message/description (required) |
| `variant` | `'danger' \| 'warning' \| 'info'` | `'danger'` | Visual variant |
| `confirmLabel` | `string` | `'Confirmer'` | Confirm button label |
| `cancelLabel` | `string` | `'Annuler'` | Cancel button label |
| `isLoading` | `boolean` | `false` | Loading state |
| `consequences` | `string[]` | `[]` | List of consequences |
| `icon` | `ReactNode` | - | Custom icon (overrides variant icon) |

### useConfirmDialog Hook

Returns an object with:

| Property | Type | Description |
|----------|------|-------------|
| `isOpen` | `boolean` | Whether the dialog is open |
| `isLoading` | `boolean` | Whether the confirm action is loading |
| `options` | `UseConfirmDialogOptions` | Current dialog options |
| `openDialog` | `(options) => Promise<boolean>` | Open dialog and return promise |
| `closeDialog` | `() => void` | Close the dialog |
| `confirm` | `() => void` | Confirm the action |
| `cancel` | `() => void` | Cancel the action |
| `setLoading` | `(loading: boolean) => void` | Set loading state |

## Keyboard Navigation

- **Escape**: Close the dialog (cancel)
- **Enter**: Confirm the action
- **Tab**: Navigate between buttons
- **Space/Enter**: Activate focused button

## Accessibility

The component follows WCAG 2.1 Level AA guidelines:

- ✅ Proper ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus management (focus trap within dialog)
- ✅ Screen reader announcements
- ✅ Color contrast ratios meet AA standards
- ✅ Focus indicators visible
- ✅ Backdrop click to close (with keyboard alternative)

## Best Practices

### 1. Use Appropriate Variants

- **Danger**: For destructive actions (delete, remove, destroy)
- **Warning**: For actions requiring caution (unpublish, archive, reset)
- **Info**: For informational confirmations (save, continue, proceed)

### 2. Write Clear Messages

```tsx
// ❌ Bad: Vague message
message="Êtes-vous sûr ?"

// ✅ Good: Clear and specific
message="Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible."
```

### 3. Use Consequences for Complex Actions

```tsx
// ✅ Good: Help users understand the impact
consequences={[
  'Le produit sera définitivement supprimé',
  'Les images associées seront conservées',
  'Cette action ne peut pas être annulée'
]}
```

### 4. Use Action-Specific Button Labels

```tsx
// ❌ Bad: Generic labels
confirmLabel="OK"

// ✅ Good: Action-specific labels
confirmLabel="Supprimer le produit"
```

### 5. Handle Loading States

```tsx
// ✅ Good: Show loading during async operations
const handleConfirm = async () => {
  confirmDialog.setLoading(true);
  try {
    await deleteProduct();
  } finally {
    confirmDialog.setLoading(false);
    confirmDialog.closeDialog();
  }
};
```

## Examples

### Delete Product

```tsx
const confirmed = await confirmDialog.openDialog({
  title: 'Supprimer le produit',
  message: 'Êtes-vous sûr de vouloir supprimer ce produit ?',
  variant: 'danger',
  confirmLabel: 'Supprimer',
  consequences: [
    'Le produit sera définitivement supprimé',
    'Cette action ne peut pas être annulée'
  ]
});
```

### Unpublish Product

```tsx
const confirmed = await confirmDialog.openDialog({
  title: 'Dépublier le produit',
  message: 'Le produit ne sera plus visible sur le site public.',
  variant: 'warning',
  confirmLabel: 'Dépublier',
  cancelLabel: 'Annuler'
});
```

### Delete Gallery Image

```tsx
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
```

### Archive Message

```tsx
const confirmed = await confirmDialog.openDialog({
  title: 'Archiver le message',
  message: 'Le message sera déplacé vers les archives.',
  variant: 'warning',
  confirmLabel: 'Archiver',
  consequences: [
    'Le message ne sera plus visible dans la liste principale',
    'Vous pourrez le retrouver dans les archives'
  ]
});
```

## Styling

The component uses Tailwind CSS and follows the ÉBENOR CRÉATION design system:

- **Primary color**: Amber (amber-600, amber-700)
- **Danger color**: Red (red-600, red-700)
- **Warning color**: Amber (amber-600, amber-700)
- **Info color**: Blue (blue-600, blue-700)
- **Neutral colors**: Gray scale (neutral-50 to neutral-900)

## Testing

### Unit Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmDialog } from './ConfirmDialog';

test('calls onConfirm when confirm button is clicked', () => {
  const onConfirm = jest.fn();
  const onClose = jest.fn();

  render(
    <ConfirmDialog
      isOpen={true}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Test"
      message="Test message"
    />
  );

  fireEvent.click(screen.getByText('Confirmer'));
  expect(onConfirm).toHaveBeenCalled();
});
```

### Integration Tests

```tsx
test('confirms deletion and shows success toast', async () => {
  const { user } = renderWithUser(<DeleteProductButton productId="123" />);
  
  await user.click(screen.getByText('Supprimer'));
  await user.click(screen.getByText('Confirmer'));
  
  expect(await screen.findByText('Produit supprimé avec succès')).toBeInTheDocument();
});
```

## Troubleshooting

### Dialog doesn't close after confirm

Make sure to call `closeDialog()` or `onClose()` after the action completes:

```tsx
const handleConfirm = async () => {
  await performAction();
  confirmDialog.closeDialog(); // Don't forget this!
};
```

### Keyboard navigation not working

Ensure the dialog is properly focused. The component handles this automatically, but if you're having issues, check that there are no conflicting event handlers.

### Loading state not showing

Make sure to set loading state before the async operation:

```tsx
confirmDialog.setLoading(true); // Set BEFORE the operation
await performAction();
confirmDialog.setLoading(false); // Reset AFTER
```

## Related Components

- **Toast**: For success/error notifications after actions
- **Modal**: For general-purpose modals
- **Button**: Used internally for action buttons

## Support

For issues or questions, please refer to the main project documentation or contact the development team.
