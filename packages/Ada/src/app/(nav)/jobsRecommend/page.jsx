"use client";

import { useState } from "react";

export default function JobScraper() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    console.log("Fetching jobs...");
    setLoading(true);
    try {
      const response = await fetch("/api/scrape");
      if (!response.ok) throw new Error("Failed to fetch jobs");

      const data = await response.json();
      setJobs(data);
      console.log("Scraped Jobs:", data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={fetchJobs}
        className="p-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Scraping..." : "Scrape LinkedIn Jobs"}
      </button>

      {jobs.length > 0 && (
        <ul className="mt-4">
          {jobs.map((job, index) => (
            <li key={index} className="border p-2 mb-2">
              <a href={job.listingUrl} target="_blank" className="text-blue-600">
                {job.title} - {job.company} ({job.location})
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
