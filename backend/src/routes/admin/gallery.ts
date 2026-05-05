import { Router } from 'express';
import { galleryController } from '@/controllers/galleryController';
import { authenticate } from '@/middleware/auth';
import { uploadLimiter } from '@/middleware/security';
import { 
  validateGalleryImage, 
  validateObjectIdParam,
  validateBulkOperation,
  validateSortOrder
} from '@/middleware/validation';

const router = Router();

// Toutes les routes admin nécessitent une authentification
router.use(authenticate);

// CRUD operations
router.post('/', uploadLimiter, validateGalleryImage, galleryController.createGalleryImage.bind(galleryController));
router.put('/:id', uploadLimiter, validateObjectIdParam('id'), validateGalleryImage, galleryController.updateGalleryImage.bind(galleryController));
router.delete('/:id', validateObjectIdParam('id'), galleryController.deleteGalleryImage.bind(galleryController));

// Bulk operations
router.post('/bulk', validateBulkOperation, galleryController.bulkOperations.bind(galleryController));

// Update sort order
router.put('/sort-order', validateSortOrder, galleryController.updateSortOrder.bind(galleryController));

// Get image by ID (for editing)
router.get('/:id', validateObjectIdParam('id'), galleryController.getImageById.bind(galleryController));

export default router;
