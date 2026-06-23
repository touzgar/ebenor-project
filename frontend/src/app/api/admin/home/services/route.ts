import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { HomeContent } from '@/lib/models/HomeContent';

// PUT - Update services section

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const PUT = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const body = await request.json();
  const { services } = body;

  if (!services || !Array.isArray(services) || services.length === 0) {
    return NextResponse.json(
      {
        success: false,
        message: 'Au moins un service est requis',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  let homeContent = await HomeContent.findOne();

  if (!homeContent) {
    homeContent = new HomeContent({});
  }

  // Update services section
  homeContent.services = services;

  await homeContent.save();

  console.log(`âœ… Services section updated by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: homeContent,
    message: 'Section services mise Ã  jour avec succÃ¨s',
  });
});
