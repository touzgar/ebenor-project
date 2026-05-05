import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import mongoose from 'mongoose';
import { Product } from '../src/models/Product';
import { GalleryImage } from '../src/models/GalleryImage';
import { HomeContent } from '../src/models/HomeContent';
import { mediaLibraryService } from '../src/services/mediaLibraryService';

describe('Media Library Service', () => {
  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env['MONGODB_URI_TEST'] || 'mongodb://localhost:27017/ebenor-test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Clean up and disconnect
    await Product.deleteMany({});
    await GalleryImage.deleteMany({});
    await HomeContent.deleteMany({});
    await mongoose.connection.close();
  });

  describe('getAllMedia', () => {
    it('should return empty array when no media exists', async () => {
      const result = await mediaLibraryService.getAllMedia(1, 20, {});
      expect(result.media).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should aggregate media from products', async () => {
      // Create a test product with images
      const product = await Product.create({
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test description',
        shortDescription: 'Short desc',
        category: 'cuisine',
        images: [
          {
            url: 'https://example.com/image1.jpg',
            alt: 'Test image 1',
            isPrimary: true,
          },
          {
            url: 'https://example.com/image2.jpg',
            alt: 'Test image 2',
            isPrimary: false,
          },
        ],
        materials: [],
        finishes: [],
        availability: 'in_stock',
        featured: false,
        tags: ['test'],
      });

      const result = await mediaLibraryService.getAllMedia(1, 20, {});
      expect(result.media.length).toBe(2);
      expect(result.total).toBe(2);
      expect(result.media[0].source).toBe('product');
      expect(result.media[0].url).toContain('image');

      // Clean up
      await Product.findByIdAndDelete(product._id);
    });

    it('should aggregate media from gallery', async () => {
      // Create a test gallery image
      const galleryImage = await GalleryImage.create({
        title: 'Test Gallery Image',
        url: 'https://example.com/gallery1.jpg',
        thumbnailUrl: 'https://example.com/gallery1-thumb.jpg',
        category: 'cuisine',
        tags: ['test'],
        alt: 'Test gallery image',
        dimensions: { width: 1920, height: 1080 },
        fileSize: 500000,
        mimeType: 'image/jpeg',
        featured: false,
        sortOrder: 0,
      });

      const result = await mediaLibraryService.getAllMedia(1, 20, {});
      expect(result.media.length).toBeGreaterThan(0);
      expect(result.media.some((m) => m.source === 'gallery')).toBe(true);

      // Clean up
      await GalleryImage.findByIdAndDelete(galleryImage._id);
    });

    it('should filter media by type', async () => {
      // Create test data
      const product = await Product.create({
        name: 'Test Product',
        slug: 'test-product-filter',
        description: 'Test description',
        shortDescription: 'Short desc',
        category: 'cuisine',
        images: [
          {
            url: 'https://example.com/image.jpg',
            alt: 'Test image',
            isPrimary: true,
          },
        ],
        materials: [],
        finishes: [],
        availability: 'in_stock',
        featured: false,
        tags: [],
      });

      const result = await mediaLibraryService.getAllMedia(1, 20, { type: 'image' });
      expect(result.media.every((m) => m.type === 'image')).toBe(true);

      // Clean up
      await Product.findByIdAndDelete(product._id);
    });

    it('should filter media by source', async () => {
      // Create test data
      const product = await Product.create({
        name: 'Test Product Source',
        slug: 'test-product-source',
        description: 'Test description',
        shortDescription: 'Short desc',
        category: 'cuisine',
        images: [
          {
            url: 'https://example.com/source-image.jpg',
            alt: 'Test image',
            isPrimary: true,
          },
        ],
        materials: [],
        finishes: [],
        availability: 'in_stock',
        featured: false,
        tags: [],
      });

      const result = await mediaLibraryService.getAllMedia(1, 20, { source: 'product' });
      expect(result.media.every((m) => m.source === 'product')).toBe(true);

      // Clean up
      await Product.findByIdAndDelete(product._id);
    });
  });

  describe('getMediaStats', () => {
    it('should return correct statistics', async () => {
      // Create test data
      const product = await Product.create({
        name: 'Stats Test Product',
        slug: 'stats-test-product',
        description: 'Test description',
        shortDescription: 'Short desc',
        category: 'cuisine',
        images: [
          {
            url: 'https://example.com/stats-image.jpg',
            alt: 'Test image',
            isPrimary: true,
          },
        ],
        materials: [],
        finishes: [],
        availability: 'in_stock',
        featured: false,
        tags: [],
      });

      const stats = await mediaLibraryService.getMediaStats();
      expect(stats.totalMedia).toBeGreaterThan(0);
      expect(stats.totalImages).toBeGreaterThan(0);
      expect(stats.bySource.product).toBeGreaterThan(0);

      // Clean up
      await Product.findByIdAndDelete(product._id);
    });
  });

  describe('findMediaReferences', () => {
    it('should find references in products', async () => {
      const testUrl = 'https://example.com/ref-test-image.jpg';

      // Create test product
      const product = await Product.create({
        name: 'Reference Test Product',
        slug: 'reference-test-product',
        description: 'Test description',
        shortDescription: 'Short desc',
        category: 'cuisine',
        images: [
          {
            url: testUrl,
            alt: 'Test image',
            isPrimary: true,
          },
        ],
        materials: [],
        finishes: [],
        availability: 'in_stock',
        featured: false,
        tags: [],
      });

      const references = await mediaLibraryService.findMediaReferences(testUrl);
      expect(references.length).toBe(1);
      expect(references[0].type).toBe('product');
      expect(references[0].name).toBe('Reference Test Product');

      // Clean up
      await Product.findByIdAndDelete(product._id);
    });

    it('should find references in gallery', async () => {
      const testUrl = 'https://example.com/gallery-ref-test.jpg';

      // Create test gallery image
      const galleryImage = await GalleryImage.create({
        title: 'Reference Test Gallery',
        url: testUrl,
        thumbnailUrl: 'https://example.com/gallery-ref-test-thumb.jpg',
        category: 'cuisine',
        tags: ['test'],
        alt: 'Test gallery image',
        dimensions: { width: 1920, height: 1080 },
        fileSize: 500000,
        mimeType: 'image/jpeg',
        featured: false,
        sortOrder: 0,
      });

      const references = await mediaLibraryService.findMediaReferences(testUrl);
      expect(references.length).toBe(1);
      expect(references[0].type).toBe('gallery');
      expect(references[0].name).toBe('Reference Test Gallery');

      // Clean up
      await GalleryImage.findByIdAndDelete(galleryImage._id);
    });

    it('should return empty array for unused media', async () => {
      const testUrl = 'https://example.com/unused-image.jpg';
      const references = await mediaLibraryService.findMediaReferences(testUrl);
      expect(references).toEqual([]);
    });
  });

  describe('deleteMedia', () => {
    it('should not delete media that is in use', async () => {
      const testUrl = 'https://example.com/in-use-image.jpg';

      // Create test product
      const product = await Product.create({
        name: 'Delete Test Product',
        slug: 'delete-test-product',
        description: 'Test description',
        shortDescription: 'Short desc',
        category: 'cuisine',
        images: [
          {
            url: testUrl,
            alt: 'Test image',
            isPrimary: true,
          },
        ],
        materials: [],
        finishes: [],
        availability: 'in_stock',
        featured: false,
        tags: [],
      });

      const result = await mediaLibraryService.deleteMedia(testUrl);
      expect(result.deleted).toBe(false);
      expect(result.references.length).toBe(1);

      // Clean up
      await Product.findByIdAndDelete(product._id);
    });
  });

  describe('replaceMedia', () => {
    it('should replace media URL in products', async () => {
      const oldUrl = 'https://example.com/old-image.jpg';
      const newUrl = 'https://example.com/new-image.jpg';

      // Create test product
      const product = await Product.create({
        name: 'Replace Test Product',
        slug: 'replace-test-product',
        description: 'Test description',
        shortDescription: 'Short desc',
        category: 'cuisine',
        images: [
          {
            url: oldUrl,
            alt: 'Test image',
            isPrimary: true,
          },
        ],
        materials: [],
        finishes: [],
        availability: 'in_stock',
        featured: false,
        tags: [],
      });

      const result = await mediaLibraryService.replaceMedia(oldUrl, newUrl);
      expect(result.updated).toBe(1);
      expect(result.references.length).toBe(1);

      // Verify the URL was updated
      const updatedProduct = await Product.findById(product._id);
      expect(updatedProduct?.images[0].url).toBe(newUrl);

      // Clean up
      await Product.findByIdAndDelete(product._id);
    });

    it('should replace media URL in gallery', async () => {
      const oldUrl = 'https://example.com/old-gallery-image.jpg';
      const newUrl = 'https://example.com/new-gallery-image.jpg';

      // Create test gallery image
      const galleryImage = await GalleryImage.create({
        title: 'Replace Test Gallery',
        url: oldUrl,
        thumbnailUrl: 'https://example.com/old-gallery-image-thumb.jpg',
        category: 'cuisine',
        tags: ['test'],
        alt: 'Test gallery image',
        dimensions: { width: 1920, height: 1080 },
        fileSize: 500000,
        mimeType: 'image/jpeg',
        featured: false,
        sortOrder: 0,
      });

      const result = await mediaLibraryService.replaceMedia(oldUrl, newUrl);
      expect(result.updated).toBe(1);

      // Verify the URL was updated
      const updatedImage = await GalleryImage.findById(galleryImage._id);
      expect(updatedImage?.url).toBe(newUrl);

      // Clean up
      await GalleryImage.findByIdAndDelete(galleryImage._id);
    });
  });
});
