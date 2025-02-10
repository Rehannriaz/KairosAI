const axios = require("axios");
const cheerio = require("cheerio");

export async function GET(req) {
  console.log("reached");
  const url = `https://www.linkedin.com/jobs/search?keywords=software+developer&location=remote`;

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    console.log("API Response Data:", response.data);

    console.log("API Response Status:", response.status);
    if (response.status !== 200) {
      return new Response(JSON.stringify({ error: "Failed to fetch jobs" }), {
        status: response.status,
      });
    }

    const $ = cheerio.load(response.data);
    let allJobs = [];

    $(".jobs-search__results-list li").each((index, element) => {
      const title = $(element).find(".base-search-card__title").text().trim();
      const company = $(element).find(".base-search-card__subtitle").text().trim();
      const location = $(element).find(".job-search-card__location").text().trim();
      const listingUrl = $(element).find("a.base-card__full-link").attr("href");

      if (title && company && location && listingUrl) {
        allJobs.push({ title, company, location, listingUrl });
      }
    });

    return new Response(JSON.stringify(allJobs), { status: 200 });
  } catch (error) {
    console.error("Scraping error:", error.message);
    return new Response(JSON.stringify({ error: "Failed to scrape jobs", details: error.message }), {
      status: 500,
    });
  }
}
