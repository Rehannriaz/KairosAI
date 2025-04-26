// Use the pool from your database.ts
import { IJob } from '../models/job.model';
import { pool } from '../utils/database';
import axios from 'axios';

const cheerio = require('cheerio');
// Fetch all jobs
// const findAllJobs = async (
//   page: number,
//   limit: number,
//   filters: {
//     locations?: string[];
//     isRemote?: boolean | null;
//     minSalary?: number | null;
//     maxSalary?: number | null;
//     categories?: string[];
//   }
// ): Promise<{ jobs: IJob[]; total: number }> => {
//   console.log('filters in job.repository.ts in polly', filters);
//   try {
//     const offset = (page - 1) * limit;

//     // Get paginated jobs
//     const jobsResult = await pool.query(
//       `
//       SELECT job_id, title, company, location, salary, description, 
//              skills_required, listingurl, posteddate, aboutrole, requirements 
//       FROM jobs
//       ORDER BY posteddate DESC
//       LIMIT $1 OFFSET $2;
//       `,
//       [limit, offset]
//     );

//     // Get total job count
//     const countResult = await pool.query(`SELECT COUNT(*) FROM jobs;`);
//     const total = parseInt(countResult.rows[0].count, 10);

//     return { jobs: jobsResult.rows, total };
//   } catch (error: any) {
//     console.error('Error fetching jobs:', error.message);
//     throw error;
//   }
// };

const findAllJobs = async (
  page: number,
  limit: number,
  filters: {
    locations?: string[];
    isRemote?: boolean | null;
    minSalary?: number | null;
    maxSalary?: number | null;
    categories?: string[];
  }
): Promise<{ jobs: IJob[]; total: number }> => {
  console.log('filters in job.repository.ts', filters);
  
  try {
    const offset = (page - 1) * limit;
    const queryParams: (number | string)[] = [];
    let paramCounter = 1; // Start from $1

    let whereConditions: string[] = [];

    // Location filter
    if (filters.locations && filters.locations.length > 0) {
      const placeholders = filters.locations.map(() => `$${paramCounter++}`).join(', ');
      whereConditions.push(`location IN (${placeholders})`);
      queryParams.push(...filters.locations);
    }

    // Remote filter
    if (filters.isRemote === true) {
      whereConditions.push(`location ILIKE '%Remote%'`);
    } else if (filters.isRemote === false) {
      whereConditions.push(`location NOT ILIKE '%Remote%'`);
    }

    // Salary filters
    if (filters.minSalary !== undefined && filters.minSalary !== null) {
      whereConditions.push(`salary >= $${paramCounter++}`);
      queryParams.push(Number(filters.minSalary)); // Force to number
    }
    if (filters.maxSalary !== undefined && filters.maxSalary !== null) {
      whereConditions.push(`salary <= $${paramCounter++}`);
      queryParams.push(Number(filters.maxSalary)); // Force to number
    }

    // Categories filter
    if (filters.categories && filters.categories.length > 0) {
      const categorySubConditions: string[] = [];
      for (const category of filters.categories) {
        categorySubConditions.push(`description ILIKE $${paramCounter} OR skills_required ILIKE $${paramCounter + 1}`);
        queryParams.push(`%${category}%`, `%${category}%`);
        paramCounter += 2;
      }
      whereConditions.push(`(${categorySubConditions.join(' OR ')})`);
    }

    // Build the final query
    let baseQuery = `
      SELECT job_id, title, company, location, salary, description, 
             skills_required, listingurl, posteddate, aboutrole, requirements 
      FROM jobs
    `;
    
    if (whereConditions.length > 0) {
      baseQuery += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    const finalQuery = `
      ${baseQuery}
      ORDER BY posteddate DESC
      LIMIT $${paramCounter} OFFSET $${paramCounter + 1};
    `;

    queryParams.push(limit, offset);

    const jobsResult = await pool.query(finalQuery, queryParams);

    // Count query
    const countQuery = `
      SELECT COUNT(*) FROM jobs
      ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
    `;

    const countResult = await pool.query(countQuery, queryParams.slice(0, paramCounter - 1)); // Only filters, not limit/offset
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
    console.log('FINAL', JSON.parse(embeddings));

    const result = await pool.query(
      `SELECT job_id, title, company, location, salary, description, 
              skills_required, listingurl, posteddate, aboutrole, requirements
       FROM jobs 
       ORDER BY embedding <-> $1 
       LIMIT $2`,
      [JSON.parse(embeddings), limit]
    );
    // console.log('here123', result.rows);
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
