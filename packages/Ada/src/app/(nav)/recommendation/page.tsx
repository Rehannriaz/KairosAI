"use client";
import { useEffect, useState } from "react";
import { Table } from "antd";
import { useRouter } from "next/navigation";
import jobServiceInstance from "@/api/jobService";

interface Job {
  job_id: string;
  title: string;
  location: string;
  posted_date: string;
  listing_url: string;
  company: string; // Added this since it's in your response
}

export default function RecommendationPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await jobServiceInstance.getAllJobs();
        console.log("Response: ", response);
        
        // Since response is already an array of jobs, we can map it directly
        const mappedJobs = response.map((job: Job) => ({
          job_id: job.job_id,
          title: job.title,
          location: job.location,
          posted_date: job.posted_date || '', // Add fallback in case it's undefined
          listing_url: job.listing_url,
          company: job.company,
        }));
        
        setJobs(mappedJobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const handleRowClick = (record: Job) => {
    router.push(`/jobs/${record.job_id}`);
  };

  const columns = [
    { title: "Job Title", 
      dataIndex: "title", 
      key: "title",
      render: (text: string, record: Job) => `${text} at ${record.company}`
    },
    { title: "Location", dataIndex: "location", key: "location" },
    { 
      title: "Posted", 
      dataIndex: "posted_date", 
      key: "posted_date",
      render: (date: string) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString();
      }
    },
    {
      title: "Details",
      dataIndex: "listing_url",
      key: "listing_url",
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          View
        </a>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={jobs} 
      loading={loading} 
      rowKey="job_id"
      pagination={{ pageSize: 10 }}
      onRow={(record) => ({
        onClick: () => handleRowClick(record),
        style: { cursor: 'pointer' }
      })}
    />
  );
}