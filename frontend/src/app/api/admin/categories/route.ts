import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { Category } from '@/lib/models/Category';

// GET - List all categories

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAuth(request);

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const skip = (page - 1) * limit;
  const search = searchParams.get('search');
  const isActive = searchParams.get('isActive');

  const query: any = {};

  // Filter by active status
  if (isActive !== null) {
    query.isActive = isActive === 'true';
  }

  // Search by name
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const [categories, total] = await Promise.all([
    Category.find(query)
      .sort({ displayOrder: 1, name: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Category.countDocuments(query)
  ]);

  return NextResponse.json({
    success: true,
    data: categories,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// POST - Create new category
export const POST = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const body = await request.json();
  const { name, description, icon, color, isActive, displayOrder } = body;

  if (!name) {
    return NextResponse.json(
      {
        success: false,
        message: 'Le nom de la catÃ©gorie est requis',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  // Generate slug from name
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[Ã Ã¡Ã¢Ã£Ã¤Ã¥]/g, 'a')
    .replace(/[Ã¨Ã©ÃªÃ«]/g, 'e')
    .replace(/[Ã¬Ã­Ã®Ã¯]/g, 'i')
    .replace(/[Ã²Ã³Ã´ÃµÃ¶]/g, 'o')
    .replace(/[Ã¹ÃºÃ»Ã¼]/g, 'u')
    .replace(/[Ã§]/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Check if category with same name or slug exists
  const existingCategory = await Category.findOne({
    $or: [{ name }, { slug }],
  });

  if (existingCategory) {
    return NextResponse.json(
      {
        success: false,
        message: 'Une catÃ©gorie avec ce nom existe dÃ©jÃ ',
        code: 'DUPLICATE_ERROR',
      },
      { status: 409 }
    );
  }

  const category = new Category({
    name,
    slug,
    description,
    icon,
    color: color || '#f59e0b',
    isActive: isActive !== undefined ? isActive : true,
    displayOrder: displayOrder || 0,
  });

  await category.save();

  console.log(`âœ… Category created: ${category.name} by ${user.email}`);

  return NextResponse.json(
    {
      success: true,
      data: category,
      message: 'CatÃ©gorie crÃ©Ã©e avec succÃ¨s',
    },
    { status: 201 }
  );
});
