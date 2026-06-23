import mongoose, { Schema, Model } from 'mongoose';

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  images: Array<{
    url: string;
    alt?: string;
    isPrimary?: boolean;
  }>;
  video?: {
    url: string;
    publicId?: string;
    thumbnail?: string;
  };
  specifications?: Map<string, string>;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: 'cm' | 'm';
  };
  materials?: string[];
  finishes?: string[];
  price?: {
    amount?: number;
    currency?: string;
    unit?: string;
  };
  availability: 'in_stock' | 'made_to_order' | 'out_of_stock';
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductDocument extends Omit<IProduct, '_id'>, mongoose.Document {
  toPublicJSON(): any;
  getPrimaryImage(): any;
}

const ProductSchema = new Schema<ProductDocument>({
  name: { 
    type: String, 
    required: true, 
    maxlength: 200,
    trim: true
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true, 
    maxlength: 5000 
  },
  shortDescription: { 
    type: String, 
    required: true, 
    maxlength: 300 
  },
  category: { 
    type: String, 
    required: true,
    lowercase: true
  },
  images: [{
    url: { type: String, required: true },
    alt: { type: String, default: '', maxlength: 200 },
    isPrimary: { type: Boolean, default: false }
  }],
  video: {
    url: { type: String },
    publicId: { type: String },
    thumbnail: { type: String }
  },
  specifications: {
    type: Map,
    of: String,
    default: new Map()
  },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
    unit: { type: String, enum: ['cm', 'm'], default: 'cm' }
  },
  materials: [{ 
    type: String, 
    maxlength: 100,
    trim: true
  }],
  finishes: [{ 
    type: String, 
    maxlength: 100,
    trim: true
  }],
  price: {
    amount: { type: Number, min: 0 },
    currency: { type: String, default: 'TND', maxlength: 3 },
    unit: { type: String, maxlength: 20 }
  },
  availability: { 
    type: String, 
    enum: ['in_stock', 'made_to_order', 'out_of_stock'],
    default: 'made_to_order'
  },
  featured: { 
    type: Boolean, 
    default: false 
  },
  seoTitle: { 
    type: String, 
    maxlength: 60 
  },
  seoDescription: { 
    type: String, 
    maxlength: 160 
  },
  tags: [{ 
    type: String, 
    maxlength: 50,
    lowercase: true,
    trim: true
  }],
  createdBy: { 
    type: String
  },
  updatedBy: { 
    type: String 
  }
}, {
  timestamps: true,
  collection: 'products'
});

// Indexes
ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ category: 1, subcategory: 1 });
ProductSchema.index({ featured: -1, createdAt: -1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ category: 1, featured: -1 });
ProductSchema.index({ category: 1, availability: 1 });
ProductSchema.index({ availability: 1 });
ProductSchema.index({ 'price.amount': 1 });
ProductSchema.index({ createdAt: -1 });

ProductSchema.index({
  name: 'text',
  description: 'text',
  shortDescription: 'text',
  tags: 'text'
}, {
  weights: {
    name: 10,
    shortDescription: 5,
    tags: 3,
    description: 1
  },
  name: 'product_text_search'
});

// Methods
ProductSchema.methods.toPublicJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.createdBy;
  delete obj.updatedBy;
  return obj;
};

ProductSchema.methods.getPrimaryImage = function() {
  const primaryImage = this.images.find(img => img.isPrimary);
  return primaryImage || this.images[0] || null;
};

// Pre-save middleware
ProductSchema.pre('save', async function(next) {
  try {
    if (!this.slug && this.name) {
      let baseSlug = this.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .trim();
      
      let slug = baseSlug;
      let counter = 1;
      
      while (await mongoose.models.Product.findOne({ slug, _id: { $ne: this._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      this.slug = slug;
    }

    const primaryImages = this.images.filter(img => img.isPrimary);
    if (primaryImages.length > 1) {
      this.images.forEach((img, index) => {
        img.isPrimary = index === 0;
      });
    } else if (primaryImages.length === 0 && this.images.length > 0) {
      this.images[0].isPrimary = true;
    }

    if (!this.seoTitle) {
      this.seoTitle = this.name.substring(0, 60);
    }
    if (!this.seoDescription) {
      this.seoDescription = this.shortDescription.substring(0, 160);
    }

    next();
  } catch (error: any) {
    next(error);
  }
});

export const Product = (mongoose.models.Product as Model<ProductDocument>) || mongoose.model<ProductDocument>('Product', ProductSchema);
