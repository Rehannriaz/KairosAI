'use client';

import { Chat } from '@/components/chatpage/chat';
import { Sidebar } from '@/components/chatpage/sidebar';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PageProps {
  params: {
    jobID: string;
    chatID: string;
  };
}

export default function Page({ params }: PageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile and set initial sidebar state
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile); // Close sidebar by default on mobile
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <div className="star-bg bg-background min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1 relative">
        {/* Mobile sidebar toggle button - now placed on the right */}
        {isMobile && (
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 z-30 rounded-full w-10 h-10 flex items-center justify-center"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </Button>
        )}

        {/* Chat area that expands to fill space */}
        <div className="flex-1 flex flex-col">
          <Chat jobID={params.jobID} chatID={params.chatID} />
        </div>

        {/* Sidebar wrapper with mobile overlay - now positioned on the right */}
        <div
          className={`
            ${isMobile ? 'fixed inset-y-0 right-0 z-40' : 'relative'} 
            ${
              sidebarOpen ? 'translate-x-0' : isMobile ? 'translate-x-full' : ''
            }
            transition-transform duration-300 ease-in-out
          `}
        >
          <Sidebar
            jobID={params.jobID}
            chatID={params.chatID}
            onSelectChat={isMobile ? () => setSidebarOpen(false) : undefined}
          />
        </div>

        {/* Overlay to close sidebar when clicking outside on mobile */}
        {sidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/20 z-30"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
