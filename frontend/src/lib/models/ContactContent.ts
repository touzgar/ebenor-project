import mongoose, { Schema, Model } from 'mongoose';

export interface IContactContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  contactInfo: {
    address: {
      line1: string;
      line2: string;
    };
    phone: string;
    email: string;
    hours: {
      weekdays: string;
      weekdaysTime: string;
      saturday: string;
      saturdayTime: string;
      sunday: string;
      sundayStatus: string;
    };
  };
  whatsapp: {
    title: string;
    description: string;
    buttonText: string;
    phoneNumber: string;
  };
  map: {
    title: string;
    subtitle: string;
    embedUrl: string;
  };
  faq: {
    title: string;
    subtitle: string;
    questions: Array<{
      question: string;
      answer: string;
    }>;
  };
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactContentDocument extends Omit<IContactContent, '_id'>, mongoose.Document {}

const ContactContentSchema = new Schema<ContactContentDocument>({
  hero: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
  },
  contactInfo: {
    address: {
      line1: { type: String, required: true },
      line2: { type: String, required: true },
    },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    hours: {
      weekdays: { type: String, required: true },
      weekdaysTime: { type: String, required: true },
      saturday: { type: String, required: true },
      saturdayTime: { type: String, required: true },
      sunday: { type: String, required: true },
      sundayStatus: { type: String, required: true },
    },
  },
  whatsapp: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    buttonText: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  map: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    embedUrl: { type: String, required: true },
  },
  faq: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    questions: [{
      question: { type: String, required: true },
      answer: { type: String, required: true },
    }],
  },
  updatedBy: { type: String },
}, {
  timestamps: true,
  collection: 'contact_content'
});

export const ContactContent = (mongoose.models.ContactContent as Model<ContactContentDocument>) || 
  mongoose.model<ContactContentDocument>('ContactContent', ContactContentSchema);
