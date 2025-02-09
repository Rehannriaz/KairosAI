import { Schema, model, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  listingUrl: string;
  postedDate: Date;
  aboutRole: string;
  requirements: string;
  description: string;
  scrapedAt: Date;
  salary?: string; // Optional field
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    listingUrl: { type: String, required: true, unique: true },
    postedDate: { type: Date, required: true },
    aboutRole: { type: String, required: true },
    requirements: { type: String, required: true },
    description: { type: String, required: true },
    scrapedAt: { type: Date, required: true },
    salary: { type: String }, // Optional field
  },
  { timestamps: true }
);

export default model<IJob>('Job', jobSchema);
