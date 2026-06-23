import mongoose, { Schema, Model } from 'mongoose';

export interface IMessage {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  priority: 'low' | 'medium' | 'high';
  source: 'contact_form' | 'whatsapp' | 'email';
  ipAddress?: string;
  userAgent?: string;
  readAt?: Date;
  repliedAt?: Date;
  notes?: Array<{
    text: string;
    createdAt: Date;
    createdBy: string;
  }>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageDocument extends Omit<IMessage, '_id'>, mongoose.Document {
  toPublicJSON(): any;
  markAsRead(userId: string): Promise<MessageDocument>;
  markAsReplied(userId: string): Promise<MessageDocument>;
  addNote(text: string, userId: string): Promise<MessageDocument>;
  setPriority(priority: 'low' | 'medium' | 'high'): Promise<MessageDocument>;
}

const MessageSchema = new Schema<MessageDocument>({
  name: { 
    type: String, 
    required: true, 
    maxlength: 100,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    maxlength: 100,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  phone: { 
    type: String, 
    maxlength: 20,
    trim: true,
    match: [/^[\+]?[0-9\s\-\(\)]{8,20}$/, 'Numéro de téléphone invalide']
  },
  subject: { 
    type: String, 
    required: true, 
    maxlength: 200,
    trim: true
  },
  message: { 
    type: String, 
    required: true, 
    maxlength: 5000,
    trim: true
  },
  status: { 
    type: String, 
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  source: { 
    type: String, 
    enum: ['contact_form', 'whatsapp', 'email'],
    default: 'contact_form'
  },
  ipAddress: { 
    type: String
  },
  userAgent: { 
    type: String, 
    maxlength: 500 
  },
  readAt: { type: Date },
  repliedAt: { type: Date },
  notes: [{
    text: { type: String, required: true, maxlength: 1000 },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true }
  }],
  createdBy: { 
    type: String 
  }
}, {
  timestamps: true,
  collection: 'messages'
});

// Indexes
MessageSchema.index({ status: 1, createdAt: -1 });
MessageSchema.index({ priority: -1, createdAt: -1 });
MessageSchema.index({ email: 1 });
MessageSchema.index({ source: 1, createdAt: -1 });
MessageSchema.index({ createdAt: -1 });

MessageSchema.index({
  name: 'text',
  email: 'text',
  subject: 'text',
  message: 'text'
}, {
  weights: {
    subject: 10,
    name: 5,
    email: 3,
    message: 1
  }
});

// Methods
MessageSchema.methods.toPublicJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.ipAddress;
  delete obj.userAgent;
  delete obj.notes;
  return obj;
};

MessageSchema.methods.markAsRead = function(userId: string) {
  this.status = 'read';
  this.readAt = new Date();
  return this.save();
};

MessageSchema.methods.markAsReplied = function(userId: string) {
  this.status = 'replied';
  this.repliedAt = new Date();
  return this.save();
};

MessageSchema.methods.addNote = function(text: string, userId: string) {
  this.notes = this.notes || [];
  this.notes.push({
    text,
    createdAt: new Date(),
    createdBy: userId
  });
  return this.save();
};

MessageSchema.methods.setPriority = function(priority: 'low' | 'medium' | 'high') {
  this.priority = priority;
  return this.save();
};

// Pre-save middleware
MessageSchema.pre('save', function(next) {
  if (this.isNew && !this.priority) {
    const urgentKeywords = ['urgent', 'rapidement', 'vite', 'immédiat', 'emergency'];
    const messageText = (this.subject + ' ' + this.message).toLowerCase();
    
    if (urgentKeywords.some(keyword => messageText.includes(keyword))) {
      this.priority = 'high';
    } else if (this.phone) {
      this.priority = 'medium';
    } else {
      this.priority = 'low';
    }
  }

  if (this.name) this.name = this.name.trim();
  if (this.email) this.email = this.email.toLowerCase().trim();
  if (this.subject) this.subject = this.subject.trim();
  if (this.message) this.message = this.message.trim();

  next();
});

export const Message = (mongoose.models.Message as Model<MessageDocument>) || mongoose.model<MessageDocument>('Message', MessageSchema);
