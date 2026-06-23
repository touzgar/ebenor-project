import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { GalleryImage } from '@/lib/models/GalleryImage';
import { cloudinaryService } from '@/lib/services/cloudinary-service';

// POST - Upload image/video to gallery

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const POST = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const formData = await request.formData();
  
  // Try different field names that might be used
  let file = formData.get('file') as File;
  if (!file) file = formData.get('image') as File;
  if (!file) file = formData.get('images') as File;
  
  // Also check if it's in an array
  if (!file) {
    const files = formData.getAll('images');
    if (files && files.length > 0) {
      file = files[0] as File;
    }
  }

  if (!file) {
    return NextResponse.json(
      {
        success: false,
        message: 'Fichier requis',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  // Check file type
  const isVideo = file.type.startsWith('video/');
  const isImage = file.type.startsWith('image/');

  if (!isImage && !isVideo) {
    return NextResponse.json(
      {
        success: false,
        message: 'Type de fichier non supportÃ©',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  // Convert File to Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Upload to Cloudinary
  const uploadResult = isVideo
    ? await cloudinaryService.uploadVideo(buffer, 'gallery', {
        public_id: `gallery/${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}`,
      })
    : await cloudinaryService.uploadImage(buffer, 'gallery', {
        public_id: `gallery/${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}`,
      });

  // Parse tags if they exist
  let tags: string[] = [];
  const tagsString = formData.get('tags');
  if (tagsString) {
    try {
      tags = typeof tagsString === 'string' ? JSON.parse(tagsString) : [];
    } catch (e) {
      tags = [];
    }
  }

  // Create gallery image record
  const categoryValue = (formData.get('category') as string) || 'autre';
  // Map common categories to valid enum values
  const categoryMap: Record<string, string> = {
    'GÃ©nÃ©ral': 'autre',
    'gÃ©nÃ©ral': 'autre',
    'General': 'autre',
    'general': 'autre',
  };
  
  const imageData = {
    title: (formData.get('title') as string) || file.name.replace(/\.[^/.]+$/, ''),
    description: (formData.get('description') as string) || '',
    alt: (formData.get('alt') as string) || file.name.replace(/\.[^/.]+$/, ''),
    url: uploadResult.secure_url,
    thumbnailUrl: uploadResult.secure_url,
    category: categoryMap[categoryValue] || categoryValue.toLowerCase(),
    tags: tags,
    featured: formData.get('featured') === 'true',
    dimensions: {
      width: uploadResult.width || 0,
      height: uploadResult.height || 0,
    },
    fileSize: file.size,
    mimeType: file.type as any, // Allow any mime type, will be validated by model if needed
    cloudinaryId: uploadResult.public_id,
    source: 'cloudinary' as const,
    uploadedBy: user.id,
  };

  const image = new GalleryImage(imageData);
  await image.save();

  console.log(`âœ… Gallery ${isVideo ? 'video' : 'image'} uploaded: ${image.title} by ${user.email}`);

  return NextResponse.json(
    {
      success: true,
      data: image,
      message: `${isVideo ? 'VidÃ©o' : 'Image'} tÃ©lÃ©chargÃ©e et ajoutÃ©e Ã  la galerie avec succÃ¨s`,
    },
    { status: 201 }
  );
});
