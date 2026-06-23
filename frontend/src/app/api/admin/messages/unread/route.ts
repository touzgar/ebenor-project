import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { Message } from '@/lib/models/Message';

// GET - Get unread messages

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAuth(request);

  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '50');

  const messages = await Message.find({ status: 'unread', isArchived: false })
    .sort({ priority: -1, createdAt: -1 })
    .limit(limit)
    .lean();

  return NextResponse.json({
    success: true,
    data: messages,
  });
});
