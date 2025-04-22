'use client';

import jobServiceInstance from '@/api/jobService';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table } from '@/components/ui/table';
import { Search, ListFilter, Grid, List } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';

type Job = {
  job_id: string;
  title: string;
  company: string;
  location: string;
  posteddate: string;
};

export default function RecommendationPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const router = useRouter();

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
    return () => abortController.abort();
  }, []);

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return (
          new Date(b.posteddate).getTime() - new Date(a.posteddate).getTime()
        );
      }
      if (sortBy === 'company') {
        return a.company.localeCompare(b.company);
      }
      return a.title.localeCompare(b.title);
    });
  }, [jobs, searchTerm, sortBy]);

  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-10 rounded" />
            <Skeleton className="h-10 w-10 rounded" />
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-6 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-4 w-1/3" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-lg shadow">
            <Table>
              <thead>
                <tr>
                  <th className="px-6 py-3">Job Title</th>
                  <th className="px-6 py-3">Company</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Posted Date</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="hover:bg-accent">
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-16" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Recommended Jobs</h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              placeholder="Search jobs..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <ListFilter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date Posted</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="title">Job Title</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid' ? 'bg-accent' : 'hover:bg-accent'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list' ? 'bg-accent' : 'hover:bg-accent'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className=" text-lg">No job recommendations available.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedJobs.map((job) => (
            <Card
              key={job.job_id}
              className="hover:shadow-white transition-shadow duration-200 cursor-pointer"
              onClick={() => handleJobClick(job.job_id)}
            >
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold line-clamp-2">
                    {job.title}
                  </h3>
                  <p className=" font-medium">{job.company}</p>
                </div>

                <div className="flex items-center gap-2 ">
                  <span>{job.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {new Date(job.posteddate).toLocaleDateString()}
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer">
                    View Details
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg shadow">
          <Table>
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Posted Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedJobs.map((job) => (
                <tr
                  key={job.job_id}
                  onClick={() => handleJobClick(job.job_id)}
                  className="hover:bg-accent cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium ">{job.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{job.company}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{job.location}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {new Date(job.posteddate).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
