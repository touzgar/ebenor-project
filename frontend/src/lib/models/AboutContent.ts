import mongoose, { Schema, Model } from 'mongoose';

export interface IAboutContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    backgroundImage: string;
  };
  stats: Array<{
    label: string;
    value: string;
    icon: string;
  }>;
  history: {
    title: string;
    subtitle: string;
    paragraphs: string[];
    image: string;
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
  cta: {
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
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
    backgroundImage: { type: String, required: true },
  },
  stats: [{
    label: { type: String, required: true },
    value: { type: String, required: true },
    icon: { type: String, required: true },
  }],
  history: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    paragraphs: [{ type: String, required: true }],
    image: { type: String, required: true },
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
  cta: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    primaryButton: { type: String, required: true },
    secondaryButton: { type: String, required: true },
  },
  updatedBy: { type: String },
}, {
  timestamps: true,
  collection: 'about_content'
});

export const AboutContent = (mongoose.models.AboutContent as Model<AboutContentDocument>) || 
  mongoose.model<AboutContentDocument>('AboutContent', AboutContentSchema);
