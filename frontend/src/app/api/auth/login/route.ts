import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/services/auth-service';
import { handleApiError } from '@/lib/errors';
import { getClientIP, getUserAgent } from '@/lib/auth/helpers';


// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email et mot de passe requis',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    // Authenticate
    const { user, token } = await authenticateUser(email, password);

    // Get client info
    const ipAddress = getClientIP(request);
    const userAgent = getUserAgent(request);

    console.log(`âœ… Login: ${email} from ${ipAddress}`);

    // Return response with token
    const response = NextResponse.json({
      success: true,
      data: {
        user: user.toPublicJSON(),
        token,
      },
      message: 'Connexion rÃ©ussie',
    });

    // Set auth token in httpOnly cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    const errorResponse = handleApiError(error);
    const statusCode = (error as any).statusCode || 500;
    return NextResponse.json(errorResponse, { status: statusCode });
  }
}
