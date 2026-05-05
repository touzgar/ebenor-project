# Input Validation and Sanitization Implementation

## Overview

This document describes the comprehensive input validation and sanitization implementation for the ÉBENOR CRÉATION backend API, fulfilling requirements 26.1-26.10.

## Implementation Summary

### 1. Server-Side Validation (Requirement 26.1-26.8)

All API endpoints now have comprehensive server-side validation using `express-validator`:

#### Product Validation
- **Required fields**: name, description, shortDescription, category, images
- **String lengths**: 
  - name: 2-200 characters
  - description: 10-5000 characters
  - shortDescription: 10-300 characters
  - slug: 2-200 characters (auto-generated if not provided)
- **Numeric ranges**:
  - price.amount: 0-999999999
  - dimensions: 0-10000 (length, width, height)
- **Email format**: Validated using standard email regex
- **URL format**: All image URLs validated with protocol requirement
- **Enum values**: 
  - category: cuisine, dressing, mobilier, amenagement, autre
  - availability: in_stock, made_to_order, out_of_stock
  - dimensions.unit: cm, m
- **Unique constraints**: Product slugs checked for uniqueness

#### Gallery Image Validation
- **Required fields**: title, category, alt, url
- **String lengths**:
  - title: 2-200 characters
  - description: 0-1000 characters
  - alt: 2-200 characters
- **Enum values**:
  - category: cuisine, dressing, mobilier, amenagement, showroom, process, autre
- **Numeric ranges**:
  - width: 1-10000 pixels
  - height: 1-10000 pixels
  - sortOrder: 0+

#### Contact Message Validation
- **Required fields**: name, email, subject, message
- **String lengths**:
  - name: 2-100 characters
  - email: max 100 characters
  - phone: 8-20 characters (optional)
  - subject: 5-200 characters
  - message: 10-5000 characters
- **Email format**: Validated and normalized
- **Phone format**: International format with +, -, (, ) allowed

#### Authentication Validation
- **Email**: Required, valid format, max 100 characters, unique check
- **Password**: 8-128 characters, must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one digit
  - At least one special character (@$!%*?&)
- **Names**: 2-50 characters, letters, spaces, apostrophes, hyphens only

### 2. Input Sanitization (Requirement 26.10)

Implemented comprehensive sanitization using `isomorphic-dompurify`:

#### Sanitization Functions

**`sanitizeHtml(html: string)`**
- Allows safe HTML tags: b, i, em, strong, u, p, br, ul, ol, li, h1-h6, a, blockquote
- Allows safe attributes: href, target, rel
- Removes all script tags and event handlers
- Used for rich text fields (descriptions)

**`sanitizeText(text: string)`**
- Removes ALL HTML tags
- Removes dangerous protocols (javascript:, data:, vbscript:)
- Removes event handlers (onclick, onerror, etc.)
- Used for plain text fields (names, titles, etc.)

**`sanitizeUrl(url: string)`**
- Allows only http://, https://, and relative paths (/)
- Removes dangerous protocols
- Used for URL fields

**`sanitizeFilePath(path: string)`**
- Prevents directory traversal attacks (..)
- Removes dangerous characters (<>:"|?*)
- Used for file path handling

#### XSS Prevention

All text inputs are automatically sanitized to prevent:
- Script injection (`<script>alert('XSS')</script>`)
- Event handler injection (`<img onerror="alert(1)">`)
- Protocol injection (`javascript:alert(1)`)
- Data URI injection (`data:text/html,<script>alert(1)</script>`)

### 3. Error Handling (Requirement 26.9)

**400 Bad Request Response Format:**
```json
{
  "success": false,
  "message": "Données invalides",
  "code": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "name",
      "message": "Le nom doit contenir entre 2 et 200 caractères",
      "value": "A"
    },
    {
      "field": "email",
      "message": "Email invalide",
      "value": "invalid-email"
    }
  ]
}
```

All validation errors are returned together (not just the first one), allowing clients to display all issues at once.

### 4. Unique Constraint Validation (Requirement 26.7)

Implemented database-level unique constraint checks:

**Product Slugs:**
```typescript
body('slug')
  .custom(async (value, { req }) => {
    if (value) {
      const existingProduct = await Product.findOne({ slug: value });
      if (existingProduct && existingProduct._id.toString() !== req.params?.id) {
        throw new Error('Ce slug est déjà utilisé');
      }
    }
    return true;
  })
```

**Admin User Emails:**
```typescript
body('email')
  .custom(async (value, { req }) => {
    const existingUser = await AdminUser.findOne({ email: value });
    if (existingUser && existingUser._id.toString() !== req.params?.id) {
      throw new Error('Cet email est déjà utilisé');
    }
    return true;
  })
```

## Middleware Application

### Global Middleware (Applied to All Routes)

In `server.ts`:
```typescript
app.use(sanitizeInput);  // Sanitizes all request data
app.use(validateHeaders);  // Validates Content-Type headers
app.use(validatePayloadSize());  // Limits payload size
```

### Route-Specific Validation

**Product Routes:**
```typescript
router.post('/', uploadLimiter, validateProduct, productController.createProduct);
router.put('/:id', uploadLimiter, validateObjectIdParam('id'), validateProduct, productController.updateProduct);
router.delete('/:id', validateObjectIdParam('id'), productController.deleteProduct);
router.post('/bulk', validateBulkOperation, productController.bulkOperations);
```

**Gallery Routes:**
```typescript
router.post('/', uploadLimiter, validateGalleryImage, galleryController.createGalleryImage);
router.put('/:id', uploadLimiter, validateObjectIdParam('id'), validateGalleryImage, galleryController.updateGalleryImage);
router.delete('/:id', validateObjectIdParam('id'), galleryController.deleteGalleryImage);
router.post('/bulk', validateBulkOperation, galleryController.bulkOperations);
router.put('/sort-order', validateSortOrder, galleryController.updateSortOrder);
```

**Homepage Routes:**
```typescript
router.put('/', validateHomeContent, homeController.updateHomeContent);
router.put('/hero', [/* hero validation */], homeController.updateHeroSection);
router.put('/about', [/* about validation */], homeController.updateAboutSection);
// ... other sections
```

**Public Routes:**
```typescript
router.post('/messages', contactLimiter, validateMessage, messageController.createMessage);
router.get('/products', validatePagination, validateProductFilters, productController.getProducts);
router.get('/products/:id', validateObjectIdParam('id'), productController.getProductById);
```

## Security Features

### 1. XSS Prevention
- All text inputs sanitized using DOMPurify
- Script tags removed
- Event handlers removed
- Dangerous protocols blocked

### 2. SQL/NoSQL Injection Prevention
- MongoDB ObjectId validation
- Query parameter sanitization
- Type checking for all inputs

### 3. CSRF Protection
- Token validation on all state-changing operations
- Already implemented in previous tasks

### 4. Rate Limiting
- Upload endpoints: 10 requests/minute
- Authentication: 5 attempts/15 minutes
- Contact form: 3 messages/hour

### 5. File Upload Security
- File type validation
- File size limits (10MB images, 100MB videos)
- Malware scanning (to be implemented)

## Testing

Comprehensive test suite in `tests/validation.test.ts`:

- ✅ Required field validation
- ✅ String length validation
- ✅ Numeric range validation
- ✅ Email format validation
- ✅ URL format validation
- ✅ Enum value validation
- ✅ XSS prevention
- ✅ SQL injection prevention
- ✅ Unique constraint validation
- ✅ Error message format

Run tests:
```bash
npm test -- validation.test.ts
```

## Dependencies Added

```json
{
  "dependencies": {
    "isomorphic-dompurify": "^2.x.x"
  },
  "devDependencies": {
    "@types/dompurify": "^3.x.x"
  }
}
```

## Files Modified

1. **backend/src/middleware/validation.ts**
   - Enhanced all validation rules
   - Added unique constraint checks
   - Added bulk operation validation
   - Added sort order validation

2. **backend/src/middleware/security.ts**
   - Added DOMPurify integration
   - Implemented sanitizeHtml()
   - Implemented sanitizeText()
   - Implemented sanitizeUrl()
   - Implemented sanitizeFilePath()
   - Enhanced sanitizeInput() middleware

3. **backend/src/routes/admin/products.ts**
   - Applied validateProduct middleware
   - Applied validateObjectIdParam middleware
   - Applied validateBulkOperation middleware

4. **backend/src/routes/admin/gallery.ts**
   - Applied validateGalleryImage middleware
   - Applied validateObjectIdParam middleware
   - Applied validateBulkOperation middleware
   - Applied validateSortOrder middleware

5. **backend/src/routes/admin/home.ts**
   - Already had comprehensive validation (no changes needed)

6. **backend/src/routes/public.ts**
   - Already had validation applied (no changes needed)

## Validation Rules Summary

### Products
| Field | Required | Min | Max | Type | Enum/Pattern |
|-------|----------|-----|-----|------|--------------|
| name | Yes | 2 | 200 | String | Letters, numbers, spaces, -'.,() |
| slug | No | 2 | 200 | String | lowercase, numbers, hyphens |
| description | Yes | 10 | 5000 | String | HTML allowed |
| shortDescription | Yes | 10 | 300 | String | - |
| category | Yes | - | - | Enum | cuisine, dressing, mobilier, amenagement, autre |
| subcategory | No | - | 100 | String | - |
| images | Yes | 1 | - | Array | - |
| images[].url | Yes | - | - | URL | http/https |
| images[].alt | Yes | 2 | 200 | String | - |
| price.amount | No | 0 | 999999999 | Number | - |
| price.currency | No | 3 | 3 | String | Uppercase (TND, EUR, USD) |
| availability | No | - | - | Enum | in_stock, made_to_order, out_of_stock |
| tags | No | - | - | Array | lowercase, numbers, hyphens |

### Gallery Images
| Field | Required | Min | Max | Type | Enum/Pattern |
|-------|----------|-----|-----|------|--------------|
| title | Yes | 2 | 200 | String | - |
| description | No | - | 1000 | String | HTML allowed |
| category | Yes | - | - | Enum | cuisine, dressing, mobilier, amenagement, showroom, process, autre |
| alt | Yes | 2 | 200 | String | - |
| url | No | - | - | URL | http/https |
| tags | No | - | - | Array | lowercase, numbers, hyphens |
| width | No | 1 | 10000 | Number | - |
| height | No | 1 | 10000 | Number | - |
| sortOrder | No | 0 | - | Number | - |

### Contact Messages
| Field | Required | Min | Max | Type | Pattern |
|-------|----------|-----|-----|------|---------|
| name | Yes | 2 | 100 | String | Letters, spaces, apostrophes, hyphens |
| email | Yes | - | 100 | Email | Standard email format |
| phone | No | 8 | 20 | String | +, numbers, spaces, -, (, ) |
| subject | Yes | 5 | 200 | String | - |
| message | Yes | 10 | 5000 | String | - |

### Authentication
| Field | Required | Min | Max | Type | Pattern |
|-------|----------|-----|-----|------|---------|
| email | Yes | - | 100 | Email | Standard email format |
| password | Yes | 8 | 128 | String | 1 uppercase, 1 lowercase, 1 digit, 1 special |
| firstName | Yes | 2 | 50 | String | Letters, spaces, apostrophes, hyphens |
| lastName | Yes | 2 | 50 | String | Letters, spaces, apostrophes, hyphens |

## Best Practices Implemented

1. **Defense in Depth**: Multiple layers of validation (client-side, server-side, database)
2. **Fail Securely**: Invalid input rejected with clear error messages
3. **Whitelist Approach**: Only allowed values/patterns accepted
4. **Sanitization**: All inputs sanitized before processing
5. **Type Safety**: TypeScript types enforced throughout
6. **Comprehensive Testing**: All validation rules tested
7. **Clear Documentation**: All rules documented and maintainable

## Future Enhancements

1. **Malware Scanning**: Implement ClamAV or similar for uploaded files
2. **Content Security Policy**: Enhance CSP headers
3. **Input Logging**: Log suspicious input patterns
4. **Honeypot Fields**: Add honeypot fields to forms
5. **CAPTCHA**: Add CAPTCHA for public forms
6. **Audit Trail**: Log all validation failures

## Compliance

This implementation fulfills all requirements from Requirement 26:

- ✅ 26.1: All required fields validated
- ✅ 26.2: String length limits enforced
- ✅ 26.3: Numeric ranges validated
- ✅ 26.4: Email format validated
- ✅ 26.5: URL format validated
- ✅ 26.6: Enum values validated
- ✅ 26.7: Unique constraints validated
- ✅ 26.8: Client-side and server-side validation
- ✅ 26.9: 400 Bad Request with detailed errors
- ✅ 26.10: XSS prevention through sanitization
