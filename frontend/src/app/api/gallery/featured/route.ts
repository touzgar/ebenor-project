import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { GalleryImage } from '@/lib/models/GalleryImage';


// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '6');

  const images = await GalleryImage.find({ featured: true })
    .sort({ sortOrder: 1, uploadedAt: -1 })
    .limit(limit)
    .lean();

  return NextResponse.json({
    success: true,
    data: images,
  });
});
