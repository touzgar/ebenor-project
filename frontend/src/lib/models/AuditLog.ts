import mongoose, { Schema, Model } from 'mongoose';

export interface IAuditLog {
  userId: string;
  userEmail?: string;
  action: 'create' | 'update' | 'delete' | 'bulk_delete' | 'bulk_update' | 'login' | 'logout' | 'password_change' | 'upload' | 'download';
  resource: 'product' | 'gallery' | 'home' | 'message' | 'user' | 'media' | 'auth';
  resourceId?: string;
  changes?: {
    before?: any;
    after?: any;
  };
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AuditLogDocument extends Omit<IAuditLog, '_id'>, mongoose.Document {
  toPublicJSON(): any;
}

const AuditLogSchema = new Schema<AuditLogDocument>({
  userId: { 
    type: String, 
    required: true
  },
  userEmail: { 
    type: String,
    maxlength: 100
  },
  action: { 
    type: String, 
    required: true,
    enum: ['create', 'update', 'delete', 'bulk_delete', 'bulk_update', 'login', 'logout', 'password_change', 'upload', 'download']
  },
  resource: { 
    type: String, 
    required: true,
    enum: ['product', 'gallery', 'home', 'message', 'user', 'media', 'auth']
  },
  resourceId: { 
    type: String
  },
  changes: {
    before: { type: Schema.Types.Mixed },
    after: { type: Schema.Types.Mixed }
  },
  ipAddress: { 
    type: String,
    maxlength: 45
  },
  userAgent: { 
    type: String,
    maxlength: 500
  },
  timestamp: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  }
}, {
  collection: 'audit_logs'
});

// Indexes
AuditLogSchema.index({ resource: 1, resourceId: 1, timestamp: -1 });
AuditLogSchema.index({ userId: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });
AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60, name: 'timestamp_ttl' });

AuditLogSchema.methods.toPublicJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export const AuditLog = (mongoose.models.AuditLog as Model<AuditLogDocument>) || mongoose.model<AuditLogDocument>('AuditLog', AuditLogSchema);
