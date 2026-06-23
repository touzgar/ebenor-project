import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { Message } from '@/lib/models/Message';
import { emailService } from '@/lib/services/email-service';

// POST - Reply to message by email
export const POST = withApiHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const { replyText } = await request.json();

  if (!replyText || replyText.trim().length === 0) {
    return NextResponse.json(
      {
        success: false,
        message: 'Le texte de réponse ne peut pas être vide',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  const message = await Message.findById(params.id);

  if (!message) {
    return NextResponse.json(
      {
        success: false,
        message: 'Message non trouvé',
        code: 'NOT_FOUND',
      },
      { status: 404 }
    );
  }

  // Send reply email
  await emailService.sendEmail({
    to: message.email,
    subject: `Re: ${message.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Réponse à votre message</h2>
        <p>Bonjour ${message.name},</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
          ${replyText.replace(/\n/g, '<br>')}
        </div>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 14px;"><strong>Votre message original :</strong></p>
        <p style="color: #666; font-size: 14px;">${message.message}</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
        <p style="color: #999; font-size: 12px;">
          Ceci est une réponse automatique de ÉBENOR CRÉATION.<br>
          Pour toute question supplémentaire, n'hésitez pas à nous contacter.
        </p>
      </div>
    `,
  });

  // Update message status
  message.status = 'replied';
  await message.save();

  console.log(`✅ Reply sent to ${message.email} for message ${params.id} by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: message,
    message: 'Réponse envoyée avec succès',
  });
});
