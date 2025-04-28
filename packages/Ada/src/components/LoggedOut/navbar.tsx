'use client';

import { Button } from '@/components/ui/button';
import { getUserId } from '@/lib';
import { motion } from 'framer-motion';
import { Bot, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { useEffect, useState } from 'react';

// Added import for React

export default function Navbar() {
  const [user_id, setUserId] = useState<string | null>(null);
  useEffect(() => {
    return setUserId(getUserId() ?? null);
  }, []);
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10"
    >
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src={'/logo_white_notext.png'}
          width={40}
          height={40}
          alt="Logo"
        />
        <span className="text-white font-medium text-xl">KairosAI</span>
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About Us</NavLink>
        <NavLink href="/faqs">FAQs</NavLink>
        <NavLink href="/pricing">Pricing</NavLink>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        {user_id ? (
          <Link href={'/dashboard'}>
            <Button className="text-white hover:text-purple-400">
              Dashboard
            </Button>
          </Link>
        ) : (
          <>
            <Link href={'/login'}>
              <Button
                variant="ghost"
                className="text-white hover:text-purple-400"
              >
                Sign In
              </Button>
            </Link>
            <Link href={'/signup'}>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Get Started
              </Button>
            </Link>
          </>
        )}
      </div>

      <Button variant="ghost" size="icon" className="md:hidden text-white">
        <Menu className="w-6 h-6" />
      </Button>
    </motion.nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-gray-300 hover:text-white transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full" />
    </Link>
  );
}
