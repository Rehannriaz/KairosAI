import Resume from '../models/resume.model'; // Import the resume model

const findAllResumes = async () => {
  return await Resume.find(); // Fetch all resumes from the database
};

const findResumeById = async (id: string) => {
  return await Resume.findById(id); // Find a resume by ID
};

const createResume = async (resumeData: any) => {
  const newResume = new Resume(resumeData);
  return await newResume.save(); // Create a new resume document in the database
};

const updateResume = async (id: string, resumeData: Partial<any>) => {
  return await Resume.findByIdAndUpdate(id, resumeData, { new: true }); // Update an existing resume by ID
};

const deleteResume = async (id: string) => {
  return await Resume.findByIdAndDelete(id); // Delete a resume by ID
};

export default {
  findAllResumes,
  findResumeById,
  createResume,
  updateResume,
  deleteResume,
};
