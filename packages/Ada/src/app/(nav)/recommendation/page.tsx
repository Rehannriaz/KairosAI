'use client';
import { useEffect, useState } from 'react';

import { Table } from 'antd';

const Recommendation = () => {
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        // Fetch all resumes
        const response = await fetch(`${process.env.NEXT_PUBLIC_DB}/api/resumes`); // Replace <ARTHUR_PORT> with the actual port number
        const data = await response.json();
        console.log('All Resumes:', data);

        // Fetch resume by ID (replace '1' with the actual ID to fetch)
        const responseById = await fetch('http://localhost:<ARTHUR_PORT>/api/resumes/1');
        const resumeById = await responseById.json();
        console.log('Resume by ID:', resumeById);
      } catch (error) {
        console.error('Error fetching resumes:', error);
      }
    };

    fetchResumes();
  }, []);
  // Dummy job data
  const jobData = [
    {
      key: '1',
      title: 'Frontend Developer',
      company: 'TechCorp',
      location: 'New York, NY',
      salary: '$90,000 - $110,000',
    },
    {
      key: '2',
      title: 'Backend Developer',
      company: 'CodeBase Inc.',
      location: 'San Francisco, CA',
      salary: '$100,000 - $130,000',
    },
    {
      key: '3',
      title: 'UI/UX Designer',
      company: 'DesignPro',
      location: 'Austin, TX',
      salary: '$75,000 - $95,000',
    },
    {
      key: '4',
      title: 'UI/UX Designer',
      company: 'DesignPro',
      location: 'Austin, TX',
      salary: '$75,000 - $95,000',
    },
    {
      key: '5',
      title: 'UI/UX Designer',
      company: 'DesignPro',
      location: 'Austin, TX',
      salary: '$75,000 - $95,000',
    },
    {
      key: '6',
      title: 'UI/UX Designer',
      company: 'DesignPro',
      location: 'Austin, TX',
      salary: '$75,000 - $95,000',
    },
    {
      key: '7',
      title: 'UI/UX Designer',
      company: 'DesignPro',
      location: 'Austin, TX',
      salary: '$75,000 - $95,000',
    },
    {
      key: '8',
      title: 'UI/UX Designer',
      company: 'DesignPro',
      location: 'Austin, TX',
      salary: '$75,000 - $95,000',
    },
  ];

  // Table columns definition
  const columns = [
    {
      title: 'Job Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
    },
  ];

  return (
    <section className="p-8">
      <h1 className="text-2xl font-bold mb-4">Recommended Jobs</h1>
      <p className="mb-6">Based on your resume, we have found the best matching jobs for you:</p>
      <Table 
        columns={columns} 
        dataSource={jobData} 
        pagination={{ pageSize: 5 }} 
        bordered
      />
    </section>
  );
};

export default Recommendation;
