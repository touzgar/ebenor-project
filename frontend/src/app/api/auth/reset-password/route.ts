import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { AdminUser } from '@/lib/models/AdminUser';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export const POST = withApiHandler(async (request: NextRequest) => {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({
        success: false,
        message: 'Token et mot de passe requis'
      }, { status: 400 });
    }

    // Hash the token to compare with database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid reset token
    const user = await AdminUser.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Lien invalide ou expiré'
      }, { status: 400 });
    }

    // Update password (will be hashed by pre-save middleware)
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    });

  } catch (error: any) {
    console.error('Reset password error:', error);
    
    // Check if it's a validation error
    if (error.message && error.message.includes('mot de passe')) {
      return NextResponse.json({
        success: false,
        message: error.message
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Une erreur est survenue'
    }, { status: 500 });
  }
});
