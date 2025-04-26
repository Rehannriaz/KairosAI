import { scrapingConfig } from '../config';
import { OPENAI_API_KEY } from '../config';
import { IJob } from '../models/job.model';
import jobRepository from '../repositories/job.repository';
import resumeRepository from '../repositories/resume.repository';
import jobApiService from './job-api.services';
import jobApiServices from './job-api.services';
import { OpenAIEmbeddings } from '@langchain/openai';
import { UserJWT } from 'common/src/types/UserTypes';
import OpenAI from 'openai';

const openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });

export const getJobEmbedding = async (text: string) => {
  try {
    const embeddingsModel = new OpenAIEmbeddings({ apiKey: OPENAI_API_KEY });
    // Generate embeddings for the job description
    const embeddings = await embeddingsModel.embedQuery(text);
    return embeddings;
  } catch (error) {
    console.error('Error generating job embedding:', error);
    return null;
  }
};

export const formatJobs = async (job: IJob) => {
  try {
    const prompt = `Given the following job details, generate structured data in JSON format following this schema:
    {
      "description": "A complete summary of the role, responsibilities, and expectations. Remove redundant information and focus only on job-relevant details.",
      "skills_required": "A structured list of all technical and soft skills required for the role. Include programming languages, frameworks, tools, methodologies, and domain-specific expertise explicitly mentioned in the posting.",
      "aboutrole": "A high-level summary that provides an overview of the job, including its purpose, significance, and general expectations. This should be written in a way that makes it clear to potential candidates what the role entails at a broader level.",
      "requirements": "Specific job requirements listed separately, such as years of experience, degrees, certifications, or other qualifications explicitly mentioned."
    }
    
    ### Guidelines:
    - **Remove HTML tags and unnecessary formatting.** Extract only meaningful content.
    - **Ensure clarity and conciseness.** Avoid excessive repetition or promotional content (e.g., company mission statements).
    - **Keep lists properly formatted.** Use bullet points where necessary for readability.
    - **Preserve important technical details.** Ensure that programming languages, frameworks, databases, and methodologies are clearly mentioned.
    - **Exclude benefits, company description, and application process.** Only focus on job-related content.
    - **Standardize outputs.** Ensure consistency in formatting and structure across different job postings.
    
    Ensure the JSON follows the schema exactly.
    
    Job details:
    - Title: ${job.title}
    - Company: ${job.company}
    - Location: ${job.location}
    - Description: ${job.description}
    `;

    const response: any = await openaiClient.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a job data formatter.' },
        { role: 'user', content: prompt },
      ],
    });

    const responseText = response.choices[0].message.content || '{}';
    const jsonMatch = responseText.match(/```json([\s\S]*?)```/);
    const cleanJson = jsonMatch ? jsonMatch[1].trim() : responseText;
    const parsedJson = JSON.parse(cleanJson);
    return {
      ...parsedJson,
    };
  } catch (error: any) {
    console.error('Error formatting jobs:', error.message);
    throw error;
  }
};

const getAllJobs = async (
  page: number,
  limit: number
): Promise<{ jobs: IJob[]; total: number }> => {
  return await jobRepository.findAllJobs(page, limit);
};

const getJobById = async (id: string): Promise<IJob | null> => {
  return await jobRepository.findJobById(id);
};

const scrapeJobs = async (): Promise<void> => {
  let currentPage = 0;
  let allJobs: IJob[] = [];

  do {
    const url = `${scrapingConfig.baseUrl}?keywords=${encodeURIComponent(
      scrapingConfig.searchQuery
    )}&location=${encodeURIComponent(scrapingConfig.location)}&start=${
      currentPage * scrapingConfig.pagination.itemsPerPage
    }`;
    console.log(`Scraping page ${currentPage + 1}...`);
    console.log('url', url);
    const $ = await jobRepository.fetchJobListings(url);
    const jobListings: any[] = [];

    $('.jobs-search__results-list li').each((index: any, element: any) => {
      const $element = $(element);
      const listingUrl = $element.find('a.base-card__full-link').attr('href');
      const title = $element.find('.base-search-card__title').text().trim();

      // Skip job if title contains "*"
      if (title.includes('*')) {
        return;
      }

      const company = $element
        .find('.base-search-card__subtitle')
        .text()
        .trim();
      const location = $element
        .find('.job-search-card__location')
        .text()
        .trim();
      // const postedDate = $element.find("time").text().trim();
      const postedDate = Date.now();
      const salary =
        $element.find('.job-search-card__salary-info').text().trim() ||
        parseInt('0');

      if (listingUrl) {
        jobListings.push({
          title,
          company,
          location,
          salary,
          listingUrl,
          postedDate,
        });
      }
    });

    for (let job of jobListings) {
      console.log(`Fetching details for job: ${job.title}...`);
      const $details = await jobRepository.fetchJobDetails(job.listingUrl);

      if ($details) {
        job.aboutRole =
          $details('.show-more-less-html__markup').html() || 'Not specified';
        job.description =
          $details('.show-more-less-html__markup').text().trim() ||
          'No description available.';
        job.skills_required = $details('.job-criteria__list li')
          .map((_: any, el: any) => $(el).text().trim())
          .get()
          .join(', ');
      } else {
        job.aboutRole = 'Failed to fetch';
        job.description = 'Failed to fetch';
        job.skills_required = 'Failed to fetch';
      }
      const formattedJobs = await formatJobs(job);
      console.log('formattedJobs', formattedJobs);
      const descriptionEmbedding = await getJobEmbedding(job.description);

      if (descriptionEmbedding) {
        job.embedding = descriptionEmbedding; // Store the embeddings in the job object
      }

      job.description = formattedJobs.description;
      job.aboutRole = formattedJobs.aboutrole;
      job.requirements = formattedJobs.requirements;
      job.skills_required = formattedJobs.skills_required;

      allJobs.push(job);

      // Save job to DB only if it didn't contain "*"
      await jobRepository.saveJobInDb(job);
    }

    currentPage++;

    if (
      !scrapingConfig.pagination.enabled ||
      currentPage >= scrapingConfig.pagination.maxPages
    ) {
      break;
    }
  } while (true);

  console.log(
    `Scraped ${allJobs.length} jobs and stored them in the database.`
  );
};

const fetchJobsFromAPIs = async (
  query: string = scrapingConfig.searchQuery,
  location: string = scrapingConfig.location,
  maxPages: number = 2
): Promise<void> => {
  try {
    await jobApiServices.fetchAdzunaJobs(query, location, maxPages);
    // return await jobApiService.fetchJobsFromAllSources(query, location, maxPages);
  } catch (error) {
    console.error('Error fetching jobs from APIs:', error);
    throw error;
  }
};

const fetchAllJobSources = async (
  query: string = scrapingConfig.searchQuery,
  location: string = scrapingConfig.location,
  maxPages: number = scrapingConfig.pagination.maxPages
): Promise<void> => {
  // Run LinkedIn scraping and API fetches in parallel
  await Promise.all([
    scrapeJobs(),
    fetchJobsFromAPIs(query, location, maxPages),
  ]);

  console.log('All job sources fetched successfully');
};

const getNRecommendedJobs = async (
  limit: number,
  userObj: UserJWT
): Promise<any> => {
  try {
    let limitReached = false;
    if (limit <= 0) {
      throw new Error('Invalid limit');
    }
    if (limit > 10) {
      limitReached = true;
    }
    const resumeEmbeddings = await resumeRepository.getUserResumesEmbeddings(
      userObj.userId
    );
    console.log('TEST');

    const recommendedJobs = await jobRepository.getRecommendedJobs(
      JSON.stringify(resumeEmbeddings[0].embedding),
      limitReached ? 5 : limit
    );
    return recommendedJobs;
  } catch (error: any) {
    console.error('Error fetching recommended jobs:', error.message);
    throw new Error('Failed to fetch recommended jobs');
  }
};

const searchJobs = async (
  query: string,
  location: string = '',
  page: number = 1,
  limit: number = 10
): Promise<{ jobs: IJob[]; total: number }> => {
  try {
    return await jobRepository.searchJobs(query, location, page, limit);
  } catch (error: any) {
    console.error('Error searching jobs:', error.message);
    throw new Error('Failed to search jobs');
  }
};

export default {
  getAllJobs,
  scrapeJobs,
  getJobById,
  getNRecommendedJobs,
  fetchJobsFromAPIs,
  fetchAllJobSources,
  searchJobs,
};
