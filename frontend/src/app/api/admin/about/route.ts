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
        title: 'À Propos',
        subtitle: 'Notre Histoire',
        description: 'Découvrez l\'histoire d\'ÉBÉNOR CRÉATION, une entreprise familiale passionnée par l\'art du bois depuis plus de 25 ans.',
      },
      stats: [
        { icon: '🏆', number: '25+', label: 'Ans d\'expérience' },
        { icon: '👨‍🔧', number: '50+', label: 'Artisans qualifiés' },
        { icon: '🛋️', number: '1000+', label: 'Projets réalisés' },
        { icon: '⭐', number: '100%', label: 'Satisfaction client' },
      ],
      history: {
        title: 'Notre Histoire',
        subtitle: 'Une Passion Transmise de Génération en Génération',
        description: 'Fondée en 1998, ÉBÉNOR CRÉATION est née de la passion d\'artisans ébénistes tunisiens pour le travail du bois noble. Depuis plus de deux décennies, nous perpétuons un savoir-faire ancestral tout en intégrant les technologies modernes pour offrir à nos clients des créations d\'exception.',
      },
      timeline: [
        { year: '1998', title: 'Fondation', description: 'Création de l\'atelier par une équipe de passionnés' },
        { year: '2005', title: 'Expansion', description: 'Agrandissement et modernisation de l\'atelier' },
        { year: '2015', title: 'Innovation', description: 'Intégration de technologies CNC de pointe' },
        { year: '2024', title: 'Excellence', description: 'Leader régional de l\'ébénisterie sur mesure' },
      ],
      values: {
        title: 'Nos Valeurs',
        subtitle: 'Ce qui nous guide au quotidien',
        items: [
          { icon: '🎯', title: 'Excellence', description: 'Nous visons la perfection dans chaque détail de nos créations' },
          { icon: '🤝', title: 'Confiance', description: 'Des relations durables basées sur la transparence' },
          { icon: '🌿', title: 'Durabilité', description: 'Respect de l\'environnement et bois certifiés' },
          { icon: '💡', title: 'Innovation', description: 'Tradition et modernité pour des créations uniques' },
        ],
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
