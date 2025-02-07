import { Request, Response } from 'express';
import ResumeService from '../services/resume.services';
import { DecodedToken } from '../types/authTypes'; // Create this interface
import { AuthenticatedRequest } from '../types/authTypes';
class ResumeController {
  static async processResume(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const extractedData = await ResumeService.extractResumeData(req.file);
      return res.json(extractedData);
    } catch (error) {
      console.error('Error processing resume:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getUserResumes(req: AuthenticatedRequest, res: Response) {
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
  }
}

export default ResumeController;
