'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  ThumbsUp,
  FileText,
  Info,
  Settings,
  NotebookText,
  X,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type React from 'react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  isMobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isMobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const activeRoute = `/${pathname.split('/')[1]}`;
  const containerRef = useRef<HTMLDivElement>(null);

  const [indicatorY, setIndicatorY] = useState(0);
  const [indicatorHeight, setIndicatorHeight] = useState(0);

  const updateIndicator = (rect: DOMRect | null) => {
    if (!containerRef.current) return;
    const offset = containerRef.current.getBoundingClientRect().top + 80;
    if (rect) {
      setIndicatorY(rect.top - offset);
      setIndicatorHeight(rect.height);
    } else {
      const activeEl = containerRef.current.querySelector(
        '[data-active="true"]'
      );
      if (activeEl instanceof HTMLElement) {
        const rect = activeEl.getBoundingClientRect();
        setIndicatorY(rect.top - offset);
        setIndicatorHeight(rect.height);
      }
    }
  };

  useEffect(() => {
    updateIndicator(null);
  }, [pathname]);

  return (
    <>
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      <div
        ref={containerRef}
        className={cn(
          'relative pb-12 border-r border-border/40 h-screen z-50',
          'fixed md:static',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          'transition-transform duration-300 ease-in-out',
          className
        )}
      >
        <div className="space-y-4 py-4">
          <div className="px-6 py-2 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo_white_notext.png"
                  alt="Kairos AI Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-lg tracking-tight">
                KAIROS AI
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          </div>
          <div className="px-3 py-2 relative">
            <motion.div
              className="absolute left-2 right-2 rounded-md bg-primary/10 z-0"
              style={{ top: 0 }}
              animate={{ top: indicatorY, height: indicatorHeight }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
            <div className="space-y-1 relative z-10">
              {[
                {
                  href: '/dashboard',
                  icon: <LayoutDashboard size={20} />,
                  title: 'Dashboard',
                },
                {
                  href: '/jobs',
                  icon: <Briefcase size={20} />,
                  title: 'View Jobs',
                },
                {
                  href: '/recommendation',
                  icon: <ThumbsUp size={20} />,
                  title: 'Recommend Jobs',
                },
                {
                  href: '/resume',
                  icon: <FileText size={20} />,
                  title: 'Resume',
                },
                {
                  href: '/application-tracker',
                  icon: <NotebookText size={20} />,
                  title: 'Application Tracker',
                },
                {
                  href: '/mock-interviews',
                  icon: <Sparkles size={20} />,
                  title: 'Mock Interviews',
                },
                {
                  href: '/about',
                  icon: <Info size={20} />,
                  title: 'About KairosAI',
                },
                {
                  href: '/settings',
                  icon: <Settings size={20} />,
                  title: 'Settings',
                },
              ].map((item) => (
                <SidebarItem
                  key={item.href}
                  {...item}
                  active={activeRoute === item.href}
                  onHover={updateIndicator}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  onHover?: (rect: DOMRect | null) => void;
}

function SidebarItem({ href, icon, title, active, onHover }: SidebarItemProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    if (ref.current && onHover) {
      onHover(ref.current.getBoundingClientRect());
    }
  };

  const handleMouseLeave = () => {
    if (onHover) {
      onHover(null);
    }
  };

  return (
    <Link
      ref={ref}
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-active={active ? 'true' : undefined}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all relative',
        active
          ? 'text-primary font-medium'
          : 'text-muted-foreground hover:text-primary'
      )}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
}
