// Use the pool from your database.ts
import { IJob } from '../models/job.model';
import { pool } from '../utils/database';
import axios from 'axios';

const cheerio = require('cheerio');

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
      const categoryConditions: string[] = [];
      
      // For each category, build a specific condition based on title patterns
      for (const category of filters.categories) {
        let categoryCondition = '';
        
        switch(category) {
          case 'Software Engineer':
            categoryCondition = `(title ILIKE '%software engineer%' OR title ILIKE '%software developer%')`;
            break;
          case 'Data Science':
            categoryCondition = `(title ILIKE '%data scientist%' OR title ILIKE '%data analyst%' OR title ILIKE '%data engineer%' OR title ILIKE '%data science%')`;
            break;
          case 'Frontend Developer':
            categoryCondition = `(title ILIKE '%frontend%' OR title ILIKE '%front end%' OR title ILIKE '%ui developer%')`;
            break;
          case 'Backend Developer':
            categoryCondition = `(title ILIKE '%backend%' OR title ILIKE '%back end%' OR title ILIKE '%api developer%')`;
            break;
          case 'Full Stack Developer':
            categoryCondition = `(title ILIKE '%full stack%' OR title ILIKE '%fullstack%')`;
            break;
          case 'DevOps':
            categoryCondition = `(title ILIKE '%devops%' OR title ILIKE '%site reliability%' OR title ILIKE '%platform engineer%')`;
            break;
          case 'UX/UI Design':
            categoryCondition = `(title ILIKE '%ux%' OR title ILIKE '%ui%' OR title ILIKE '%user experience%' OR title ILIKE '%user interface%' OR title ILIKE '%product designer%')`;
            break;
          case 'Product Management':
            categoryCondition = `(title ILIKE '%product manager%' OR title ILIKE '%product owner%')`;
            break;
          // Add other categories as needed based on your comprehensive categorization
          default:
            // For other categories, search in description and skills_required (fallback)
            categoryCondition = `(description ILIKE $${paramCounter} OR skills_required ILIKE $${paramCounter} OR title ILIKE $${paramCounter})`;
            queryParams.push(`%${category}%`);
            paramCounter++;
            break;
        }
        
        categoryConditions.push(categoryCondition);
      }
      
      whereConditions.push(`(${categoryConditions.join(' OR ')})`);
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
      LIMIT $${paramCounter++} OFFSET $${paramCounter++};
    `;

    queryParams.push(limit, offset);

    const jobsResult = await pool.query(finalQuery, queryParams);

    // Count query
    const countQuery = `
      SELECT COUNT(*) FROM jobs
      ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
    `;

    const countResult = await pool.query(countQuery, queryParams.slice(0, paramCounter - 3)); // Only filters, not limit/offset
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
const getLocations = async (): Promise<string[]> => {
  try {
    const result = await pool.query('SELECT DISTINCT location FROM jobs WHERE location IS NOT NULL');
    return result.rows.map((row) => row.location);
  } catch (error: any) {
    console.error('Error fetching locations:', error.message);
    throw error;
  }
};
const getJobCategories = async (): Promise<string[]> => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT
        CASE 
          -- Tech & Software Development
          WHEN title ILIKE '%software engineer%' OR title ILIKE '%software developer%' THEN 'Software Engineer'
          WHEN title ILIKE '%data scientist%' OR title ILIKE '%data analyst%' OR title ILIKE '%data engineer%' OR title ILIKE '%data science%' THEN 'Data Science'
          WHEN title ILIKE '%machine learning%' OR title ILIKE '%ai engineer%' OR title ILIKE '%artificial intelligence%' THEN 'AI & Machine Learning'
          WHEN title ILIKE '%devops%' OR title ILIKE '%site reliability%' OR title ILIKE '%platform engineer%' THEN 'DevOps'
          WHEN title ILIKE '%qa%' OR title ILIKE '%quality assurance%' OR title ILIKE '%test engineer%' THEN 'QA Engineer'
          WHEN title ILIKE '%full stack%' OR title ILIKE '%fullstack%' THEN 'Full Stack Developer'
          WHEN title ILIKE '%frontend%' OR title ILIKE '%front end%' OR title ILIKE '%ui developer%' THEN 'Frontend Developer'
          WHEN title ILIKE '%backend%' OR title ILIKE '%back end%' OR title ILIKE '%api developer%' THEN 'Backend Developer'
          WHEN title ILIKE '%cloud%' OR title ILIKE '%aws%' OR title ILIKE '%azure%' OR title ILIKE '%gcp%' THEN 'Cloud Engineering'
          WHEN title ILIKE '%security%' OR title ILIKE '%cybersecurity%' OR title ILIKE '%infosec%' THEN 'Cybersecurity'
          WHEN title ILIKE '%mobile%' OR title ILIKE '%ios%' OR title ILIKE '%android%' THEN 'Mobile Development'
          WHEN title ILIKE '%database%' OR title ILIKE '%sql%' OR title ILIKE '%dba%' THEN 'Database Administration'
          WHEN title ILIKE '%network%' OR title ILIKE '%systems administrator%' OR title ILIKE '%infrastructure%' THEN 'IT & Networking'
          
          -- Design & Creative
          WHEN title ILIKE '%ux%' OR title ILIKE '%ui%' OR title ILIKE '%user experience%' OR title ILIKE '%user interface%' OR title ILIKE '%product designer%' THEN 'UX/UI Design'
          WHEN title ILIKE '%graphic designer%' OR title ILIKE '%visual designer%' OR title ILIKE '%creative design%' THEN 'Graphic Design'
          WHEN title ILIKE '%content writer%' OR title ILIKE '%copywriter%' OR title ILIKE '%editor%' THEN 'Content & Copywriting'
          WHEN title ILIKE '%marketing designer%' OR title ILIKE '%brand designer%' THEN 'Brand & Marketing Design'
          
          -- Management & Leadership
          WHEN title ILIKE '%product manager%' OR title ILIKE '%product owner%' THEN 'Product Management'
          WHEN title ILIKE '%project manager%' OR title ILIKE '%program manager%' THEN 'Project Management'
          WHEN title ILIKE '%cto%' OR title ILIKE '%technical director%' OR title ILIKE '%vp of engineering%' THEN 'Technical Leadership'
          WHEN title ILIKE '%engineering manager%' THEN 'Engineering Management'
          WHEN title ILIKE '%ceo%' OR title ILIKE '%coo%' OR title ILIKE '%chief%' THEN 'Executive'
          WHEN title ILIKE '%director%' AND NOT title ILIKE '%art director%' THEN 'Director'
          WHEN title ILIKE '%manager%' AND NOT (title ILIKE '%software%' OR title ILIKE '%product%' OR title ILIKE '%project%') THEN 'Management'
          
          -- Marketing & Sales
          WHEN title ILIKE '%marketing%' OR title ILIKE '%growth%' OR title ILIKE '%seo%' OR title ILIKE '%social media%' THEN 'Marketing'
          WHEN title ILIKE '%sales%' OR title ILIKE '%account executive%' OR title ILIKE '%business development%' THEN 'Sales'
          WHEN title ILIKE '%customer success%' OR title ILIKE '%account manager%' OR title ILIKE '%customer support%' THEN 'Customer Success'
          
          -- Healthcare
          WHEN title ILIKE '%nurse%' OR title ILIKE '%rn%' OR title ILIKE '%lpn%' OR title ILIKE '%nursing%' THEN 'Nursing'
          WHEN title ILIKE '%doctor%' OR title ILIKE '%physician%' OR title ILIKE '%md%' THEN 'Physician'
          WHEN title ILIKE '%therapist%' OR title ILIKE '%physical therapy%' OR title ILIKE '%occupational therapy%' THEN 'Therapy'
          WHEN title ILIKE '%dental%' OR title ILIKE '%dentist%' THEN 'Dental'
          WHEN title ILIKE '%pharmacist%' OR title ILIKE '%pharmacy%' THEN 'Pharmacy'
          WHEN title ILIKE '%health%' AND NOT (title ILIKE '%software%' OR title ILIKE '%data%') THEN 'Healthcare'
          
          -- Finance & Accounting
          WHEN title ILIKE '%accountant%' OR title ILIKE '%accounting%' OR title ILIKE '%bookkeeper%' THEN 'Accounting'
          WHEN title ILIKE '%financial analyst%' OR title ILIKE '%finance manager%' THEN 'Finance'
          WHEN title ILIKE '%investment%' OR title ILIKE '%wealth management%' OR title ILIKE '%portfolio%' THEN 'Investment'
          WHEN title ILIKE '%actuary%' OR title ILIKE '%underwriter%' OR title ILIKE '%insurance%' THEN 'Insurance & Risk'
          WHEN title ILIKE '%tax%' OR title ILIKE '%auditor%' THEN 'Tax & Audit'
          
          -- Legal
          WHEN title ILIKE '%attorney%' OR title ILIKE '%lawyer%' OR title ILIKE '%paralegal%' OR title ILIKE '%legal%' THEN 'Legal'
          
          -- Education
          WHEN title ILIKE '%teacher%' OR title ILIKE '%professor%' OR title ILIKE '%tutor%' OR title ILIKE '%instructor%' THEN 'Education'
          
          -- Trades & Services
          WHEN title ILIKE '%mechanic%' OR title ILIKE '%technician%' OR title ILIKE '%repair%' THEN 'Mechanical & Technical'
          WHEN title ILIKE '%forklift%' OR title ILIKE '%warehouse%' OR title ILIKE '%inventory%' THEN 'Warehouse & Logistics'
          WHEN title ILIKE '%driver%' OR title ILIKE '%delivery%' OR title ILIKE '%chauffeur%' OR title ILIKE '%truck%' THEN 'Driving & Transportation'
          WHEN title ILIKE '%chef%' OR title ILIKE '%cook%' OR title ILIKE '%kitchen%' OR title ILIKE '%culinary%' THEN 'Culinary'
          WHEN title ILIKE '%construction%' OR title ILIKE '%builder%' OR title ILIKE '%contractor%' THEN 'Construction'
          WHEN title ILIKE '%electrician%' OR title ILIKE '%plumber%' OR title ILIKE '%hvac%' THEN 'Skilled Trades'
          
          -- Retail & Hospitality
          WHEN title ILIKE '%retail%' OR title ILIKE '%sales associate%' OR title ILIKE '%cashier%' THEN 'Retail'
          WHEN title ILIKE '%hospitality%' OR title ILIKE '%hotel%' OR title ILIKE '%restaurant%' THEN 'Hospitality'
          WHEN title ILIKE '%barista%' OR title ILIKE '%server%' OR title ILIKE '%bartender%' THEN 'Food Service'
          
          -- Human Resources
          WHEN title ILIKE '%hr%' OR title ILIKE '%human resources%' OR title ILIKE '%recruiter%' OR title ILIKE '%talent%' THEN 'Human Resources'
          
          -- Science & Research
          WHEN title ILIKE '%scientist%' AND NOT title ILIKE '%data scientist%' THEN 'Science & Research'
          WHEN title ILIKE '%research%' AND NOT (title ILIKE '%market research%' OR title ILIKE '%data%') THEN 'Science & Research'
          WHEN title ILIKE '%lab%' OR title ILIKE '%laboratory%' THEN 'Laboratory'
          
          -- Administrative
          WHEN title ILIKE '%administrative%' OR title ILIKE '%admin%' OR title ILIKE '%office%' OR title ILIKE '%receptionist%' OR title ILIKE '%secretary%' THEN 'Administrative'
          
          -- Other categories
          WHEN title ILIKE '%analyst%' AND NOT (title ILIKE '%data%' OR title ILIKE '%financial%') THEN 'Business Analysis'
          WHEN title ILIKE '%consultant%' OR title ILIKE '%consulting%' THEN 'Consulting'
          WHEN title ILIKE '%coordinator%' THEN 'Coordination'
          WHEN title ILIKE '%specialist%' THEN 'Specialist'
          
          ELSE 'Other'
        END AS category
      FROM jobs
      WHERE title IS NOT NULL
      ORDER BY category
    `);
    
    return result.rows.map((row) => row.category);
  } catch (error: any) {
    console.error('Error fetching job categories:', error.message);
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
  getLocations,
  getJobCategories,
};
