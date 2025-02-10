const axios = require("axios");
const cheerio = require("cheerio");

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const jobUrl = searchParams.get("url");

  if (!jobUrl) {
    return new Response(JSON.stringify({ error: "Missing job URL" }), {
      status: 400,
    });
  }

  try {
    const response = await axios.get(jobUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);

    // Extract job title and company
    const title =
      $(".top-card-layout__title").text().trim() || "No title found.";
    const company =
      $(".topcard__org-name-link").text().trim() || "No company found.";

    // Extract job description from the expanded section
    let description = [];
    $(".show-more-less-html__markup").each((_, element) => {
      description.push($(element).text().trim());
    });

    // Handle cases where description is truncated
    if (description.length === 0) {
      description.push("No description available.");
    }

    // Extract qualifications as a list
    let qualifications = [];
    $(".job-criteria__list li").each((_, element) => {
      const text = $(element).text().trim();
      if (text) {
        qualifications.push(text);
      }
    });

    // Handle missing qualifications
    if (qualifications.length === 0) {
      qualifications.push("No qualifications specified.");
    }

    return new Response(
      JSON.stringify({ title, company, description, qualifications }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching job details:", error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch job details" }), {
      status: 500,
    });
  }
}
