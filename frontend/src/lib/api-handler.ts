import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from './errors';
import connectDB from './db/mongodb';

export type ApiHandler = (request: NextRequest, context?: any) => Promise<NextResponse>;

/**
 * Wrap API route handler with error handling and DB connection
 */
export function withApiHandler(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest, context?: any) => {
    try {
      // Connect to database
      await connectDB();
      
      // Execute handler
      return await handler(request, context);
    } catch (error) {
      const errorResponse = handleApiError(error);
      const statusCode = (error as any).statusCode || 500;
      return NextResponse.json(errorResponse, { status: statusCode });
    }
  };
}
