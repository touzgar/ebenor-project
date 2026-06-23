import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { Product } from '@/lib/models/Product';

export const GET = withApiHandler(async (request: NextRequest, { params }: { params: { slug: string } }) => {
  const product = await Product.findOne({ slug: params.slug });

  if (!product) {
    return NextResponse.json(
      {
        success: false,
        message: 'Produit non trouvé',
        code: 'NOT_FOUND',
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: product.toPublicJSON(),
  });
});
