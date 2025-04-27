import jobServices from '../services/job.services';
import { Request, Response } from 'express';

const getAllJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('req.query in job.controller.ts in polly', req.query);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Extract filter parameters from request
    const filters = {
      locations: Array.isArray(req.query.locations) ? 
        req.query.locations as string[] : 
        req.query.locations ? [req.query.locations as string] : 
        undefined,
      isRemote: req.query.isRemote !== undefined ? 
        req.query.isRemote === 'true' : 
        undefined,
      minSalary: req.query.minSalary ? 
        parseInt(req.query.minSalary as string) : 
        undefined,
      maxSalary: req.query.maxSalary ? 
        parseInt(req.query.maxSalary as string) : 
        undefined,
      categories: Array.isArray(req.query.categories) ? 
        req.query.categories as string[] : 
        req.query.categories ? [req.query.categories as string] : 
        undefined
    };

    console.log('Filters received:', filters);
    
    // Pass filters to service
    const { jobs, total } = await jobServices.getAllJobs(page, limit, filters);
    
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

const getLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('reached getLocations in job.controller.ts');
    const locations = await jobServices.getLocations();
    res.status(200).json(locations);
  } catch (error: Error | any) {
    res.status(500).json({ error: error.message });
  }
};
const getJobCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await jobServices.getJobCategories();
    res.status(200).json(categories);
  } catch (error: Error | any) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchJobsFromAPIs = async (req: Request, res: Response) => {
  console.log('fetchJobsFromAPIs called');
  try {
    const query = (req.query.query as string) || undefined;
    const location = (req.query.location as string) || undefined;
    const maxPages = req.query.maxPages
      ? parseInt(req.query.maxPages as string)
      : undefined;

    console.log('query', query);
    console.log('location', location);
    console.log('maxPages', maxPages);

    const jobs = await jobServices.fetchJobsFromAPIs(query, location, maxPages);

    res.status(200).json({
      message: 'Jobs fetched successfully.',
      jobs,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getAllJobs,
  scrapeJobs,
  getJobById,
  getNRecommendedJobs,
  getLocations,
  getJobCategories,
  fetchJobsFromAPIs,
};
