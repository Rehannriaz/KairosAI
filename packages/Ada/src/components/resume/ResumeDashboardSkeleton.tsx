import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ResumeDashboardSkeleton = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 mx-auto max-w-7xl">
      {/* Header Section */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-10 w-32 self-start sm:self-auto" />
      </div>

      <Card className="overflow-x-auto">
        {/* Search Bar */}
        <div className="p-4 border-b">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Table Wrapper for Responsiveness */}
        <div className="min-w-[100px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-4 w-16 ml-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-8 w-8" />
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default ResumeDashboardSkeleton;
