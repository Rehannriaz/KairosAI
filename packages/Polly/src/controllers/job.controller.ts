import jobServices from '../services/job.services';
import { Request, Response } from 'express';

const getAllJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    console.log('page', page, limit);
    const { jobs, total } = await jobServices.getAllJobs(page, limit);
    console.log('jobs', jobs);
    res.status(200).json({ jobs, total });
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
const getNRecommendedJobs = async (req: any, res: any): Promise<void> => {
  console.log('reacheddddd');
  const { limit } = req.params;
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const jobs = await jobServices.getNRecommendedJobs(
      parseInt(limit),
      req.user
    );
    res.status(200).json(jobs);
  } catch (error: Error | any) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getAllJobs,
  scrapeJobs,
  getJobById,
  getNRecommendedJobs,
};
