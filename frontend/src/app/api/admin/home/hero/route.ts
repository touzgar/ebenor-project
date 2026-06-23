import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { HomeContent } from '@/lib/models/HomeContent';

// PUT - Update hero section

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const PUT = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const body = await request.json();
  const { companyName, title, subtitle, backgroundImage, videoUrl, ctaText, ctaLink } = body;

  let homeContent = await HomeContent.findOne();

  if (!homeContent) {
    homeContent = new HomeContent({});
  }

  // Update hero section
  homeContent.hero = {
    companyName: companyName || homeContent.hero?.companyName || '',
    title: title || homeContent.hero?.title || '',
    subtitle: subtitle || homeContent.hero?.subtitle || '',
    backgroundImage: backgroundImage || homeContent.hero?.backgroundImage || '',
    videoUrl: videoUrl || homeContent.hero?.videoUrl || '',
    ctaText: ctaText || homeContent.hero?.ctaText || '',
    ctaLink: ctaLink || homeContent.hero?.ctaLink || '',
  };

  await homeContent.save();

  console.log(`âœ… Hero section updated by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: homeContent,
    message: 'Section hero mise Ã  jour avec succÃ¨s',
  });
});
