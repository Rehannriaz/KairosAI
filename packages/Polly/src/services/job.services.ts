import jobRepository from '../repositories/job.repository';
import { IJob } from '../models/job.model';
import { scrapingConfig } from '../config';
import { ErrorProps } from 'next/error';
import { UserJWT } from 'common/src/types/UserTypes';
import resumeRepository from '../repositories/resume.repository';
import { v4 as uuidv4 } from "uuid";
const getAllJobs = async (): Promise<IJob[]> => {
  return await jobRepository.findAllJobs();
};

const getJobById = async (id: string): Promise<IJob | null> => {
  return await jobRepository.findJobById(id);
};

const saveJobsInDb = async() => {
  try{
    console.log("here in savejobs");
  }catch(error:any){
    console.error('Error saving jobs:', error.message);
    throw error;
  }
}

const scrapeJobs = async (): Promise<void> => {
  let currentPage = 0;
  let allJobs: IJob[] = [];

  do {
    const url = `${scrapingConfig.baseUrl}?keywords=${encodeURIComponent(
      scrapingConfig.searchQuery
    )}&location=${encodeURIComponent(scrapingConfig.location)}&start=${
      currentPage * scrapingConfig.pagination.itemsPerPage
    }`;
    console.log(url);
    console.log(`Scraping page ${currentPage + 1}...`);

    const $ = await jobRepository.fetchJobListings(url);
    const jobListings: any[] = [];

    $(".jobs-search__results-list li").each((index:any, element:any) => {
      const $element = $(element);
      const listingUrl = $element.find("a.base-card__full-link").attr("href");
      const title = $element.find(".base-search-card__title").text().trim();
      const company = $element
        .find(".base-search-card__subtitle")
        .text()
        .trim();
      const location = $element
        .find(".job-search-card__location")
        .text()
        .trim();
      // const postedDate = $element.find("time").text().trim(); 
      const postedDate = Date.now(); 
      const salary =
        $element.find(".job-search-card__salary-info").text().trim() || parseInt("0");

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
          $details(".show-more-less-html__markup").html() || "Not specified";
        job.description =
          $details(".show-more-less-html__markup").text().trim() ||
          "No description available.";
        job.skills_required = $details(".job-criteria__list li")
          .map((_:any, el:any) => $(el).text().trim())
          .get()
          .join(", ");
      } else {
        job.aboutRole = "Failed to fetch";
        job.description = "Failed to fetch";
        job.skills_required = "Failed to fetch";
      }

      allJobs.push(job);
      console.log("alljobs-",allJobs);
      await jobRepository.saveJobInDb(job); // Save job to DB
    }

    currentPage++;

    if (
      !scrapingConfig.pagination.enabled ||
      currentPage >= scrapingConfig.pagination.maxPages
    ) {
      break;
    }
  } while (true);

  console.log(`Scraped ${allJobs.length} jobs and stored them in the database.`);
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
    if (limit > 5) {
      limitReached = true;
    }
    const resumeEmbeddings = await resumeRepository.getUserResumesEmbeddings(
      userObj.userId
    );
    const recommendedJobs = await jobRepository.getRecommendedJobs(
      resumeEmbeddings,
      limitReached ? 5 : limit
    );
    return recommendedJobs;
  } catch (error: any) {
    console.error('Error fetching recommended jobs:', error.message);
    throw new Error('Failed to fetch recommended jobs');
  }
};

export default {
  getAllJobs,
  scrapeJobs,
  getJobById,
  getNRecommendedJobs,
};
