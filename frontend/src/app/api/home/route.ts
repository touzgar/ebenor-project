import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { HomeContent } from '@/lib/models/HomeContent';


// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  const homeContent = await HomeContent.findOne().sort({ updatedAt: -1 });

  if (!homeContent) {
    return NextResponse.json(
      {
        success: false,
        message: 'Contenu non trouvÃ©',
        code: 'NOT_FOUND',
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: homeContent.toPublicJSON(),
  });
});
