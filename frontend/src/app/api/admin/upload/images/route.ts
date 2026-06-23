import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { cloudinaryService } from '@/lib/services/cloudinary-service';

// POST - Upload multiple images

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const POST = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const formData = await request.formData();
  const files: File[] = [];

  // Get all files from form data
  for (const [key, value] of formData.entries()) {
    if (key === 'images' && value instanceof File) {
      files.push(value);
    }
  }

  if (files.length === 0) {
    return NextResponse.json(
      {
        success: false,
        message: 'Aucun fichier fourni',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  // Get folder from form data or use default
  const folder = (formData.get('folder') as string) || 'homepage';

  // Upload all images
  const results = [];
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await cloudinaryService.uploadImage(buffer, folder, {
      public_id: `${folder}/${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}`,
    });

    results.push({
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      size: result.bytes,
    });
  }

  console.log(`âœ… ${results.length} images uploaded by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: results,
    message: `${results.length} image(s) uploadÃ©e(s) avec succÃ¨s`,
  });
});
