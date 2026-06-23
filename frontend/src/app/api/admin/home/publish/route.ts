import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { HomeContent } from '@/lib/models/HomeContent';

// POST - Publish/unpublish a section

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const POST = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const body = await request.json();
  const { section, published } = body;

  const validSections = ['hero', 'about', 'services', 'process', 'testimonials', 'contact'];

  if (!section || !validSections.includes(section)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Section invalide',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  if (typeof published !== 'boolean') {
    return NextResponse.json(
      {
        success: false,
        message: 'Le statut de publication doit Ãªtre un boolÃ©en',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  let homeContent = await HomeContent.findOne();

  if (!homeContent) {
    homeContent = new HomeContent({});
  }

  // Update published status for the section
  if (!homeContent.publishedSections) {
    homeContent.publishedSections = {} as any;
  }

  (homeContent.publishedSections as any)[section] = published;

  await homeContent.save();

  console.log(`âœ… Section ${section} ${published ? 'published' : 'unpublished'} by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: homeContent,
    message: `Section ${section} ${published ? 'publiÃ©e' : 'dÃ©publiÃ©e'} avec succÃ¨s`,
  });
});
