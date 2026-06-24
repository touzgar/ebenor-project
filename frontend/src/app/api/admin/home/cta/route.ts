import { NextRequest, NextResponse} from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { HomeContent } from '@/lib/models/HomeContent';

export const dynamic = 'force-dynamic';

export const PUT = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const body = await request.json();

  let homeContent = await HomeContent.findOne();

  if (!homeContent) {
    homeContent = new HomeContent({});
  }

  // Update CTA section
  homeContent.cta = body;

  await homeContent.save();

  console.log(`✅ CTA section updated by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: homeContent.cta,
    message: 'Section CTA mise à jour avec succès',
  });
});
