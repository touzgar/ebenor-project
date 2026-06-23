import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { cloudinaryService } from '@/lib/services/cloudinary-service';

// POST - Upload a single image

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const POST = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const formData = await request.formData();
  
  // Try different field names
  let file = formData.get('image') as File;
  if (!file) file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json(
      {
        success: false,
        message: 'Aucun fichier fourni',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  // Convert File to Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Get folder from form data or use default
  const folder = (formData.get('folder') as string) || 'homepage';

  // Upload to Cloudinary
  const result = await cloudinaryService.uploadImage(buffer, folder, {
    public_id: `${folder}/${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}`,
  });

  console.log(`âœ… Image uploaded: ${result.public_id} by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      size: result.bytes,
    },
    message: 'Image uploadÃ©e avec succÃ¨s',
  });
});
