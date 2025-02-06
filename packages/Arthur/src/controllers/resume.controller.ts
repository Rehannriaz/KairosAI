import { Request, Response } from 'express';
import Resume from '../models/resume.model';
import {pool} from '../utils/database'
// Get all resumes
export const getAllResumes = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log("reached here")
    const resumes = await pool.query('SELECT * FROM resumes');
    console.log("resumes",resumes.rows);
    return res.status(200).json(resumes.rows);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching resumes', error });
  }
};

// Get a specific resume by ID
export const getResumeById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id); // Fetch a resume by ID
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    return res.status(200).json(resume);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching resume', error });
  }
};

// Create a new parsed resume
export const createResume = async (req: Request, res: Response): Promise<any> => {
  try {
    const resumeData = req.body; // Get resume data from the request body
    const newResume = new Resume(resumeData); // Create a new resume document
    await newResume.save();
    return res.status(201).json(newResume);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating resume', error });
  }
};

// Update an existing resume
export const updateResume = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const resumeData = req.body; // Get updated resume data
    const updatedResume = await Resume.findByIdAndUpdate(id, resumeData, { new: true });
    if (!updatedResume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    return res.status(200).json(updatedResume);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating resume', error });
  }
};

// Delete a resume
export const deleteResume = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const deletedResume = await Resume.findByIdAndDelete(id);
    if (!deletedResume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    return res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting resume', error });
  }
};
