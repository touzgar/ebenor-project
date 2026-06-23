// Error codes
export const ERROR_CODES = {
  // Authentication
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INVALID_TOKEN: 'INVALID_TOKEN',
  EXPIRED_TOKEN: 'EXPIRED_TOKEN',
  ACCESS_DENIED: 'ACCESS_DENIED',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // Files
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  
  // CSRF
  CSRF_TOKEN_MISSING: 'CSRF_TOKEN_MISSING',
  CSRF_TOKEN_INVALID: 'CSRF_TOKEN_INVALID',
  
  // Rate limiting
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  
  // Server
  SERVER_ERROR: 'SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const;

export class ApiError extends Error {
  statusCode: number;
  code: string;
  details?: any;

  constructor(message: string, statusCode: number = 500, code: string = ERROR_CODES.SERVER_ERROR, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function handleApiError(error: any) {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return {
      success: false,
      message: error.message,
      code: error.code,
      details: error.details,
    };
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    return {
      success: false,
      message: 'Données invalides',
      code: ERROR_CODES.VALIDATION_ERROR,
      details: Object.values(error.errors).map((e: any) => e.message),
    };
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    return {
      success: false,
      message: 'Cette ressource existe déjà',
      code: ERROR_CODES.ALREADY_EXISTS,
      details: error.keyValue,
    };
  }

  // Default error
  return {
    success: false,
    message: error.message || 'Une erreur est survenue',
    code: ERROR_CODES.SERVER_ERROR,
  };
}
