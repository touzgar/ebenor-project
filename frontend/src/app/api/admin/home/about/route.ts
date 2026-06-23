import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { HomeContent } from '@/lib/models/HomeContent';

// PUT - Update about section

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const PUT = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const body = await request.json();
  const { title, description, image, highlights } = body;

  let homeContent = await HomeContent.findOne();

  if (!homeContent) {
    homeContent = new HomeContent({});
  }

  // Update about section
  homeContent.about = {
    title: title || homeContent.about?.title || '',
    description: description || homeContent.about?.description || '',
    image: image || homeContent.about?.image || '',
    highlights: highlights || homeContent.about?.highlights || [],
  };

  await homeContent.save();

  console.log(`âœ… About section updated by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: homeContent,
    message: 'Section Ã  propos mise Ã  jour avec succÃ¨s',
  });
});
