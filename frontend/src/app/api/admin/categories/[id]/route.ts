import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { Category } from '@/lib/models/Category';

// GET - Get category by ID
export const GET = withApiHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  await requireAuth(request);

  const category = await Category.findById(params.id).lean();

  if (!category) {
    return NextResponse.json(
      {
        success: false,
        message: 'Catégorie non trouvée',
        code: 'NOT_FOUND',
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: category,
  });
});

// PUT - Update category
export const PUT = withApiHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const body = await request.json();
  const { name, description, icon, color, isActive, displayOrder } = body;

  const category = await Category.findById(params.id);

  if (!category) {
    return NextResponse.json(
      {
        success: false,
        message: 'Catégorie non trouvée',
        code: 'NOT_FOUND',
      },
      { status: 404 }
    );
  }

  // If name is being updated, regenerate slug
  if (name && name !== category.name) {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if another category has the same name or slug
    const existingCategory = await Category.findOne({
      _id: { $ne: params.id },
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: 'Une catégorie avec ce nom existe déjà',
          code: 'DUPLICATE_ERROR',
        },
        { status: 409 }
      );
    }

    category.name = name;
    category.slug = slug;
  }

  if (description !== undefined) category.description = description;
  if (icon !== undefined) category.icon = icon;
  if (color !== undefined) category.color = color;
  if (isActive !== undefined) category.isActive = isActive;
  if (displayOrder !== undefined) category.displayOrder = displayOrder;

  await category.save();

  console.log(`✅ Category updated: ${category.name} by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: category,
    message: 'Catégorie mise à jour avec succès',
  });
});

// DELETE - Delete category
export const DELETE = withApiHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const category = await Category.findById(params.id);

  if (!category) {
    return NextResponse.json(
      {
        success: false,
        message: 'Catégorie non trouvée',
        code: 'NOT_FOUND',
      },
      { status: 404 }
    );
  }

  await category.deleteOne();

  console.log(`✅ Category deleted: ${category.name} by ${user.email}`);

  return NextResponse.json({
    success: true,
    message: 'Catégorie supprimée avec succès',
  });
});
