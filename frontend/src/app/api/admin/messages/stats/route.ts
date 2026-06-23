import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { Message } from '@/lib/models/Message';

// GET - Get message statistics

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAuth(request);

  const [
    totalMessages,
    unreadMessages,
    repliedMessages,
    archivedMessages,
    highPriorityMessages,
  ] = await Promise.all([
    Message.countDocuments(),
    Message.countDocuments({ status: 'unread' }),
    Message.countDocuments({ status: 'replied' }),
    Message.countDocuments({ isArchived: true }),
    Message.countDocuments({ priority: 'high' }),
  ]);

  const stats = {
    total: totalMessages,
    unread: unreadMessages,
    replied: repliedMessages,
    archived: archivedMessages,
    highPriority: highPriorityMessages,
  };

  return NextResponse.json({
    success: true,
    data: stats,
  });
});
