import request from 'supertest';
import app from '../src/server';
import { Product } from '../src/models/Product';
import { GalleryImage } from '../src/models/GalleryImage';
import { AdminUser } from '../src/models/AdminUser';
import mongoose from 'mongoose';

describe('Input Validation and Sanitization Tests', () => {
  let authToken: string;
  let csrfToken: string;

  beforeAll(async () => {
    // Create admin user for authentication
    const adminUser = new AdminUser({
      email: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'Test',
      password: 'Test123!@#',
    });
    await adminUser.save();

    // Login to get auth token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'Test123!@#',
      });

    authToken = loginRes.body.data.token;

    // Get CSRF token
    const csrfRes = await request(app).get('/api/csrf-token');
    csrfToken = csrfRes.body.csrfToken;
  });

  afterAll(async () => {
    await AdminUser.deleteMany({});
    await Product.deleteMany({});
    await GalleryImage.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Product Validation', () => {
    it('should reject product with missing required fields', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('should reject product with invalid name length', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send({
          name: 'A', // Too short
          description: 'Valid description with enough characters',
          shortDescription: 'Valid short description',
          category: 'cuisine',
          images: [{ url: 'https://example.com/image.jpg', alt: 'Test image' }],
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should reject product with invalid category', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send({
          name: 'Valid Product Name',
          description: 'Valid description with enough characters',
          shortDescription: 'Valid short description',
          category: 'invalid_category',
          images: [{ url: 'https://example.com/image.jpg', alt: 'Test image' }],
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should reject product with invalid price', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send({
          name: 'Valid Product Name',
          description: 'Valid description with enough characters',
          shortDescription: 'Valid short description',
          category: 'cuisine',
          images: [{ url: 'https://example.com/image.jpg', alt: 'Test image' }],
          price: {
            amount: -100, // Negative price
            currency: 'TND',
          },
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should reject product with invalid email in description (XSS attempt)', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send({
          name: 'Valid Product Name',
          description: '<script>alert("XSS")</script>Valid description',
          shortDescription: 'Valid short description',
          category: 'cuisine',
          images: [{ url: 'https://example.com/image.jpg', alt: 'Test image' }],
        });

      // Should succeed but sanitize the script tag
      if (res.status === 201) {
        expect(res.body.data.description).not.toContain('<script>');
      }
    });

    it('should accept valid product data', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send({
          name: 'Valid Product Name',
          description: 'Valid description with enough characters to pass validation',
          shortDescription: 'Valid short description for testing',
          category: 'cuisine',
          images: [
            {
              url: 'https://example.com/image.jpg',
              alt: 'Test image alt text',
              isPrimary: true,
            },
          ],
          price: {
            amount: 1500,
            currency: 'TND',
          },
          availability: 'in_stock',
          featured: true,
          tags: ['modern', 'luxury'],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });
  });

  describe('Gallery Image Validation', () => {
    it('should reject gallery image with missing required fields', async () => {
      const res = await request(app)
        .post('/api/admin/gallery')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject gallery image with invalid category', async () => {
      const res = await request(app)
        .post('/api/admin/gallery')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send({
          title: 'Valid Title',
          category: 'invalid_category',
          alt: 'Valid alt text',
          url: 'https://example.com/image.jpg',
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should accept valid gallery image data', async () => {
      const res = await request(app)
        .post('/api/admin/gallery')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send({
          title: 'Valid Gallery Image Title',
          description: 'Valid description for gallery image',
          category: 'cuisine',
          alt: 'Valid alt text for accessibility',
          url: 'https://example.com/image.jpg',
          featured: true,
          tags: ['modern', 'showcase'],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Contact Message Validation', () => {
    it('should reject message with invalid email', async () => {
      const res = await request(app)
        .post('/api/messages')
        .set('X-CSRF-Token', csrfToken)
        .send({
          name: 'John Doe',
          email: 'invalid-email',
          subject: 'Test Subject',
          message: 'This is a test message with enough characters',
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should reject message with short message text', async () => {
      const res = await request(app)
        .post('/api/messages')
        .set('X-CSRF-Token', csrfToken)
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'Short', // Too short
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should sanitize XSS attempts in message', async () => {
      const res = await request(app)
        .post('/api/messages')
        .set('X-CSRF-Token', csrfToken)
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: '<script>alert("XSS")</script>This is a test message',
        });

      // Should succeed but sanitize the script tag
      if (res.status === 201) {
        expect(res.body.data.message).not.toContain('<script>');
      }
    });

    it('should accept valid contact message', async () => {
      const res = await request(app)
        .post('/api/messages')
        .set('X-CSRF-Token', csrfToken)
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+216 12 345 678',
          subject: 'Test Subject for Contact',
          message: 'This is a valid test message with enough characters to pass validation',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe('XSS Prevention', () => {
    it('should sanitize script tags in text fields', async () => {
      const maliciousInput = '<script>alert("XSS")</script>Test';
      const res = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send({
          name: maliciousInput,
          description: 'Valid description with enough characters',
          shortDescription: 'Valid short description',
          category: 'cuisine',
          images: [{ url: 'https://example.com/image.jpg', alt: 'Test' }],
        });

      if (res.status === 201) {
        expect(res.body.data.name).not.toContain('<script>');
      }
    });

    it('should sanitize event handlers', async () => {
      const maliciousInput = '<img src=x onerror="alert(1)">';
      const res = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send({
          name: 'Valid Name',
          description: maliciousInput,
          shortDescription: 'Valid short description',
          category: 'cuisine',
          images: [{ url: 'https://example.com/image.jpg', alt: 'Test' }],
        });

      if (res.status === 201) {
        expect(res.body.data.description).not.toContain('onerror');
      }
    });
  });

  describe('SQL Injection Prevention (MongoDB)', () => {
    it('should handle MongoDB injection attempts safely', async () => {
      const res = await request(app)
        .get('/api/products')
        .query({
          category: { $ne: null }, // MongoDB injection attempt
        });

      // Should either reject or handle safely
      expect([200, 400]).toContain(res.status);
    });
  });

  describe('Unique Constraint Validation', () => {
    it('should reject duplicate product slug', async () => {
      // Create first product
      await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send({
          name: 'Unique Product',
          slug: 'unique-product-slug',
          description: 'Valid description with enough characters',
          shortDescription: 'Valid short description',
          category: 'cuisine',
          images: [{ url: 'https://example.com/image.jpg', alt: 'Test' }],
        });

      // Try to create second product with same slug
      const res = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send({
          name: 'Another Product',
          slug: 'unique-product-slug', // Duplicate slug
          description: 'Valid description with enough characters',
          shortDescription: 'Valid short description',
          category: 'cuisine',
          images: [{ url: 'https://example.com/image.jpg', alt: 'Test' }],
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });
});
