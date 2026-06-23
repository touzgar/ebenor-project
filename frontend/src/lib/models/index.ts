// Export all models
export { AdminUser } from './AdminUser';
export { Product } from './Product';
export { Category } from './Category';
export { GalleryImage } from './GalleryImage';
export { Message } from './Message';
export { HomeContent } from './HomeContent';
export { ShowroomContent } from './ShowroomContent';
export { AuditLog } from './AuditLog';

// Export types
export type { IAdminUser, AdminUserDocument } from './AdminUser';
export type { IProduct, ProductDocument } from './Product';
export type { ICategory } from './Category';
export type { IGalleryImage, GalleryImageDocument } from './GalleryImage';
export type { IMessage, MessageDocument } from './Message';
export type { IHomeContent, HomeContentDocument } from './HomeContent';
export type { IShowroomContent } from './ShowroomContent';
export type { IAuditLog, AuditLogDocument } from './AuditLog';

import { AdminUser } from './AdminUser';
import { Category } from './Category';

/**
 * Initialize default data (admin user and categories)
 */
export async function initializeModels(): Promise<void> {
  try {
    // Create default admin if not exists
    await AdminUser.createIndexes();
    const existingAdmin = await AdminUser.findOne({ role: 'super_admin' });
    
    if (!existingAdmin) {
      const defaultAdmin = new AdminUser({
        email: 'admin@ebenor-creation.tn',
        password: 'Admin123!',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'super_admin',
        permissions: [
          { resource: 'products', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'gallery', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'messages', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'home_content', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'settings', actions: ['create', 'read', 'update', 'delete'] }
        ]
      });
      await defaultAdmin.save();
      console.log('✅ Default admin created');
    }
    
    // Create default categories
    const defaultCategories = [
      {
        name: 'Cuisine',
        slug: 'cuisine',
        description: 'Meubles de cuisine sur mesure',
        icon: '🍳',
        color: '#ef4444',
        displayOrder: 1,
      },
      {
        name: 'Dressing',
        slug: 'dressing',
        description: 'Dressings et rangements personnalisés',
        icon: '👔',
        color: '#3b82f6',
        displayOrder: 2,
      },
      {
        name: 'Mobilier',
        slug: 'mobilier',
        description: 'Mobilier sur mesure pour tous espaces',
        icon: '🪑',
        color: '#10b981',
        displayOrder: 3,
      },
      {
        name: 'Aménagement',
        slug: 'amenagement',
        description: 'Aménagement intérieur complet',
        icon: '🏠',
        color: '#f59e0b',
        displayOrder: 4,
      },
      {
        name: 'Salon',
        slug: 'salon',
        description: 'Meubles et aménagements pour le salon',
        icon: '🛋️',
        color: '#8b5cf6',
        displayOrder: 5,
      },
      {
        name: 'Chambre à coucher',
        slug: 'chambre-a-coucher',
        description: 'Lits, tables de chevet et rangements de chambre',
        icon: '🛏️',
        color: '#ec4899',
        displayOrder: 6,
      },
      {
        name: 'Autre',
        slug: 'autre',
        description: 'Autres créations sur mesure',
        icon: '📦',
        color: '#6b7280',
        displayOrder: 7,
      },
    ];

    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
        console.log(`✅ Default category created: ${cat.name}`);
      }
    }

    console.log('✅ Models initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing models:', error);
    throw error;
  }
}
