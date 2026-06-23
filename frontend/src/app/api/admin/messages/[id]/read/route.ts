import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { Message } from '@/lib/models/Message';

// PUT - Mark message as read
export const PUT = withApiHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const message = await Message.findByIdAndUpdate(
    params.id,
    { status: 'read' },
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

  console.log(`✅ Message marked as read: ${params.id} by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: message,
    message: 'Message marqué comme lu',
  });
});
