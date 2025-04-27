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

export {
  USERNAME,
  PASSWORD,
  HOST,
  DB,
  PORT,
  DB_PORT,
  OPENAI_API_KEY,
  ADZUNA_APP_ID,
  ADZUNA_API_KEY,
  GITHUB_JOBS_TOKEN,
};

export const scrapingConfig = {
  baseUrl: 'https://www.linkedin.com/jobs/search',
  outputFile: 'linkedin_jobs_detailed.json',
  searchQuery: '',
  location: '',
  pagination: {
    enabled: true,
    pageParam: 'start',
    maxPages: 3,
    itemsPerPage: 25,
  },
};

export const adzunaConfig = {
  baseUrl: 'https://api.adzuna.com/v1/api/jobs/nz/search',
  appId: process.env.ADZUNA_APP_ID,
  appKey: process.env.ADZUNA_API_KEY,
  resultsPerPage: 50,
  maxPages: 3,
  queries: [
    'software engineer',
    'data scientist',
    'product manager',
    'ux designer',
    'full stack developer',
    'backend developer',
    'frontend developer',
    'devops engineer',
    'mobile developer',
    'cloud engineer',
    'data analyst',
    'business analyst',
    'project manager',
    'cybersecurity analyst',
    'network engineer',
    'database administrator',
    'system administrator',
    'it support specialist',
    'web developer',
    'game developer',
    'machine learning engineer',
    'artificial intelligence engineer',
  ],
  locations: [
    '',
    'Sydney',
    'Melbourne',
    'Brisbane',
    'Perth',
    'Adelaide',
    'Canberra',
    'Hobart',
    'Darwin',
  ],
};
