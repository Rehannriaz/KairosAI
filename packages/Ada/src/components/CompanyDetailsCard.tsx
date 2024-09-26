import { FC } from 'react';
import { Card, Typography, Button } from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  CalendarOutlined,
  HomeOutlined,
  ClusterOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface Company {
  industry: string;
  size: string;
  founded: string;
  phone: string;
  email: string;
  location: string;
}

interface CompanyInfoProps {
  company: Company;
}

const CompanyInfo: FC<CompanyInfoProps> = ({ company }) => {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg">
      <Card
        title={<Title level={3} className="text-xl font-bold">About Company</Title>}
        bordered={false}
        className="border-none shadow-none p-6"
        bodyStyle={{ padding: 0 }}
      >
        {/* Industry */}
        <div className="flex items-center justify-between mb-4 mt-2 border-b border-gray-200 pb-4">
          <div className="flex items-center">
            <ClusterOutlined className="text-neutral-600 mr-3" />
            <Text className="text-gray-500 text-sm">Primary industry</Text>
          </div>
          <Text className="font-medium">{company.industry}</Text>
        </div>

        {/* Company Size */}
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-4">
          <div className="flex items-center">
            <GlobalOutlined className="text-neutral-600 mr-3" />
            <Text className="text-gray-500 text-sm">Company size</Text>
          </div>
          <Text className="font-medium">{company.size}</Text>
        </div>

        {/* Founded */}
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-4">
          <div className="flex items-center">
            <CalendarOutlined className="text-neutral-600 mr-3" />
            <Text className="text-gray-500 text-sm">Founded in</Text>
          </div>
          <Text className="font-medium">{company.founded}</Text>
        </div>

        {/* Phone */}
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-4">
          <div className="flex items-center">
            <PhoneOutlined className="text-neutral-600 mr-3" />
            <Text className="text-gray-500 text-sm">Phone</Text>
          </div>
          <Text className="font-medium">{company.phone}</Text>
        </div>

        {/* Email */}
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-4">
          <div className="flex items-center">
            <MailOutlined className="text-neutral-600 mr-3" />
            <Text className="text-gray-500 text-sm">Email</Text>
          </div>
          <Text className="font-medium">{company.email}</Text>
        </div>

        {/* Location */}
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-4">
          <div className="flex items-center">
            <HomeOutlined className="text-neutral-600 mr-3" />
            <Text className="text-gray-500 text-sm">Location</Text>
          </div>
          <Text className="font-medium">{company.location}</Text>
        </div>

        {/* Contact Button */}
        <Button
          type="primary"
          className="bg-green-500 hover:bg-green-600 w-full mt-4 text-white py-2 rounded-lg font-semibold flex justify-center items-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Website
        </Button>
      </Card>
    </div>
  );
};

export default CompanyInfo;
