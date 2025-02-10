import { pool } from '../utils/database'; // Use the pool from your database.ts
import { IJob } from '../models/job.model';
import axios from 'axios';
const cheerio = require('cheerio');
// Fetch all jobs
const findAllJobs = async (
  page: number,
  limit: number
): Promise<{ jobs: IJob[]; total: number }> => {
  try {
    const offset = (page - 1) * limit;

    // Get paginated jobs
    const jobsResult = await pool.query(
      `
      SELECT job_id, title, company, location, salary, description, 
             skills_required, listingurl, posteddate, aboutrole, requirements 
      FROM jobs
      ORDER BY posteddate DESC
      LIMIT $1 OFFSET $2;
      `,
      [limit, offset]
    );

    // Get total job count
    const countResult = await pool.query(`SELECT COUNT(*) FROM jobs;`);
    const total = parseInt(countResult.rows[0].count, 10);

    return { jobs: jobsResult.rows, total };
  } catch (error: any) {
    console.error('Error fetching jobs:', error.message);
    throw error;
  }
};

const findJobById = async (id: string): Promise<IJob | null> => {
  try {
    const result = await pool.query('SELECT * FROM jobs WHERE job_id = $1', [
      id,
    ]);
    return result.rows[0];
  } catch (error: any) {
    console.error('Error fetching job:', error.message);
    throw error;
  }
};

const saveJobInDb = async (job: IJob): Promise<IJob> => {
  console.log('SAVING \n\n\n\n\n', job);
  try {
    const result = await pool.query(
      'INSERT INTO jobs (title, company, location, listingurl, posteddate, aboutrole, requirements, description, salary, embedding) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [
        job.title,
        job.company,
        job.location,
        job.listingUrl,
        new Date(job.postedDate), // Convert to proper Date object
        job.aboutRole,
        JSON.stringify(job.requirements),
        job.description,
        job.salary,
        JSON.stringify(job.embedding), // Convert JSON to string for jsonb
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error saving job to the database:', error);
    throw new Error('Failed to save job to the database');
  }
};

async function fetchJobListings(url: string) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
      },
      timeout: 5000,
    });

    return cheerio.load(response.data);
  } catch (error: any) {
    console.error('Error fetching job listings:', error.message);
    throw error;
  }
}

async function fetchJobDetails(url: string) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
      },
      timeout: 5000,
    });

    return cheerio.load(response.data);
  } catch (error: any) {
    console.error(`Error fetching job details for ${url}:`, error.message);
    return null;
  }
}

const getRecommendedJobs = async (
  embeddings: any,
  limit: number
): Promise<IJob[]> => {
  try {
    console.log('FINAL');
    const result = await pool.query(
      `SELECT job_id, title, company, location, salary, description, 
              skills_required, listingurl, posteddate, aboutrole, requirements
       FROM jobs 
       ORDER BY embedding <-> $1 
       LIMIT $2`,
      [JSON.stringify(embeddings), limit]
    );
    console.log('here123', result.rows);
    return result.rows;
  } catch (error: any) {
    // console.error('Error fetching recommended jobs:', error.message);
    throw error;
  }
};

export default {
  findAllJobs,
  findJobById,
  saveJobInDb,
  fetchJobListings,
  fetchJobDetails,
  getRecommendedJobs,
};
