'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Application } from '@/types/application-tracker';
import { format, formatDistanceToNow } from 'date-fns';
import { Edit, Eye, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface ApplicationCardProps {
  application: Application;
  onViewDetails: (application: Application) => void;
  onEditApplication: (application: Application) => void;
  onUpdateStatus: (
    id: string,
    status: 'applied' | 'interview' | 'offer' | 'rejected'
  ) => void;
  onDeleteApplication: (id: string) => void;
}

export function ApplicationCard({
  application,
  onViewDetails,
  onEditApplication,
  onUpdateStatus,
}: ApplicationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'bg-blue-100 w-[6rem] justify-center text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'interview':
      case 'screening':
      case 'technical':
        return 'bg-purple-100  w-[6rem] justify-center text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'offer':
        return 'bg-green-100  w-[6rem] justify-center text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100  w-[6rem] justify-center text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'accepted':
        return 'bg-emerald-100  w-[6rem] justify-center text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
      case 'declined':
      case 'withdrawn':
        return 'bg-amber-100  w-[6rem] justify-center text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default:
        return 'bg-gray-100  w-[6rem] justify-center text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Format dates
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Unknown';
    }
  };

  return (
    <Card className="overflow-hidden border">
      <CardContent className="p-0">
        <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-md flex items-center justify-center bg-slate-100">
              {application.logo ? (
                <Image
                  src={application.logo}
                  alt={`${application.company} logo`}
                  width={56}
                  height={56}
                  className="object-contain rounded-md"
                />
              ) : (
                <span className="text-lg font-semibold text-slate-700">
                  {application.company.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Application Details */}
          <div className="flex-grow flex flex-col">
            <div className="flex flex-col md:flex-row justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold">
                  {application.position}
                </h3>
                <p className="text-gray-500">{application.company}</p>
              </div>
              <Badge
                className={`self-start md:self-auto ${getStatusColor(
                  application.status
                )}`}
              >
                {application.status.charAt(0).toUpperCase() +
                  application.status.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {application.location && (
                <div>
                  <span className="font-medium">Location:</span>{' '}
                  {application.location}
                </div>
              )}
              {application.salary && (
                <div>
                  <span className="font-medium">Salary:</span>{' '}
                  {application.salary}
                </div>
              )}
              <div>
                <span className="font-medium">Applied:</span>{' '}
                {formatDate(application.applied_date)}
              </div>
              <div>
                <span className="font-medium">Updated:</span>{' '}
                {getTimeAgo(application.updated_date)}
              </div>
            </div>

            {application.next_step && (
              <div className="mt-3 py-2 border-t text-sm">
                <span className="font-medium">Next step:</span>{' '}
                {application.next_step}
              </div>
            )}
            {application.application_tracker_notes?.[0]?.note && (
              <div className="mt-3 py-2 border-t text-sm">
                <span className="font-medium">Notes:</span>{' '}
                {application.application_tracker_notes[0].note}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-transparent  px-4 py-3 flex justify-between">
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewDetails(application)}
          >
            <Eye className="h-4 w-4 mr-1" /> View
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEditApplication(application)}
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          {application.url && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                application.url && window.open(application.url, '_blank')
              }
            >
              <ExternalLink className="h-4 w-4 mr-1" /> Job Post
            </Button>
          )}
        </div>

        <div className="hidden md:flex space-x-2">
          <div className="flex space-x-1 text-sm">
            {application.status !== 'rejected' &&
              application.status !== 'declined' &&
              application.status !== 'withdrawn' &&
              application.status !== 'accepted' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => onUpdateStatus(application.id, 'rejected')}
                >
                  Rejected
                </Button>
              )}
            {(application.status === 'applied' ||
              application.status === 'screening') && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => onUpdateStatus(application.id, 'interview')}
              >
                Interview
              </Button>
            )}
            {application.status === 'interview' && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => onUpdateStatus(application.id, 'offer')}
              >
                Offer
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
