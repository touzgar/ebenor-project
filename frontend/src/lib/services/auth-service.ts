import bcrypt from 'bcryptjs';
import { AdminUser, type AdminUserDocument } from '../models/AdminUser';
import { ApiError, ERROR_CODES } from '../errors';
import { generateToken } from '../auth/jwt';
import connectDB from '../db/mongodb';

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(email: string, password: string): Promise<{
  user: AdminUserDocument;
  token: string;
}> {
  await connectDB();

  // Find user by email
  const user = await AdminUser.findOne({ email: email.toLowerCase() });
  
  if (!user) {
    throw new ApiError(
      'Email ou mot de passe incorrect',
      401,
      ERROR_CODES.INVALID_CREDENTIALS
    );
  }

  // Check if account is active
  if (!user.isActive) {
    throw new ApiError(
      'Compte désactivé',
      401,
      ERROR_CODES.ACCESS_DENIED
    );
  }

  // Check if account is locked
  if (user.isLocked()) {
    const lockTime = user.lockUntil ? new Date(user.lockUntil) : new Date();
    const remainingTime = Math.ceil((lockTime.getTime() - Date.now()) / (1000 * 60));
    
    throw new ApiError(
      `Compte verrouillé. Réessayez dans ${remainingTime} minutes.`,
      423,
      ERROR_CODES.ACCESS_DENIED
    );
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    // Increment login attempts
    await user.incrementLoginAttempts();
    
    throw new ApiError(
      'Email ou mot de passe incorrect',
      401,
      ERROR_CODES.INVALID_CREDENTIALS
    );
  }

  // Reset login attempts on success
  await user.resetLoginAttempts();

  // Generate token
  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  console.log(`✅ Login successful: ${user.email}`);

  return { user, token };
}

/**
 * Hash password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate password reset token
 */
export async function generatePasswordResetToken(email: string): Promise<string> {
  await connectDB();
  
  const user = await AdminUser.findOne({ email: email.toLowerCase() });
  
  if (!user) {
    // Don't reveal if email exists
    throw new ApiError(
      'Si cet email existe, un lien de réinitialisation a été envoyé',
      200
    );
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save();

  console.log(`✅ Password reset token generated for ${email}`);
  
  return resetToken;
}

/**
 * Reset password with token
 */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await connectDB();
  
  const crypto = require('crypto');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await AdminUser.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(
      'Token de réinitialisation invalide ou expiré',
      400,
      ERROR_CODES.INVALID_TOKEN
    );
  }

  // Update password
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.loginAttempts = 0;
  user.lockUntil = undefined;

  await user.save();

  console.log(`✅ Password reset for ${user.email}`);
}

/**
 * Change password for authenticated user
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  await connectDB();
  
  const user = await AdminUser.findById(userId);
  
  if (!user) {
    throw new ApiError(
      'Utilisateur non trouvé',
      404,
      ERROR_CODES.NOT_FOUND
    );
  }

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  
  if (!isCurrentPasswordValid) {
    throw new ApiError(
      'Mot de passe actuel incorrect',
      400,
      ERROR_CODES.INVALID_CREDENTIALS
    );
  }

  // Update password
  user.password = newPassword;
  await user.save();

  console.log(`✅ Password changed for ${user.email}`);
}
