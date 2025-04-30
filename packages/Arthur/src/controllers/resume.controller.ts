import ResumeService from '../services/resume.services';
import { AuthenticatedRequest } from '../types/authTypes';
import { Request, Response } from 'express';

const processResume = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const file_url = req.body.file_url;
    if (!file_url) {
      return res.status(400).json({ error: 'No file_url provided' });
    }
    const extractedData = await ResumeService.extractResumeData(
      req.user.userId,
      req.file,
      file_url
    );
    return res.json(extractedData);
  } catch (error) {
    console.error('Error processing resume:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserResumes = async (req: any, res: any) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const resumes = await ResumeService.getUserResumes(req.user.userId);
    return res.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getResumeById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const resume = await ResumeService.getResumeById(id); // Fetch a resume by ID
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    return res.status(200).json(resume);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching resume', error });
  }
};

// Update an existing resume
const updateResume = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const resumeData = req.body; // Get updated resume data
    const updatedResume = await ResumeService.updateResume(id, resumeData);
    if (!updatedResume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    return res.status(200).json(updatedResume);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating resume', error });
  }
};
const setPrimary = async (req: any, res: any): Promise<any> => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const { id } = req.params;
    const updatedResume = await ResumeService.setPrimary(id, req.user.userId);
    if (!updatedResume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    return res.status(200).json(updatedResume);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating resume', error });
  }
};

// Delete a resume
const deleteResume = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const deletedResume = await ResumeService.deleteResume(id);
    if (!deletedResume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    return res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting resume', error });
  }
};

const optimizeResumeText = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { text, section } = req.body;

    if (!text || !section) {
      return res.status(400).json({
        error:
          'Both text and section (professional_summary, experience, skills, or education) are required',
      });
    }

    const optimizedSection = await ResumeService.optimizeResumeText(
      text,
      section
    );
    return res.json(optimizedSection);
  } catch (error) {
    console.error('Error optimizing resume section:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default {
  processResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
  optimizeResumeText,
  setPrimary,
};
