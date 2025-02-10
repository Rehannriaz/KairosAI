'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import jobServiceInstance from '@/api/jobService'
import { Card } from '@shadcn/ui';  // Ensure this is correct

export default function RecommendationPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobServiceInstance.getRecommendedJobs();
        setJobs(response);
        console.log("jobs:", response);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Recommended Jobs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job, index) => (
          <Link key={index} href={`/jobs/${job.id}`} passHref>
            <Card className="shadow-md p-4">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-gray-500">{job.location}</p>
              <p className="text-sm text-gray-400">{new Date(job.postedDate).toLocaleDateString()}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
