import { ADZUNA_APP_ID, ADZUNA_API_KEY, GITHUB_JOBS_TOKEN } from '../config';
import { IJob } from '../models/job.model';
import jobRepository from '../repositories/job.repository';
import { getJobEmbedding, formatJobs } from './job.services';
import axios from 'axios';
import https from 'https';

/**
 * Fetches jobs from the Adzuna API
 * @param query The job search query
 * @param location The location to search in
 * @param page The page number
 * @param resultsPerPage Number of results per page
 */
const fetchAdzunaJobs = async (
  query: string,
  location: string = '',
  page: number = 1,
  country: string = 'nz',
  resultsPerPage: number = 50
): Promise<boolean> => {
  try {
    const queryParams = {
      app_id: ADZUNA_APP_ID,
      app_key: ADZUNA_API_KEY,
      'content-type': 'application/json',
      results_per_page: resultsPerPage.toString(),
      what: query,
      where: location ? encodeURIComponent(location) : '',
    };

    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`;

    console.log(`Fetching Adzuna jobs for query: ${query}, page: ${page}`);
    console.log('Adzuna URL:', url);
    console.log('Query Parameters:', queryParams);
    const httpsAgent = new https.Agent({
      family: 4,
      rejectUnauthorized: true, // Keep SSL verification
    });

    // Make the API call with query parameters
    const response = await axios.get(url, {
      params: queryParams,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      httpsAgent: httpsAgent,
      timeout: 10000,
    });
    const data = response.data;
    console.log('Adzuna response:', data);

    if (data && data.results) {
      const jobs = data.results;

      for (const job of jobs) {
        const avgSalary = (job.salary_min + job.salary_max) / 2;
        const formattedJob: Partial<IJob> = {
          title: job.title,
          company: job.company.display_name,
          location: job.location.display_name,
          listingUrl: job.redirect_url,
          postedDate: new Date(job.created),
          description: job.description,
          salary: avgSalary ? avgSalary : 0,
        };

        const enhancedJob = await formatJobs(formattedJob as IJob);

        const descriptionEmbedding = await getJobEmbedding(
          formattedJob.description || ''
        );

        if (descriptionEmbedding) {
          formattedJob.embedding = descriptionEmbedding;
        }

        formattedJob.description = enhancedJob.description;
        formattedJob.aboutRole = enhancedJob.aboutrole;
        formattedJob.requirements = enhancedJob.requirements;
        // formattedJob.skills_required = enhancedJob.skills_required;

        await jobRepository.saveJobInDb(formattedJob as IJob);
      }

      console.log(`Saved ${jobs.length} Adzuna jobs to database`);
      return true;
    }
    return false; // Return false if no jobs are processed
  } catch (error: any) {
    console.error('Error fetching Adzuna jobs:', error);
    throw new Error('Error fetching Adzuna jobs');
  }
};

/**
 * Fetches jobs from the GitHub Jobs API
 * @param query The job search query
 * @param location The location to search in
 * @param page The page number
 */
const fetchGithubJobs = async (
  query: string,
  location: string = '',
  page: number = 1
): Promise<void> => {
  try {
    const locationParam = location
      ? `&location=${encodeURIComponent(location)}`
      : '';
    const url = `https://jobs.github.com/positions.json?page=${page}&search=${encodeURIComponent(
      query
    )}${locationParam}`;

    console.log(`Fetching GitHub jobs for query: ${query}, page: ${page}`);
    const response = await axios.get(url, {
      headers: {
        Authorization: `token ${GITHUB_JOBS_TOKEN}`,
      },
    });

    if (response.data && Array.isArray(response.data)) {
      const jobs = response.data;

      for (const job of jobs) {
        // Transform GitHub job to match our schema
        const formattedJob: Partial<IJob> = {
          title: job.title,
          company: job.company,
          location: job.location,
          listingUrl: job.url,
          postedDate: new Date(job.created_at),
          description: job.description,
          salary: 0,
        };

        // Format the job to extract standardized fields
        const enhancedJob = await formatJobs(formattedJob as IJob);

        // Generate embedding for job
        const descriptionEmbedding = await getJobEmbedding(
          formattedJob.description || ''
        );

        if (descriptionEmbedding) {
          formattedJob.embedding = descriptionEmbedding;
        }

        // Apply formatted fields
        formattedJob.description = enhancedJob.description;
        formattedJob.aboutRole = enhancedJob.aboutrole;
        formattedJob.requirements = enhancedJob.requirements;
        // formattedJob.skills_required = enhancedJob.skills_required;

        // Save to database
        await jobRepository.saveJobInDb(formattedJob as IJob);
      }

      console.log(`Saved ${jobs.length} GitHub jobs to database`);
    }
  } catch (error: any) {
    console.error('Error fetching GitHub jobs:', error.message);
    throw error;
  }
};

/**
 * Fetches jobs from the Reed API
 * @param keywords The job search keywords
 * @param location The location to search in
 * @param page The page number
 */
const fetchReedJobs = async (
  keywords: string,
  location: string = '',
  page: number = 1
): Promise<void> => {
  try {
    const locationParam = location
      ? `&locationName=${encodeURIComponent(location)}`
      : '';
    const url = `https://www.reed.co.uk/api/1.0/search?keywords=${encodeURIComponent(
      keywords
    )}${locationParam}&resultsToTake=100&resultsToSkip=${(page - 1) * 100}`;

    console.log(`Fetching Reed jobs for keywords: ${keywords}, page: ${page}`);
    const response = await axios.get(url, {
      auth: {
        username: process.env.REED_API_KEY || '',
        password: '',
      },
    });

    if (response.data && response.data.results) {
      const jobs = response.data.results;

      for (const job of jobs) {
        // Transform Reed job to match our schema
        const avgSalary = (job.salary_min + job.salary_max) / 2;
        const formattedJob: Partial<IJob> = {
          title: job.jobTitle,
          company: job.employerName,
          location: job.locationName,
          listingUrl: job.jobUrl,
          postedDate: new Date(job.datePosted),
          description: job.jobDescription,
          salary: avgSalary ? avgSalary : 0,
        };

        // Format the job to extract standardized fields
        const enhancedJob = await formatJobs(formattedJob as IJob);

        // Generate embedding for job
        const descriptionEmbedding = await getJobEmbedding(
          formattedJob.description || ''
        );

        if (descriptionEmbedding) {
          formattedJob.embedding = descriptionEmbedding;
        }

        // Apply formatted fields
        formattedJob.description = enhancedJob.description;
        formattedJob.aboutRole = enhancedJob.aboutrole;
        formattedJob.requirements = enhancedJob.requirements;
        // formattedJob.skills_required = enhancedJob.skills_required;

        // Save to database
        await jobRepository.saveJobInDb(formattedJob as IJob);
      }

      console.log(`Saved ${jobs.length} Reed jobs to database`);
    }
  } catch (error: any) {
    console.error('Error fetching Reed jobs:', error.message);
    throw error;
  }
};

/**
 * Orchestrates job fetching from multiple sources
 * @param query The job search query
 * @param location The location to search in
 * @param maxPages Maximum number of pages to fetch per source
 */
const fetchJobsFromAllSources = async (
  query: string,
  location: string = '',
  maxPages: number = 1
): Promise<void> => {
  try {
    console.log(
      `Fetching jobs from all sources for query: ${query}, location: ${location}`
    );

    // Fetch jobs from multiple sources in parallel
    const fetchPromises = [];

    // Fetch jobs from Adzuna
    for (let page = 1; page <= maxPages; page++) {
      fetchPromises.push(await fetchAdzunaJobs(query, location, page));
    }

    // // Fetch jobs from GitHub Jobs
    // for (let page = 1; page <= maxPages; page++) {
    //   fetchPromises.push(fetchGithubJobs(query, location, page));
    // }

    // // Fetch jobs from Reed
    // for (let page = 1; page <= maxPages; page++) {
    //   fetchPromises.push(fetchReedJobs(query, location, page));
    // }

    // Wait for all fetches to complete
    await Promise.allSettled(fetchPromises);

    console.log('Completed fetching jobs from all sources');
  } catch (error: any) {
    console.error('Error fetching jobs from all sources:', error.message);
    throw error;
  }
};

export default {
  fetchAdzunaJobs,
  fetchGithubJobs,
  fetchReedJobs,
  fetchJobsFromAllSources,
};
