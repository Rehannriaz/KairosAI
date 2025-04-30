import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface Interview {
  id: string | number;
  jobTitle: string;
  company: string;
  date?: string;
  status?: 'Completed' | 'Ongoing' | 'Scheduled' | 'In Progress';
  children?: Interview[];
  interview_ids?: string[];
  interview_dates?: string[];
  statuses?: string[];
  job_title?: string;
  job_id?: string;
  job_company?: string;
  user_id?: string;
}
interface InterviewsTableProps {
  interviews: Interview[];
}

export function InterviewsTable({ interviews }: InterviewsTableProps) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const router = useRouter();

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const getStatusVariant = (status?: string) => {
    switch (status) {
      case 'Completed':
        return 'outline';
      case 'Ongoing':
        return 'default';
      case 'In Progress':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  const determineParentStatus = (statuses?: string[]) => {
    if (!statuses || statuses.length === 0) return 'Scheduled';

    const hasCompleted = statuses.includes('Completed');
    const hasOngoing = statuses.includes('Ongoing');

    if (hasCompleted && hasOngoing) {
      return 'In Progress';
    } else if (statuses.every((status) => status === 'Completed')) {
      return 'Completed';
    } else if (hasOngoing) {
      return 'Ongoing';
    } else {
      return 'Scheduled';
    }
  };

  const handleViewFeedback = (interviewId: string | number) => {
    router.push(`/mock-interviews/feedback/${interviewId}`);
  };

  // Process interviews to create child items for display
  const processInterviews = (interviews: Interview[]) => {
    return interviews.map((job) => {
      // For data in the format provided in the example
      if (job.interview_ids && job.interview_dates && job.statuses) {
        const childInterviews = job.interview_ids.map((id, index) => ({
          id: id,
          jobTitle: job.job_title || job.jobTitle,
          company: job.job_company || job.company,
          date: job.interview_dates?.[index] ?? '',
          status: job.statuses?.[index] ?? 'Scheduled',
        }));

        return {
          ...job,
          id: job.job_id || job.id,
          jobTitle: job.job_title || job.jobTitle,
          company: job.job_company || job.company,
          status: determineParentStatus(job.statuses),
          children: childInterviews,
        };
      }

      // For already structured data with children
      if (job.children && job.children.length > 0) {
        const childStatuses = job.children.map(
          (child) => child.status as string
        );
        return {
          ...job,
          status: determineParentStatus(childStatuses),
        };
      }

      return job;
    });
  };

  // Process the interviews data
  const processedInterviews = processInterviews(interviews);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job Title</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {processedInterviews.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4 ">
              No interviews initiated yet!
            </TableCell>
          </TableRow>
        ) : (
          processedInterviews.map((job) => (
            <React.Fragment key={job.id}>
              <TableRow>
                <TableCell>
                  {job.children && job.children.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleRow(job.id as number)}
                    >
                      {expandedRows.includes(job.id as number) ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </Button>
                  )}
                  {job.jobTitle}
                </TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(job.status)}>
                    {job.status === 'In Progress'
                      ? 'In Progress (Partial)'
                      : job.status}
                  </Badge>
                </TableCell>
                <TableCell>-</TableCell>
              </TableRow>

              {expandedRows.includes(job.id as number) &&
                job.children?.map((interview, index) => (
                  <TableRow key={interview.id} className="bg-accent">
                    <TableCell className="pl-6">
                      {interview.jobTitle} Interview-{index + 1}
                    </TableCell>
                    <TableCell>{interview.company}</TableCell>
                    <TableCell>
                      {moment(interview.date).format('YYYY-MM-DD HH:mm')}
                    </TableCell>
                    <TableCell>
                      {interview.status === 'Completed' ||
                      interview.status === 'Ongoing' ? (
                        <Badge variant={getStatusVariant(interview.status)}>
                          {interview.status}
                        </Badge>
                      ) : (
                        <Badge
                          variant={'outline'}
                          className="cursor-pointer"
                          onClick={() => {
                            router.push(
                              `/mock-interviews/${job.id}/${interview.id}`
                            );
                          }}
                        >
                          Start Now
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {interview.status === 'Completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleViewFeedback(interview.id)}
                        >
                          <FileText size={14} />
                          <span>View Feedback</span>
                        </Button>
                      )}
                      {interview.status === 'Ongoing' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => {
                            router.push(
                              `/mock-interviews/${job.id}/${interview.id}`
                            );
                          }}
                        >
                          <ChevronRight size={14} />
                          <span>Continue</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </React.Fragment>
          ))
        )}
      </TableBody>
    </Table>
  );
}
