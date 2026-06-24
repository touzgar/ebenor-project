import mongoose, { Schema, Model } from 'mongoose';

export interface IHomeContent {
  hero: {
    companyName?: string;
    title: string;
    subtitle: string;
    backgroundImage?: string;
    videoUrl?: string;
    ctaText: string;
    ctaLink: string;
  };
  factory?: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    description: string;
    backgroundImage?: string;
    video1Url: string;
    video1Title: string;
    video1Description: string;
    video2Url: string;
    video2Title: string;
    video2Description: string;
    stats: Array<{
      icon: string;
      value: string;
      label: string;
    }>;
  };
  woodCatalog?: {
    title: string;
    titleHighlight: string;
    description: string;
    videoUrl: string;
    badgeText: string;
    woodSamples: Array<{
      name: string;
      color: string;
      description: string;
    }>;
  };
  cta?: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    button1Text: string;
    button1Link: string;
    button2Text: string;
    button2Link: string;
    phone: string;
    email: string;
    address: string;
    backgroundImage?: string;
    stats: Array<{
      icon: string;
      number: string;
      label: string;
    }>;
  };
  about: {
    title: string;
    description: string;
    image: string;
    highlights: string[];
  };
  services: Array<{
    title: string;
    description: string;
    icon: string;
    image?: string;
  }>;
  process: Array<{
    step: number;
    title: string;
    description: string;
    image: string;
  }>;
  testimonials: Array<{
    name: string;
    company: string;
    text: string;
    rating: number;
    image?: string;
  }>;
  contact: {
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
    workingHours: string;
  };
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HomeContentDocument extends Omit<IHomeContent, '_id'>, mongoose.Document {
  toPublicJSON(): any;
}

const HomeContentSchema = new Schema<HomeContentDocument>({
  hero: {
    companyName: { type: String, maxlength: 100 },
    title: { type: String, required: true, maxlength: 200 },
    subtitle: { type: String, required: true, maxlength: 500 },
    backgroundImage: { type: String },
    videoUrl: { type: String },
    ctaText: { type: String, required: true, maxlength: 50 },
    ctaLink: { type: String, required: true }
  },
  factory: {
    title: { type: String, maxlength: 200 },
    titleHighlight: { type: String, maxlength: 200 },
    subtitle: { type: String, maxlength: 200 },
    description: { type: String, maxlength: 2000 },
    backgroundImage: { type: String },
    video1Url: { type: String },
    video1Title: { type: String, maxlength: 200 },
    video1Description: { type: String, maxlength: 1000 },
    video2Url: { type: String },
    video2Title: { type: String, maxlength: 200 },
    video2Description: { type: String, maxlength: 1000 },
    stats: [{
      icon: { type: String, maxlength: 50 },
      value: { type: String, maxlength: 50 },
      label: { type: String, maxlength: 100 }
    }]
  },
  woodCatalog: {
    title: { type: String, maxlength: 200 },
    titleHighlight: { type: String, maxlength: 200 },
    description: { type: String, maxlength: 500 },
    videoUrl: { type: String },
    badgeText: { type: String, maxlength: 200 },
    woodSamples: [{
      name: { type: String, maxlength: 100 },
      color: { type: String, maxlength: 50 },
      description: { type: String, maxlength: 200 }
    }]
  },
  cta: {
    badge: { type: String, maxlength: 200 },
    title: { type: String, maxlength: 200 },
    titleHighlight: { type: String, maxlength: 200 },
    description: { type: String, maxlength: 1000 },
    button1Text: { type: String, maxlength: 100 },
    button1Link: { type: String, maxlength: 500 },
    button2Text: { type: String, maxlength: 100 },
    button2Link: { type: String, maxlength: 500 },
    phone: { type: String, maxlength: 50 },
    email: { type: String, maxlength: 100 },
    address: { type: String, maxlength: 500 },
    backgroundImage: { type: String },
    stats: [{
      icon: { type: String, maxlength: 50 },
      number: { type: String, maxlength: 50 },
      label: { type: String, maxlength: 100 }
    }]
  },
  about: {
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 2000 },
    image: { type: String, required: true },
    highlights: [{ type: String, maxlength: 100 }]
  },
  services: [{
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 500 },
    icon: { type: String, required: true },
    image: { type: String }
  }],
  process: [{
    step: { type: Number, required: true, min: 1 },
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 500 },
    image: { type: String, required: true }
  }],
  testimonials: [{
    name: { type: String, required: true, maxlength: 100 },
    company: { type: String, required: true, maxlength: 100 },
    text: { type: String, required: true, maxlength: 1000 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    image: { type: String }
  }],
  contact: {
    address: { type: String, required: true, maxlength: 300 },
    phone: { type: String, required: true, maxlength: 20 },
    email: { type: String, required: true, maxlength: 100 },
    whatsapp: { type: String, required: true, maxlength: 20 },
    workingHours: { type: String, required: true, maxlength: 200 }
  },
  createdBy: { 
    type: String 
  },
  updatedBy: { 
    type: String
  }
}, {
  timestamps: true,
  collection: 'home_content'
});

HomeContentSchema.index({ updatedAt: -1 });

HomeContentSchema.methods.toPublicJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

HomeContentSchema.pre('save', function(next) {
  if (this.process && this.process.length > 0) {
    const steps = this.process.map(p => p.step).sort((a, b) => a - b);
    for (let i = 0; i < steps.length; i++) {
      if (steps[i] !== i + 1) {
        return next(new Error('Les étapes du processus doivent être séquentielles à partir de 1'));
      }
    }
  }
  next();
});

export const HomeContent = (mongoose.models.HomeContent as Model<HomeContentDocument>) || mongoose.model<HomeContentDocument>('HomeContent', HomeContentSchema);
