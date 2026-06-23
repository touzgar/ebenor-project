import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { Product } from '@/lib/models/Product';

// GET - Get product statistics

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  const products = await Product.find({}); // Remove isActive filter to match all products

  // Count by category
  const byCategory: Record<string, number> = {};
  products.forEach(product => {
    const category = product.category || 'Non catÃ©gorisÃ©';
    byCategory[category] = (byCategory[category] || 0) + 1;
  });

  const stats = {
    total: products.length,
    totalProducts: products.length, // Add this for dashboard compatibility
    featured: products.filter(p => p.featured).length,
    featuredProducts: products.filter(p => p.featured).length, // Add this for dashboard compatibility
    categoriesCount: Object.keys(byCategory).length, // Add this for dashboard compatibility
    byCategory,
    inStock: products.filter(p => p.availability === 'in_stock').length,
    outOfStock: products.filter(p => p.availability === 'out_of_stock').length,
    madeToOrder: products.filter(p => p.availability === 'made_to_order').length,
  };

  return NextResponse.json({
    success: true,
    data: stats,
  });
});
