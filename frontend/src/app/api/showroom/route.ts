import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { ShowroomContent } from '@/lib/models/ShowroomContent';

// GET - Get showroom content (public)

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  const content = await ShowroomContent.findOne().sort({ updatedAt: -1 });

  if (!content) {
    // Return default content
    return NextResponse.json({
      success: true,
      data: {
        title: 'Notre',
        titleHighlight: 'Collection',
        subtitle: 'DÃ©couvrez nos crÃ©ations en bois d\'exception et laissez-vous inspirer par notre savoir-faire artisanal.',
        ctaTitle: 'Vous ne trouvez pas ce que vous cherchez ?',
        ctaSubtitle: 'Nous crÃ©ons Ã©galement des piÃ¨ces sur mesure selon vos spÃ©cifications exactes. Contactez-nous pour discuter de votre projet personnalisÃ©.',
        ctaButtonText: 'Demander un Devis Gratuit',
      },
    });
  }

  return NextResponse.json({
    success: true,
    data: content,
  });
});

// PUT - Update showroom content (admin only)
export const PUT = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const body = await request.json();

  let content = await ShowroomContent.findOne();

  if (!content) {
    content = new ShowroomContent({
      ...body,
      updatedBy: user.id,
    });
  } else {
    Object.assign(content, body);
    content.updatedBy = user.id;
  }

  await content.save();

  console.log(`âœ… Showroom content updated by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: content,
    message: 'Contenu showroom mis Ã  jour avec succÃ¨s',
  });
});
