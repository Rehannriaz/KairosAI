// components/SideNavbar.tsx
'use client';
import React, { useState } from 'react';
import Image from 'next/image';

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import {
  AssessmentOutlined,
  FavoriteBorderOutlined,
  SettingsOutlined,
  SportsGymnasticsOutlined,
} from '@mui/icons-material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import MenuIcon from '@mui/icons-material/Menu'; // Menu icon for toggling
import CloseIcon from '@mui/icons-material/Close'; // Close icon for toggling
import { useRouter, usePathname } from 'next/navigation';
import LogoPage from './LogoPage';
import { useSidebar } from '@/contexts/SidebarContext';

const SideNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { isOpen, toggleSidebar } = useSidebar(); // Use the context

  const getActiveTab = () => {
    if (pathname === '/dashboard') {
      return 'dashboard';
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
    <div className="">
      {/* Sidebar */}
      <div
        className={`fixed lg:relative z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-fit h-screen shadow-lg border-e-2 rounded-b-lg overflow-y-auto bg-white`}
      >
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className=" top-2 right-2 z-50  transition duration-100 ease-in focus:outline-none hover:bg-black hover:text-white rounded-full p-1 absolute"
        >
          {isOpen ? (
            <CloseIcon className="text-3xl" />
          ) : (
            <MenuIcon className="text-3xl" />
          )}
        </button>

        <div className="flex flex-col justify-center">
          {/* Logo */}
          <div
            className="flex flex-col pt-12 mb-20 items-center cursor-pointer"
            onClick={() => {
              router.push('/');
            }}
          >
            <Image src={'/next.svg'} width={109} height={66} alt="logo" />
          </div>

          {/* Sidebar Links */}
          <LogoPage
            title={'Dashboard'}
            llink={'/dashboard'}
            iconn={<HomeOutlinedIcon />}
            active={activeTab === 'dashboard'}
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
    </div>
  );
};

export default SideNavbar;
