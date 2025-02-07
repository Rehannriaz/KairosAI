"use client";
import { useEffect, useState } from 'react';
import { Card, Skeleton, Button, Typography } from 'antd';
import jobServiceInstance from "@/api/jobService";
import { useRouter } from 'next/navigation';

const { Title, Text, Paragraph } = Typography;

interface JobDetails  {
  description: string;
  title: string;
    company: string;
    location: string;
    listing_url: string;
  requirements: string[];
  salary_range?: string;
  // add any other fields you're getting from the API
}

export default function JobDetailsPage({ params }: { params: { id: string } }) {

    console.log("Params: ", params);
  const [job, setJob] = useState<JobDetails | null>(null);
  useEffect(() => {
    async function fetchJobDetails() {
      try {
        console.log("r123eached")

        const jobData = await jobServiceInstance.getJobById(params.id);
        console.log("Job data: ", jobData);
        setJob(jobData);
      } catch (error) {
        console.error("Failed to fetch job details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobDetails();
  }, []);
  const [loading, setLoading] = useState(true);
  console.log("reached")
  const router = useRouter();



  if (loading) {
    return <Skeleton active />;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Button 
        onClick={() => router.back()} 
        className="mb-4"
      >
        ← Back to Jobs
      </Button>

      <Card>
        <Title level={2}>{job.title}</Title>
        <Title level={4} type="secondary">{job.company}</Title>
        
        <div className="my-4">
          <Text strong>Location: </Text>
          <Text>{job.location}</Text>
          {job.salary_range && (
            <div className="mt-2">
              <Text strong>Salary Range: </Text>
              <Text>{job.salary_range}</Text>
            </div>
          )}
        </div>

        <div className="my-6">
          <Title level={4}>Job Description</Title>
          <Paragraph>{job.description}</Paragraph>
        </div>

        {job.requirements && job.requirements.length > 0 && (
          <div className="my-6">
            <Title level={4}>Requirements</Title>
            <ul className="list-disc pl-6">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <Button 
            type="primary" 
            href={job.listing_url} 
            target="_blank"
            size="large"
          >
            Apply Now
          </Button>
        </div>
      </Card>
    </div>
  );
}