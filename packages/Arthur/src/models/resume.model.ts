import { Schema, model, Document } from 'mongoose';

// Define the Resume interface
export interface IResume extends Document { // Export IResume to use in other files
  name: string;
  location: string;
  contact: {
    email: string;
    phone: string;
  };
  professional_summary: string;
  skills: string[];
  employment_history: {
    role: string;
    company: string;
    duration: string;
  }[];
  education: {
    degree: string;
    field_of_study: string;
    graduation_year: number;
  };
  preferences: {
    job_type: string;
    preferred_location: string[];
    industry: string;
  };
}

// Define the Resume Schema
const resumeSchema = new Schema<IResume>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  contact: {
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  professional_summary: { type: String, required: true },
  skills: { type: [String], required: true },
  employment_history: [
    {
      role: { type: String, required: true },
      company: { type: String, required: true },
      duration: { type: String, required: true }
    }
  ],
  education: {
    degree: { type: String, required: true },
    field_of_study: { type: String, required: true },
    graduation_year: { type: Number, required: true }
  },
  preferences: {
    job_type: { type: String, required: true },
    preferred_location: { type: [String], required: true },
    industry: { type: String, required: true }
  }
});

// Create the model using the schema and export it
const Resume = model<IResume>('Resume', resumeSchema);

export default Resume;
