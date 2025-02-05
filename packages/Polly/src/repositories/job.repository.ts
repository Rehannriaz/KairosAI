import { pool } from '../utils/database'; // Use the pool from your database.ts
import { IJob } from '../models/job.model';

// Fetch all jobs
const findAllJobs = async (): Promise<IJob[]> => {
  const result = await pool.query('SELECT * FROM jobs');
  return result.rows;
};

const createJob = async (job: IJob): Promise<IJob> => {
  const result = await pool.query(
    'INSERT INTO jobs (title, company, location, listingUrl, postedDate, aboutRole, requirements, fullDescription, scrapedAt, salary ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
    [job.title, job.company, job.location, job.listingUrl, job.postedDate, job.aboutRole, job.requirements, job.fullDescription, job.scrapedAt, job.salary]
  );
  return result.rows[0];
}


export default {
  findAllJobs,
  createJob,
};
