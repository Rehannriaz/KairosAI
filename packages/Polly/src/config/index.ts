require('dotenv').config();

const USERNAME = process.env.DB_USERNAME;

const PASSWORD = process.env.DB_PASSWORD;
const HOST = process.env.DB_HOST;
const DB = process.env.DB_NAME;
const DB_PORT = parseInt(process.env.DB_PORT || '');
const PORT = parseInt(process.env.PORT || '');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || '';
const ADZUNA_API_KEY = process.env.ADZUNA_API_KEY || '';
const GITHUB_JOBS_TOKEN = process.env.GITHUB_JOBS_TOKEN || '';

export { USERNAME, PASSWORD, HOST, DB, PORT, DB_PORT, OPENAI_API_KEY, ADZUNA_APP_ID, ADZUNA_API_KEY, GITHUB_JOBS_TOKEN };

export const scrapingConfig = {
  baseUrl: 'https://www.linkedin.com/jobs/search',
  outputFile: 'linkedin_jobs_detailed.json',
  searchQuery: 'software engineer',
  location: 'remote',
  pagination: {
    enabled: true,
    pageParam: 'start',
    maxPages: 3,
    itemsPerPage: 25,
  },
};
