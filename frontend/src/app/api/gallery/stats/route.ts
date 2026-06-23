import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { GalleryImage } from '@/lib/models/GalleryImage';

// GET - Get gallery statistics

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  const images = await GalleryImage.find();

  // Calculate total size in MB
  const totalSizeBytes = images.reduce((sum, img) => sum + (img.fileSize || 0), 0);
  const totalSizeMB = totalSizeBytes / (1024 * 1024);

  // Count by category
  const byCategory: Record<string, number> = {};
  images.forEach(image => {
    const category = image.category || 'GÃ©nÃ©ral';
    byCategory[category] = (byCategory[category] || 0) + 1;
  });

  const stats = {
    total: images.length,
    totalImages: images.length, // Add this for dashboard compatibility
    featured: images.filter(img => img.featured).length,
    featuredImages: images.filter(img => img.featured).length, // Add this for dashboard compatibility
    categoriesCount: Object.keys(byCategory).length, // Add this for dashboard compatibility
    byCategory,
    totalViews: images.reduce((sum, img) => sum + (img.views || 0), 0),
    totalSize: totalSizeMB,
  };

  return NextResponse.json({
    success: true,
    data: stats,
  });
});
