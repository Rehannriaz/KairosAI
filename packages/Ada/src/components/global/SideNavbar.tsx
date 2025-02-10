// components/SideNavbar.tsx
'use client';

import LogoPage from './LogoPage';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  AssessmentOutlined,
  FavoriteBorderOutlined,
  SettingsOutlined,
  SportsGymnasticsOutlined,
  DevicesOutlined,
} from '@mui/icons-material';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InfoIcon from '@mui/icons-material/Info';
import WorkIcon from '@mui/icons-material/Work';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import React from 'react';

const SideNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { isOpen, toggleSidebar } = useSidebar(); // Use the context

  const getActiveTab = () => {
    if (!pathname) return '';
    if (pathname === '/dashboard') {
      return 'dashboard';
    } else if (pathname.includes('/single-job')) {
      return 'job-listing';
    } else if (pathname.includes('/recommendation')) {
      return 'job-recommendations';
    } else if (pathname.includes('/resume')) {
      return 'Resume';
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
    } else if (pathname.includes('mock-interviews')) {
      return 'mock-interviews';
    } else {
      return '';
    }
  };

  const activeTab = getActiveTab();

  return (
    <div className="">
      {/* Sidebar */}
      <div
        className={`fixed lg:relative z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-fit h-screen shadow-lg border-e-2 rounded-b-lg overflow-y-auto bg-white`}
      >
        <div className="flex flex-col justify-center">
          {/* Logo */}
          <div
            className="flex flex-col pt-12 mb-20 items-center cursor-pointer"
            onClick={() => {
              router.push('/dashboard');
            }}
          >
            <Image src={'/logo_black.png'} width={109} height={66} alt="logo" />
          </div>

          {/* Sidebar Links */}
          <LogoPage
            title={'Dashboard'}
            llink={'/dashboard'}
            iconn={<HomeOutlinedIcon />}
            active={activeTab === 'dashboard'}
          />
          <LogoPage
            title={'Recommend Jobs'}
            llink={'/recommendation'}
            iconn={<WorkIcon />}
            active={activeTab === 'job-listing'}
          />
          {/* <LogoPage
            title={'Recommend Jobs'}
            llink={'/recommendation'}
            iconn={<WorkOutlineIcon />}
            active={activeTab === 'key-metrics'}
          /> */}
          <LogoPage
            title={'Resume'}
            llink={'/resume'}
            iconn={<ContactPageIcon />}
            active={activeTab === 'Resume'}
          />
          <LogoPage
            title={'Interview'}
            llink={'/mock-interviews'}
            iconn={<DevicesOutlined />}
            active={activeTab === 'mock-interviews'}
          />
          <LogoPage
            title={'Resources'}
            llink={'/resources'}
            iconn={<BookmarkBorderOutlinedIcon />}
            active={activeTab === 'Resources'}
          />
          <LogoPage
            title={'Job Trends'}
            llink={'/questionnaire'}
            iconn={<AssessmentOutlined />}
            active={activeTab === 'Questionnaire'}
          />
          <LogoPage
            title={'About KairosAI'}
            llink={'/about'}
            iconn={<InfoIcon />}
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
    </div>
  );
};

export default SideNavbar;
