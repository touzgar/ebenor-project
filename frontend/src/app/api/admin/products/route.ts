import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { Product } from '@/lib/models/Product';

// GET - List all products (admin view)

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAuth(request);

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;
  const sort = searchParams.get('sort') || '-createdAt';

  const [products, total] = await Promise.all([
    Product.find()
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments()
  ]);

  return NextResponse.json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// POST - Create new product
export const POST = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const body = await request.json();

  const product = new Product({
    ...body,
    createdBy: user.id,
  });

  await product.save();

  console.log(`âœ… Product created: ${product.name} by ${user.email}`);

  return NextResponse.json(
    {
      success: true,
      data: product.toPublicJSON(),
      message: 'Produit crÃ©Ã© avec succÃ¨s',
    },
    { status: 201 }
  );
});
