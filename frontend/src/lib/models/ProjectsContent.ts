import mongoose, { Schema, Model } from 'mongoose';

export interface IProjectsContent {
  hero: {
    title: string;
    titleHighlight: string;
    description: string;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectsContentDocument extends Omit<IProjectsContent, '_id'>, mongoose.Document {}

const ProjectsContentSchema = new Schema<ProjectsContentDocument>({
  hero: {
    title: { type: String, required: true },
    titleHighlight: { type: String, required: true },
    description: { type: String, required: true },
  },
  cta: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    buttonText: { type: String, required: true },
  },
  updatedBy: { type: String },
}, {
  timestamps: true,
  collection: 'projects_content'
});

export const ProjectsContent = (mongoose.models.ProjectsContent as Model<ProjectsContentDocument>) || 
  mongoose.model<ProjectsContentDocument>('ProjectsContent', ProjectsContentSchema);
