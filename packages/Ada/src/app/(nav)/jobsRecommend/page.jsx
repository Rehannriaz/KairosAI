"use client";

import { useState } from "react";
import { Table, Button, Spin } from "antd";
import { useRouter } from "next/navigation";

export default function JobScraper() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/scrape");
      if (!response.ok) throw new Error("Failed to fetch jobs");

      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Company", dataIndex: "company", key: "company" },
    { title: "Location", dataIndex: "location", key: "location" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => router.push(`/job?url=${encodeURIComponent(record.listingUrl)}`)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Button onClick={fetchJobs} type="primary" disabled={loading}>
        {loading ? <Spin /> : "Scrape LinkedIn Jobs"}
      </Button>

      <Table
        className="mt-4"
        columns={columns}
        dataSource={jobs}
        rowKey={(record) => record.listingUrl}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
