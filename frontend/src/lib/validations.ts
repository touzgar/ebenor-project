import { z } from 'zod';

// Validation pour le formulaire de contact
export const contactFormSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Veuillez sélectionner un sujet'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
  consent: z.boolean().refine(val => val === true, 'Vous devez accepter les conditions'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Validation pour le login admin
export const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Validation pour les produits
export const productSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  shortDescription: z.string().min(5, 'La description courte doit contenir au moins 5 caractères'),
  category: z.string().min(1, 'Veuillez sélectionner une catégorie'),
  subcategory: z.string().optional(),
  specifications: z.record(z.string()).optional(),
  dimensions: z.object({
    length: z.number().positive().optional(),
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
    unit: z.enum(['cm', 'm']).default('cm'),
  }).optional(),
  materials: z.array(z.string()).optional(),
  finishes: z.array(z.string()).optional(),
  price: z.object({
    amount: z.number().positive(),
    currency: z.string().default('TND'),
    unit: z.string().optional(),
  }).optional(),
  availability: z.enum(['in_stock', 'made_to_order', 'out_of_stock']).default('in_stock'),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Validation pour les images de galerie
export const galleryImageSchema = z.object({
  title: z.string().min(2, 'Le titre doit contenir au moins 2 caractères'),
  description: z.string().optional(),
  category: z.string().min(1, 'Veuillez sélectionner une catégorie'),
  tags: z.array(z.string()).optional(),
  alt: z.string().min(2, 'Le texte alternatif est requis'),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
});

export type GalleryImageFormData = z.infer<typeof galleryImageSchema>;

// Validation pour le contenu de la page d'accueil
export const homeContentSchema = z.object({
  hero: z.object({
    title: z.string().min(2, 'Le titre est requis'),
    subtitle: z.string().min(2, 'Le sous-titre est requis'),
    backgroundImage: z.string().url('URL d\'image invalide'),
    ctaText: z.string().min(2, 'Le texte du bouton est requis'),
    ctaLink: z.string().min(1, 'Le lien est requis'),
  }),
  about: z.object({
    title: z.string().min(2, 'Le titre est requis'),
    description: z.string().min(10, 'La description est requise'),
    image: z.string().url('URL d\'image invalide'),
    highlights: z.array(z.string()).min(1, 'Au moins un point fort est requis'),
  }),
  services: z.array(z.object({
    title: z.string().min(2, 'Le titre est requis'),
    description: z.string().min(10, 'La description est requise'),
    icon: z.string().min(1, 'L\'icône est requise'),
    image: z.string().url('URL d\'image invalide'),
  })).min(1, 'Au moins un service est requis'),
  process: z.array(z.object({
    step: z.number().int().positive(),
    title: z.string().min(2, 'Le titre est requis'),
    description: z.string().min(10, 'La description est requise'),
    image: z.string().url('URL d\'image invalide'),
  })).min(1, 'Au moins une étape est requise'),
  testimonials: z.array(z.object({
    name: z.string().min(2, 'Le nom est requis'),
    company: z.string().min(2, 'L\'entreprise est requise'),
    text: z.string().min(10, 'Le témoignage est requis'),
    rating: z.number().int().min(1).max(5),
    image: z.string().url().optional(),
  })).optional(),
  contact: z.object({
    address: z.string().min(5, 'L\'adresse est requise'),
    phone: z.string().min(8, 'Le téléphone est requis'),
    email: z.string().email('Email invalide'),
    whatsapp: z.string().min(8, 'Le numéro WhatsApp est requis'),
    workingHours: z.string().min(5, 'Les horaires sont requis'),
  }),
});

export type HomeContentFormData = z.infer<typeof homeContentSchema>;

// Utilitaires de validation
export const validateFile = (file: File, maxSize: number = 5 * 1024 * 1024) => {
  const errors: string[] = [];
  
  // Vérifier la taille
  if (file.size > maxSize) {
    errors.push(`Le fichier est trop volumineux (max ${maxSize / 1024 / 1024}MB)`);
  }
  
  // Vérifier le type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Type de fichier non autorisé (JPEG, PNG, WebP uniquement)');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Validation pour numéros tunisiens
  const phoneRegex = /^(\+216|216|0)?[2-9]\d{7}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};