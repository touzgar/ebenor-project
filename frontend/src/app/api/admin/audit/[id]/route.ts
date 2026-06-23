import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { auditService } from '@/lib/services/audit-service';

// GET - Get audit log by ID
export const GET = withApiHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  await requireAuth(request);

  const log = await auditService.getAuditLogById(params.id);

  if (!log) {
    return NextResponse.json(
      {
        success: false,
        message: 'Audit log not found',
        code: 'NOT_FOUND',
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: log,
  });
});
