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
import { ChevronDown, ChevronRight } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface Interview {
  id: string | number;
  jobTitle: string;
  company: string;
  date?: string;
  status?: 'Completed' | 'Ongoing' | 'Scheduled';
  children?: Interview[];
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job Title</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {interviews.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4 text-gray-500">
              No interviews intiated yet!
            </TableCell>
          </TableRow>
        ) : (
          interviews.map((job) => (
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
                  <Badge>{job.status}</Badge>
                </TableCell>
              </TableRow>

              {expandedRows.includes(job.id as number) &&
                job.children?.map((interview, index) => (
                  <TableRow key={interview.id} className="bg-gray-50">
                    <TableCell className="pl-6">
                      {interview.jobTitle} Interview-{index + 1}
                    </TableCell>
                    <TableCell>{interview.company}</TableCell>
                    <TableCell>
                      {moment(interview.date).format('YYYY-MM-DD HH:mm')}
                    </TableCell>
                    <TableCell>
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
