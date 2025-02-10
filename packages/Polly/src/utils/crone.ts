import cron from "node-cron";
import jobService from "../services/job.services";

const startJobScraper = () => {
  cron.schedule("* * * * *", async () => {
    console.log("Running job scraper cron job...");
    try {
      await jobService.scrapeJobs();
    } catch (error) {
      console.error("Error running job scraper:", error);
    }
  });

  console.log("Job scraping cron job scheduled to run every 1 hour.");
};

export default startJobScraper;
