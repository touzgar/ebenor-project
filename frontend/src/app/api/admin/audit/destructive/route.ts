import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { auditService } from '@/lib/services/audit-service';

// GET - Get destructive operations (deletes)

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAuth(request);

  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '50');

  const logs = await auditService.getDestructiveOperations(limit);

  return NextResponse.json({
    success: true,
    data: logs,
  });
});
