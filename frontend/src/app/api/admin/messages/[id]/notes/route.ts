import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { Message } from '@/lib/models/Message';

// POST - Add note to message
export const POST = withApiHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const { note } = await request.json();

  if (!note || note.trim().length === 0) {
    return NextResponse.json(
      {
        success: false,
        message: 'La note ne peut pas être vide',
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

  message.notes = message.notes || [];
  message.notes.push({
    text: note,
    addedBy: user.email,
    addedAt: new Date(),
  } as any);

  await message.save();

  console.log(`✅ Note added to message ${params.id} by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: message,
    message: 'Note ajoutée avec succès',
  });
});
