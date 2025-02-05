import { pool } from '../utils/database'; // Use the pool from your database.ts
import { IJob } from '../models/job.model';
import axios from 'axios'
import cheerio from 'cheerio'
// Fetch all jobs
const findAllJobs = async (): Promise<IJob[]> => {
  try{
    const result = await pool.query('SELECT * FROM jobs;');
    return result.rows;
  
  }catch(error: any){
    console.error('Error fetching jobs:', error.message);
    throw error;
  }
};

const findJobById = async (id: string): Promise<IJob | null> => {
  try {
    const result = await pool.query('SELECT * FROM jobs WHERE job_id = $1', [id]);
    return result.rows[0];
  } catch (error: any) {
    console.error('Error fetching job:', error.message);
    throw error;
  }
};

const scrapeJobs = async (job: IJob): Promise<IJob> => {
  const result = await pool.query(
    'INSERT INTO jobs (title, company, location, listingUrl, postedDate, aboutRole, requirements, fullDescription, scrapedAt, salary ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
    [job.title, job.company, job.location, job.listingUrl, job.postedDate, job.aboutRole, job.requirements, job.fullDescription, job.scrapedAt, job.salary]
  );
  return result.rows[0];
}


async function fetchJobListings(url:string) {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
      },
      timeout: 5000,
    });

    return cheerio.load(response.data);
  } catch (error:any) {
    console.error("Error fetching job listings:", error.message);
    throw error;
  }
}

async function fetchJobDetails(url:string) {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
      },
      timeout: 5000,
    });

    return cheerio.load(response.data);
  } catch (error:any) {
    console.error(`Error fetching job details for ${url}:`, error.message);
    return null;
  }
}




export default {
  findAllJobs,
  findJobById,
  scrapeJobs,
  fetchJobListings,
  fetchJobDetails
};
