import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { Product } from '@/lib/models/Product';

// GET - Get product by ID
export const GET = withApiHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  await requireAuth(request);

  const product = await Product.findById(params.id);

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
    data: product,
  });
});

// PUT - Update product
export const PUT = withApiHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const body = await request.json();

  const product = await Product.findByIdAndUpdate(
    params.id,
    {
      ...body,
      updatedBy: user.id,
    },
    { new: true, runValidators: true }
  );

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

  console.log(`✅ Product updated: ${product.name} by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: product.toPublicJSON(),
    message: 'Produit mis à jour avec succès',
  });
});

// DELETE - Delete product
export const DELETE = withApiHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const product = await Product.findByIdAndDelete(params.id);

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

  console.log(`✅ Product deleted: ${product.name} by ${user.email}`);

  return NextResponse.json({
    success: true,
    message: 'Produit supprimé avec succès',
  });
});
