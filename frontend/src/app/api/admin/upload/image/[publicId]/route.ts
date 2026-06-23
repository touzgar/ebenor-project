import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { cloudinaryService } from '@/lib/services/cloudinary-service';

// DELETE - Delete an image
export const DELETE = withApiHandler(async (request: NextRequest, { params }: { params: { publicId: string } }) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const { publicId } = params;

  if (!publicId) {
    return NextResponse.json(
      {
        success: false,
        message: 'Public ID requis',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  // Decode the public ID (it may be URL encoded)
  const decodedPublicId = decodeURIComponent(publicId);

  await cloudinaryService.deleteImage(decodedPublicId);

  console.log(`✅ Image deleted: ${decodedPublicId} by ${user.email}`);

  return NextResponse.json({
    success: true,
    message: 'Image supprimée avec succès',
  });
});
