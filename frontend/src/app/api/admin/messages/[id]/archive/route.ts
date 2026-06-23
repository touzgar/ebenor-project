import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { Message } from '@/lib/models/Message';

// PUT - Archive message
export const PUT = withApiHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const message = await Message.findByIdAndUpdate(
    params.id,
    { isArchived: true },
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

  console.log(`✅ Message archived: ${params.id} by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: message,
    message: 'Message archivé avec succès',
  });
});
