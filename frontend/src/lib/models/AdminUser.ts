import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdminUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'editor';
  permissions: Array<{
    resource: 'products' | 'gallery' | 'messages' | 'home_content' | 'users' | 'settings';
    actions: Array<'create' | 'read' | 'update' | 'delete'>;
  }>;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUserDocument extends Omit<IAdminUser, '_id'>, mongoose.Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
  isLocked(): boolean;
  generatePasswordResetToken(): string;
  toPublicJSON(): any;
  hasPermission(resource: string, action: string): boolean;
}

const AdminUserSchema = new Schema<AdminUserDocument>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    maxlength: 100,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  password: { 
    type: String, 
    required: true,
    minlength: 8
  },
  firstName: { 
    type: String, 
    required: true, 
    maxlength: 50,
    trim: true
  },
  lastName: { 
    type: String, 
    required: true, 
    maxlength: 50,
    trim: true
  },
  role: { 
    type: String, 
    enum: ['super_admin', 'admin', 'editor'],
    default: 'editor'
  },
  permissions: [{
    resource: { 
      type: String, 
      required: true,
      enum: ['products', 'gallery', 'messages', 'home_content', 'users', 'settings']
    },
    actions: [{ 
      type: String, 
      enum: ['create', 'read', 'update', 'delete']
    }]
  }],
  avatar: { type: String },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastLogin: { type: Date },
  loginAttempts: { 
    type: Number, 
    default: 0 
  },
  lockUntil: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date }
}, {
  timestamps: true,
  collection: 'admin_users'
});

// Indexes
AdminUserSchema.index({ email: 1 }, { unique: true });
AdminUserSchema.index({ role: 1, isActive: 1 });
AdminUserSchema.index({ lastLogin: -1 });
AdminUserSchema.index({ passwordResetToken: 1 });

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours

// Methods
AdminUserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

AdminUserSchema.methods.incrementLoginAttempts = async function(): Promise<void> {
  if (this.lockUntil && this.lockUntil < new Date()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates: any = { $inc: { loginAttempts: 1 } };
  
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked()) {
    updates.$set = { lockUntil: new Date(Date.now() + LOCK_TIME) };
  }
  
  return this.updateOne(updates);
};

AdminUserSchema.methods.resetLoginAttempts = async function(): Promise<void> {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  });
};

AdminUserSchema.methods.isLocked = function(): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

AdminUserSchema.methods.generatePasswordResetToken = function(): string {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  return token;
};

AdminUserSchema.methods.toPublicJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.loginAttempts;
  delete obj.lockUntil;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  delete obj.__v;
  return obj;
};

AdminUserSchema.methods.hasPermission = function(resource: string, action: string): boolean {
  if (this.role === 'super_admin') {
    return true;
  }
  
  const permission = this.permissions.find(p => p.resource === resource);
  return permission ? permission.actions.includes(action as any) : false;
};

// Pre-save middleware - hash password
AdminUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    // TEMPORARILY DISABLED - Password validation will be re-enabled after admin creation
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // if (!passwordRegex.test(this.password)) {
    //   throw new Error('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial');
    // }

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Pre-save middleware - set default permissions
AdminUserSchema.pre('save', function(next) {
  if (this.isNew && this.permissions.length === 0) {
    switch (this.role) {
      case 'super_admin':
        this.permissions = [
          { resource: 'products', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'gallery', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'messages', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'home_content', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'settings', actions: ['create', 'read', 'update', 'delete'] }
        ];
        break;
      case 'admin':
        this.permissions = [
          { resource: 'products', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'gallery', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'messages', actions: ['read', 'update'] },
          { resource: 'home_content', actions: ['read', 'update'] }
        ];
        break;
      case 'editor':
        this.permissions = [
          { resource: 'products', actions: ['create', 'read', 'update'] },
          { resource: 'gallery', actions: ['create', 'read', 'update'] },
          { resource: 'messages', actions: ['read'] },
          { resource: 'home_content', actions: ['read'] }
        ];
        break;
    }
  }
  next();
});

export const AdminUser = (mongoose.models.AdminUser as Model<AdminUserDocument>) || mongoose.model<AdminUserDocument>('AdminUser', AdminUserSchema);
