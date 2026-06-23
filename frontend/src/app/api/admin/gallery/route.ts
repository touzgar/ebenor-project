import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { GalleryImage } from '@/lib/models/GalleryImage';

// GET - List all gallery images

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAuth(request);

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'sortOrder';

  const filters: any = {};

  if (category) filters.category = category;
  if (featured !== null) filters.featured = featured === 'true';
  if (search) filters.$text = { $search: search };

  // Determine sort order
  let sortQuery: any = { sortOrder: 1, uploadedAt: -1 };
  if (sort === 'date') {
    sortQuery = { uploadedAt: -1 };
  } else if (sort === 'title') {
    sortQuery = { title: 1 };
  } else if (sort === 'featured') {
    sortQuery = { featured: -1, sortOrder: 1 };
  }

  const [images, total] = await Promise.all([
    GalleryImage.find(filters)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean(),
    GalleryImage.countDocuments(filters)
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

// POST - Create new gallery image
export const POST = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const body = await request.json();

  const image = new GalleryImage({
    ...body,
    uploadedBy: user.id,
  });

  await image.save();

  console.log(`âœ… Gallery image created: ${image.title} by ${user.email}`);

  return NextResponse.json(
    {
      success: true,
      data: image,
      message: 'Image ajoutÃ©e Ã  la galerie avec succÃ¨s',
    },
    { status: 201 }
  );
});
