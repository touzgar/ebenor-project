import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { GalleryImage } from '@/lib/models/GalleryImage';


// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const skip = (page - 1) * limit;
  
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const sort = searchParams.get('sort') || '-uploadedAt';

  // Build query
  const query: any = {};
  
  if (category) {
    query.category = category.toLowerCase();
  }
  
  if (featured === 'true') {
    query.featured = true;
  }

  // Execute query
  const [images, total] = await Promise.all([
    GalleryImage.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    GalleryImage.countDocuments(query)
  ]);

  return NextResponse.json({
    success: true,
    data: images,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});
