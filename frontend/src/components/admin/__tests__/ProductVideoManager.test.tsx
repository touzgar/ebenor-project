import { render, screen, fireEvent } from '@testing-library/react';
import { ProductVideoManager } from '../ProductVideoManager';
import type { ProductVideo } from '../ProductVideoManager';

describe('ProductVideoManager', () => {
  it('renders upload mode by default', () => {
    const mockOnChange = jest.fn();
    render(<ProductVideoManager video={null} onChange={mockOnChange} />);
    
    expect(screen.getByText('Télécharger un fichier')).toBeInTheDocument();
    expect(screen.getByText('URL de vidéo')).toBeInTheDocument();
  });

  it('switches between upload and URL modes', () => {
    const mockOnChange = jest.fn();
    render(<ProductVideoManager video={null} onChange={mockOnChange} />);
    
    const urlButton = screen.getByText('URL de vidéo');
    fireEvent.click(urlButton);
    
    expect(screen.getByLabelText('URL de la vidéo')).toBeInTheDocument();
  });

  it('displays video when provided', () => {
    const mockOnChange = jest.fn();
    const mockVideo: ProductVideo = {
      url: 'https://example.com/video.mp4',
      publicId: 'test-video',
    };
    
    render(<ProductVideoManager video={mockVideo} onChange={mockOnChange} />);
    
    expect(screen.getByText('Vidéo externe')).toBeInTheDocument();
    expect(screen.getByText('Supprimer')).toBeInTheDocument();
  });

  it('validates file size', () => {
    const mockOnChange = jest.fn();
    render(<ProductVideoManager video={null} onChange={mockOnChange} maxFileSize={100} />);
    
    // Create a mock file that's too large (101MB)
    const largeFile = new File(['x'.repeat(101 * 1024 * 1024)], 'large-video.mp4', {
      type: 'video/mp4',
    });
    
    const input = screen.getByRole('button', { name: /cliquez pour sélectionner/i })
      .parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
    
    if (input) {
      Object.defineProperty(input, 'files', {
        value: [largeFile],
        writable: false,
      });
      
      fireEvent.change(input);
      
      expect(screen.getByText(/Fichier trop volumineux/i)).toBeInTheDocument();
    }
  });

  it('validates file type', () => {
    const mockOnChange = jest.fn();
    render(<ProductVideoManager video={null} onChange={mockOnChange} />);
    
    // Create a mock file with invalid type
    const invalidFile = new File(['test'], 'video.avi', {
      type: 'video/avi',
    });
    
    const input = screen.getByRole('button', { name: /cliquez pour sélectionner/i })
      .parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
    
    if (input) {
      Object.defineProperty(input, 'files', {
        value: [invalidFile],
        writable: false,
      });
      
      fireEvent.change(input);
      
      expect(screen.getByText(/Format non autorisé/i)).toBeInTheDocument();
    }
  });

  it('validates URL format', () => {
    const mockOnChange = jest.fn();
    render(<ProductVideoManager video={null} onChange={mockOnChange} />);
    
    // Switch to URL mode
    const urlButton = screen.getByText('URL de vidéo');
    fireEvent.click(urlButton);
    
    // Enter invalid URL
    const urlInput = screen.getByLabelText('URL de la vidéo');
    fireEvent.change(urlInput, { target: { value: 'not-a-url' } });
    
    const addButton = screen.getByRole('button', { name: /ajouter/i });
    fireEvent.click(addButton);
    
    expect(screen.getByText(/URL invalide/i)).toBeInTheDocument();
  });

  it('calls onChange when valid video is added', () => {
    const mockOnChange = jest.fn();
    render(<ProductVideoManager video={null} onChange={mockOnChange} />);
    
    // Switch to URL mode
    const urlButton = screen.getByText('URL de vidéo');
    fireEvent.click(urlButton);
    
    // Enter valid URL
    const urlInput = screen.getByLabelText('URL de la vidéo');
    fireEvent.change(urlInput, { target: { value: 'https://example.com/video.mp4' } });
    
    const addButton = screen.getByRole('button', { name: /ajouter/i });
    fireEvent.click(addButton);
    
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://example.com/video.mp4',
        uploading: false,
      })
    );
  });

  it('calls onChange with null when video is deleted', () => {
    const mockOnChange = jest.fn();
    const mockVideo: ProductVideo = {
      url: 'https://example.com/video.mp4',
      publicId: 'test-video',
    };
    
    render(<ProductVideoManager video={mockVideo} onChange={mockOnChange} />);
    
    const deleteButton = screen.getByText('Supprimer');
    fireEvent.click(deleteButton);
    
    expect(mockOnChange).toHaveBeenCalledWith(null);
  });

  it('displays empty state when no video', () => {
    const mockOnChange = jest.fn();
    render(<ProductVideoManager video={null} onChange={mockOnChange} />);
    
    expect(screen.getByText('Aucune vidéo ajoutée')).toBeInTheDocument();
    expect(screen.getByText('Ajoutez une vidéo pour présenter votre produit')).toBeInTheDocument();
  });
});
