import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, type JWTPayload } from './jwt';
import { ApiError, ERROR_CODES } from '../errors';
import { AdminUser } from '../models/AdminUser';
import connectDB from '../db/mongodb';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Get auth token from request
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Try cookie as fallback
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  return token || null;
}

/**
 * Authenticate request and return user
 */
export async function authenticateRequest(request: NextRequest): Promise<AuthUser> {
  const token = getTokenFromRequest(request);
  
  if (!token) {
    throw new ApiError(
      'Token d\'authentification requis',
      401,
      ERROR_CODES.INVALID_TOKEN
    );
  }

  // Verify token
  const decoded = verifyToken(token);
  
  // Connect to DB and get user
  await connectDB();
  const user = await AdminUser.findById(decoded.userId);
  
  if (!user) {
    throw new ApiError(
      'Utilisateur non trouvé',
      401,
      ERROR_CODES.INVALID_TOKEN
    );
  }

  if (!user.isActive) {
    throw new ApiError(
      'Compte désactivé',
      401,
      ERROR_CODES.ACCESS_DENIED
    );
  }

  if (user.isLocked()) {
    throw new ApiError(
      'Compte temporairement verrouillé',
      423,
      ERROR_CODES.ACCESS_DENIED
    );
  }

  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  return await authenticateRequest(request);
}

/**
 * Require specific role(s)
 */
export async function requireRole(request: NextRequest, ...allowedRoles: string[]): Promise<AuthUser> {
  const user = await requireAuth(request);
  
  if (!allowedRoles.includes(user.role)) {
    throw new ApiError(
      'Permissions insuffisantes',
      403,
      ERROR_CODES.ACCESS_DENIED
    );
  }
  
  return user;
}

/**
 * Optional authentication - returns user or null
 */
export async function optionalAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    return await authenticateRequest(request);
  } catch {
    return null;
  }
}

/**
 * Get client IP address
 */
export function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * Get user agent
 */
export function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown';
}
