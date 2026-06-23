import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { Message } from '@/lib/models/Message';

// GET - Get message by ID
export const GET = withApiHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  await requireAuth(request);

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

  return NextResponse.json({
    success: true,
    data: message,
  });
});

// PUT - Update message
export const PUT = withApiHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const body = await request.json();

  const message = await Message.findByIdAndUpdate(
    params.id,
    body,
    { new: true, runValidators: true }
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

  console.log(`✅ Message updated: ${params.id} by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: message,
    message: 'Message mis à jour avec succès',
  });
});

// DELETE - Delete message
export const DELETE = withApiHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const message = await Message.findByIdAndDelete(params.id);

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

  console.log(`✅ Message deleted: ${params.id} by ${user.email}`);

  return NextResponse.json({
    success: true,
    message: 'Message supprimé avec succès',
  });
});
