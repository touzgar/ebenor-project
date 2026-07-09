import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { AdminUser } from '@/lib/models/AdminUser';

export const dynamic = 'force-dynamic';

export const POST = withApiHandler(async (request: NextRequest) => {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email requis'
      }, { status: 400 });
    }

    // Find user by email (case-insensitive)
    const user = await AdminUser.findOne({ 
      email: email.toLowerCase() 
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé'
      });
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // In production, you would send an email here
    // For now, we'll just log the reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/reset-password?token=${resetToken}`;
    
    console.log('🔐 Password Reset Link:', resetUrl);
    console.log('📧 Send this link to:', email);

    // TODO: Implement email sending with a service like SendGrid, Resend, or Nodemailer
    // await sendPasswordResetEmail(user.email, resetUrl);

    return NextResponse.json({
      success: true,
      message: 'Un lien de réinitialisation a été envoyé à votre email',
      // In development, include the link
      ...(process.env.NODE_ENV === 'development' && { resetUrl })
    });

  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({
      success: false,
      message: 'Une erreur est survenue'
    }, { status: 500 });
  }
});
