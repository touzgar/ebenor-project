// Configuration de l'application
export const APP_CONFIG = {
  name: 'ÉBENOR CRÉATION',
  description: 'Fabrication de Bois Haut de Gamme en Tunisie',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  apiUrl: '/api', // ✅ FIXED: Now uses Next.js API routes instead of external server
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+216XXXXXXXX',
} as const;

// Routes de l'application
export const ROUTES = {
  public: {
    home: '/',
    products: '/produits',
    gallery: '/galerie',
    contact: '/contact',
  },
  admin: {
    root: '/admin',
    login: '/admin/login',
    dashboard: '/admin/dashboard',
    products: '/admin/products',
    gallery: '/admin/gallery',
    messages: '/admin/messages',
    home: '/admin/home',
  },
} as const;

// Catégories de produits
export const PRODUCT_CATEGORIES = [
  'Meubles',
  'Aménagements',
  'Décoration',
  'Sur Mesure',
] as const;

// Types de messages de contact
export const CONTACT_SUBJECTS = [
  { value: 'devis', label: 'Demande de devis' },
  { value: 'projet', label: 'Nouveau projet' },
  { value: 'information', label: 'Demande d\'information' },
  { value: 'autre', label: 'Autre' },
] as const;

// Statuts des messages
export const MESSAGE_STATUS = {
  NEW: 'new',
  READ: 'read',
  REPLIED: 'replied',
  ARCHIVED: 'archived',
} as const;

// Limites de fichiers
export const FILE_LIMITS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFiles: 10,
} as const;

// Messages d'erreur
export const ERROR_MESSAGES = {
  required: 'Ce champ est requis',
  email: 'Veuillez entrer une adresse email valide',
  phone: 'Veuillez entrer un numéro de téléphone valide',
  minLength: (min: number) => `Minimum ${min} caractères requis`,
  maxLength: (max: number) => `Maximum ${max} caractères autorisés`,
  fileSize: 'Le fichier est trop volumineux (max 5MB)',
  fileType: 'Type de fichier non autorisé',
  network: 'Erreur de connexion réseau',
  server: 'Erreur serveur, veuillez réessayer',
} as const;

// Messages de succès
export const SUCCESS_MESSAGES = {
  contactSent: 'Votre message a été envoyé avec succès !',
  productCreated: 'Produit créé avec succès',
  productUpdated: 'Produit mis à jour avec succès',
  productDeleted: 'Produit supprimé avec succès',
  imageUploaded: 'Image téléchargée avec succès',
  contentSaved: 'Contenu sauvegardé avec succès',
} as const;