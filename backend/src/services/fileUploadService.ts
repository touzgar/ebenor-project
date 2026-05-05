import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { cloudinaryService, CloudinaryUploadOptions } from './cloudinaryService';
import { logger } from '@/utils/logger';

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

// File size limits (in bytes)
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export class FileUploadService {
  /**
   * Validate file type
   */
  public validateFileType(mimetype: string, allowedTypes: string[]): FileValidationResult {
    if (!allowedTypes.includes(mimetype)) {
      return {
        isValid: false,
        error: `Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`,
      };
    }
    return { isValid: true };
  }

  /**
   * Validate file size
   */
  public validateFileSize(size: number, maxSize: number): FileValidationResult {
    if (size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
      return {
        isValid: false,
        error: `Taille de fichier trop grande. Taille maximale: ${maxSizeMB}MB`,
      };
    }
    return { isValid: true };
  }

  /**
   * Validate image file
   */
  public validateImage(file: Express.Multer.File): FileValidationResult {
    // Validate type
    const typeValidation = this.validateFileType(file.mimetype, ALLOWED_IMAGE_TYPES);
    if (!typeValidation.isValid) {
      return typeValidation;
    }

    // Validate size
    const sizeValidation = this.validateFileSize(file.size, MAX_IMAGE_SIZE);
    if (!sizeValidation.isValid) {
      return sizeValidation;
    }

    return { isValid: true };
  }

  /**
   * Validate video file
   */
  public validateVideo(file: Express.Multer.File): FileValidationResult {
    // Validate type
    const typeValidation = this.validateFileType(file.mimetype, ALLOWED_VIDEO_TYPES);
    if (!typeValidation.isValid) {
      return typeValidation;
    }

    // Validate size
    const sizeValidation = this.validateFileSize(file.size, MAX_VIDEO_SIZE);
    if (!sizeValidation.isValid) {
      return sizeValidation;
    }

    return { isValid: true };
  }

  /**
   * Upload image to Cloudinary
   */
  public async uploadImage(
    file: Express.Multer.File,
    folder: string = 'products'
  ): Promise<any> {
    try {
      // Validate image
      const validation = this.validateImage(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Upload to Cloudinary
      const options: CloudinaryUploadOptions = {
        folder: `ebenor-creation/${folder}`,
        resource_type: 'image',
        tags: [folder],
      };

      const result = await cloudinaryService.uploadBuffer(file.buffer, options);

      logger.info('Image uploaded successfully', {
        public_id: result.public_id,
        folder,
      });

      return result;
    } catch (error) {
      logger.error('Error uploading image', { error });
      throw error;
    }
  }

  /**
   * Upload multiple images to Cloudinary
   */
  public async uploadImages(
    files: Express.Multer.File[],
    folder: string = 'products'
  ): Promise<any[]> {
    try {
      const uploadPromises = files.map((file) => this.uploadImage(file, folder));
      const results = await Promise.all(uploadPromises);

      logger.info('Multiple images uploaded successfully', {
        count: results.length,
        folder,
      });

      return results;
    } catch (error) {
      logger.error('Error uploading multiple images', { error });
      throw error;
    }
  }

  /**
   * Upload video to Cloudinary
   */
  public async uploadVideo(
    file: Express.Multer.File,
    folder: string = 'products'
  ): Promise<any> {
    try {
      // Validate video
      const validation = this.validateVideo(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Upload to Cloudinary
      const options: CloudinaryUploadOptions = {
        folder: `ebenor-creation/${folder}`,
        resource_type: 'video',
        tags: [folder],
      };

      const result = await cloudinaryService.uploadBuffer(file.buffer, options);

      logger.info('Video uploaded successfully', {
        public_id: result.public_id,
        folder,
      });

      return result;
    } catch (error) {
      logger.error('Error uploading video', { error });
      throw error;
    }
  }

  /**
   * Delete file from Cloudinary
   */
  public async deleteFile(publicId: string, resourceType: 'image' | 'video' = 'image'): Promise<void> {
    try {
      await cloudinaryService.deleteFile(publicId, resourceType);
      logger.info('File deleted successfully', { public_id: publicId });
    } catch (error) {
      logger.error('Error deleting file', { error, public_id: publicId });
      throw error;
    }
  }

  /**
   * Delete multiple files from Cloudinary
   */
  public async deleteFiles(publicIds: string[], resourceType: 'image' | 'video' = 'image'): Promise<void> {
    try {
      await cloudinaryService.deleteFiles(publicIds, resourceType);
      logger.info('Multiple files deleted successfully', { count: publicIds.length });
    } catch (error) {
      logger.error('Error deleting multiple files', { error });
      throw error;
    }
  }

  /**
   * Get responsive image URLs
   */
  public getResponsiveImageUrls(publicId: string): {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  } {
    return cloudinaryService.getResponsiveUrls(publicId);
  }
}

// Multer configuration for memory storage
export const multerConfig = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_VIDEO_SIZE, // Use max video size as the limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Accept all files here, validation will be done in the service
    cb(null, true);
  },
});

// Export singleton instance
export const fileUploadService = new FileUploadService();
