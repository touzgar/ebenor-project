import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { HomeContent } from '@/lib/models/HomeContent';
import { Category } from '@/lib/models/Category';
import { ShowroomContent } from '@/lib/models/ShowroomContent';
import { AdminUser } from '@/lib/models/AdminUser';

// POST - Seed initial data (run once)

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const POST = withApiHandler(async (request: NextRequest) => {
  const results = {
    admin: null as any,
    homeContent: null as any,
    categories: [] as any[],
    showroom: null as any,
  };

  // 1. Create default admin user if doesn't exist
  const existingAdmin = await AdminUser.findOne({ email: 'admin@ebenor-creation.tn' });
  if (!existingAdmin) {
    const admin = new AdminUser({
      firstName: 'Admin',
      lastName: 'Ã‰BENOR',
      email: 'admin@ebenor-creation.tn',
      password: 'Admin123!',
      role: 'super_admin',
      permissions: [], // Will be auto-filled by pre-save middleware based on role
    });
    await admin.save();
    results.admin = { email: admin.email, name: `${admin.firstName} ${admin.lastName}`, message: 'Created' };
  } else {
    results.admin = { email: existingAdmin.email, name: `${existingAdmin.firstName} ${existingAdmin.lastName}`, message: 'Already exists' };
  }

  // 2. Create default home content if doesn't exist
  const existingHome = await HomeContent.findOne();
  if (!existingHome) {
    const homeContent = new HomeContent({
      hero: {
        companyName: 'Ã‰BENOR CRÃ‰ATION',
        title: 'L\'Art du Bois Haut de Gamme',
        subtitle: 'Fabrication artisanale de meubles et amÃ©nagements sur mesure en Tunisie',
        backgroundImage: '/logo/logo.jpg',
        videoUrl: '/video/hero.mp4',
        ctaText: 'DÃ©couvrir nos rÃ©alisations',
        ctaLink: '/galerie',
      },
      about: {
        title: 'Ã€ Propos de Ã‰BENOR CRÃ‰ATION',
        description: 'SpÃ©cialistes de l\'Ã©bÃ©nisterie haut de gamme, nous crÃ©ons des meubles et amÃ©nagements sur mesure qui allient tradition artisanale et design moderne.',
        image: '/logo/logo.jpg',
        highlights: [
          'Plus de 10 ans d\'expÃ©rience',
          'Artisans qualifiÃ©s',
          'MatÃ©riaux nobles',
          'Service personnalisÃ©',
        ],
      },
      services: [
        {
          title: 'Cuisines Sur Mesure',
          description: 'Des cuisines Ã©lÃ©gantes et fonctionnelles, conÃ§ues selon vos besoins',
          icon: 'ðŸ³',
          image: '/logo/logo.jpg',
        },
        {
          title: 'Dressings & Rangements',
          description: 'Solutions de rangement optimisÃ©es et esthÃ©tiques',
          icon: 'ðŸ‘”',
          image: '/logo/logo.jpg',
        },
        {
          title: 'Mobilier Haut de Gamme',
          description: 'Meubles uniques et raffinÃ©s pour tous vos espaces',
          icon: 'ðŸª‘',
          image: '/logo/logo.jpg',
        },
      ],
      process: [
        {
          step: 1,
          title: 'Consultation',
          description: 'Rencontre pour comprendre vos besoins et vos envies',
          image: '/logo/logo.jpg',
        },
        {
          step: 2,
          title: 'Conception',
          description: 'CrÃ©ation de plans dÃ©taillÃ©s et choix des matÃ©riaux',
          image: '/logo/logo.jpg',
        },
        {
          step: 3,
          title: 'Fabrication',
          description: 'RÃ©alisation artisanale avec le plus grand soin',
          image: '/logo/logo.jpg',
        },
        {
          step: 4,
          title: 'Installation',
          description: 'Pose professionnelle et finitions impeccables',
          image: '/logo/logo.jpg',
        },
      ],
      testimonials: [],
      contact: {
        address: 'Tunisie',
        phone: '+216 70 123 456',
        email: 'contact@ebenor-creation.tn',
        whatsapp: '+216 70 123 456',
        workingHours: 'Lun-Sam: 8h-18h',
      },
      publishedSections: {
        hero: true,
        about: true,
        services: true,
        process: true,
        testimonials: false,
        contact: true,
      },
    });
    await homeContent.save();
    results.homeContent = { message: 'Created' };
  } else {
    results.homeContent = { message: 'Already exists' };
  }

  // 3. Create default categories if don't exist
  const defaultCategories = [
    {
      name: 'Cuisine',
      slug: 'cuisine',
      description: 'Meubles de cuisine sur mesure',
      icon: 'ðŸ³',
      color: '#ef4444',
      displayOrder: 1,
      isActive: true,
    },
    {
      name: 'Dressing',
      slug: 'dressing',
      description: 'Dressings et rangements personnalisÃ©s',
      icon: 'ðŸ‘”',
      color: '#3b82f6',
      displayOrder: 2,
      isActive: true,
    },
    {
      name: 'Mobilier',
      slug: 'mobilier',
      description: 'Mobilier sur mesure pour tous espaces',
      icon: 'ðŸª‘',
      color: '#10b981',
      displayOrder: 3,
      isActive: true,
    },
    {
      name: 'AmÃ©nagement',
      slug: 'amenagement',
      description: 'AmÃ©nagement intÃ©rieur complet',
      icon: 'ðŸ ',
      color: '#f59e0b',
      displayOrder: 4,
      isActive: true,
    },
  ];

  for (const categoryData of defaultCategories) {
    const existing = await Category.findOne({ slug: categoryData.slug });
    if (!existing) {
      const category = new Category(categoryData);
      await category.save();
      results.categories.push({ name: category.name, message: 'Created' });
    } else {
      results.categories.push({ name: existing.name, message: 'Already exists' });
    }
  }

  // 4. Create default showroom content if doesn't exist
  const existingShowroom = await ShowroomContent.findOne();
  if (!existingShowroom) {
    const showroom = new ShowroomContent({
      title: 'Notre Showroom',
      description: 'Visitez notre showroom pour dÃ©couvrir nos rÃ©alisations et discuter de votre projet',
      address: 'Tunisie',
      phone: '+216 70 123 456',
      email: 'showroom@ebenor-creation.tn',
      hours: 'Lun-Sam: 9h-18h',
      images: [],
      virtualTourUrl: '',
      mapEmbedUrl: '',
      isPublished: true,
    });
    await showroom.save();
    results.showroom = { message: 'Created' };
  } else {
    results.showroom = { message: 'Already exists' };
  }

  return NextResponse.json({
    success: true,
    message: 'Database seeded successfully!',
    data: results,
  });
});
