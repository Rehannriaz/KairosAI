'use client';

import jobServiceInstance from '@/api/jobService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, HeartIcon, LocateIcon, ShareIcon } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface JobDetails {
  description: string;
  title: string;
  company: string;
  location: string;
  listingurl: string;
  requirements: string;
  salary_range?: string;
  posteddate?: string;
  aboutrole?: string;
}

export default function JobDetailsPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchJobDetails() {
      try {
        const jobData = await jobServiceInstance.getJobById(id);
        setJob(jobData);
      } catch (error) {
        console.error('Failed to fetch job details:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobDetails();
  }, [id]);

  if (loading) {
    return (
      <section className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
        <Skeleton className="h-8 md:h-10 w-full md:w-3/4" />
        <Skeleton className="h-6 w-2/3 md:w-1/2" />
        <Skeleton className="h-16 md:h-20 w-full" />
        <Skeleton className="h-5 md:h-6 w-1/2 md:w-1/3" />
        <Skeleton className="h-28 md:h-36 w-full" />
      </section>
    );
  }

  if (!job) {
    return <p className="p-4 md:p-8 text-center">Job not found!</p>;
  }

  let parsedRequirements: any = null;
  try {
    parsedRequirements = job.requirements ? JSON.parse(job.requirements) : null;
  } catch (error) {
    console.error('Failed to parse job requirements:', error);
  }

  return (
    <section className="p-4 md:p-6 lg:p-8 max-w-full overflow-x-hidden">
      <div className="flex justify-end space-x-3 md:space-x-4">
        <div className="flex items-center space-x-1 cursor-pointer text-sm md:text-base">
          <ShareIcon size={16} />
          <p>Share</p>
        </div>
        <div className="flex items-center space-x-1 cursor-pointer text-sm md:text-base">
          <HeartIcon size={16} />
          <p>Favorite</p>
        </div>
      </div>

      <div className="flex justify-center items-center mt-4 md:mt-6">
        <div className="w-full md:w-[90%] bg-accent rounded-lg md:rounded-2xl p-4 md:p-6 lg:p-8">
          <div className="space-y-1 md:space-y-2">
            <h1 className="text-xl md:text-2xl font-medium">{job.company}</h1>
            <h2 className="text-lg md:text-xl">{job.title}</h2>
            <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 mt-2 text-xs md:text-sm">
              <div className="flex space-x-2 items-center">
                <LocateIcon size={16} />
                <p>{job.location}</p>
              </div>
              {job.posteddate && (
                <div className="flex space-x-2 items-center">
                  <CalendarIcon size={16} />
                  <p>{new Date(job.posteddate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6 md:mt-8">
        <div className="w-full md:w-[90%] space-y-6 md:space-y-8">
          <div>
            <h1 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">About Role</h1>
            <p className="text-xs md:text-sm">{job.aboutrole}</p>
          </div>

          <div>
            <h1 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 mt-6 md:mt-10">
              Job Requirements
            </h1>
            {parsedRequirements ? (
              Object.entries(parsedRequirements).map(([key, value]) => {
                const reqValue = value as {
                  required?: string[] | string;
                  preferred?: string[] | string;
                };
                return (
                  <div key={key} className="mb-4">
                    <h2 className="text-base md:text-lg font-medium capitalize">
                      {key.replace(/_/g, ' ')}
                    </h2>
                    {typeof reqValue === 'object' && reqValue !== null ? (
                      <div className="ml-2 md:ml-4 space-y-1 md:space-y-2">
                        {reqValue.required && (
                          <div>
                            <h3 className="font-semibold text-sm md:text-base">Required:</h3>
                            {Array.isArray(reqValue.required) ? (
                              <ul className="list-disc ml-4 md:ml-5 text-xs md:text-sm">
                                {reqValue.required.map(
                                  (item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <p className="text-xs md:text-sm">{reqValue.required}</p>
                            )}
                          </div>
                        )}
                        {reqValue.preferred && (
                          <div className="mt-2">
                            <h3 className="font-semibold text-sm md:text-base">Preferred:</h3>
                            {Array.isArray(reqValue.preferred) ? (
                              <ul className="list-disc ml-4 md:ml-5 text-xs md:text-sm">
                                {reqValue.preferred.map(
                                  (item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <p className="text-xs md:text-sm">{reqValue.preferred}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs md:text-sm ml-2 md:ml-4">{String(value) || 'Not specified'}</p>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-xs md:text-sm">No job requirements listed</p>
            )}
          </div>

          <div>
            <h1 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Description</h1>
            <p className="text-xs md:text-sm">{job.description}</p>
          </div>

          <div className="mt-6 pb-8">
            <Button className="w-full sm:w-auto" asChild>
              <a
                href={job.listingurl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply Now
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}