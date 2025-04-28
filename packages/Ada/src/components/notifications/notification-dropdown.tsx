'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useState } from 'react';

// Define notification type
type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export default function NotificationDropdown() {
  // Static notification data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Mock Interview Scheduled',
      message:
        'Your mock interview with TechCorp is scheduled for tomorrow at 10:00 AM.',
      time: '5 minutes ago',
      read: true,
    },
    {
      id: '2',
      title: 'New Job Application Update',
      message:
        "Your application for 'Frontend Developer at TechCorp' has been viewed by the recruiter.",
      time: '1 hour ago',
      read: true,
    },
    {
      id: '3',
      title: 'Resume Feedback Ready',
      message:
        'Your resume review results are ready. View suggestions to improve your chances!',
      time: '25 minutes ago',
      read: true,
    },
    {
      id: '4',
      title: 'New Job Recommendation',
      message:
        'We found new job opportunities matching your profile: Software Engineer at InnovateX.',
      time: '2 hours ago',
      read: true,
    },
  ]);

  // Count unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 dark:text-gray-300" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 dark:bg-red-600" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 dark:bg-card">
        <div className="flex items-center justify-between p-2">
          <DropdownMenuLabel className="dark:text-gray-200">
            Notifications
          </DropdownMenuLabel>
          <span className="text-xs font-medium dark:text-gray-400">
            {unreadCount} unread
          </span>
        </div>
        <DropdownMenuSeparator className="dark:bg-primary" />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  'flex flex-col items-start p-3 cursor-default',
                  !notification.read && 'bg-gray-50 dark:bg-card'
                )}
              >
                <div className="flex w-full justify-between">
                  <span className="font-medium dark:text-gray-200">
                    {notification.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 ml-2 -mr-2 dark:hover:bg-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                    title="Mark as read"
                  >
                    <Check className="h-3.5 w-3.5 dark:text-gray-400" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {notification.message}
                </p>
                <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {notification.time}
                </span>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No notifications
            </div>
          )}
        </DropdownMenuGroup>
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="dark:bg-primary" />
            <div className="flex justify-between p-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={markAllAsRead}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Mark all as read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={clearAllNotifications}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Clear all
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
