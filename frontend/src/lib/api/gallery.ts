/**
 * Gallery API Client
 * Handles all gallery-related API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  alt: string;
  dimensions: {
    width: number;
    height: number;
  };
  fileSize: number;
  mimeType: string;
  featured: boolean;
  sortOrder: number;
  uploadedAt: string;
}

export interface GalleryFilters {
  category?: string;
  tags?: string[];
  featured?: boolean;
}

export interface GalleryResponse {
  success: boolean;
  data: GalleryImage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Fetch gallery images with filters and pagination
 */
export async function getGalleryImages(
  page: number = 1,
  limit: number = 20,
  filters: GalleryFilters = {}
): Promise<GalleryResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters.category) params.append('category', filters.category);
  if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
  if (filters.tags && filters.tags.length > 0) {
    filters.tags.forEach(tag => params.append('tags', tag));
  }

  const response = await fetch(`${API_BASE_URL}/gallery?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch gallery images: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch featured gallery images
 */
export async function getFeaturedGalleryImages(limit: number = 12): Promise<GalleryResponse> {
  const response = await fetch(`${API_BASE_URL}/gallery/featured?limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch featured gallery images: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get category label in French
 */
export function getGalleryCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    cuisine: 'Cuisine',
    dressing: 'Dressing',
    mobilier: 'Mobilier',
    amenagement: 'Aménagement',
    showroom: 'Showroom',
    process: 'Processus',
    autre: 'Autre',
  };
  return labels[category] || category;
}
