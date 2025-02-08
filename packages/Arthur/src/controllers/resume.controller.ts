import { Request, Response } from 'express';
import ResumeService from '../services/resume.services';
import { AuthenticatedRequest } from '../types/authTypes';

const processResume = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    console.log('reached here', req.file);
    const extractedData = await ResumeService.extractResumeData(
      req.user.userId,
      req.file
    );
    return res.json(extractedData);
  } catch (error) {
    console.error('Error processing resume:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserResumes = async (req: any, res: any) => {
  console.log("here");
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

export default { processResume, getUserResumes,getResumeById,updateResume,deleteResume };
