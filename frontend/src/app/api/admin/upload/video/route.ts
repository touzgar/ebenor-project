import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { cloudinaryService } from '@/lib/services/cloudinary-service';
import { GalleryImage } from '@/lib/models/GalleryImage';

// Configure route for large file uploads
export const maxDuration = 300; // 5 minutes
export const dynamic = 'force-dynamic';

// POST - Upload a single video
export const POST = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const formData = await request.formData();
  const file = formData.get('video') as File;

  if (!file) {
    return NextResponse.json(
      {
        success: false,
        message: 'Aucun fichier vidéo fourni',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  // Check if file is actually a video
  if (!file.type.startsWith('video/')) {
    return NextResponse.json(
      {
        success: false,
        message: 'Seulement les fichiers vidéo sont acceptés',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  // Check file size (max 100MB for videos)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    return NextResponse.json(
      {
        success: false,
        message: `La vidéo est trop volumineuse. Taille maximale: 100MB. Taille actuelle: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  console.log(`📤 Uploading video: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);

  // Convert File to Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Get folder from form data or use default
  const folder = (formData.get('folder') as string) || 'videos';

  // Upload to Cloudinary
  const result = await cloudinaryService.uploadVideo(buffer, folder, {
    public_id: `${folder}/${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}`,
  });

  console.log(`✅ Video uploaded to Cloudinary: ${result.public_id}`);

  // Get title from form data or use filename
  const title = (formData.get('title') as string) || file.name.replace(/\.[^/.]+$/, '');
  const category = (formData.get('category') as string) || 'autre';

  // Save video metadata to GalleryImage collection
  const galleryImage = new GalleryImage({
    title,
    url: result.secure_url,
    thumbnailUrl: result.secure_url.replace(/\.(mp4|mov|avi|webm)$/, '.jpg'), // Cloudinary auto-generates thumbnails
    category,
    alt: title,
    dimensions: {
      width: result.width || 1920,
      height: result.height || 1080,
    },
    fileSize: result.bytes,
    mimeType: `video/${result.format}`, // Important: Set mimeType for videos!
    featured: false,
    source: 'cloudinary',
    cloudinaryId: result.public_id,
    uploadedBy: user.email,
  });

  await galleryImage.save();

  console.log(`✅ Video saved to database by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: {
      id: galleryImage._id.toString(),
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      duration: result.duration,
      size: result.bytes,
      mimeType: `video/${result.format}`,
    },
    message: 'Vidéo uploadée avec succès',
  });
});
