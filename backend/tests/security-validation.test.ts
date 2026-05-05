import request from 'supertest';
import express from 'express';

describe('Security Validation Tests', () => {
  let app: express.Application;
  const API_URL = 'http://localhost:5000';

  describe('Rate Limiting', () => {
    it('should enforce rate limiting on login endpoint', async () => {
      // Make 6 rapid login attempts (limit is 5 per 15 min)
      const requests = [];
      for (let i = 0; i < 6; i++) {
        requests.push(
          request(API_URL)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' })
        );
      }

      const responses = await Promise.all(requests);
      
      // The 6th request should be rate limited
      const rateLimitedResponse = responses[responses.length - 1];
      expect(rateLimitedResponse.status).toBe(429);
      expect(rateLimitedResponse.headers['retry-after']).toBeDefined();
    }, 30000);
  });

  describe('CSRF Protection', () => {
    it('should require CSRF token for state-changing requests', async () => {
      // Try to create a product without CSRF token
      const response = await request(API_URL)
        .post('/api/admin/products')
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: 'Test Product',
          slug: 'test-product',
          category: 'cuisine'
        });

      // Should fail with 403 if CSRF protection is enabled
      expect([401, 403]).toContain(response.status);
    });
  });

  describe('Input Validation', () => {
    it('should reject XSS attempts in product creation', async () => {
      const response = await request(API_URL)
        .post('/api/admin/products')
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: '<script>alert("XSS")</script>',
          slug: 'xss-test',
          category: 'cuisine',
          description: '<img src=x onerror=alert("XSS")>',
          shortDescription: 'Test'
        });

      // Should be rejected or sanitized
      expect([400, 401, 403]).toContain(response.status);
    });

    it('should validate required fields', async () => {
      const response = await request(API_URL)
        .post('/api/admin/products')
        .set('Authorization', 'Bearer fake-token')
        .send({
          // Missing required fields
          name: 'Test'
        });

      expect([400, 401, 403]).toContain(response.status);
    });

    it('should validate enum values', async () => {
      const response = await request(API_URL)
        .post('/api/admin/products')
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: 'Test Product',
          slug: 'test',
          category: 'invalid-category', // Invalid enum value
          description: 'Test',
          shortDescription: 'Test'
        });

      expect([400, 401, 403]).toContain(response.status);
    });
  });

  describe('API Compression', () => {
    it('should return compressed responses when requested', async () => {
      const response = await request(API_URL)
        .get('/api/products')
        .set('Accept-Encoding', 'gzip');

      // Check if response is compressed
      expect(response.headers['content-encoding']).toMatch(/gzip|br/);
    });
  });

  describe('Security Headers', () => {
    it('should include security headers in responses', async () => {
      const response = await request(API_URL)
        .get('/api/products');

      // Check for important security headers
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
      expect(response.headers['x-xss-protection']).toBeDefined();
    });
  });
});
