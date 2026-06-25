import mongoose, { Schema, Model } from 'mongoose';

export interface IAboutContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  stats: Array<{
    icon: string;
    number: string;
    label: string;
  }>;
  history: {
    title: string;
    subtitle: string;
    description: string;
  };
  timeline: Array<{
    year: string;
    title: string;
    description: string;
  }>;
  values: {
    title: string;
    subtitle: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AboutContentDocument extends Omit<IAboutContent, '_id'>, mongoose.Document {}

const AboutContentSchema = new Schema<AboutContentDocument>({
  hero: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
  },
  stats: [{
    icon: { type: String, required: true },
    number: { type: String, required: true },
    label: { type: String, required: true },
  }],
  history: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
  },
  timeline: [{
    year: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  }],
  values: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    items: [{
      icon: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
    }],
  },
  updatedBy: { type: String },
}, {
  timestamps: true,
  collection: 'about_content'
});

export const AboutContent = (mongoose.models.AboutContent as Model<AboutContentDocument>) || 
  mongoose.model<AboutContentDocument>('AboutContent', AboutContentSchema);
