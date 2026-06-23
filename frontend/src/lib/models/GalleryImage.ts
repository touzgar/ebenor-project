import mongoose, { Schema, Model } from 'mongoose';

export interface IGalleryImage {
  title: string;
  description?: string;
  url: string;
  thumbnailUrl: string;
  category: 'cuisine' | 'dressing' | 'mobilier' | 'amenagement' | 'showroom' | 'process' | 'product' | 'autre';
  tags?: string[];
  alt: string;
  dimensions: {
    width: number;
    height: number;
  };
  fileSize: number;
  mimeType: string; // Flexible to support images and videos
  featured: boolean;
  sortOrder: number;
  source?: 'upload' | 'cloudinary' | 'external';
  cloudinaryId?: string;
  uploadedBy?: string;
  views?: number;
  createdBy?: string;
  updatedBy?: string;
  uploadedAt: Date;
  updatedAt: Date;
}

export interface GalleryImageDocument extends Omit<IGalleryImage, '_id'>, mongoose.Document {
  toPublicJSON(): any;
  getAspectRatio(): number;
  isLandscape(): boolean;
  isPortrait(): boolean;
  isSquare(): boolean;
}

const GalleryImageSchema = new Schema<GalleryImageDocument>({
  title: { 
    type: String, 
    required: true, 
    maxlength: 200,
    trim: true
  },
  description: { 
    type: String, 
    maxlength: 1000,
    trim: true
  },
  url: { 
    type: String, 
    required: true 
  },
  thumbnailUrl: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['cuisine', 'dressing', 'mobilier', 'amenagement', 'showroom', 'process', 'product', 'autre'],
    lowercase: true
  },
  tags: [{ 
    type: String, 
    maxlength: 50,
    lowercase: true,
    trim: true
  }],
  alt: { 
    type: String, 
    required: true, 
    maxlength: 200,
    trim: true
  },
  dimensions: {
    width: { type: Number, required: true, min: 1 },
    height: { type: Number, required: true, min: 1 }
  },
  fileSize: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  mimeType: { 
    type: String, 
    required: true
  },
  featured: { 
    type: Boolean, 
    default: false 
  },
  sortOrder: { 
    type: Number, 
    default: 0 
  },
  source: {
    type: String,
    enum: ['upload', 'cloudinary', 'external'],
    default: 'upload'
  },
  cloudinaryId: {
    type: String
  },
  uploadedBy: {
    type: String
  },
  views: {
    type: Number,
    default: 0
  },
  createdBy: { 
    type: String
  },
  updatedBy: { 
    type: String 
  }
}, {
  timestamps: { createdAt: 'uploadedAt', updatedAt: true },
  collection: 'gallery_images'
});

// Indexes
GalleryImageSchema.index({ category: 1, sortOrder: 1 });
GalleryImageSchema.index({ featured: -1, uploadedAt: -1 });
GalleryImageSchema.index({ tags: 1 });
GalleryImageSchema.index({ category: 1, featured: -1 });
GalleryImageSchema.index({ uploadedAt: -1 });
GalleryImageSchema.index({ sortOrder: 1 });

GalleryImageSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
  alt: 'text'
}, {
  weights: {
    title: 10,
    tags: 5,
    alt: 3,
    description: 1
  },
  name: 'gallery_text_search'
});

// Methods
GalleryImageSchema.methods.toPublicJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.createdBy;
  delete obj.updatedBy;
  return obj;
};

GalleryImageSchema.methods.getAspectRatio = function() {
  return this.dimensions.width / this.dimensions.height;
};

GalleryImageSchema.methods.isLandscape = function() {
  return this.dimensions.width > this.dimensions.height;
};

GalleryImageSchema.methods.isPortrait = function() {
  return this.dimensions.height > this.dimensions.width;
};

GalleryImageSchema.methods.isSquare = function() {
  return this.dimensions.width === this.dimensions.height;
};

// Pre-save middleware
GalleryImageSchema.pre('save', function(next) {
  if (!this.alt && this.title) {
    this.alt = `Image de ${this.title} - ÉBÉNOR CRÉATION`;
  }

  if (this.dimensions.width <= 0 || this.dimensions.height <= 0) {
    return next(new Error('Les dimensions de l\'image doivent être positives'));
  }

  if (this.fileSize > 10 * 1024 * 1024) {
    return next(new Error('La taille du fichier ne peut pas dépasser 10MB'));
  }

  next();
});

export const GalleryImage = (mongoose.models.GalleryImage as Model<GalleryImageDocument>) || mongoose.model<GalleryImageDocument>('GalleryImage', GalleryImageSchema);
