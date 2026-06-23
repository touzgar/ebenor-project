import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { Product } from '@/lib/models/Product';

export const dynamic = 'force-dynamic';

/**
 * GET /api/products/[id]/similar
 * Get similar products based on category, materials, or tags
 */
export const GET = withApiHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '4', 10);

  // Find the current product
  const currentProduct = await Product.findById(id).select('category materials tags').lean();
  
  if (!currentProduct) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Product not found' 
      },
      { status: 404 }
    );
  }

  // Build query to find similar products
  const similarQuery: any = {
    _id: { $ne: id }, // Exclude current product
    $or: [
      { category: currentProduct.category }, // Same category
      { materials: { $in: currentProduct.materials || [] } }, // Shared materials
      { tags: { $in: currentProduct.tags || [] } }, // Shared tags
    ],
  };

  // Find similar products
  const similarProducts = await Product.find(similarQuery)
    .select('name slug description shortDescription category images video price availability featured tags materials')
    .limit(limit)
    .sort({ featured: -1, createdAt: -1 }) // Prioritize featured products
    .lean();

  return NextResponse.json({
    success: true,
    data: similarProducts,
    pagination: {
      page: 1,
      limit,
      total: similarProducts.length,
      pages: 1,
    },
  });
});
