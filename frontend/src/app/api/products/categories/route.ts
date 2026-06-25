import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { Category } from '@/lib/models/Category';
import { Product } from '@/lib/models/Product';

// GET - Get all active categories with product counts (public route)

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  // Get all active categories
  const categories = await Category.find({ isActive: true })
    .sort({ displayOrder: 1, name: 1 })
    .select('name slug description icon color displayOrder')
    .lean();

  // Count products for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const count = await Product.countDocuments({ 
        category: category.slug
      });
      
      return {
        ...category,
        count,
      };
    })
  );

  return NextResponse.json({
    success: true,
    data: categoriesWithCounts,
  });
});
