import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { validateCsrfToken } from '@/lib/security/csrf';
import { HomeContent } from '@/lib/models/HomeContent';

// PUT - Update contact section

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const PUT = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);
  validateCsrfToken(request);

  const body = await request.json();
  const { address, phone, email, whatsapp, workingHours } = body;

  let homeContent = await HomeContent.findOne();

  if (!homeContent) {
    homeContent = new HomeContent({});
  }

  // Update contact section
  homeContent.contact = {
    address: address || homeContent.contact?.address || '',
    phone: phone || homeContent.contact?.phone || '',
    email: email || homeContent.contact?.email || '',
    whatsapp: whatsapp || homeContent.contact?.whatsapp || '',
    workingHours: workingHours || homeContent.contact?.workingHours || '',
  };

  await homeContent.save();

  console.log(`âœ… Contact section updated by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: homeContent,
    message: 'Section contact mise Ã  jour avec succÃ¨s',
  });
});
