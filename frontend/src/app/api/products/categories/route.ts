import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { Category } from '@/lib/models/Category';

// GET - Get all active categories (public route)

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  const categories = await Category.find({ isActive: true })
    .sort({ displayOrder: 1, name: 1 })
    .select('name slug description icon color displayOrder')
    .lean();

  return NextResponse.json({
    success: true,
    data: categories,
  });
});
