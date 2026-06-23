import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { GalleryImage } from '@/lib/models/GalleryImage';

// GET - Get gallery image by ID
export const GET = withApiHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  await requireAuth(request);

  const image = await GalleryImage.findById(params.id).lean();

  if (!image) {
    return NextResponse.json(
      {
        success: false,
        message: 'Image non trouvée',
        code: 'NOT_FOUND',
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: image,
  });
});

// PUT - Update gallery image
export const PUT = withApiHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const body = await request.json();

  const image = await GalleryImage.findById(params.id);

  if (!image) {
    return NextResponse.json(
      {
        success: false,
        message: 'Image non trouvée',
        code: 'NOT_FOUND',
      },
      { status: 404 }
    );
  }

  Object.assign(image, body);
  await image.save();

  console.log(`✅ Gallery image updated: ${image.title} by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: image,
    message: 'Image mise à jour avec succès',
  });
});

// DELETE - Delete gallery image
export const DELETE = withApiHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const image = await GalleryImage.findByIdAndDelete(params.id);

  if (!image) {
    return NextResponse.json(
      {
        success: false,
        message: 'Image non trouvée',
        code: 'NOT_FOUND',
      },
      { status: 404 }
    );
  }

  console.log(`✅ Gallery image deleted: ${image.title} by ${user.email}`);

  return NextResponse.json({
    success: true,
    message: 'Image supprimée avec succès',
  });
});
