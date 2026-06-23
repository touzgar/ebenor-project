import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { GalleryImage } from '@/lib/models/GalleryImage';
import { Product } from '@/lib/models/Product';

// GET - Get media statistics

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAuth(request);

  // Count videos and images separately from GalleryImage
  const [totalVideos, totalGalleryOnlyImages, totalProducts] = await Promise.all([
    GalleryImage.countDocuments({ mimeType: /^video\// }), // Count videos
    GalleryImage.countDocuments({ 
      $or: [
        { mimeType: /^image\// }, // Images with mimeType
        { mimeType: { $exists: false } }, // Legacy items without mimeType (assume images)
      ]
    }), // Count only images (not videos)
    Product.countDocuments(),
  ]);

  // Count product images from Product collection
  const products = await Product.find({}).select('images').lean();
  const productImagesCount = products.reduce((sum, p) => sum + (p.images?.length || 0), 0);

  // Total images = Gallery images (excluding videos) + Product images
  const totalImagesCount = totalGalleryOnlyImages + productImagesCount;

  // Calculate total storage used from GalleryImage collection
  const storageAgg = await GalleryImage.aggregate([
    {
      $group: {
        _id: null,
        totalSize: { $sum: '$fileSize' },
      },
    },
  ]);

  const totalStorage = storageAgg[0]?.totalSize || 0;

  // Get categories breakdown (from GalleryImage only)
  const categoriesBreakdown = await GalleryImage.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  // Count by source from GalleryImage collection
  const sourceBreakdown = await GalleryImage.aggregate([
    {
      $group: {
        _id: '$source',
        count: { $sum: 1 },
      },
    },
  ]);

  const bySource = {
    product: productImagesCount, // Count from Product.images array
    gallery: sourceBreakdown.find(s => s._id === 'gallery' || s._id === 'cloudinary')?.count || 0,
    homepage: sourceBreakdown.find(s => s._id === 'homepage')?.count || 0,
  };

  const stats = {
    totalMedia: totalImagesCount + totalVideos,
    totalImages: totalImagesCount,
    totalVideos,
    totalStorage, // In bytes, not MB
    totalSize: totalStorage, // In bytes
    bySource,
    byCategory: categoriesBreakdown.reduce((acc, cat) => {
      acc[cat._id || 'Uncategorized'] = cat.count;
      return acc;
    }, {} as Record<string, number>),
  };

  return NextResponse.json({
    success: true,
    data: stats,
  });
});
