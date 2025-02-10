// components/Header.tsx
'use client';

import ActionSearchBar from './actionSearchBar';
import authServiceInstance from '@/api/authService';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useSidebar } from '@/contexts/SidebarContext';
import { getUsername } from '@/lib';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Header = () => {
  const { toggleSidebar } = useSidebar(); // Use the context
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
          {/* <Image src="/logo_black.png" alt="Logo" width={65} height={65} /> */}
        </div>
        {/* Hamburger Menu Button */}
        <button onClick={toggleSidebar} className=" text-xl">
          <MenuIcon />
        </button>
      </div>

      {/* Icons on the Right */}
      <div className="flex items-center space-x-4">
        <div className="w-80">
          <ActionSearchBar />
        </div>

        <NotificationsIcon className="text-xl cursor-pointer" />
        <MailIcon className="text-xl cursor-pointer" />
        <FavoriteIcon className="text-xl cursor-pointer" />
        {/* Profile Picture */}

        <Popover>
          <PopoverTrigger>
            {' '}
            <span className="block w-8 h-8 overflow-hidden rounded-full border-[0.5px] border-black">
              <Image
                src="/profile_picture.png"
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

export default Header;
