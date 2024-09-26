'use client';
import { useParams } from 'next/navigation';
import { jobs } from '../../../../../constants';
import Image from 'next/image';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { companyData } from '../../../../../constants';
import CompanyInfo from '@/components/CompanyDetailsCard';
const SingleJob = () => {
  const { id } = useParams(); // Get job id from route params

  const job = jobs.find((job) => job.id === parseInt(id as string));

  if (!job) {
    return <p>Job not found!</p>;
  }

  return (
    <section className="p-8">
      <div className="flex justify-end">
        <div className="flex space-x-4">
          <div className="flex items-center space-x-1">
            <ShareIcon />
            <p>Share</p>
          </div>
          <div className="flex items-center space-x-1">
            <FavoriteBorderIcon />
            <p>Save</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center items-center mt-6">
        <div className="w-[90%] h-80 bg-[#FBF7EE] rounded-2xl p-8 flex items-center">
          <div className="flex">
            <Image alt='logo' src={job.logo} height={100} width={100} className="rounded-full" />
            <div className="ml-4">
              <h1 className="text-2xl font-medium">{job.company}</h1>
              <h1 className="text-xl">{job.title}</h1>
              <div className="flex space-x-6">
                <div className="flex space-x-2">
                  <StarBorderIcon className="text-yellow-400" />
                  <p>{job.rating}</p>
                </div>
                <div className="flex space-x-2">
                  <LocationOnIcon />
                  <p>{job.location}</p>
                </div>
                <div className="flex space-x-2">
                  <CalendarMonthIcon />
                  <p>{job.posting_date}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <div className="flex w-[90%] space-x-8">
          {/* About Company Section */}
          <div className="w-1/2 ml-5">
            <h1 className="text-xl font-semibold mb-4">
              About Company
            </h1>
            <p>
              {job.about_company}
            </p>
            <h1 className="text-xl font-semibold mb-4 mt-10">
              Job Requirements
            </h1>
            <p>
              {job.requirements}
            </p>
            <h1 className="text-xl font-semibold mb-4 mt-10">
              Description
            </h1>
            <p>
              {job.description}
            </p>
          </div>

          <div className="w-1/2 absolute top-56 right-0">
            <CompanyInfo company={companyData} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleJob;
