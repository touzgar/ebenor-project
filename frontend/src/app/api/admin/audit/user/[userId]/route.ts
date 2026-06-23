import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { auditService } from '@/lib/services/audit-service';

// GET - Get audit logs for a specific user
export const GET = withApiHandler(async (request: NextRequest, { params }: { params: { userId: string } }) => {
  await requireAuth(request);

  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '50');

  const logs = await auditService.getAuditLogsByUser(params.userId, limit);

  return NextResponse.json({
    success: true,
    data: logs,
  });
});
