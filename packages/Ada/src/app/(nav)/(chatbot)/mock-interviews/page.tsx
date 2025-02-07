'use client';

import { JobCard } from '@/components/Mockinterviews/job-card';
import { Pagination } from '@/components/Mockinterviews/pagination';
import { useState } from 'react';

// Dummy data for job listings
const jobListings = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechCorp',
    description:
      "We're looking for a skilled Frontend Developer to join our team and help build amazing user interfaces.",
    location: 'Remote',
    salary: '$80,000 - $120,000',
    jobID: '1',
    chatID: '1',
  },
  {
    id: 2,
    title: 'Backend Engineer',
    company: 'DataSystems Inc.',
    description:
      'Join our backend team to develop scalable and efficient server-side applications.',
    location: 'New York, NY',
    salary: '$90,000 - $140,000',
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    company: 'WebSolutions',
    description:
      'We need a versatile Full Stack Developer to work on various projects across our tech stack.',
    location: 'San Francisco, CA',
    salary: '$100,000 - $160,000',
  },
  {
    id: 4,
    title: 'UX/UI Designer',
    company: 'CreativeMinds',
    description:
      'Design intuitive and beautiful user interfaces for web and mobile applications.',
    location: 'Los Angeles, CA',
    salary: '$70,000 - $110,000',
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'CloudTech',
    description:
      'Help us streamline our development and deployment processes using cutting-edge DevOps practices.',
    location: 'Chicago, IL',
    salary: '$95,000 - $145,000',
  },
  {
    id: 6,
    title: 'Data Scientist',
    company: 'AI Innovations',
    description:
      'Apply machine learning and statistical techniques to solve complex business problems.',
    location: 'Boston, MA',
    salary: '$110,000 - $170,000',
  },
  {
    id: 7,
    title: 'Mobile App Developer',
    company: 'AppWorks',
    description:
      'Create engaging and user-friendly mobile applications for iOS and Android platforms.',
    location: 'Seattle, WA',
    salary: '$85,000 - $130,000',
  },
  {
    id: 8,
    title: 'Cybersecurity Analyst',
    company: 'SecureNet',
    description:
      'Protect our organization from cyber threats and implement robust security measures.',
    location: 'Washington, D.C.',
    salary: '$95,000 - $150,000',
  },
  {
    id: 9,
    title: 'Product Manager',
    company: 'InnovateTech',
    description:
      'Lead the development of innovative products from conception to launch.',
    location: 'Austin, TX',
    salary: '$100,000 - $160,000',
  },
];

const ITEMS_PER_PAGE = 6;

export default function JobListingsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(jobListings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentJobs = jobListings.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Job Listings</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentJobs.map((job) => (
          <JobCard
            key={job.id}
            title={job.title}
            company={job.company}
            description={job.description}
            location={job.location}
            salary={job.salary}
            jobID={job?.jobID}
            chatID={job?.chatID}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
