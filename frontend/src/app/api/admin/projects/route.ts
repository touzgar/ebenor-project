import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { ProjectsContent } from '@/lib/models/ProjectsContent';

export const dynamic = 'force-dynamic';

// GET - Get projects content
export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAuth(request);
  
  let projectsContent = await ProjectsContent.findOne().sort({ updatedAt: -1 }).lean();
  
  if (!projectsContent) {
    const defaultContent = {
      hero: {
        title: 'Nos',
        titleHighlight: 'Projets',
        description: 'Découvrez nos réalisations et laissez-vous inspirer par notre savoir-faire artisanal.',
      },
      cta: {
        title: 'Un projet en tête ?',
        description: 'Contactez-nous pour discuter de votre projet et obtenir un devis personnalisé.',
        buttonText: 'Demander un Devis',
      },
    };
    
    projectsContent = await ProjectsContent.create(defaultContent);
  }
  
  return NextResponse.json({
    success: true,
    data: projectsContent,
  });
});

// PUT - Update projects content
export const PUT = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  const data = await request.json();
  
  const projectsContent = await ProjectsContent.findOneAndUpdate(
    {},
    { ...data, updatedBy: user.email },
    { new: true, upsert: true, runValidators: true }
  );
  
  return NextResponse.json({
    success: true,
    data: projectsContent,
    message: 'Projects content updated successfully',
  });
});
