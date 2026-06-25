import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { ContactContent } from '@/lib/models/ContactContent';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET - Get contact content
export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAuth(request);
  
  // Get the most recent contact content
  let contactContent = await ContactContent.findOne().sort({ updatedAt: -1 }).lean();
  
  // If no content exists, create default content
  if (!contactContent) {
    const defaultContent = {
      hero: {
        title: 'Contactez-Nous',
        subtitle: 'Contact',
        description: 'Prêt à donner vie à votre projet ? Notre équipe d\'artisans passionnés est à votre écoute pour transformer vos idées en réalité.',
      },
      contactInfo: {
        address: {
          line1: 'Zone Industrielle',
          line2: 'Tunis, Tunisie',
        },
        phone: '+216 XX XXX XXX',
        email: 'contact@ebenor-creation.tn',
        hours: {
          weekdays: 'Lun - Ven',
          weekdaysTime: '8h00 - 17h00',
          saturday: 'Samedi',
          saturdayTime: '8h00 - 12h00',
          sunday: 'Dimanche',
          sundayStatus: 'Fermé',
        },
      },
      whatsapp: {
        title: 'Contact Rapide',
        description: 'Besoin d\'une réponse immédiate ? Contactez-nous via WhatsApp pour un échange instantané !',
        buttonText: 'Ouvrir WhatsApp',
        phoneNumber: '+216XXXXXXXX',
      },
      map: {
        title: 'Notre Localisation',
        subtitle: 'Zone Industrielle, Tunis - Tunisie',
        embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102948.82073654844!2d10.08080475!3d36.8064948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd34cf7c5f06b1%3A0x6b94f7608db567e!2sZone%20Industrielle%2C%20Tunis%2C%20Tunisia!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s',
      },
      faq: {
        title: 'Questions Fréquentes',
        subtitle: 'Trouvez rapidement les réponses aux questions les plus courantes',
        questions: [
          {
            question: 'Quel est le délai de fabrication ?',
            answer: 'Les délais varient selon la complexité du projet, généralement entre 2 à 8 semaines pour les créations sur mesure.',
          },
          {
            question: 'Proposez-vous la livraison ?',
            answer: 'Oui, nous assurons la livraison et l\'installation dans toute la Tunisie. Les frais dépendent de la distance et du volume.',
          },
          {
            question: 'Quelles essences de bois utilisez-vous ?',
            answer: 'Nous travaillons avec diverses essences : chêne, hêtre, noyer, acajou, selon vos préférences et le budget.',
          },
          {
            question: 'Comment obtenir un devis ?',
            answer: 'Contactez-nous avec les détails de votre projet. Nous vous fournirons un devis détaillé gratuit sous 48h.',
          },
        ],
      },
    };
    
    contactContent = await ContactContent.create(defaultContent);
  }
  
  return NextResponse.json({
    success: true,
    data: contactContent,
  });
});

// PUT - Update contact content
export const PUT = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  
  const data = await request.json();
  
  // Update or create contact content (we only keep one document)
  const contactContent = await ContactContent.findOneAndUpdate(
    {},
    { ...data, updatedBy: user.email },
    { new: true, upsert: true, runValidators: true }
  );
  
  return NextResponse.json({
    success: true,
    data: contactContent,
    message: 'Contact content updated successfully',
  });
});
