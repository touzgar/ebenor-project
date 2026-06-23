import jwt, { SignOptions } from 'jsonwebtoken';
import { ApiError, ERROR_CODES } from '../errors';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (process.env.NODE_ENV === 'production' && JWT_SECRET === 'fallback-secret-key-change-in-production') {
  console.error('⚠️ JWT_SECRET not configured in production!');
  throw new Error('JWT_SECRET must be configured in production');
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT token
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const tokenPayload: JWTPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
  };

  const signOptions: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as any,
    issuer: 'ebenor-creation-api',
    audience: 'ebenor-creation-frontend',
  };

  return jwt.sign(tokenPayload, JWT_SECRET, signOptions);
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'ebenor-creation-api',
      audience: 'ebenor-creation-frontend',
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(
        'Token expiré',
        401,
        ERROR_CODES.EXPIRED_TOKEN
      );
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(
        'Token invalide',
        401,
        ERROR_CODES.INVALID_TOKEN
      );
    }

    throw new ApiError(
      'Erreur de vérification du token',
      401,
      ERROR_CODES.INVALID_TOKEN
    );
  }
}

/**
 * Decode token without verification (for expired tokens)
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
}
