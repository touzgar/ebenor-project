import mongoose, { Schema, Model } from 'mongoose';

export interface IFooterContent {
  brand: {
    description: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
  newsletter: {
    title: string;
    description: string;
  };
  bottom: {
    copyright: string;
    additionalText: string;
  };
  backgroundImage: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FooterContentDocument extends Omit<IFooterContent, '_id'>, mongoose.Document {}

const FooterContentSchema = new Schema<FooterContentDocument>({
  brand: {
    description: { type: String, required: true },
  },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
  },
  social: {
    facebook: { type: String, required: true },
    instagram: { type: String, required: true },
    linkedin: { type: String, required: true },
  },
  newsletter: {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  bottom: {
    copyright: { type: String, required: true },
    additionalText: { type: String, required: true },
  },
  backgroundImage: { type: String, required: true },
  updatedBy: { type: String },
}, {
  timestamps: true,
  collection: 'footer_content'
});

export const FooterContent = (mongoose.models.FooterContent as Model<FooterContentDocument>) || 
  mongoose.model<FooterContentDocument>('FooterContent', FooterContentSchema);
