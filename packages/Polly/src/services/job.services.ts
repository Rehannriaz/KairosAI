import jobRepository from '../repositories/job.repository';
import { IJob } from '../models/job.model';

const getAllJobs = async (): Promise<IJob[]> => {
  return await jobRepository.findAllJobs();
};

const createJob = async (job: IJob): Promise<IJob> => {
  return await jobRepository.createJob(job);
}

export default {
  getAllJobs,
  createJob,
};
