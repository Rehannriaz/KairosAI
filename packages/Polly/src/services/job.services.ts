import jobRepository from '../repositories/job.repository';
import { IJob } from '../models/job.model';
import { scrapingConfig } from '../config';

const getAllJobs = async (): Promise<IJob[]> => {
  return await jobRepository.findAllJobs();
};

const getJobById = async (id: string): Promise<IJob | null> => {
  return await jobRepository.findJobById(id);
}

const scrapeJobs = async (): Promise<any> =>  {
  let allJobs = [];
  let currentPage = 0;

  do {
    const url = `${scrapingConfig.baseUrl}?keywords=${encodeURIComponent(
      scrapingConfig.searchQuery
    )}&location=${encodeURIComponent(scrapingConfig.location)}&start=${
      currentPage * scrapingConfig.pagination.itemsPerPage
    }`;

    console.log(`Scraping page ${currentPage + 1}...`);

    const $ = await jobRepository.fetchJobListings(url);
    const jobListings:any[] = [];

    $(".jobs-search__results-list li").each((index, element) => {
      const $element = $(element);
      const listingUrl = $element.find("a.base-card__full-link").attr("href");

      jobListings.push({
        title: $element.find(".base-search-card__title").text().trim(),
        company: $element.find(".base-search-card__subtitle").text().trim(),
        location: $element.find(".job-search-card__location").text().trim(),
        listingUrl,
        companyLogo: $element.find(".artdeco-entity-image").attr("src"),
        postedDate: $element.find("time").text().trim(),
      });
    });

    for (let job of jobListings) {
      console.log(`Fetching details for job: ${job.title}...`);
      const $details = await jobRepository.fetchJobDetails(job.listingUrl);

      if ($details) {
        job.aboutRole = $details(".show-more-less-html__markup").html() || "Not specified";
        job.requirements = "Not specified"; // Add logic to parse
      } else {
        job.aboutRole = "Failed to fetch";
        job.requirements = "Failed to fetch";
      }

      allJobs.push(job);
    }

    currentPage++;

    if (
      !scrapingConfig.pagination.enabled ||
      currentPage >= scrapingConfig.pagination.maxPages
    ) {
      break;
    }
  } while (true);

  return allJobs;
}

export default {
  getAllJobs,
  scrapeJobs,
  getJobById,
};
