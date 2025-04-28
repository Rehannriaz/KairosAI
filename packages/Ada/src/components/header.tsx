'use client';

import ActionSearchBar from './global/actionSearchBar';
import NotificationDropdown from './notifications/notification-dropdown';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import authServiceInstance from '@/api/authService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getUsername } from '@/lib';
import { Bell, Heart, HomeIcon, Mail, Menu, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface HeaderProps {
  toggleSidebar?: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await authServiceInstance.logout();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };
  const pathname = usePathname();
  const showHomeIcon = /^\/mock-interviews\/[^\/]+\/[^\/]+$/.test(pathname);

  return (
    <header className="flex h-14 sm:h-16 items-center px-2 sm:px-4 border-b border-border/40 gap-2 sm:gap-4">
      {/* Hamburger menu - visible only on mobile */}
      <div className="md:hidden flex-shrink-0">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="h-8 w-8 sm:h-9 sm:w-9"
        >
          <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
      
      {/* Logo/Home section with flexible width */}
      <div className={`flex items-center ${showHomeIcon ? 'gap-2 sm:gap-4' : ''} flex-1 min-w-0`}>
        {showHomeIcon && (
          <Link href="/dashboard" className="flex-shrink-0">
            <HomeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        )}
        
        {/* Search bar with responsive width */}
        <div className="flex-1 max-w-md w-full">
          <ActionSearchBar />
        </div>
      </div>
      
      {/* Action buttons with consistent spacing */}
      <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-10 sm:w-10"
        >
          <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        
        <div className="hidden xs:block">
          <NotificationDropdown />
        </div>
        
        {/* User profile with popover */}
        <Popover>
          <PopoverTrigger className="outline-none">
            <span className="block w-7 h-7 sm:w-8 sm:h-8 overflow-hidden rounded-full border-[0.5px] border-black">
              <Image
                src="/profile_picture.png"
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full cursor-pointer bg-white"
              />
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="end">
            <div className="flex flex-col">
              <div className="text-right font-bold p-3 w-full rounded-t-md border-b">
                Welcome {getUsername()}!
              </div>
              <div className="p-2">
                <button className="text-right cursor-pointer p-2 w-full rounded hover:bg-secondary hover:text-primary transition duration-100 ease-in">
                  View Profile
                </button>
                <button 
                  onClick={handleLogout}
                  className="text-right cursor-pointer p-2 w-full rounded hover:bg-secondary hover:text-primary transition duration-100 ease-in mt-1"
                >
                  Log Out
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}