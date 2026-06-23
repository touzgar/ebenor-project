import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { Message } from '@/lib/models/Message';

// PUT - Change message priority
export const PUT = withApiHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const { priority } = await request.json();

  if (!['low', 'normal', 'high'].includes(priority)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Priorité invalide. Valeurs acceptées: low, normal, high',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  const message = await Message.findByIdAndUpdate(
    params.id,
    { priority },
    { new: true }
  );

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

  console.log(`✅ Message priority changed to ${priority}: ${params.id} by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: message,
    message: 'Priorité modifiée avec succès',
  });
});
