'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import jobServiceInstance from '@/api/jobService';
import { Spin, Skeleton } from 'antd';
import { Card } from '@/components/ui/card';  // Ensure this is correct

export default function RecommendationPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true); // Default to true since data is loading

  useEffect(() => {
    const abortController = new AbortController();

    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await jobServiceInstance.getRecommendedJobs();
        if (!abortController.signal.aborted) {
          setJobs(response);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Error fetching jobs:', error);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchJobs();

    return () => {
      abortController.abort(); // Cleanup on unmount
    };
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Recommended Jobs</h1>
      {loading ? (
        <Skeleton />
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <Link key={job.job_id} href={`/jobs/${job.job_id}`} passHref>
              <Card className="shadow-md p-4 cursor-pointer">
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-gray-500">{job.location}</p>
                <p className="text-sm text-gray-400">
                  {job.posteddate ? new Date(job.posteddate).toLocaleDateString() : "N/A"}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No job recommendations available.</p>
      )}
    </div>
  );
}
