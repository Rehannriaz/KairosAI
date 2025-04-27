'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type React from 'react';
import '../globals.css';
import { Sidebar } from '@/components/global/SideNavbar';
import { Header } from '@/components/header';
import { useState } from 'react';

export default function NavLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsMobileNavOpen(prev => !prev);
  };

  return (
    <div className="flex min-h-screen bg-background star-bg">
      <Sidebar 
        className="w-64 shrink-0" 
        isMobileOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
      <div className="flex-1">
        <Header toggleSidebar={toggleSidebar} />

        {children}
      </div>
    </div>
  );
}