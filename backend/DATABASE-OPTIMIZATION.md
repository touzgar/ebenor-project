# Database Optimization Documentation

## Overview

This document describes the database optimization strategies implemented for the ÉBENOR CRÉATION Product and Content Management System. The optimizations focus on query performance, indexing, and caching to ensure the application remains responsive under load.

## Table of Contents

1. [Database Indexes](#database-indexes)
2. [Caching Strategy](#caching-strategy)
3. [Query Optimization](#query-optimization)
4. [Performance Monitoring](#performance-monitoring)
5. [Cache Invalidation](#cache-invalidation)
6. [Best Practices](#best-practices)

## Database Indexes

### Product Model Indexes

#### Single Field Indexes
- **slug** (unique): For unique constraint and fast slug-based lookups
- **tags**: For array queries and tag filtering
- **availability**: For filtering by availability status
- **price.amount**: For price range queries
- **createdAt**: For sorting by date

#### Compound Indexes
- **category + subcategory**: For filtering products by category and subcategory
- **featured + createdAt**: For fetching featured products sorted by date
- **category + featured**: For featured products within a category
- **category + availability**: For available products by category

#### Text Index
- **name, description, shortDescription, tags**: Full-text search with weighted fields
  - name: weight 10 (highest priority)
  - shortDescription: weight 5
  - tags: weight 3
  - description: weight 1

### GalleryImage Model Indexes

#### Single Field Indexes
- **tags**: For array queries and tag filtering
- **uploadedAt**: For sorting by upload date
- **sortOrder**: For manual ordering

#### Compound Indexes
- **category + sortOrder**: For ordered images within a category
- **featured + uploadedAt**: For featured images sorted by date
- **category + featured**: For featured images within a category

#### Text Index
- **title, description, tags, alt**: Full-text search with weighted fields
  - title: weight 10 (highest priority)
  - tags: weight 5
  - alt: weight 3
  - description: weight 1

### Message Model Indexes

#### Compound Indexes
- **status + createdAt**: For filtering messages by status and sorting by date
- **priority + createdAt**: For high-priority messages
- **source + createdAt**: For messages by source

#### Single Field Indexes
- **email**: For finding messages by email
- **createdAt**: For sorting by date

### AuditLog Model Indexes

#### Compound Indexes
- **resource + resourceId + timestamp**: For audit trail by resource
- **userId + timestamp**: For user activity tracking
- **action + timestamp**: For filtering by action type

#### Single Field Indexes
- **timestamp**: For recent logs (with TTL of 90 days)

### AdminUser Model Indexes

#### Single Field Indexes
- **email** (unique): For unique constraint and login lookups
- **role + isActive**: For filtering active users by role
- **lastLogin**: For tracking user activity
- **passwordResetToken**: For password reset functionality

### HomeContent Model Indexes

#### Single Field Indexes
- **updatedAt**: For fetching the latest content version

## Caching Strategy

### Cache Implementation

We use **node-cache** for in-memory caching. This is suitable for single-server deployments. For production multi-server deployments, consider migrating to Redis.

### Cache Configuration

```typescript
{
  stdTTL: 300,        // 5 minutes default
  checkperiod: 60,    // Check for expired keys every 60 seconds
  useClones: false,   // Don't clone objects for better performance
  deleteOnExpire: true
}
```

### TTL (Time To Live) Values

| Resource Type | TTL | Reason |
|--------------|-----|--------|
| Featured Products | 5 minutes | Frequently accessed, changes moderately |
| Featured Gallery | 5 minutes | Frequently accessed, changes moderately |
| Product Detail | 10 minutes | Less frequent changes |
| Gallery Detail | 10 minutes | Less frequent changes |
| Product List | 3 minutes | Changes frequently with filters |
| Gallery List | 3 minutes | Changes frequently with filters |
| Categories | 1 hour | Rarely changes |
| Tags | 1 hour | Rarely changes |
| Statistics | 5 minutes | Moderate update frequency |
| Home Content | 10 minutes | Changes infrequently |

### Cached Resources

#### Products
- Featured products (by limit)
- Product by slug
- Product by ID
- Product lists (by filters)
- Product categories
- Product statistics

#### Gallery
- Featured gallery images (by limit)
- Gallery image by ID
- Gallery lists (by filters)
- Gallery categories
- Gallery tags
- Gallery statistics

#### Home Content
- Home page content
- Home page statistics

## Query Optimization

### Optimization Techniques

#### 1. Use `.lean()` for Read-Only Queries

```typescript
// Before
const products = await Product.find(filters).sort(sort);

// After (optimized)
const products = await Product.find(filters).sort(sort).lean();
```

**Benefits:**
- Returns plain JavaScript objects instead of Mongoose documents
- ~5x faster for read operations
- Lower memory usage

#### 2. Use `.select()` to Limit Fields

```typescript
// Before
const product = await Product.findById(id);

// After (optimized)
const product = await Product.findById(id).select('-__v -createdBy -updatedBy');
```

**Benefits:**
- Reduces data transfer
- Faster query execution
- Lower bandwidth usage

#### 3. Efficient Pagination

```typescript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 12;
const skip = (page - 1) * limit;

const [products, total] = await Promise.all([
  Product.find(filters).skip(skip).limit(limit).lean(),
  Product.countDocuments(filters)
]);
```

**Benefits:**
- Parallel execution of query and count
- Proper pagination implementation
- Prevents loading all documents

#### 4. Compound Index Usage

```typescript
// This query uses the compound index (category + featured)
const products = await Product.find({
  category: 'cuisine',
  featured: true
}).lean();
```

**Benefits:**
- Single index lookup instead of multiple
- Faster query execution
- Lower I/O operations

## Performance Monitoring

### Query Performance Middleware

The `queryPerformanceMiddleware` tracks:
- Request duration
- Slow queries (>100ms by default)
- Query statistics (total, slow, avg, min, max)

### Configuration

```env
SLOW_QUERY_THRESHOLD=100  # milliseconds
QUERY_MONITORING_ENABLED=true
```

### Monitoring Endpoints

#### Get Query Statistics
```
GET /api/admin/performance/stats
```

Returns:
```json
{
  "success": true,
  "data": {
    "totalQueries": 1523,
    "slowQueries": 12,
    "avgDuration": 45.3,
    "maxDuration": 234,
    "minDuration": 5,
    "slowQueryThreshold": 100,
    "monitoringEnabled": true
  }
}
```

#### Reset Query Statistics
```
POST /api/admin/performance/reset
```

### Measuring Custom Operations

```typescript
import { measureQueryPerformance } from '@/middleware/queryPerformance';

const result = await measureQueryPerformance(
  () => Product.find(filters).lean(),
  'getProducts'
);
```

## Cache Invalidation

### Automatic Invalidation

Cache is automatically invalidated when:

#### Product Operations
- **Create**: Invalidates all product caches
- **Update**: Invalidates specific product + lists
- **Delete**: Invalidates specific product + lists
- **Bulk Operations**: Invalidates all product caches

#### Gallery Operations
- **Create**: Invalidates all gallery caches
- **Update**: Invalidates specific image + lists
- **Delete**: Invalidates specific image + lists
- **Bulk Operations**: Invalidates all gallery caches

#### Home Content Operations
- **Update**: Invalidates all home content caches

### Manual Invalidation

```typescript
import { cacheService } from '@/services/cacheService';

// Invalidate all product caches
cacheService.invalidateProducts();

// Invalidate specific product
cacheService.invalidateProduct(productId, slug);

// Invalidate all gallery caches
cacheService.invalidateGallery();

// Invalidate specific gallery image
cacheService.invalidateGalleryImage(imageId);

// Invalidate home content
cacheService.invalidateHome();

// Clear all cache
cacheService.clear();
```

## Best Practices

### 1. Index Management

#### Creating Indexes

```bash
# Create all indexes
npm run create-indexes

# Drop all indexes (use with caution!)
npm run drop-indexes
```

#### Verifying Indexes

The `create-indexes` script automatically verifies that all required indexes exist and reports any missing indexes.

### 2. Query Optimization Checklist

- [ ] Use `.lean()` for read-only queries
- [ ] Use `.select()` to limit returned fields
- [ ] Use compound indexes for multi-field queries
- [ ] Implement proper pagination with skip/limit
- [ ] Use parallel queries with `Promise.all()` when possible
- [ ] Cache frequently accessed data
- [ ] Invalidate cache on data changes

### 3. Caching Guidelines

#### When to Cache
- Frequently accessed data (featured products, categories)
- Data that changes infrequently (categories, tags)
- Expensive queries (aggregations, text search)
- Homepage content

#### When NOT to Cache
- User-specific data
- Real-time data
- Data that changes very frequently
- Admin operations (except read-only)

### 4. Performance Monitoring

#### Regular Checks
- Monitor slow query logs
- Review cache hit/miss ratios
- Check index usage with MongoDB explain()
- Monitor database size and index size

#### Optimization Triggers
- Slow query threshold exceeded frequently
- Low cache hit ratio (<70%)
- High database CPU usage
- Increasing response times

### 5. Production Considerations

#### For Multi-Server Deployments
- Replace node-cache with Redis
- Implement distributed caching
- Use Redis pub/sub for cache invalidation across servers

#### Database Configuration
```javascript
// Enable query profiling
db.setProfilingLevel(1, { slowms: 100 });

// View slow queries
db.system.profile.find().sort({ ts: -1 }).limit(10);
```

#### Monitoring Tools
- MongoDB Atlas Performance Advisor
- MongoDB Compass for index analysis
- Application Performance Monitoring (APM) tools

## Environment Variables

```env
# Cache Configuration
CACHE_ENABLED=true

# Query Performance Monitoring
SLOW_QUERY_THRESHOLD=100
QUERY_MONITORING_ENABLED=true

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ebenor-creation
```

## Performance Metrics

### Expected Performance

| Operation | Without Optimization | With Optimization | Improvement |
|-----------|---------------------|-------------------|-------------|
| Get Products List | ~150ms | ~30ms (cached: ~5ms) | 5x-30x |
| Get Product by Slug | ~50ms | ~15ms (cached: ~2ms) | 3x-25x |
| Get Featured Products | ~80ms | ~20ms (cached: ~3ms) | 4x-27x |
| Get Categories | ~120ms | ~25ms (cached: ~3ms) | 5x-40x |
| Text Search | ~200ms | ~80ms | 2.5x |

### Cache Hit Ratios

Target cache hit ratios:
- Featured products: >90%
- Product details: >70%
- Categories: >95%
- Home content: >95%

## Troubleshooting

### High Memory Usage
- Reduce cache TTL values
- Limit cache size
- Consider Redis for external caching

### Low Cache Hit Ratio
- Increase TTL values
- Review cache invalidation strategy
- Check if queries are cacheable

### Slow Queries Despite Indexes
- Verify indexes are being used (use explain())
- Check for missing compound indexes
- Review query patterns
- Consider denormalization for complex queries

### Cache Inconsistency
- Review cache invalidation logic
- Ensure all update operations invalidate cache
- Consider shorter TTL values
- Implement cache versioning

## Future Improvements

1. **Redis Integration**: For production multi-server deployments
2. **Query Result Pagination Caching**: Cache paginated results
3. **Partial Cache Updates**: Update cache instead of invalidating
4. **Cache Warming**: Pre-populate cache on startup
5. **Advanced Monitoring**: Integrate with APM tools
6. **Database Sharding**: For horizontal scaling
7. **Read Replicas**: For read-heavy workloads

## References

- [MongoDB Indexing Strategies](https://docs.mongodb.com/manual/indexes/)
- [Mongoose Performance Tips](https://mongoosejs.com/docs/guide.html#performance)
- [Node-Cache Documentation](https://www.npmjs.com/package/node-cache)
- [Redis Caching Patterns](https://redis.io/topics/lru-cache)
