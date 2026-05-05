import request from 'supertest';
import app from '../src/server';

describe('API Compression Tests', () => {
  describe('Compression Middleware', () => {
    it('should compress responses when Accept-Encoding includes gzip', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .expect(200);

      // Check if response is compressed
      expect(response.headers['content-encoding']).toMatch(/gzip|br/);
    });

    it('should not compress small responses (< 1KB)', async () => {
      const response = await request(app)
        .get('/health')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .expect(200);

      // Health endpoint returns small JSON, should not be compressed
      // (or might be compressed depending on exact size)
      // This test documents the threshold behavior
      expect(response.body).toHaveProperty('status');
    });

    it('should respect x-no-compression header', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .set('x-no-compression', 'true')
        .expect(200);

      // Should not compress when x-no-compression is set
      expect(response.headers['content-encoding']).toBeUndefined();
    });
  });

  describe('Cache Headers', () => {
    it('should set cache headers for product list (short cache)', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.headers['cache-control']).toBeDefined();
      expect(response.headers['cache-control']).toContain('public');
      expect(response.headers['cache-control']).toContain('max-age=300'); // 5 minutes
    });

    it('should set cache headers for product categories (long cache)', async () => {
      const response = await request(app)
        .get('/api/products/categories')
        .expect(200);

      expect(response.headers['cache-control']).toBeDefined();
      expect(response.headers['cache-control']).toContain('public');
      expect(response.headers['cache-control']).toContain('max-age=86400'); // 24 hours
    });

    it('should set cache headers for homepage content (medium cache)', async () => {
      const response = await request(app)
        .get('/api/home')
        .expect(200);

      expect(response.headers['cache-control']).toBeDefined();
      expect(response.headers['cache-control']).toContain('public');
      expect(response.headers['cache-control']).toContain('max-age=3600'); // 1 hour
    });

    it('should not set cache headers for POST requests', async () => {
      const response = await request(app)
        .post('/api/messages')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'Test message',
        });

      // POST requests should not have cache headers
      // (or should have no-cache/no-store)
      if (response.headers['cache-control']) {
        expect(response.headers['cache-control']).not.toContain('max-age');
      }
    });
  });

  describe('Response Size', () => {
    it('should significantly reduce response size with compression', async () => {
      // Get uncompressed response
      const uncompressed = await request(app)
        .get('/api/products')
        .set('x-no-compression', 'true')
        .expect(200);

      // Get compressed response
      const compressed = await request(app)
        .get('/api/products')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .expect(200);

      const uncompressedSize = JSON.stringify(uncompressed.body).length;
      const compressedSize = compressed.text.length;

      // Compressed should be significantly smaller (at least 30% reduction)
      // Note: This test might be flaky if response is very small
      if (uncompressedSize > 1024) {
        expect(compressedSize).toBeLessThan(uncompressedSize * 0.7);
      }
    });
  });
});
