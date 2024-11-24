import resumeRepository from '../repositories/resume.repository'; // Import the repository for resumes
import { IResume } from '../models/resume.model'; // Use the resume model

// Get all resumes
const getAllResumes = async (): Promise<IResume[]> => {
  return await resumeRepository.findAllResumes(); // Fetch all resumes from the repository
};

// Get a resume by ID
const getResumeById = async (id: string): Promise<IResume | null> => {
  return await resumeRepository.findResumeById(id); // Fetch a specific resume by ID
};

// Create a new parsed resume
const createResume = async (resumeData: IResume): Promise<IResume> => {
  return await resumeRepository.createResume(resumeData); // Create a new resume
};

// Update an existing resume
const updateResume = async (
  id: string,
  resumeData: Partial<IResume>
): Promise<IResume | null> => {
  return await resumeRepository.updateResume(id, resumeData); // Update the resume
};

// Delete a resume by ID
const deleteResume = async (id: string): Promise<IResume | null> => {
  return await resumeRepository.deleteResume(id); // Delete a resume
};

export default {
  getAllResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
};
