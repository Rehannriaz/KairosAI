"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Spin, Card, Typography, List } from "antd";

export default function JobDetails() {
  const searchParams = useSearchParams();
  const jobUrl = searchParams.get("url");

  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobUrl) return;

    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`/api/job-details?url=${encodeURIComponent(jobUrl)}`);
        if (!response.ok) throw new Error("Failed to fetch job details");

        const data = await response.json();
        setJobDetails(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobUrl]);

  if (loading) return <Spin size="large" className="flex justify-center mt-10" />;
  if (!jobDetails) return <p className="text-red-500">Failed to load job details.</p>;

  return (
    <div className="p-5">
      <Card title={jobDetails.title} bordered={false}>
        <Typography.Title level={4}>Company</Typography.Title>
        <Typography.Paragraph>{jobDetails.company}</Typography.Paragraph>

        <Typography.Title level={4}>Description</Typography.Title>
        {jobDetails.description.map((para, index) => (
          <Typography.Paragraph key={index}>{para}</Typography.Paragraph>
        ))}

        <Typography.Title level={4}>Qualifications</Typography.Title>
        <List
          bordered
          dataSource={jobDetails.qualifications}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Card>
    </div>
  );
}
