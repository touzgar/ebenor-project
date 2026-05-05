import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductBulkActions from '../ProductBulkActions';
import { productsService } from '@/lib/api';

// Mock the API service
jest.mock('@/lib/api', () => ({
  productsService: {
    bulkOperations: jest.fn(),
  },
}));

describe('ProductBulkActions', () => {
  const mockOnSuccess = jest.fn();
  const mockOnClear = jest.fn();
  const selectedProductIds = ['1', '2', '3'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct selected count', () => {
    render(
      <ProductBulkActions
        selectedProductIds={selectedProductIds}
        onSuccess={mockOnSuccess}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText(/3 produits sélectionnés/i)).toBeInTheDocument();
  });

  it('displays all action buttons', () => {
    render(
      <ProductBulkActions
        selectedProductIds={selectedProductIds}
        onSuccess={mockOnSuccess}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText(/Mettre en vedette/i)).toBeInTheDocument();
    expect(screen.getByText(/Retirer vedette/i)).toBeInTheDocument();
    expect(screen.getByText(/Changer catégorie/i)).toBeInTheDocument();
    expect(screen.getByText(/Supprimer/i)).toBeInTheDocument();
    expect(screen.getByText(/Annuler/i)).toBeInTheDocument();
  });

  it('calls onClear when cancel button is clicked', () => {
    render(
      <ProductBulkActions
        selectedProductIds={selectedProductIds}
        onSuccess={mockOnSuccess}
        onClear={mockOnClear}
      />
    );

    const cancelButton = screen.getByText(/Annuler/i);
    fireEvent.click(cancelButton);

    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it('executes feature action without confirmation', async () => {
    (productsService.bulkOperations as jest.Mock).mockResolvedValue({
      success: true,
    });

    render(
      <ProductBulkActions
        selectedProductIds={selectedProductIds}
        onSuccess={mockOnSuccess}
        onClear={mockOnClear}
      />
    );

    const featureButton = screen.getByText(/Mettre en vedette/i);
    fireEvent.click(featureButton);

    await waitFor(() => {
      expect(productsService.bulkOperations).toHaveBeenCalledWith({
        action: 'feature',
        productIds: selectedProductIds,
        data: undefined,
      });
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnClear).toHaveBeenCalled();
    });
  });

  it('shows confirmation dialog for delete action', () => {
    render(
      <ProductBulkActions
        selectedProductIds={selectedProductIds}
        onSuccess={mockOnSuccess}
        onClear={mockOnClear}
      />
    );

    const deleteButton = screen.getByText(/Supprimer/i);
    fireEvent.click(deleteButton);

    expect(screen.getByText(/Confirmer la suppression/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Êtes-vous sûr de vouloir supprimer/i)
    ).toBeInTheDocument();
  });

  it('shows category dialog for change category action', () => {
    render(
      <ProductBulkActions
        selectedProductIds={selectedProductIds}
        onSuccess={mockOnSuccess}
        onClear={mockOnClear}
      />
    );

    const changeCategoryButton = screen.getByText(/Changer catégorie/i);
    fireEvent.click(changeCategoryButton);

    expect(screen.getByText(/Changer la catégorie/i)).toBeInTheDocument();
    expect(screen.getByText(/Sélectionner une catégorie/i)).toBeInTheDocument();
  });

  it('executes delete action after confirmation', async () => {
    (productsService.bulkOperations as jest.Mock).mockResolvedValue({
      success: true,
    });

    render(
      <ProductBulkActions
        selectedProductIds={selectedProductIds}
        onSuccess={mockOnSuccess}
        onClear={mockOnClear}
      />
    );

    // Open delete confirmation dialog
    const deleteButton = screen.getByText(/Supprimer/i);
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getAllByText(/Supprimer/i)[1]; // Second "Supprimer" button in dialog
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(productsService.bulkOperations).toHaveBeenCalledWith({
        action: 'delete',
        productIds: selectedProductIds,
        data: undefined,
      });
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnClear).toHaveBeenCalled();
    });
  });

  it('executes change category action with selected category', async () => {
    (productsService.bulkOperations as jest.Mock).mockResolvedValue({
      success: true,
    });

    render(
      <ProductBulkActions
        selectedProductIds={selectedProductIds}
        onSuccess={mockOnSuccess}
        onClear={mockOnClear}
      />
    );

    // Open category dialog
    const changeCategoryButton = screen.getByText(/Changer catégorie/i);
    fireEvent.click(changeCategoryButton);

    // Select a category
    const categorySelect = screen.getByRole('combobox', { name: /Catégorie/i });
    fireEvent.change(categorySelect, { target: { value: 'cuisine' } });

    // Apply changes
    const applyButton = screen.getByText(/Appliquer/i);
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(productsService.bulkOperations).toHaveBeenCalledWith({
        action: 'changeCategory',
        productIds: selectedProductIds,
        data: { category: 'cuisine', subcategory: '' },
      });
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnClear).toHaveBeenCalled();
    });
  });

  it('shows error notification on API failure', async () => {
    (productsService.bulkOperations as jest.Mock).mockRejectedValue(
      new Error('API Error')
    );

    render(
      <ProductBulkActions
        selectedProductIds={selectedProductIds}
        onSuccess={mockOnSuccess}
        onClear={mockOnClear}
      />
    );

    const featureButton = screen.getByText(/Mettre en vedette/i);
    fireEvent.click(featureButton);

    await waitFor(() => {
      expect(screen.getByText(/API Error/i)).toBeInTheDocument();
    });

    // Should not call success callbacks on error
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockOnClear).not.toHaveBeenCalled();
  });

  it('disables buttons while processing', async () => {
    (productsService.bulkOperations as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
    );

    render(
      <ProductBulkActions
        selectedProductIds={selectedProductIds}
        onSuccess={mockOnSuccess}
        onClear={mockOnClear}
      />
    );

    const featureButton = screen.getByText(/Mettre en vedette/i);
    fireEvent.click(featureButton);

    // Buttons should be disabled during processing
    await waitFor(() => {
      expect(featureButton).toBeDisabled();
    });
  });
});
