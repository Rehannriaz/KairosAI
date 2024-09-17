'use client';
import React from 'react';

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import {
  AssessmentOutlined,
  FavoriteBorderOutlined,
  LogoutOutlined,
  SettingsOutlined,
  SportsGymnasticsOutlined,
} from '@mui/icons-material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { useRouter, usePathname } from 'next/navigation';
import LogoPage from './LogoPage';

const SideNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname === '/') {
      return 'Home';
    } else if (pathname.includes('/job-listing')) {
      return 'job-listing';
    } else if (pathname.includes('/key-metrics')) {
      return 'key-metrics';
    } else if (pathname.includes('/target')) {
      return 'Target';
    } else if (pathname.includes('/goals')) {
      return 'Goals';
    } else if (pathname.includes('/resources')) {
      return 'Resources';
    } else if (pathname.includes('/questionnaire')) {
      return 'Questionnaire';
    } else if (pathname.includes('/www')) {
      return 'Weekly Wellness Workout';
    } else if (pathname.includes('/settings')) {
      return 'Settings';
    } else {
      return '';
    }
  };

  const activeTab = getActiveTab();

  return (
    <div className="w-fit h-screen shadow-lg border-e-2 rounded-e-lg overflow-y-auto bg-white">
      <div className="flex flex-col justify-center">
        <div
          className="flex flex-col pt-12 mb-20 items-center cursor-pointer"
          onClick={() => {
            router.push('/');
          }}
        >
          {/* <Image src={'/logo3.png'} width={109} height={66} alt="logo" /> */}
        </div>

        <LogoPage
          title={'Home'}
          llink={'/'}
          iconn={<HomeOutlinedIcon />}
          active={activeTab === 'Home'}
        />
        <LogoPage
          title={'Jobs Listing'}
          llink={'/job-listing'}
          iconn={<SearchOutlinedIcon />}
          active={activeTab === 'job-listing'}
        />
        <LogoPage
          title={'Key Metrics'}
          llink={'/key-metrics'}
          iconn={<WorkOutlineIcon />}
          active={activeTab === 'key-metrics'}
        />

        <LogoPage
          title={'Targets'}
          llink={'/target'}
          iconn={<FlagOutlinedIcon />}
          active={activeTab === 'Target'}
        />
        <LogoPage
          title={'Goals'}
          llink={'/goals'}
          iconn={<FavoriteBorderOutlined />}
          active={activeTab === 'Goals'}
        />
        <LogoPage
          title={'Resources'}
          llink={'/resources'}
          iconn={<BookmarkBorderOutlinedIcon />}
          active={activeTab === 'Resources'}
        />

        <LogoPage
          title={'Questionnaire'}
          llink={'/questionnaire'}
          iconn={<AssessmentOutlined />}
          active={activeTab === 'Questionnaire'}
        />
        <LogoPage
          title={'Weekly Wellness Workout'}
          llink={'/www'}
          iconn={<SportsGymnasticsOutlined />}
          active={activeTab === 'Weekly Wellness Workout'}
        />
        <LogoPage
          title={'Settings'}
          llink={'/settings'}
          iconn={<SettingsOutlined />}
          active={activeTab === 'Settings'}
        />
      </div>
    </div>
  );
};

export default SideNavbar;
