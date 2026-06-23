import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { HomeContent } from '@/lib/models/HomeContent';

// PUT - Update testimonials section

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const PUT = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const body = await request.json();
  const { testimonials } = body;

  if (!testimonials || !Array.isArray(testimonials)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Les tÃ©moignages doivent Ãªtre un tableau',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  let homeContent = await HomeContent.findOne();

  if (!homeContent) {
    homeContent = new HomeContent({});
  }

  // Update testimonials section
  homeContent.testimonials = testimonials;

  await homeContent.save();

  console.log(`âœ… Testimonials section updated by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: homeContent,
    message: 'Section tÃ©moignages mise Ã  jour avec succÃ¨s',
  });
});
