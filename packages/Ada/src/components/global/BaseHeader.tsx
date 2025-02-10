// components/Header.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import authServiceInstance from '@/api/authService';
import { useRouter } from 'next/navigation';
import { getUsername } from '@/lib';

const BaseHeader = () => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await authServiceInstance.logout();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-6 bg-white">
      {/* Logo and Hamburger */}
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => {
            router.push('/dashboard');
          }}
        >
          <Image src="/logo_black.png" alt="Logo" width={65} height={65} />
        </div>
      </div>

      {/* Search Bar */}
      <div className="hidden lg:flex flex-1 mx-4 ">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="What service are you looking for today?"
            className="w-full pl-4 pr-10 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <SearchIcon className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Icons on the Right */}
      <div className="flex items-center space-x-4">
        <NotificationsIcon className="text-xl cursor-pointer" />
        <MailIcon className="text-xl cursor-pointer" />
        <FavoriteIcon className="text-xl cursor-pointer" />
        {/* Profile Picture */}

        <Popover>
          <PopoverTrigger>
            {' '}
            <span className="block w-10 h-10 overflow-hidden rounded-full border-[0.5px] border-black">
              <Image
                src="/logo_black.png"
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full cursor-pointer"
              />
            </span>
          </PopoverTrigger>
          <PopoverContent className="">
            <div className="flex flex-col ml-2">
              <span className="font-bold">{getUsername()}</span>
              <div className="text-right cursor-pointer mt-5 p-2 w-full rounded-r-md hover:bg-[#222222] hover:text-white transition duration-100 ease-in">
                View Profile
              </div>
              <div
                onClick={handleLogout}
                className="text-right cursor-pointer p-2 mt-5 w-full rounded-r-md hover:bg-[#222222] hover:text-white transition duration-100 ease-in"
              >
                Log Out
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default BaseHeader;
