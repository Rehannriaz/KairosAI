'use client';

import { useEffect, useState } from 'react';
import { InterviewsTable } from '@/components/Mockinterviews/interviews-table';
import { JobCard } from '@/components/Mockinterviews/job-card';
import { Pagination } from '@/components/Mockinterviews/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import jobServiceInstance from '@/api/jobService';

const ITEMS_PER_PAGE = 6;
interface Interview {
  id: number;
  jobTitle: string;
  company: string;
  date: string;
  status: 'Completed' | 'Ongoing' | 'Scheduled';
  result?: 'Passed' | 'Failed' | 'Pending';
  children?: Interview[];
}

// Updated dummy data for interviews
const interviews: Interview[] = [
  {
    id: 1,
    jobTitle: 'Frontend Developer',
    company: 'TechCorp',
    date: '2023-05-15',
    status: 'Completed' as const,
    result: 'Passed',
    children: [
      {
        id: 11,
        jobTitle: 'React Developer',
        company: 'TechCorp',
        date: '2023-05-16',
        status: 'Completed' as const,
        result: 'Passed',
      },
      {
        id: 12,
        jobTitle: 'Vue.js Developer',
        company: 'TechCorp',
        date: '2023-05-17',
        status: 'Scheduled' as const,
        result: 'Pending',
      },
    ],
  },
  {
    id: 2,
    jobTitle: 'Backend Engineer',
    company: 'DataSystems Inc.',
    date: '2023-05-18',
    status: 'Ongoing' as const,
    result: 'Pending',
  },
  {
    id: 3,
    jobTitle: 'Full Stack Developer',
    company: 'WebSolutions',
    date: '2023-05-20',
    status: 'Completed' as const,
    result: 'Failed',
    children: [
      {
        id: 31,
        jobTitle: 'Node.js Developer',
        company: 'WebSolutions',
        date: '2023-05-21',
        status: 'Scheduled' as const,
        result: 'Pending',
      },
    ],
  },
];
const TableSkeleton = () => (
  <div className="w-full space-y-3">
    {/* Header row */}
    <div className="flex w-full gap-4 p-4 bg-gray-50 rounded-t-lg">
      <Skeleton className="h-5 w-[30%]" /> {/* Job Title */}
      <Skeleton className="h-5 w-[25%]" /> {/* Company */}
      <Skeleton className="h-5 w-[20%]" /> {/* Date */}
      <Skeleton className="h-5 w-[15%]" /> {/* Status */}
      <Skeleton className="h-5 w-[10%]" /> {/* Result */}
    </div>

    {/* Table rows */}
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex w-full gap-4 p-4 border rounded-lg">
        <Skeleton className="h-6 w-[30%]" />
        <Skeleton className="h-6 w-[25%]" />
        <Skeleton className="h-6 w-[20%]" />
        <Skeleton className="h-6 w-[15%]" />
        <Skeleton className="h-6 w-[10%]" />
      </div>
    ))}
  </div>
);
// JobGridSkeleton component for the job cards grid
const JobGridSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const { jobs: fetchedJobs, total } =
          await jobServiceInstance.getAllJobs(currentPage, ITEMS_PER_PAGE);
        setJobs(fetchedJobs);
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
    <div className="container mx-auto py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Give a mock interview now!</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          You need to have a resume uploaded and set as primary. Select a job
          below and get started with the interview.
        </p>
      </div>

      <div className="my-8 space-y-4">
        <h2 className="text-2xl font-semibold">Your Interviews</h2>
        {loading ? (
          <TableSkeleton />
        ) : (
          <InterviewsTable interviews={interviews} />
        )}
      </div>

      <h1 className="text-3xl font-semibold my-8 text-center">Job Listings</h1>

      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="space-y-8">
          {loading ? (
            <JobGridSkeleton />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job: any) => (
                <JobCard key={job.id} {...job} />
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
