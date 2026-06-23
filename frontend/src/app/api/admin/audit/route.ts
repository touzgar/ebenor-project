import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { auditService } from '@/lib/services/audit-service';

// GET - Get audit logs with filters and pagination

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAuth(request);

  const searchParams = request.nextUrl.searchParams;
  
  // Build filters
  const filters: any = {};
  if (searchParams.get('userId')) filters.userId = searchParams.get('userId');
  if (searchParams.get('action')) filters.action = searchParams.get('action');
  if (searchParams.get('resource')) filters.resource = searchParams.get('resource');
  if (searchParams.get('resourceId')) filters.resourceId = searchParams.get('resourceId');
  if (searchParams.get('startDate')) filters.startDate = new Date(searchParams.get('startDate')!);
  if (searchParams.get('endDate')) filters.endDate = new Date(searchParams.get('endDate')!);

  // Pagination
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');

  const result = await auditService.getAuditLogs(filters, { page, limit });

  return NextResponse.json({
    success: true,
    data: result.logs,
    pagination: result.pagination,
  });
});
