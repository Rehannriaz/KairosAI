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

export default { processResume, getUserResumes };
