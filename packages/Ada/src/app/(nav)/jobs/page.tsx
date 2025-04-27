'use client';

import jobServiceInstance from '@/api/jobService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Table } from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Search, ListFilter, Grid, List, SlidersHorizontal, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';

// Define a TypeScript interface for job objects
interface Job {
  job_id: string;
  title: string;
  company: string;
  location: string;
  posteddate: string;
  salary?: string;
  aboutrole?: string;
  // Add any other job properties here
}

// Define filter interface
interface JobFilters {
  locations: string[];
  isRemote: boolean | null;
  minSalary: number | null;
  maxSalary: number | null;
  categories: string[];
}

// Job categories
const JOB_CATEGORIES = [
  'Software Engineer',
  'Data Science',
  'Product Manager',
  'UX Designer',
  'DevOps',
  'QA Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
];

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const router = useRouter();

  // Filter states
  const [filters, setFilters] = useState<JobFilters>({
    locations: [],
    isRemote: null,
    minSalary: null,
    maxSalary: null,
    categories: [],
  });

  // Available filter options (would be populated from the data)
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Pass filters to the API call
        const response = await jobServiceInstance.getAllJobs(currentPage, 9, filters);
        setJobs(response.jobs || []);
        setTotalPages(Math.ceil(response.total / 9));
        
        // Extract unique locations for the location filter if not already loaded
        if (availableLocations.length === 0 && response.jobs) {
          const locations = Array.from(new Set(response.jobs.map((job: Job) => job.location))) as string[];
          setAvailableLocations(locations);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, filters]);

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter(
      (job: Job) =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a: Job, b: Job) => {
      if (sortBy === 'date') {
        return (
          new Date(b.posteddate).getTime() - new Date(a.posteddate).getTime()
        );
      }
      if (sortBy === 'company') {
        return a.company?.localeCompare(b.company);
      }
      return a.title?.localeCompare(b.title);
    });
  }, [jobs, searchTerm, sortBy]);

  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleLocationToggle = (location: string) => {
    setFilters(prev => {
      const locations = [...prev.locations];
      if (locations.includes(location)) {
        return { ...prev, locations: locations.filter(loc => loc !== location) };
      } else {
        return { ...prev, locations: [...locations, location] };
      }
    });
    setCurrentPage(1);
  };

  const handleCategoryToggle = (category: string) => {
    setFilters(prev => {
      const categories = [...prev.categories];
      if (categories.includes(category)) {
        return { ...prev, categories: categories.filter(cat => cat !== category) };
      } else {
        return { ...prev, categories: [...categories, category] };
      }
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      locations: [],
      isRemote: null,
      minSalary: null,
      maxSalary: null,
      categories: [],
    });
  };

  const ActiveFiltersCount = 
    (filters.locations.length > 0 ? 1 : 0) +
    (filters.isRemote !== null ? 1 : 0) +
    (filters.minSalary !== null || filters.maxSalary !== null ? 1 : 0) +
    (filters.categories.length > 0 ? 1 : 0);

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
        <h1 className="text-3xl font-bold">All Jobs</h1>

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

          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {ActiveFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {ActiveFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine job search results
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 flex justify-between items-center">
                <h3 className="font-medium">Active filters: {ActiveFiltersCount}</h3>
                {ActiveFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>

              {/* Remote/On-site Filter */}
              <div className="border-t py-4">
                <h3 className="font-medium mb-2">Job Type</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remote"
                      checked={filters.isRemote === true}
                      onCheckedChange={() => handleFilterChange('isRemote', filters.isRemote === true ? null : true)}
                    />
                    <label htmlFor="remote">Remote</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="onSite"
                      checked={filters.isRemote === false}
                      onCheckedChange={() => handleFilterChange('isRemote', filters.isRemote === false ? null : false)}
                    />
                    <label htmlFor="onSite">On-site</label>
                  </div>
                </div>
              </div>

              {/* Salary Range Filter */}
              <div className="border-t py-4">
                <h3 className="font-medium mb-4">Salary Range</h3>
                <div className="px-2">
                  <div className="flex justify-between mb-6">
                    <Input 
                      type="number" 
                      placeholder="Min" 
                      value={filters.minSalary || ''}
                      onChange={(e) => handleFilterChange('minSalary', e.target.value ? Number(e.target.value) : null)}
                      className="w-24"
                    />
                    <span className="mx-2 self-center">to</span>
                    <Input 
                      type="number" 
                      placeholder="Max" 
                      value={filters.maxSalary || ''}
                      onChange={(e) => handleFilterChange('maxSalary', e.target.value ? Number(e.target.value) : null)}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>

              {/* Location Filter */}
              <div className="border-t py-4">
                <h3 className="font-medium mb-2">Locations</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableLocations.map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`location-${location}`}
                        checked={filters.locations.includes(location)}
                        onCheckedChange={() => handleLocationToggle(location)}
                      />
                      <label htmlFor={`location-${location}`}>{location}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Job Category Filter */}
              <div className="border-t py-4">
                <h3 className="font-medium mb-2">Job Categories</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {JOB_CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category}`}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <label htmlFor={`category-${category}`}>{category}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  className="w-full" 
                  onClick={() => setFiltersOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>

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

      {/* Active Filters Display */}
      {ActiveFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 my-4">
          {filters.locations.length > 0 && (
            <Badge variant="secondary" className="px-3 py-1">
              Locations: {filters.locations.length}
              <button onClick={() => handleFilterChange('locations', [])} className="ml-2">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.isRemote !== null && (
            <Badge variant="secondary" className="px-3 py-1">
              {filters.isRemote ? 'Remote' : 'On-site'}
              <button onClick={() => handleFilterChange('isRemote', null)} className="ml-2">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {(filters.minSalary !== null || filters.maxSalary !== null) && (
            <Badge variant="secondary" className="px-3 py-1">
              Salary: {filters.minSalary || 'Any'} - {filters.maxSalary || 'Any'}
              <button onClick={() => {
                handleFilterChange('minSalary', null);
                handleFilterChange('maxSalary', null);
              }} className="ml-2">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.categories.length > 0 && (
            <Badge variant="secondary" className="px-3 py-1">
              Categories: {filters.categories.length}
              <button onClick={() => handleFilterChange('categories', [])} className="ml-2">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg">No jobs available matching your criteria.</p>
          {ActiveFiltersCount > 0 && (
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear all filters
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedJobs.map((job: Job) => (
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
                  <p className="font-medium">{job.company}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span>{job.location}</span>
                  {job.salary && (
                    <Badge variant="outline">{job.salary}</Badge>
                  )}
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
                {/* Add salary column in list view */}
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Salary
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedJobs.map((job: Job) => (
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
                  <td className="px-6 py-4">
                    <div className="text-sm">{job.salary || 'Not specified'}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className={
                currentPage === 1 ? 'pointer-events-none opacity-50' : ''
              }
              href="#"
            />
          </PaginationItem>
          <PaginationItem>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              className={
                currentPage === totalPages
                  ? 'pointer-events-none opacity-50'
                  : ''
              }
              href="#"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default JobsPage;