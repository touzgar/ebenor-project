import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { GalleryImage } from '@/lib/models/GalleryImage';

// POST - Bulk operations on gallery images

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const POST = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const { action, imageIds, data } = await request.json();

  // Special case: deleteAll doesn't need imageIds
  if (action === 'deleteAll') {
    const result = await GalleryImage.deleteMany({});
    console.log(`âœ… Delete ALL gallery images: ${result.deletedCount} by ${user.email}`);

    return NextResponse.json({
      success: true,
      data: { deletedCount: result.deletedCount },
      message: `${result.deletedCount} image(s) supprimÃ©e(s) avec succÃ¨s`,
    });
  }

  if (!action || !imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
    return NextResponse.json(
      {
        success: false,
        message: 'Action et IDs d\'images requis',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  let result;

  switch (action) {
    case 'delete':
      result = await GalleryImage.deleteMany({ _id: { $in: imageIds } });
      console.log(`âœ… Bulk delete gallery images: ${result.deletedCount} by ${user.email}`);
      break;

    case 'feature':
      result = await GalleryImage.updateMany(
        { _id: { $in: imageIds } },
        { $set: { featured: true } }
      );
      console.log(`âœ… Bulk feature gallery images: ${result.modifiedCount} by ${user.email}`);
      break;

    case 'unfeature':
      result = await GalleryImage.updateMany(
        { _id: { $in: imageIds } },
        { $set: { featured: false } }
      );
      console.log(`âœ… Bulk unfeature gallery images: ${result.modifiedCount} by ${user.email}`);
      break;

    case 'changeCategory':
      if (!data || !data.category) {
        return NextResponse.json(
          {
            success: false,
            message: 'CatÃ©gorie requise pour cette action',
            code: 'VALIDATION_ERROR',
          },
          { status: 400 }
        );
      }
      result = await GalleryImage.updateMany(
        { _id: { $in: imageIds } },
        { $set: { category: data.category } }
      );
      console.log(`âœ… Bulk change category: ${result.modifiedCount} to ${data.category} by ${user.email}`);
      break;

    default:
      return NextResponse.json(
        {
          success: false,
          message: 'Action non reconnue',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
  }

  return NextResponse.json({
    success: true,
    data: result,
    message: `OpÃ©ration "${action}" effectuÃ©e avec succÃ¨s`,
  });
});
