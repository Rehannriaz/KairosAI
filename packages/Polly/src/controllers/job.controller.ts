import { Request, Response } from 'express';
import jobServices from '../services/job.services';

const getAllJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobs = await jobServices.getAllJobs();
    console.log('reached here', jobs);
    res.status(200).json(jobs);
  } catch (error: Error | any) {
    res.status(500).json({ error: error.message });
  }
};

const scrapeJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await jobServices.scrapeJobs();
    res.status(201).json(job);
  } catch (error: Error | any) {
    res.status(500).json({ error: error.message });
  }
};

const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await jobServices.getJobById(req.params.id);
    res.status(200).json(job);
  } catch (error: Error | any) {
    res.status(500).json({ error: error.message });
  }
};



export default {
  getAllJobs,
  scrapeJobs,
  getJobById,
};
