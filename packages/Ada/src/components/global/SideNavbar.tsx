'use client';

import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Briefcase,
  ThumbsUp,
  FileText,
  Video,
  Info,
  Settings,
  NotebookText,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const activeRoute = `/${pathname.split('/')[1]}`; // e.g., /jobs from /jobs/123

  return (
    <div className={cn('pb-12 border-r border-border/40 h-screen', className)}>
      <div className="space-y-4 py-4">
        <div className="px-6 py-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image
                src="/logo_white_notext.png"
                alt="Kairos AI Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-lg tracking-tight">KAIROS AI</span>
          </Link>
        </div>
        <div className="px-3 py-2">
          <div className="space-y-1">
            <SidebarItem
              href="/dashboard"
              icon={<LayoutDashboard size={20} />}
              title="Dashboard"
              active={activeRoute === '/dashboard'}
            />
            <SidebarItem
              href="/jobs"
              icon={<Briefcase size={20} />}
              title="View Jobs"
              active={activeRoute === '/jobs'}
            />
            <SidebarItem
              href="/recommendation"
              icon={<ThumbsUp size={20} />}
              title="Recommend Jobs"
              active={activeRoute === '/recommendation'}
            />
            <SidebarItem
              href="/resume"
              icon={<FileText size={20} />}
              title="Resume"
              active={activeRoute === '/resume'}
            />
            <SidebarItem
              href="/application-tracker"
              icon={<NotebookText size={20} />}
              title="Application Tracker"
              active={activeRoute === '/application-tracker'}
            />
            <SidebarItem
              href="/mock-interviews"
              icon={<Video size={20} />}
              title="Interview"
              active={activeRoute === '/mock-interviews'}
            />
            <SidebarItem
              href="/about"
              icon={<Info size={20} />}
              title="About KairosAI"
              active={activeRoute === '/about'}
            />
            <SidebarItem
              href="/settings"
              icon={<Settings size={20} />}
              title="Settings"
              active={activeRoute === '/settings'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  active?: boolean;
}

function SidebarItem({ href, icon, title, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary',
        active ? 'bg-secondary text-primary' : 'text-muted-foreground'
      )}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
}
