import { NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { HomeContent } from '@/lib/models/HomeContent';

export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async () => {
  const homeContent = await HomeContent.findOne().lean();

  if (!homeContent) {
    return NextResponse.json({
      success: true,
      data: null,
      message: 'No content found, using defaults',
    });
  }

  return NextResponse.json({
    success: true,
    data: homeContent,
  });
});
