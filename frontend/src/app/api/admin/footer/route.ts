import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { FooterContent } from '@/lib/models/FooterContent';

export const dynamic = 'force-dynamic';

// GET - Get footer content
export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAuth(request);
  
  let footerContent = await FooterContent.findOne().sort({ updatedAt: -1 }).lean();
  
  if (!footerContent) {
    const defaultContent = {
      brand: {
        description: 'ÉBÉNOR CRÉATION - Votre partenaire de confiance pour la menuiserie et l\'ébénisterie d\'excellence en Tunisie. Depuis notre atelier, nous créons des pièces uniques alliant tradition artisanale et design contemporain.',
      },
      contact: {
        phone: '+216 70 123 456',
        email: 'contact@ebenor-creation.tn',
        address: 'Zone Industrielle Mghira 2, 2082 Fouchana, Tunis, Tunisie',
      },
      social: {
        facebook: 'https://www.facebook.com/ebenorcreation',
        instagram: 'https://www.instagram.com/ebenorcreation',
        linkedin: 'https://www.linkedin.com/company/ebenorcreation',
      },
      newsletter: {
        title: 'Restez informé',
        description: 'Recevez nos dernières réalisations et nouveautés en exclusivité.',
      },
      bottom: {
        copyright: 'ÉBÉNOR CRÉATION. Tous droits réservés.',
        additionalText: 'Artisanat tunisien d\'excellence',
      },
      backgroundImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=90',
    };
    
    footerContent = await FooterContent.create(defaultContent);
  }
  
  return NextResponse.json({
    success: true,
    data: footerContent,
  });
});

// PUT - Update footer content
export const PUT = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  const data = await request.json();
  
  const footerContent = await FooterContent.findOneAndUpdate(
    {},
    { ...data, updatedBy: user.email },
    { new: true, upsert: true, runValidators: true }
  );
  
  return NextResponse.json({
    success: true,
    data: footerContent,
    message: 'Footer content updated successfully',
  });
});
