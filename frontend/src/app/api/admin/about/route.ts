import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { AboutContent } from '@/lib/models/AboutContent';

export const dynamic = 'force-dynamic';

// GET - Get about content
export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAuth(request);
  
  let aboutContent = await AboutContent.findOne().sort({ updatedAt: -1 }).lean();
  
  if (!aboutContent) {
    const defaultContent = {
      hero: {
        title: 'L\'Art du Bois',
        subtitle: 'Depuis 1998',
        description: 'Plus de 25 ans d\'excellence dans la création de mobilier sur mesure en Tunisie',
        backgroundImage: '/logo/logo.jpg',
      },
      stats: [
        { label: 'Années d\'expérience', value: '25+', icon: 'trophy' },
        { label: 'Projets réalisés', value: '500+', icon: 'check' },
        { label: 'Clients satisfaits', value: '98%', icon: 'heart' },
        { label: 'Artisans qualifiés', value: '15', icon: 'users' },
      ],
      history: {
        title: 'Notre Histoire',
        subtitle: 'Une passion familiale transmise de génération en génération',
        paragraphs: [
          'Fondée en 1998, ÉBENOR CRÉATION est née de la passion d\'artisans tunisiens pour le travail du bois noble. Notre atelier familial s\'est rapidement imposé comme une référence dans la création de mobilier sur mesure haut de gamme.',
          'Aujourd\'hui, nous combinons savoir-faire traditionnel et technologies modernes pour créer des pièces uniques qui transforment vos espaces de vie en véritables œuvres d\'art.',
          'Chaque projet est une nouvelle opportunité de repousser les limites de la créativité, tout en respectant les traditions qui font notre renommée.',
        ],
        image: '/logo/logo.jpg',
      },
      timeline: [
        { year: '1998', title: 'Les débuts', description: 'Création de l\'atelier avec une vision: allier tradition et modernité.' },
        { year: '2005', title: 'Expansion', description: 'Agrandissement de l\'atelier et diversification des services.' },
        { year: '2015', title: 'Innovation', description: 'Intégration de technologies modernes tout en préservant le savoir-faire artisanal.' },
        { year: '2024', title: 'Excellence', description: 'Leader en Tunisie pour les créations sur mesure haut de gamme.' },
      ],
      values: {
        title: 'Nos Valeurs',
        subtitle: 'Les principes qui guident chacune de nos créations',
        items: [
          { icon: 'sparkles', title: 'Excellence', description: 'Nous visons l\'excellence dans chaque projet, du design à la réalisation finale.' },
          { icon: 'heart', title: 'Passion', description: 'Notre passion pour le bois et l\'artisanat se reflète dans chaque création.' },
          { icon: 'shield', title: 'Qualité', description: 'Nous utilisons uniquement des matériaux nobles et des techniques éprouvées.' },
          { icon: 'users', title: 'Service', description: 'Un accompagnement personnalisé du premier contact à la livraison finale.' },
        ],
      },
      cta: {
        title: 'Prêt à créer ensemble ?',
        description: 'Transformons vos rêves en réalité avec notre savoir-faire artisanal',
        primaryButton: 'Contactez-nous',
        secondaryButton: 'Voir nos créations',
      },
    };
    
    aboutContent = await AboutContent.create(defaultContent);
  }
  
  return NextResponse.json({
    success: true,
    data: aboutContent,
  });
});

// PUT - Update about content
export const PUT = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  const data = await request.json();
  
  const aboutContent = await AboutContent.findOneAndUpdate(
    {},
    { ...data, updatedBy: user.email },
    { new: true, upsert: true, runValidators: true }
  );
  
  return NextResponse.json({
    success: true,
    data: aboutContent,
    message: 'About content updated successfully',
  });
});
