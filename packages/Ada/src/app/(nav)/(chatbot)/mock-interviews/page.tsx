'use client';

import chatServiceInstance from '@/api/chatService';
import jobServiceInstance from '@/api/jobService';
import { InterviewsTable } from '@/components/Mockinterviews/interviews-table';
import { JobCard } from '@/components/Mockinterviews/job-card';
import { Pagination } from '@/components/Mockinterviews/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

const ITEMS_PER_PAGE = 6;

interface Interview {
  id: number;
  jobTitle: string;
  company: string;
  date: string;
  status: 'Completed' | 'Ongoing';
  result?: 'Passed' | 'Failed' | 'Pending';
  children?: Interview[];
}

// Skeleton for Interviews Table
const TableSkeleton = () => (
  <div className="w-full space-y-3">
    {/* Header row */}
    <div className="hidden sm:flex w-full gap-4 p-4 bg-accent rounded-t-lg">
      <Skeleton className="h-5 w-[30%]" /> {/* Job Title */}
      <Skeleton className="h-5 w-[25%]" /> {/* Company */}
      <Skeleton className="h-5 w-[20%]" /> {/* Date */}
      <Skeleton className="h-5 w-[15%]" /> {/* Status */}
      <Skeleton className="h-5 w-[10%]" /> {/* Result */}
    </div>

    {/* Table rows */}
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full p-4 border rounded-lg"
      >
        <Skeleton className="h-5 w-full sm:w-[30%]" />
        <Skeleton className="h-5 w-full sm:w-[25%]" />
        <Skeleton className="h-5 w-full sm:w-[20%]" />
        <Skeleton className="h-5 w-full sm:w-[15%]" />
        <Skeleton className="h-5 w-full sm:w-[10%]" />
      </div>
    ))}
  </div>
);

// Skeleton for Job Cards
const JobGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
      <JobCard key={i} isLoading={true} />
    ))}
  </div>
);

export default function JobListingsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await chatServiceInstance.getInterviewsData();
        const { jobs: fetchedJobs, total } = await jobServiceInstance.getAllJobs(currentPage, ITEMS_PER_PAGE);

        setJobs(fetchedJobs);

        const formattedInterviews =
          result?.map((job: any) => ({
            id: job.job_id,
            jobTitle: job.job_title,
            company: job.job_company,
            status: job.statuses[0],
            children: job.interview_dates.map((date: any, index: number) => ({
              id: `${job.interview_ids[index]}`,
              jobTitle: job.job_title,
              company: job.job_company,
              date,
              status: job.statuses[index],
            })),
          })) || [];

        setInterviews(formattedInterviews);
        setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
      } catch (err) {
        setError('Failed to load job listings.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Give a mock interview now!
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto sm:mx-0">
          You need to have a resume uploaded and set as primary. Select a job
          below and get started with the interview.
        </p>
      </div>

      {/* Interviews Section */}
      <div className="my-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Your Interviews</h2>
        {loading ? (
          <TableSkeleton />
        ) : (
          <InterviewsTable interviews={interviews} />
        )}
      </div>

      {/* Job Listings Section */}
      <h1 className="text-2xl sm:text-3xl font-semibold my-8 text-center">
        Job Listings
      </h1>

      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="space-y-8">
          {loading ? (
            <JobGridSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job: any) => (
                <JobCard key={job.job_id} {...job} />
              ))}
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
