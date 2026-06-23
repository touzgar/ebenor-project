import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { Product } from '@/lib/models/Product';

// GET - Get category breakdown with product counts and details

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  const products = await Product.find({}); // Remove isActive filter

  const breakdown: Record<string, {
    count: number;
    products: Array<{ id: string; name: string; price: number; featured: boolean }>;
  }> = {};

  products.forEach(product => {
    const category = product.category || 'Non catÃ©gorisÃ©';
    
    if (!breakdown[category]) {
      breakdown[category] = {
        count: 0,
        products: [],
      };
    }

    breakdown[category].count++;
    breakdown[category].products.push({
      id: product._id.toString(),
      name: product.name,
      price: product.price?.amount || 0,
      featured: product.featured,
    });
  });

  // Sort categories by count (descending) and convert to array
  const categoriesArray = Object.entries(breakdown)
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([category, data]) => ({
      category,
      count: data.count,
      products: data.products,
    }));

  return NextResponse.json({
    success: true,
    data: categoriesArray,
  });
});
