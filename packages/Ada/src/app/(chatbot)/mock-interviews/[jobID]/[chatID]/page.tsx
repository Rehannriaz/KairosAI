'use client';

import { Chat } from '@/components/chatpage/chat';
import { Sidebar } from '@/components/chatpage/sidebar';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

// Add CSS for the starry background
const starStyles = `
  .star-bg {
    position: relative;
    overflow: hidden;
  }
  
  .star-bg::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(1px 1px at 25px 5px, white, rgba(255, 255, 255, 0)),
      radial-gradient(1px 1px at 50px 25px, white, rgba(255, 255, 255, 0)),
      radial-gradient(1px 1px at 125px 20px, white, rgba(255, 255, 255, 0)),
      radial-gradient(1.5px 1.5px at 50px 75px, white, rgba(255, 255, 255, 0)),
      radial-gradient(2px 2px at 175px 125px, white, rgba(255, 255, 255, 0)),
      radial-gradient(2.5px 2.5px at 200px 175px, white, rgba(255, 255, 255, 0));
    background-repeat: repeat;
    background-size: 250px 250px;
    opacity: 0.2;
    z-index: 0;
    pointer-events: none;
  }
`;

interface PageProps {
  params: {
    jobID: string;
    chatID: string;
  };
}

export default function Page({ params }: PageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
    <>
      {/* Inject starry background styles */}
      <style jsx global>
        {starStyles}
      </style>

      <div className="star-bg bg-background min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1 relative">
          {/* Sidebar */}
          <div
            className={`
              ${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'relative'} 
              ${
                sidebarOpen
                  ? 'translate-x-0'
                  : isMobile
                  ? '-translate-x-full'
                  : ''
              }
              transition-transform duration-300 ease-in-out
              bg-background
            `}
          >
            <Sidebar
              jobID={params.jobID}
              chatID={params.chatID}
              onSelectChat={isMobile ? () => setSidebarOpen(false) : undefined}
            />
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col relative">
            {/* Mobile sidebar toggle button */}
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

            <Chat jobID={params.jobID} chatID={params.chatID} />
          </div>

          {/* Overlay to close sidebar on mobile */}
          {sidebarOpen && isMobile && (
            <div
              className="fixed inset-0 bg-black/20 z-30"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </>
  );
}
