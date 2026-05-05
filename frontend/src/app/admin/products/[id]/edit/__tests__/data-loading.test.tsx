import { render, screen, waitFor } from '@testing-library/react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { productsService } from '@/lib/api';
import EditProductPage from '../page';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
  productsService: {
    getById: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('@/components/admin', () => ({
  Breadcrumb: () => <div>Breadcrumb</div>,
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('EditProductPage - Data Loading', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockProduct = {
    _id: 'test-product-id',
    name: 'Test Product',
    slug: 'test-product',
    category: 'mobilier',
    subcategory: 'Test Subcategory',
    shortDescription: 'Short description',
    description: 'Full description',
    images: [],
    specifications: { key1: 'value1' },
    materials: ['Wood', 'Metal'],
    finishes: ['Matte', 'Glossy'],
    tags: ['modern', 'luxury'],
    availability: 'in_stock',
    featured: true,
    dimensions: {
      length: 200,
      width: 100,
      height: 80,
      unit: 'cm',
    },
    price: {
      amount: 1500,
      currency: 'TND',
      unit: 'per unit',
    },
    seoTitle: 'SEO Title',
    seoDescription: 'SEO Description',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useParams as jest.Mock).mockReturnValue({ id: 'test-product-id' });
  });

  it('should show loading spinner while fetching product', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    (productsService.getById as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<EditProductPage />);

    expect(screen.getByText('Chargement du produit...')).toBeInTheDocument();
  });

  it('should load and populate form with product data', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    (productsService.getById as jest.Mock).mockResolvedValue({
      success: true,
      data: mockProduct,
    });

    render(<EditProductPage />);

    await waitFor(() => {
      expect(productsService.getById).toHaveBeenCalledWith('test-product-id');
    });

    await waitFor(() => {
      expect(screen.queryByText('Chargement du produit...')).not.toBeInTheDocument();
    });

    // Verify form fields are populated
    await waitFor(() => {
      const nameInput = screen.getByLabelText(/Nom du produit/i) as HTMLInputElement;
      expect(nameInput.value).toBe('Test Product');
    });
  });

  it('should handle 404 error when product not found', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    (productsService.getById as jest.Mock).mockRejectedValue(
      new Error('404 - Produit non trouvé')
    );

    render(<EditProductPage />);

    await waitFor(() => {
      expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
      expect(screen.getByText(/Produit non trouvé \(404\)/i)).toBeInTheDocument();
    });

    // Verify retry and back buttons are present
    expect(screen.getByText('Réessayer')).toBeInTheDocument();
    expect(screen.getByText('Retour à la liste')).toBeInTheDocument();
  });

  it('should handle network error', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    (productsService.getById as jest.Mock).mockRejectedValue(
      new Error('Network error: Failed to fetch')
    );

    render(<EditProductPage />);

    await waitFor(() => {
      expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
      expect(screen.getByText(/Erreur réseau/i)).toBeInTheDocument();
    });
  });

  it('should populate all optional fields when present', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    (productsService.getById as jest.Mock).mockResolvedValue({
      success: true,
      data: mockProduct,
    });

    render(<EditProductPage />);

    await waitFor(() => {
      expect(productsService.getById).toHaveBeenCalledWith('test-product-id');
    });

    await waitFor(() => {
      // Check dimensions are populated
      const lengthInput = screen.getByLabelText(/Longueur/i) as HTMLInputElement;
      expect(lengthInput.value).toBe('200');

      // Check price is populated
      const priceInput = screen.getByLabelText(/Montant/i) as HTMLInputElement;
      expect(priceInput.value).toBe('1500');

      // Check SEO fields are populated
      const seoTitleInput = screen.getByLabelText(/Titre SEO/i) as HTMLInputElement;
      expect(seoTitleInput.value).toBe('SEO Title');
    });
  });

  it('should handle product without optional fields', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    const minimalProduct = {
      _id: 'test-product-id',
      name: 'Minimal Product',
      slug: 'minimal-product',
      category: 'mobilier',
      shortDescription: 'Short description',
      description: 'Full description',
      images: [],
      specifications: {},
      materials: [],
      finishes: [],
      tags: [],
      availability: 'made_to_order',
      featured: false,
    };

    (productsService.getById as jest.Mock).mockResolvedValue({
      success: true,
      data: minimalProduct,
    });

    render(<EditProductPage />);

    await waitFor(() => {
      expect(productsService.getById).toHaveBeenCalledWith('test-product-id');
    });

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/Nom du produit/i) as HTMLInputElement;
      expect(nameInput.value).toBe('Minimal Product');
    });

    // Verify optional fields are empty
    const lengthInput = screen.getByLabelText(/Longueur/i) as HTMLInputElement;
    expect(lengthInput.value).toBe('');
  });

  it('should redirect to login if not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    render(<EditProductPage />);

    expect(mockRouter.push).toHaveBeenCalledWith('/admin/login');
  });

  it('should not fetch product while auth is loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    render(<EditProductPage />);

    expect(productsService.getById).not.toHaveBeenCalled();
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });
});
