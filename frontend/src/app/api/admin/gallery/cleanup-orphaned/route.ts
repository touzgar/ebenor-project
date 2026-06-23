import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { GalleryImage } from '@/lib/models/GalleryImage';
import { Product } from '@/lib/models/Product';
import { cloudinaryService } from '@/lib/services/cloudinary-service';

// POST - Cleanup orphaned gallery images

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const POST = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  // Get all products and their image URLs
  const products = await Product.find({}).lean();
  const productImageUrls = new Set<string>();

  products.forEach((product: any) => {
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img: any) => {
        if (img.url) {
          productImageUrls.add(img.url);
        }
      });
    }
  });

  // Get all gallery images
  const galleryImages = await GalleryImage.find({}).lean();

  // Find orphaned images (gallery images not referenced by any product)
  const orphanedImages = galleryImages.filter((img: any) => !productImageUrls.has(img.url));

  if (orphanedImages.length === 0) {
    return NextResponse.json({
      success: true,
      data: {
        orphanedCount: 0,
        deletedCount: 0,
        cloudinaryDeletedCount: 0,
      },
      message: 'Aucune image orpheline trouvÃ©e. La galerie est propre!',
    });
  }

  // Delete orphaned images from database
  const orphanedUrls = orphanedImages.map((img: any) => img.url);
  const deleteResult = await GalleryImage.deleteMany({
    url: { $in: orphanedUrls },
  });

  // Delete from Cloudinary
  let cloudinaryDeletedCount = 0;
  for (const img of orphanedImages) {
    try {
      const urlMatch = (img as any).url.match(/\/([^/]+)\.(jpg|jpeg|png|webp|mp4|mov)$/i);
      if (urlMatch && urlMatch[1]) {
        const publicId = `ebenor-creation/products/${urlMatch[1]}`;
        await cloudinaryService.deleteImage(publicId);
        cloudinaryDeletedCount++;
      }
    } catch (error) {
      console.warn('Failed to delete orphaned image from Cloudinary:', (img as any).url, error);
    }
  }

  console.log(
    `âœ… Cleanup orphaned gallery images: ${orphanedImages.length} orphaned, ${deleteResult.deletedCount} deleted from DB, ${cloudinaryDeletedCount} deleted from Cloudinary by ${user.email}`
  );

  return NextResponse.json({
    success: true,
    data: {
      orphanedCount: orphanedImages.length,
      deletedCount: deleteResult.deletedCount,
      cloudinaryDeletedCount,
      orphanedImages: orphanedImages.map((img: any) => ({
        title: img.title,
        url: img.url,
        category: img.category,
      })),
    },
    message: `${deleteResult.deletedCount} image(s) orpheline(s) supprimÃ©e(s) avec succÃ¨s!`,
  });
});
