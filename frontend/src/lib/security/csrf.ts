import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { ApiError, ERROR_CODES } from '../errors';

const CSRF_CONFIG = {
  tokenLength: 32,
  cookieName: 'csrf-token',
  headerName: 'x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 24 * 60 * 60, // 24 hours in seconds
    path: '/',
  },
};

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(CSRF_CONFIG.tokenLength).toString('hex');
}

/**
 * Get or create CSRF token
 */
export function getOrCreateCsrfToken(): string {
  const cookieStore = cookies();
  let token = cookieStore.get(CSRF_CONFIG.cookieName)?.value;

  if (!token) {
    token = generateCsrfToken();
    cookieStore.set(CSRF_CONFIG.cookieName, token, CSRF_CONFIG.cookieOptions);
  }

  return token;
}

/**
 * Validate CSRF token from request
 */
export function validateCsrfToken(request: NextRequest): void {
  // Skip validation for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return;
  }

  // Get token from cookie
  const cookieToken = request.cookies.get(CSRF_CONFIG.cookieName)?.value;

  // Get token from header
  const headerToken = request.headers.get(CSRF_CONFIG.headerName);

  // Check both tokens exist
  if (!cookieToken || !headerToken) {
    throw new ApiError(
      'Token CSRF manquant',
      403,
      ERROR_CODES.CSRF_TOKEN_MISSING
    );
  }

  // Check tokens match (double-submit cookie pattern)
  if (cookieToken !== headerToken) {
    throw new ApiError(
      'Token CSRF invalide',
      403,
      ERROR_CODES.CSRF_TOKEN_INVALID
    );
  }
}

/**
 * Set CSRF token in response
 */
export function setCsrfTokenInResponse(response: NextResponse): NextResponse {
  const token = generateCsrfToken();
  response.cookies.set(CSRF_CONFIG.cookieName, token, CSRF_CONFIG.cookieOptions);
  return response;
}
