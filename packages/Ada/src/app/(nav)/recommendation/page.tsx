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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Skeleton className="h-8 w-40" />
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* Tablet optimized search and filter layout */}
            <div className="flex flex-col sm:flex-row w-full gap-2">
              <Skeleton className="h-10 w-full sm:w-64" />
              <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
                <Skeleton className="h-10 w-full sm:w-32 flex-grow sm:flex-grow-0" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-10 rounded" />
                  <Skeleton className="h-10 w-10 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4 sm:p-6 space-y-4">
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
          <div className="overflow-x-auto rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%] sm:w-auto">Job Title</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Company
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Location
                  </TableHead>
                  <TableHead>Posted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-32" />
                      <div className="sm:hidden mt-1">
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Recommended Jobs</h1>

        {/* Tablet optimized control layout */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-initial w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Search jobs..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[160px] flex-grow sm:flex-grow-0">
                <ListFilter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date Posted</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="title">Job Title</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2 ml-auto sm:ml-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid' ? 'bg-accent' : 'hover:bg-accent'
                }`}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list' ? 'bg-accent' : 'hover:bg-accent'
                }`}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg">No job recommendations available.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredAndSortedJobs.map((job) => (
            <Card
              key={job.job_id}
              className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => handleJobClick(job.job_id)}
            >
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="text-lg font-semibold line-clamp-2 sm:text-xl">
                    {job.title}
                  </h3>
                  <p className="font-medium">{job.company}</p>
                </div>

                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <span>{job.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    {new Date(job.posteddate).toLocaleDateString()}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer text-xs sm:text-sm"
                  >
                    View Details
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%] sm:w-auto">Job Title</TableHead>
                <TableHead className="hidden sm:table-cell">Company</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead>Posted Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedJobs.map((job) => (
                <TableRow
                  key={job.job_id}
                  onClick={() => handleJobClick(job.job_id)}
                  className="hover:bg-accent cursor-pointer"
                >
                  <TableCell className="py-4">
                    <div className="text-sm font-medium">{job.title}</div>
                    <div className="sm:hidden mt-1 text-xs text-muted-foreground">
                      {job.company}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="text-sm">{job.company}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm">{job.location}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(job.posteddate).toLocaleDateString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
