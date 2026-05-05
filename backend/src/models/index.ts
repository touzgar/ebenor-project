// Export de tous les modèles Mongoose
export { HomeContent, HomeContentDocument } from './HomeContent';
export { Product, ProductDocument } from './Product';
export { GalleryImage, GalleryImageDocument } from './GalleryImage';
export { Message, MessageDocument } from './Message';
export { AdminUser, AdminUserDocument } from './AdminUser';
export { AuditLog, AuditLogDocument } from './AuditLog';

// Types pour les requêtes de base de données
export interface DatabaseModels {
  HomeContent: typeof HomeContent;
  Product: typeof Product;
  GalleryImage: typeof GalleryImage;
  Message: typeof Message;
  AdminUser: typeof AdminUser;
  AuditLog: typeof AuditLog;
}

// Fonction utilitaire pour initialiser les modèles
export async function initializeModels(): Promise<void> {
  try {
    // Créer l'utilisateur admin par défaut s'il n'existe pas
    const { AdminUser } = await import('./AdminUser');
    await AdminUser.createDefaultAdmin();
    
    console.log('✅ Modèles de base de données initialisés avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des modèles:', error);
    throw error;
  }
}

// Fonction pour créer les index de base de données
export async function createIndexes(): Promise<void> {
  try {
    const models = [
      (await import('./HomeContent')).HomeContent,
      (await import('./Product')).Product,
      (await import('./GalleryImage')).GalleryImage,
      (await import('./Message')).Message,
      (await import('./AdminUser')).AdminUser,
      (await import('./AuditLog')).AuditLog
    ];

    for (const model of models) {
      await model.createIndexes();
      console.log(`✅ Index créés pour ${model.modelName}`);
    }
    
    console.log('✅ Tous les index de base de données ont été créés');
  } catch (error) {
    console.error('❌ Erreur lors de la création des index:', error);
    throw error;
  }
}