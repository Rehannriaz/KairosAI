import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type React from 'react';
import '../globals.css';
import { Sidebar } from '@/components/global/SideNavbar';
import { Header } from '@/components/header';

const inter = Inter({ subsets: ['latin'] });

export default function NavLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-background star-bg">
      <Sidebar className="hidden md:block w-64 shrink-0" />
      <div className="flex-1">
        <Header />

        {children}
      </div>
    </div>
  );
}
