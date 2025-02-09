import Card from '@/components/Dashboard/Card';
import LineChart from '@/components/Dashboard/LineChart';
import { HomeRepairServiceOutlined, WorkOutline } from '@mui/icons-material';
import React from 'react';
import DoughnutChart from '@/components/Dashboard/DoughnutChart';

const Page = () => {
  return (
    <div className="p-6">
      <p className="text-3xl font-semibold">Dashboard</p>
      <p className="text-xl text-gray-600 max-w-2xl mt-2">
        This is your dashboard, providing insights into your job applications.
        Track the jobs you've applied to, see how many opportunities are
        available, and stay updated on your progress.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        <Card
          icon={<WorkOutline className="w-12 h-12" />}
          number={100}
          description="Jobs in the last 24 hours"
          title="Applied to more than"
        />
        <Card
          icon={<HomeRepairServiceOutlined className="w-12 h-12" />}
          number={5}
          title="Total Users"
          description="Active job seekers using the platform"
        />
        <Card
          icon={<HomeRepairServiceOutlined className="w-12 h-12" />}
          number={250}
          description="Total jobs currently available"
          title="Available Job Listings"
        />
        <Card
          icon={<HomeRepairServiceOutlined className="w-12 h-12" />}
          number={20}
          description="Interviews scheduled this week"
          title="Upcoming Interviews"
        />
      </div>
      <div className="flex flex-wrap justify-evenly mt-4 gap-x-4">
        <div className="card bg-white shadow-sm rounded-sm p-6">
          <LineChart />
        </div>
        <div className="card bg-white shadow-sm rounded-sm p-6">
          <DoughnutChart />
        </div>
      </div>
    </div>
  );
};

export default Page;
