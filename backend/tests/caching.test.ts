import { Request, Response, NextFunction } from 'express';
import { cacheControl, CacheStrategies, etag, vary } from '../src/middleware/caching';

// Mock Express request, response, and next function
const mockRequest = () => {
  const req: Partial<Request> = {
    method: 'GET',
    headers: {},
  };
  return req as Request;
};

const mockResponse = () => {
  const res: Partial<Response> = {
    setHeader: jest.fn(),
    send: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    statusCode: 200,
  };
  return res as Response;
};

const mockNext: NextFunction = jest.fn();

describe('Caching Middleware Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('cacheControl', () => {
    it('should set Cache-Control header for GET requests', () => {
      const req = mockRequest();
      const res = mockResponse();
      const middleware = cacheControl({ isPublic: true, maxAge: 300 });

      middleware(req, res, mockNext);

      expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'public, max-age=300');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should not set Cache-Control header for POST requests', () => {
      const req = mockRequest();
      req.method = 'POST';
      const res = mockResponse();
      const middleware = cacheControl({ isPublic: true, maxAge: 300 });

      middleware(req, res, mockNext);

      expect(res.setHeader).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should set no-store directive', () => {
      const req = mockRequest();
      const res = mockResponse();
      const middleware = cacheControl({ noStore: true });

      middleware(req, res, mockNext);

      expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should set stale-while-revalidate directive', () => {
      const req = mockRequest();
      const res = mockResponse();
      const middleware = cacheControl({
        isPublic: true,
        maxAge: 3600,
        staleWhileRevalidate: 300,
      });

      middleware(req, res, mockNext);

      expect(res.setHeader).toHaveBeenCalledWith(
        'Cache-Control',
        'public, max-age=3600, stale-while-revalidate=300'
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should set private cache directive', () => {
      const req = mockRequest();
      const res = mockResponse();
      const middleware = cacheControl({
        isPrivate: true,
        maxAge: 300,
        mustRevalidate: true,
      });

      middleware(req, res, mockNext);

      expect(res.setHeader).toHaveBeenCalledWith(
        'Cache-Control',
        'private, max-age=300, must-revalidate'
      );
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('CacheStrategies', () => {
    it('should apply noCache strategy', () => {
      const req = mockRequest();
      const res = mockResponse();
      const middleware = CacheStrategies.noCache();

      middleware(req, res, mockNext);

      expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should apply short cache strategy', () => {
      const req = mockRequest();
      const res = mockResponse();
      const middleware = CacheStrategies.short();

      middleware(req, res, mockNext);

      expect(res.setHeader).toHaveBeenCalledWith(
        'Cache-Control',
        'public, max-age=300, stale-while-revalidate=60'
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should apply medium cache strategy', () => {
      const req = mockRequest();
      const res = mockResponse();
      const middleware = CacheStrategies.medium();

      middleware(req, res, mockNext);

      expect(res.setHeader).toHaveBeenCalledWith(
        'Cache-Control',
        'public, max-age=3600, stale-while-revalidate=300'
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should apply long cache strategy', () => {
      const req = mockRequest();
      const res = mockResponse();
      const middleware = CacheStrategies.long();

      middleware(req, res, mockNext);

      expect(res.setHeader).toHaveBeenCalledWith(
        'Cache-Control',
        'public, max-age=86400, stale-while-revalidate=3600'
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should apply private cache strategy', () => {
      const req = mockRequest();
      const res = mockResponse();
      const middleware = CacheStrategies.private();

      middleware(req, res, mockNext);

      expect(res.setHeader).toHaveBeenCalledWith(
        'Cache-Control',
        'private, max-age=300, must-revalidate'
      );
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('etag', () => {
    it('should add ETag header for GET requests with 200 status', () => {
      const req = mockRequest();
      const res = mockResponse();
      const middleware = etag();

      middleware(req, res, mockNext);

      // Simulate sending response
      const data = { test: 'data' };
      res.send(data);

      expect(res.setHeader).toHaveBeenCalledWith('ETag', expect.any(String));
      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 304 if ETag matches If-None-Match', () => {
      const req = mockRequest();
      const res = mockResponse();
      const middleware = etag();

      // Generate ETag
      const data = { test: 'data' };
      const expectedETag = `"${Buffer.from(JSON.stringify(data)).toString('base64').substring(0, 27)}"`;
      
      req.headers['if-none-match'] = expectedETag;

      middleware(req, res, mockNext);

      // Simulate sending response
      res.send(data);

      expect(res.status).toHaveBeenCalledWith(304);
      expect(res.end).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should not add ETag for POST requests', () => {
      const req = mockRequest();
      req.method = 'POST';
      const res = mockResponse();
      const middleware = etag();

      middleware(req, res, mockNext);

      // Simulate sending response
      res.send({ test: 'data' });

      expect(res.setHeader).not.toHaveBeenCalledWith('ETag', expect.any(String));
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('vary', () => {
    it('should set Vary header with single value', () => {
      const req = mockRequest();
      const res = mockResponse();
      const middleware = vary('Accept-Encoding');

      middleware(req, res, mockNext);

      expect(res.setHeader).toHaveBeenCalledWith('Vary', 'Accept-Encoding');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should set Vary header with multiple values', () => {
      const req = mockRequest();
      const res = mockResponse();
      const middleware = vary('Accept-Encoding', 'Accept-Language', 'User-Agent');

      middleware(req, res, mockNext);

      expect(res.setHeader).toHaveBeenCalledWith('Vary', 'Accept-Encoding, Accept-Language, User-Agent');
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
