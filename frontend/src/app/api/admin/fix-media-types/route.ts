import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { GalleryImage } from '@/lib/models/GalleryImage';

// GET - Fix mimeType for existing media

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAuth(request);

  // Find all GalleryImages without proper mimeType or with wrong mimeType
  const allMedia = await GalleryImage.find({}).lean();

  let fixed = 0;
  let skipped = 0;

  for (const media of allMedia) {
    let needsUpdate = false;
    const updates: any = {};

    // Check if URL indicates it's a video
    const isVideo = media.url.match(/\.(mp4|mov|avi|webm|flv|mkv)(\?|$)/i);
    const isImage = media.url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i);

    // Fix mimeType if missing or incorrect
    if (isVideo && (!media.mimeType || !media.mimeType.startsWith('video/'))) {
      const extension = media.url.match(/\.(mp4|mov|avi|webm|flv|mkv)/i)?.[1] || 'mp4';
      updates.mimeType = `video/${extension.toLowerCase()}`;
      needsUpdate = true;
    } else if (isImage && (!media.mimeType || !media.mimeType.startsWith('image/'))) {
      const extension = media.url.match(/\.(jpg|jpeg|png|gif|webp|svg)/i)?.[1] || 'jpeg';
      const imageType = extension === 'jpg' ? 'jpeg' : extension.toLowerCase();
      updates.mimeType = `image/${imageType}`;
      needsUpdate = true;
    }

    // Fix source if missing
    if (!media.source) {
      if (media.cloudinaryId || media.url.includes('cloudinary')) {
        updates.source = 'cloudinary';
      } else {
        updates.source = 'upload';
      }
      needsUpdate = true;
    }

    // Apply updates
    if (needsUpdate) {
      await GalleryImage.updateOne({ _id: media._id }, { $set: updates });
      fixed++;
      console.log(`âœ… Fixed media ${media._id}: ${JSON.stringify(updates)}`);
    } else {
      skipped++;
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      total: allMedia.length,
      fixed,
      skipped,
    },
    message: `Migration terminÃ©e: ${fixed} corrigÃ©(s), ${skipped} ignorÃ©(s)`,
  });
});
