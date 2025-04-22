'use client';

import jobServiceInstance from '@/api/jobService';
import { ConstructionOutlined } from '@mui/icons-material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShareIcon from '@mui/icons-material/Share';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Skeleton, Button, Typography } from 'antd';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Paragraph } = Typography;

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
  const { id } = useParams();
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
    return <Skeleton active />;
  }

  if (!job) {
    return <p>Job not found!</p>;
  }

  let parsedRequirements;
  try {
    parsedRequirements = job.requirements ? JSON.parse(job.requirements) : null;
    console.log('parsed requirements', parsedRequirements);
  } catch (error) {
    console.error('Failed to parse job requirements:', error);
    parsedRequirements = null;
  }

  return (
    <section className="p-8">
      <div className="flex justify-end space-x-4">
        <div className="flex items-center space-x-1 cursor-pointer">
          <ShareIcon />
          <p>Share</p>
        </div>
        <div className="flex items-center space-x-1 cursor-pointer">
          <FavoriteBorderIcon />
          <p>Save</p>
        </div>
      </div>

      <div className="flex justify-center items-center mt-6">
        <div className="w-[90%] bg-[#FBF7EE] rounded-2xl p-8 flex items-center">
          <div className="ml-4">
            <h1 className="text-2xl font-medium">{job.company}</h1>
            <h1 className="text-xl">{job.title}</h1>
            <div className="flex space-x-6 mt-2">
              <div className="flex space-x-2">
                <LocationOnIcon />
                <p>{job.location}</p>
              </div>
              {job.posteddate && (
                <div className="flex space-x-2">
                  <CalendarMonthIcon />
                  <p>{new Date(job.posteddate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <div className="w-[90%] space-y-8">
          <div>
            <h1 className="text-xl font-semibold mb-4">About Role</h1>
            <Paragraph>{job.aboutrole}</Paragraph>
          </div>

          <div>
            <h1 className="text-xl font-semibold mb-4 mt-10">
              Job Requirements
            </h1>
            {job.requirements ? (
              (() => {
                try {
                  const parsedRequirements = JSON.parse(job.requirements);

                  // If parsedRequirements is an object, map over it
                  if (
                    typeof parsedRequirements === 'object' &&
                    parsedRequirements !== null
                  ) {
                    return Object.entries(parsedRequirements).map(
                      ([key, value]) => (
                        <div key={key} className="mb-4">
                          <h2 className="text-lg font-medium capitalize">
                            {key.replace(/_/g, ' ')}
                          </h2>
                          {typeof value === 'object' && value !== null ? (
                            <div className="ml-4">
                              {value.required && (
                                <div>
                                  <h3 className="font-semibold">Required:</h3>
                                  {Array.isArray(value.required) ? (
                                    <ul className="list-disc ml-5">
                                      {value.required.map((item, index) => (
                                        <li key={index}>{item}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p>{value.required}</p>
                                  )}
                                </div>
                              )}
                              {value.preferred && (
                                <div className="mt-2">
                                  <h3 className="font-semibold">Preferred:</h3>
                                  {Array.isArray(value.preferred) ? (
                                    <ul className="list-disc ml-5">
                                      {value.preferred.map((item, index) => (
                                        <li key={index}>{item}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p>{value.preferred}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <p>{value || 'Not specified'}</p>
                          )}
                        </div>
                      )
                    );
                  } else {
                    // If it's a simple string, show it directly
                    return <p>{job.requirements}</p>;
                  }
                } catch (error) {
                  console.error('Error parsing job requirements:', error);
                  return (
                    <p className="text-red-500">
                      Error loading job requirements
                    </p>
                  );
                }
              })()
            ) : (
              <p className="text-gray-500">No job requirements listed</p>
            )}
          </div>

          <div>
            <h1 className="text-xl font-semibold mb-4">Description</h1>
            <Paragraph>{job.description}</Paragraph>
          </div>

          <div className="mt-6">
            <Button
              type="primary"
              href={job.listingurl}
              target="_blank"
              size="large"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
