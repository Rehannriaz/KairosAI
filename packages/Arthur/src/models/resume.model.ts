import { Schema, model, Document } from 'mongoose';

// Define the Resume interface
export interface IResume extends Document {
  id: string; // Matches character(24) from NeonDB
  user_id?: string; // Optional since it's nullable in NeonDB
  name: string;
  location: string;
  contact: {
    email: string;
    phone: string;
  };
  professional_summary: string;
  skills?: string[]; // Optional since it's nullable in NeonDB
  employment_history?: any;
  education?: {
    degree: string;
    field_of_study: string;
    graduation_year: number;
  };
  preferences?: {
    job_type: string;
    preferred_location: string[];
    industry: string;
  };
  embedding?: number[]; // Assuming vector(1536) is stored as an array of numbers
  link?: string;
}

// Define the Resume Schema
const resumeSchema = new Schema<IResume>({
  id: { type: String, required: true },
  user_id: { type: String },
  name: { type: String, required: true },
  location: { type: String, required: true },
  contact: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  professional_summary: { type: String, required: true },
  skills: { type: [String] },
  employment_history: [
    {
      role: { type: String, required: true },
      company: { type: String, required: true },
      duration: { type: String, required: true },
    },
  ],
  education: {
    degree: { type: String, required: true },
    field_of_study: { type: String, required: true },
    graduation_year: { type: Number, required: true },
  },
  preferences: {
    job_type: { type: String, required: true },
    preferred_location: { type: [String], required: true },
    industry: { type: String, required: true },
  },
  embedding: { type: [Number] },
  link: { type: String },
});

// Create the model using the schema and export it
const Resume = model<IResume>('Resume', resumeSchema);
export default Resume;
