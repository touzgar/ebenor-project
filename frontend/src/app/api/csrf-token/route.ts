import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateCsrfToken } from '@/lib/security/csrf';


// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = getOrCreateCsrfToken();

    return NextResponse.json({
      success: true,
      data: {
        csrfToken: token,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Impossible de gÃ©nÃ©rer un token CSRF',
        code: 'CSRF_TOKEN_GENERATION_FAILED',
      },
      { status: 500 }
    );
  }
}
