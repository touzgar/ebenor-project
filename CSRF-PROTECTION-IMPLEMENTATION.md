# CSRF Protection Implementation

## Overview

This document describes the implementation of Cross-Site Request Forgery (CSRF) protection for the ÉBENOR CRÉATION Product and Content Management System.

**Requirement**: 25.7 - THE system SHALL implement CSRF protection for all state-changing operations

**Implementation Date**: 2024
**Status**: ✅ Complete

---

## What is CSRF?

Cross-Site Request Forgery (CSRF) is an attack that forces authenticated users to submit unwanted requests to a web application. CSRF attacks specifically target state-changing requests, not theft of data, since the attacker has no way to see the response to the forged request.

### Example Attack Scenario

Without CSRF protection:
1. User logs into admin panel at `admin.ebenor.com`
2. User visits malicious site `evil.com` in another tab
3. `evil.com` contains hidden form that submits to `admin.ebenor.com/api/admin/products/delete`
4. Browser automatically includes authentication cookies
5. Product gets deleted without user's knowledge

---

## Implementation Strategy

We implemented the **Double-Submit Cookie Pattern**, which is a stateless CSRF protection mechanism that doesn't require server-side session storage.

### How It Works

1. **Token Generation**: Server generates a random CSRF token and sends it in two ways:
   - As an HTTP-only cookie (cannot be accessed by JavaScript)
   - In the response body (can be read by legitimate JavaScript)

2. **Token Submission**: Client includes the token in two ways:
   - Cookie is automatically sent by browser
   - Token is manually added to `X-CSRF-Token` header

3. **Token Validation**: Server compares both tokens:
   - If they match → Request is legitimate
   - If they don't match or are missing → Request is rejected

### Why This Works

- **Malicious sites cannot read cookies** from other domains (Same-Origin Policy)
- **Malicious sites cannot set custom headers** on cross-origin requests
- **Only legitimate JavaScript** from our domain can read the token and add it to headers

---

## Architecture

### Backend Components

#### 1. CSRF Middleware (`backend/src/middleware/csrf.ts`)

**Key Functions:**

- `generateCsrfToken()`: Generates a 32-byte random token
- `setCsrfToken()`: Middleware that generates and sets CSRF token cookie
- `validateCsrfToken()`: Middleware that validates CSRF tokens on state-changing requests
- `getCsrfToken()`: Endpoint handler to retrieve current CSRF token
- `refreshCsrfToken()`: Regenerates CSRF token (optional, for enhanced security)
- `exemptCsrf()`: Marks routes as exempt from CSRF validation

**Configuration:**

```typescript
const CSRF_CONFIG = {
  tokenLength: 32,                    // 32 bytes = 64 hex characters
  cookieName: 'csrf-token',           // Cookie name
  headerName: 'x-csrf-token',         // Header name
  cookieOptions: {
    httpOnly: true,                   // Cannot be accessed by JavaScript
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict',               // Strict same-site policy
    maxAge: 24 * 60 * 60 * 1000,     // 24 hours
  },
};
```

#### 2. Server Configuration (`backend/src/server.ts`)

**Middleware Order:**

```typescript
app.use(cookieParser());              // Parse cookies
app.use(setCsrfToken);                // Generate CSRF token for all requests
app.get('/api/csrf-token', getCsrfToken); // Endpoint to get token
app.use('/api', validateCsrfToken, apiRoutes); // Validate on all API routes
```

**CORS Configuration:**

```typescript
const corsOptions = {
  credentials: true,                  // Allow cookies
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token'                    // Allow CSRF header
  ],
  exposedHeaders: ['Set-Cookie'],     // Expose cookie headers
};
```

#### 3. Error Handling (`backend/src/middleware/errorHandler.ts`)

**New Error Codes:**

- `CSRF_TOKEN_MISSING`: Token not provided in request
- `CSRF_TOKEN_INVALID`: Token mismatch between cookie and header

### Frontend Components

#### 1. API Client (`frontend/src/lib/api.ts`)

**Key Features:**

- **Automatic Token Fetching**: Fetches CSRF token on first state-changing request
- **Token Caching**: Stores token in sessionStorage to avoid repeated fetches
- **Automatic Retry**: If CSRF validation fails, refreshes token and retries once
- **Credential Inclusion**: All requests include `credentials: 'include'` for cookies

**Token Management:**

```typescript
class ApiClient {
  private csrfToken: string | null = null;

  // Fetch token from server
  private async fetchCsrfToken(): Promise<string> {
    const response = await fetch(`${this.baseURL}/csrf-token`, {
      credentials: 'include'
    });
    const data = await response.json();
    this.csrfToken = data.data.csrfToken;
    sessionStorage.setItem('csrf_token', this.csrfToken);
    return this.csrfToken;
  }

  // Get cached or fetch new token
  private async getCsrfToken(): Promise<string> {
    if (this.csrfToken) return this.csrfToken;
    return await this.fetchCsrfToken();
  }

  // Add token to state-changing requests
  private async request<T>(endpoint: string, options: RequestInit) {
    const needsCsrf = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(
      options.method?.toUpperCase() || 'GET'
    );

    if (needsCsrf) {
      const csrfToken = await this.getCsrfToken();
      options.headers = {
        ...options.headers,
        'X-CSRF-Token': csrfToken
      };
    }

    // ... make request with credentials: 'include'
  }
}
```

---

## Protected Endpoints

### State-Changing Operations (CSRF Protected)

All endpoints using these HTTP methods are automatically protected:

- **POST**: Create operations
- **PUT**: Update operations  
- **PATCH**: Partial update operations
- **DELETE**: Delete operations

### Examples of Protected Endpoints

**Authentication:**
- `POST /api/auth/logout`
- `POST /api/auth/refresh-token`
- `POST /api/auth/change-password`
- `PUT /api/auth/profile`

**Products:**
- `POST /api/admin/products`
- `PUT /api/admin/products/:id`
- `DELETE /api/admin/products/:id`
- `POST /api/admin/products/bulk`

**Gallery:**
- `POST /api/admin/gallery`
- `PUT /api/admin/gallery/:id`
- `DELETE /api/admin/gallery/:id`
- `POST /api/admin/gallery/bulk`

**Homepage:**
- `PUT /api/admin/home`
- `PUT /api/admin/home/hero`
- `PUT /api/admin/home/about`
- `POST /api/admin/home/publish`

**Messages:**
- `POST /api/messages`
- `PATCH /api/admin/messages/:id/read`
- `DELETE /api/admin/messages/:id`

### Exempt Endpoints (No CSRF Required)

These endpoints are exempt because they don't change state:

- **GET**: All read operations
- **HEAD**: Header-only requests
- **OPTIONS**: CORS preflight requests

---

## Security Features

### 1. Token Randomness

- Uses `crypto.randomBytes(32)` for cryptographically secure random tokens
- 32 bytes = 256 bits of entropy
- Hex encoding produces 64-character tokens

### 2. Cookie Security

- **httpOnly**: Prevents JavaScript access (XSS protection)
- **secure**: HTTPS-only in production (prevents interception)
- **sameSite: 'strict'**: Prevents cross-site cookie sending
- **maxAge**: 24-hour expiration (limits exposure window)

### 3. Automatic Token Refresh

- If validation fails, client automatically fetches new token
- Prevents user disruption from expired tokens
- Limits retry to once to prevent infinite loops

### 4. Defense in Depth

CSRF protection works alongside other security measures:

- **JWT Authentication**: Verifies user identity
- **Rate Limiting**: Prevents brute force attacks
- **Input Sanitization**: Prevents XSS attacks
- **CORS**: Restricts cross-origin requests
- **Helmet**: Sets security headers

---

## Usage Guide

### For Frontend Developers

**No manual work required!** The API client handles everything automatically:

```typescript
// Just use the API client normally
await apiClient.post('/admin/products', productData);
await apiClient.put('/admin/products/123', updatedData);
await apiClient.delete('/admin/products/123');

// CSRF token is automatically:
// 1. Fetched on first state-changing request
// 2. Cached in sessionStorage
// 3. Added to X-CSRF-Token header
// 4. Refreshed if validation fails
```

### For Backend Developers

**Adding New Protected Routes:**

```typescript
// Routes are automatically protected by validateCsrfToken middleware
router.post('/api/admin/new-endpoint', authenticate, controller.handler);
// ✅ CSRF protected automatically
```

**Exempting Public Endpoints (if needed):**

```typescript
import { exemptCsrf } from '@/middleware/csrf';

// Exempt specific route from CSRF validation
router.post('/api/public/webhook', exemptCsrf, webhookHandler);
```

### For Testing

**Using Postman/cURL:**

1. First, get a CSRF token:
```bash
curl -c cookies.txt http://localhost:5000/api/csrf-token
```

2. Extract token from response and use in subsequent requests:
```bash
curl -b cookies.txt \
  -H "X-CSRF-Token: YOUR_TOKEN_HERE" \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"name":"Test Product"}' \
  http://localhost:5000/api/admin/products
```

**In Development:**

- CSRF protection is active in all environments
- Use browser DevTools to inspect cookies and headers
- Check Network tab for `X-CSRF-Token` header in requests

---

## Error Handling

### Client-Side Errors

**CSRF Token Missing:**
```json
{
  "success": false,
  "message": "Token CSRF manquant",
  "code": "CSRF_TOKEN_MISSING"
}
```

**CSRF Token Invalid:**
```json
{
  "success": false,
  "message": "Token CSRF invalide",
  "code": "CSRF_TOKEN_INVALID"
}
```

**Client Behavior:**
- Automatically refreshes token
- Retries request once
- If still fails, shows error to user

### Server-Side Errors

**Token Generation Failed:**
```json
{
  "success": false,
  "message": "Impossible de générer un token CSRF",
  "code": "CSRF_TOKEN_GENERATION_FAILED"
}
```

---

## Testing

### Manual Testing

**Test 1: Valid CSRF Token**
```bash
# Get token
TOKEN=$(curl -c cookies.txt -s http://localhost:5000/api/csrf-token | jq -r '.data.csrfToken')

# Use token in request
curl -b cookies.txt \
  -H "X-CSRF-Token: $TOKEN" \
  -H "Authorization: Bearer YOUR_JWT" \
  -X POST \
  http://localhost:5000/api/admin/products
# Expected: 200 OK (or 201 Created)
```

**Test 2: Missing CSRF Token**
```bash
curl -H "Authorization: Bearer YOUR_JWT" \
  -X POST \
  http://localhost:5000/api/admin/products
# Expected: 403 Forbidden, CSRF_TOKEN_MISSING
```

**Test 3: Invalid CSRF Token**
```bash
curl -b cookies.txt \
  -H "X-CSRF-Token: invalid-token" \
  -H "Authorization: Bearer YOUR_JWT" \
  -X POST \
  http://localhost:5000/api/admin/products
# Expected: 403 Forbidden, CSRF_TOKEN_INVALID
```

**Test 4: GET Requests (No CSRF Required)**
```bash
curl http://localhost:5000/api/products
# Expected: 200 OK (CSRF not required for GET)
```

### Automated Testing

Create test file `backend/tests/csrf.test.ts`:

```typescript
import request from 'supertest';
import app from '../src/server';

describe('CSRF Protection', () => {
  let csrfToken: string;
  let cookies: string[];

  beforeAll(async () => {
    // Get CSRF token
    const response = await request(app)
      .get('/api/csrf-token')
      .expect(200);
    
    csrfToken = response.body.data.csrfToken;
    cookies = response.headers['set-cookie'];
  });

  it('should reject POST without CSRF token', async () => {
    await request(app)
      .post('/api/admin/products')
      .set('Authorization', 'Bearer valid-jwt')
      .expect(403)
      .expect((res) => {
        expect(res.body.code).toBe('CSRF_TOKEN_MISSING');
      });
  });

  it('should accept POST with valid CSRF token', async () => {
    await request(app)
      .post('/api/admin/products')
      .set('Authorization', 'Bearer valid-jwt')
      .set('Cookie', cookies)
      .set('X-CSRF-Token', csrfToken)
      .send({ name: 'Test Product' })
      .expect(201);
  });

  it('should allow GET without CSRF token', async () => {
    await request(app)
      .get('/api/products')
      .expect(200);
  });
});
```

---

## Troubleshooting

### Issue: "CSRF_TOKEN_MISSING" Error

**Possible Causes:**
1. Frontend not including `credentials: 'include'`
2. CORS not configured to allow credentials
3. Cookie blocked by browser (third-party cookie settings)

**Solutions:**
1. Verify `credentials: 'include'` in fetch options
2. Check CORS `credentials: true` in server config
3. Ensure frontend and backend on same domain or proper CORS setup

### Issue: "CSRF_TOKEN_INVALID" Error

**Possible Causes:**
1. Token mismatch between cookie and header
2. Token expired (24-hour lifetime)
3. Cookie not being sent with request

**Solutions:**
1. Clear browser cookies and sessionStorage
2. Refresh token using `apiClient.refreshCsrfToken()`
3. Check browser DevTools Network tab for cookie in request

### Issue: Token Not Persisting

**Possible Causes:**
1. Browser blocking cookies
2. Incorrect cookie domain/path
3. sessionStorage cleared

**Solutions:**
1. Check browser cookie settings
2. Verify cookie domain matches request domain
3. Token will be re-fetched automatically on next request

---

## Performance Considerations

### Token Caching

- CSRF tokens are cached in sessionStorage
- Reduces server requests (only fetched once per session)
- Automatic refresh on validation failure

### Cookie Overhead

- Cookie size: ~100 bytes (64-char token + metadata)
- Sent with every request to same domain
- Minimal impact on performance

### Validation Performance

- Token comparison is O(1) operation
- No database queries required
- Stateless validation (no session lookup)

---

## Security Best Practices

### ✅ Do's

- Always use HTTPS in production
- Keep token length at 32 bytes minimum
- Set `httpOnly` and `secure` flags on cookies
- Use `sameSite: 'strict'` for maximum protection
- Implement automatic token refresh
- Log CSRF validation failures for monitoring

### ❌ Don'ts

- Don't store CSRF tokens in localStorage (XSS vulnerable)
- Don't disable CSRF protection in production
- Don't use predictable token generation
- Don't share tokens between users
- Don't extend token lifetime beyond 24 hours
- Don't exempt state-changing endpoints without good reason

---

## Compliance

This implementation satisfies:

- **Requirement 25.7**: CSRF protection for state-changing operations
- **OWASP Top 10**: A01:2021 – Broken Access Control
- **OWASP CSRF Prevention Cheat Sheet**: Double-Submit Cookie Pattern
- **CWE-352**: Cross-Site Request Forgery (CSRF)

---

## Future Enhancements

### Potential Improvements

1. **Per-Request Tokens**: Generate new token for each request (higher security, more overhead)
2. **Token Rotation**: Rotate tokens periodically during session
3. **Origin Validation**: Additional check of Origin/Referer headers
4. **Encrypted Tokens**: Encrypt token payload for additional security
5. **Monitoring Dashboard**: Track CSRF validation failures

### Not Implemented (By Design)

1. **Synchronizer Token Pattern**: Requires server-side session storage
2. **SameSite Cookie Only**: Not sufficient protection alone
3. **Custom Header Only**: Vulnerable to CORS misconfiguration

---

## References

- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Double-Submit Cookie Pattern](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie)
- [MDN: SameSite Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [CWE-352: Cross-Site Request Forgery](https://cwe.mitre.org/data/definitions/352.html)

---

## Changelog

### Version 1.0.0 (Initial Implementation)

- ✅ Implemented double-submit cookie pattern
- ✅ Added CSRF middleware for token generation and validation
- ✅ Updated API client with automatic token handling
- ✅ Configured CORS for credential support
- ✅ Added error codes and handling
- ✅ Created comprehensive documentation
- ✅ Protected all state-changing endpoints
- ✅ Implemented automatic token refresh on failure

---

## Support

For questions or issues related to CSRF protection:

1. Check this documentation first
2. Review browser console for error messages
3. Check server logs for validation failures
4. Verify CORS and cookie configuration
5. Test with browser DevTools Network tab

---

**Document Version**: 1.0.0  
**Last Updated**: 2024  
**Maintained By**: ÉBENOR CRÉATION Development Team
