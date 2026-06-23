import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { HomeContent } from '@/lib/models/HomeContent';

// GET - Get home content for editing

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAuth(request);

  const homeContent = await HomeContent.findOne().lean();

  if (!homeContent) {
    return NextResponse.json(
      {
        success: false,
        message: 'Contenu de la page d\'accueil non trouvÃ©',
        code: 'NOT_FOUND',
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: homeContent,
  });
});

// PUT - Update complete home content
export const PUT = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const body = await request.json();

  let homeContent = await HomeContent.findOne();

  if (!homeContent) {
    // Create if doesn't exist
    homeContent = new HomeContent(body);
  } else {
    // Update existing
    Object.assign(homeContent, body);
  }

  await homeContent.save();

  console.log(`âœ… Home content updated by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: homeContent,
    message: 'Contenu de la page d\'accueil mis Ã  jour avec succÃ¨s',
  });
});
