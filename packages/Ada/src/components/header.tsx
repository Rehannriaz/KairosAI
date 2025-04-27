'use client';

import ActionSearchBar from './global/actionSearchBar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import authServiceInstance from '@/api/authService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getUsername } from '@/lib';
import { Bell, Heart, Mail, Search } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function Header() {
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
    <header className="flex h-16 items-center px-4 border-b border-border/40">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md">
          <ActionSearchBar />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Mail className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Heart className="h-5 w-5" />
        </Button>
        <Popover>
          <PopoverTrigger>
            {' '}
            <span className="block w-8 h-8 overflow-hidden rounded-full border-[0.5px] border-black">
              <Image
                src="/profile_picture.png"
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full cursor-pointer bg-white"
              />
            </span>
          </PopoverTrigger>
          <PopoverContent className="">
            <div className="flex flex-col ml-2">
              <span className="font-bold text-right">{getUsername()}</span>
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
    </header>
  );
}
