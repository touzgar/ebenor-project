import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryUploadOptions {
  folder?: string;
  transformation?: any[];
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  public_id?: string;
  overwrite?: boolean;
  tags?: string[];
}

export interface CloudinaryUploadResult {
  public_id: string;
  url: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  resource_type: string;
  created_at: string;
}

export class CloudinaryService {
  public async uploadBuffer(
    buffer: Buffer,
    options: CloudinaryUploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || 'ebenor-creation',
          resource_type: options.resource_type || 'auto',
          overwrite: options.overwrite !== undefined ? options.overwrite : false,
          tags: options.tags || [],
          timeout: 600000, // 10 minutes timeout for large files
          chunk_size: 6000000, // 6MB chunks for better upload stability
          ...options,
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            console.error('Error uploading buffer to Cloudinary', { error });
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          } else if (result) {
            console.log('✅ Buffer uploaded to Cloudinary', result.public_id);

            resolve({
              public_id: result.public_id,
              url: result.url,
              secure_url: result.secure_url,
              format: result.format,
              width: result.width,
              height: result.height,
              bytes: result.bytes,
              resource_type: result.resource_type,
              created_at: result.created_at,
            });
          }
        }
      );

      uploadStream.end(buffer);
    });
  }

  // Wrapper method for image uploads (used by routes)
  public async uploadImage(
    buffer: Buffer,
    folder: string = 'ebenor-creation',
    additionalOptions: Partial<CloudinaryUploadOptions> = {}
  ): Promise<CloudinaryUploadResult> {
    return this.uploadBuffer(buffer, {
      folder,
      resource_type: 'image',
      ...additionalOptions,
    });
  }

  // Wrapper method for video uploads (used by routes)
  public async uploadVideo(
    buffer: Buffer,
    folder: string = 'ebenor-creation',
    additionalOptions: Partial<CloudinaryUploadOptions> = {}
  ): Promise<CloudinaryUploadResult> {
    return this.uploadBuffer(buffer, {
      folder,
      resource_type: 'video',
      ...additionalOptions,
    });
  }

  public async deleteFile(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image'): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      console.log('✅ File deleted from Cloudinary', publicId);
    } catch (error) {
      console.error('Error deleting file from Cloudinary', { error, public_id: publicId });
      throw new Error(`Cloudinary delete failed: ${(error as Error).message}`);
    }
  }

  public async deleteFiles(publicIds: string[], resourceType: 'image' | 'video' | 'raw' = 'image'): Promise<void> {
    try {
      await cloudinary.api.delete_resources(publicIds, { resource_type: resourceType });
      console.log('✅ Multiple files deleted from Cloudinary', publicIds.length);
    } catch (error) {
      console.error('Error deleting multiple files from Cloudinary', { error });
      throw new Error(`Cloudinary bulk delete failed: ${(error as Error).message}`);
    }
  }

  public getThumbnailUrl(publicId: string, width: number = 300, height: number = 300, resourceType: 'image' | 'video' = 'image'): string {
    return cloudinary.url(publicId, {
      resource_type: resourceType,
      transformation: [
        { width, height, crop: 'fill', gravity: 'auto' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
      secure: true,
    });
  }

  public getResponsiveUrls(publicId: string): {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  } {
    return {
      thumbnail: this.getThumbnailUrl(publicId, 300, 300),
      medium: cloudinary.url(publicId, {
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
        secure: true,
      }),
      large: cloudinary.url(publicId, {
        transformation: [
          { width: 1920, height: 1920, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
        secure: true,
      }),
      original: cloudinary.url(publicId, {
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        secure: true,
      }),
    };
  }
}

export const cloudinaryService = new CloudinaryService();
