import Card from '@/components/Dashboard/Card';
import LineChart from '@/components/Dashboard/LineChart';
import { HomeRepairServiceOutlined } from '@mui/icons-material';
import React from 'react';
import DoughnutChart from '@/components/Dashboard/DoughnutChart';

const Page = () => {
  return (
    <div className="p-6">
      <p className="text-3xl font-semibold">Dashboard</p>
      <p className="mt-2 text-base">Lorem ipsum dolor sit amet consectetur.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        <Card
          icon={<HomeRepairServiceOutlined className="w-12 h-12" />}
          number={100}
          text="Lorem ipsum dolor"
          title="Total Users"
        />
        <Card
          icon={<HomeRepairServiceOutlined className="w-12 h-12" />}
          number={100}
          text="Lorem ipsum dolor"
          title="Total Users"
        />
        <Card
          icon={<HomeRepairServiceOutlined className="w-12 h-12" />}
          number={100}
          text="Lorem ipsum dolor"
          title="Total Users"
        />
        <Card
          icon={<HomeRepairServiceOutlined className="w-12 h-12" />}
          number={100}
          text="Lorem ipsum dolor"
          title="Total Users"
        />
      </div>
      <div className='flex flex-wrap justify-evenly mt-4 gap-x-4'>
        <div className="card bg-white shadow-sm rounded-sm p-6">
          <LineChart />
        </div>
        <div className='card bg-white shadow-sm rounded-sm p-6'>
          <DoughnutChart />
        </div>
      </div>
    </div>
  );
};

export default Page;
