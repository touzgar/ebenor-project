import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { Message } from '@/lib/models/Message';
import { getClientIP, getUserAgent } from '@/lib/auth/helpers';


// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const POST = withApiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const { name, email, phone, subject, message } = body;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      {
        success: false,
        message: 'Tous les champs requis doivent Ãªtre remplis',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  // Get client info
  const ipAddress = getClientIP(request);
  const userAgent = getUserAgent(request);

  // Create message
  const newMessage = new Message({
    name,
    email,
    phone,
    subject,
    message,
    ipAddress,
    userAgent,
    source: 'contact_form',
  });

  await newMessage.save();

  console.log(`âœ… New message from: ${email}`);

  return NextResponse.json(
    {
      success: true,
      data: newMessage.toPublicJSON(),
      message: 'Message envoyÃ© avec succÃ¨s',
    },
    { status: 201 }
  );
});
