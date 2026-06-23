import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { Category } from '@/lib/models/Category';

// POST - Initialize default categories

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const POST = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const defaultCategories = [
    {
      name: 'Cuisine',
      slug: 'cuisine',
      description: 'Meubles de cuisine sur mesure',
      icon: 'ðŸ³',
      color: '#ef4444',
      displayOrder: 1,
    },
    {
      name: 'Dressing',
      slug: 'dressing',
      description: 'Dressings et rangements personnalisÃ©s',
      icon: 'ðŸ‘”',
      color: '#3b82f6',
      displayOrder: 2,
    },
    {
      name: 'Mobilier',
      slug: 'mobilier',
      description: 'Mobilier sur mesure pour tous espaces',
      icon: 'ðŸª‘',
      color: '#10b981',
      displayOrder: 3,
    },
    {
      name: 'AmÃ©nagement',
      slug: 'amenagement',
      description: 'AmÃ©nagement intÃ©rieur complet',
      icon: 'ðŸ ',
      color: '#f59e0b',
      displayOrder: 4,
    },
  ];

  const created: any[] = [];
  const skipped: any[] = [];

  for (const categoryData of defaultCategories) {
    const existing = await Category.findOne({
      $or: [{ name: categoryData.name }, { slug: categoryData.slug }],
    });

    if (!existing) {
      const category = new Category(categoryData);
      await category.save();
      created.push(category);
      console.log(`âœ… Default category created: ${categoryData.name}`);
    } else {
      skipped.push({ name: categoryData.name, reason: 'Already exists' });
    }
  }

  console.log(`âœ… Categories initialized by ${user.email}: ${created.length} created, ${skipped.length} skipped`);

  return NextResponse.json({
    success: true,
    message: `${created.length} catÃ©gorie(s) crÃ©Ã©e(s), ${skipped.length} ignorÃ©e(s)`,
    data: {
      created,
      skipped,
    },
  });
});
