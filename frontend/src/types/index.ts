// Types partagés entre frontend et backend

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Types pour les modèles de données
export interface HomeContent {
  _id?: string;
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    ctaText: string;
    ctaLink: string;
  };
  about: {
    title: string;
    description: string;
    image: string;
    highlights: string[];
  };
  services: Array<{
    title: string;
    description: string;
    icon: string;
    image?: string;
  }>;
  process: Array<{
    step: number;
    title: string;
    description: string;
    image: string;
  }>;
  testimonials: Array<{
    name: string;
    company: string;
    text: string;
    rating: number;
    image?: string;
  }>;
  contact: {
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
    workingHours: string;
  };
  updatedAt?: Date;
  updatedBy?: string;
}

export interface Product {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  video?: {
    url: string;
    publicId?: string;
    thumbnail?: string;
  };
  specifications: Record<string, string>;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit: 'cm' | 'm';
  };
  materials: string[];
  finishes: string[];
  price?: {
    amount: number;
    currency: string;
    unit?: string;
  };
  availability: 'in_stock' | 'made_to_order' | 'out_of_stock';
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
}

export interface GalleryImage {
  _id?: string;
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
  uploadedAt?: Date;
  uploadedBy?: string;
}

export interface Message {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  priority: 'low' | 'medium' | 'high';
  source: 'contact_form' | 'whatsapp' | 'email';
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date;
  readAt?: Date;
  repliedAt?: Date;
  notes?: Array<{
    text: string;
    createdAt: Date;
    createdBy: string;
  }>;
}

export interface AdminUser {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'editor';
  permissions: Array<{
    resource: string;
    actions: string[];
  }>;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Types pour les formulaires
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  specifications?: Record<string, string>;
  video?: {
    url: string;
    publicId?: string;
    thumbnail?: string;
  };
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit: 'cm' | 'm';
  };
  materials?: string[];
  finishes?: string[];
  price?: {
    amount: number;
    currency: string;
    unit?: string;
  };
  availability?: 'in_stock' | 'made_to_order' | 'out_of_stock';
  featured?: boolean;
  tags?: string[];
}

// Types pour les hooks et contextes
export interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AppError {
  message: string;
  statusCode?: number;
  code?: string;
}

// Types pour les composants
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Types pour les filtres et recherche
export interface ProductFilters {
  category?: string;
  search?: string;
  featured?: boolean;
  availability?: string;
  minPrice?: number;
  maxPrice?: number;
  materials?: string[];
  tags?: string[];
}

export interface GalleryFilters {
  category?: string;
  search?: string;
  featured?: boolean;
  tags?: string[];
}

export interface MessageFilters {
  status?: string;
  priority?: string;
  source?: string;
  dateFrom?: Date;
  dateTo?: Date;
}