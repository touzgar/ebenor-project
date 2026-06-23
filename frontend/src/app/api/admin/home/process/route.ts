import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { HomeContent } from '@/lib/models/HomeContent';

// PUT - Update process section

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const PUT = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const body = await request.json();
  const { process } = body;

  if (!process || !Array.isArray(process) || process.length === 0) {
    return NextResponse.json(
      {
        success: false,
        message: 'Au moins une Ã©tape de processus est requise',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  let homeContent = await HomeContent.findOne();

  if (!homeContent) {
    homeContent = new HomeContent({});
  }

  // Update process section
  homeContent.process = process;

  await homeContent.save();

  console.log(`âœ… Process section updated by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: homeContent,
    message: 'Section processus mise Ã  jour avec succÃ¨s',
  });
});
