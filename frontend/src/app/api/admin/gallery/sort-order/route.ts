import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { GalleryImage } from '@/lib/models/GalleryImage';

// PUT - Update sort order of gallery images

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const PUT = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const { imageOrders } = await request.json();

  if (!imageOrders || !Array.isArray(imageOrders)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Ordre des images requis',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  // Update sort order for each image
  const updatePromises = imageOrders.map(({ id, sortOrder }: any) =>
    GalleryImage.findByIdAndUpdate(id, { sortOrder })
  );

  await Promise.all(updatePromises);

  console.log(`âœ… Gallery images sort order updated: ${imageOrders.length} images by ${user.email}`);

  return NextResponse.json({
    success: true,
    message: 'Ordre des images mis Ã  jour avec succÃ¨s',
  });
});
