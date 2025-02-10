import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Interview {
  id: number;
  jobTitle: string;
  company: string;
  date: string;
  status?: 'Completed' | 'Ongoing' | 'Scheduled';
  children?: Omit<Interview, 'status' | 'children'>[];
}

interface InterviewsTableProps {
  interviews: Interview[];
}

export function InterviewsTable({ interviews }: InterviewsTableProps) {
  const [expandedRows, setExpandedRows] = React.useState<number[]>([]);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const renderInterviewRow = (
    interview: Interview,
    depth = 0,
    isChild = false
  ) => {
    const hasChildren = interview.children && interview.children.length > 0;
    const isExpanded = expandedRows.includes(interview.id);

    return (
      <React.Fragment key={interview.id}>
        <TableRow>
          <TableCell className="font-medium">
            <div className="flex items-center">
              {hasChildren && (
                <button
                  onClick={() => toggleRow(interview.id)}
                  className="mr-2"
                >
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              )}
              <span style={{ marginLeft: `${depth * 20}px` }}>
                {interview.jobTitle}
              </span>
            </div>
          </TableCell>
          <TableCell>{interview.company}</TableCell>
          <TableCell>{interview.date}</TableCell>
          <TableCell>
            {isChild ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  console.log(`Starting interview ${interview.id}`)
                }
              >
                Start Now
              </Button>
            ) : interview.status ? (
              <Badge
                variant={
                  interview.status === 'Completed'
                    ? 'default'
                    : interview.status === 'Ongoing'
                    ? 'secondary'
                    : 'destructive'
                }
              >
                {interview.status}
              </Badge>
            ) : null}
          </TableCell>
        </TableRow>
        {isExpanded &&
          interview.children?.map((child) =>
            renderInterviewRow(child, depth + 1, true)
          )}
      </React.Fragment>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job Title</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status / Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {interviews.map((interview) => renderInterviewRow(interview))}
      </TableBody>
    </Table>
  );
}
