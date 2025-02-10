import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const ResumeReviewSkeleton = () => {
  return (
    <div className="container mx-auto max-w-4xl py-10">
      <Card className="p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        
        {/* Personal Information Section */}
        <div className="space-y-4 mb-8">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Professional Summary Section */}
        <div className="space-y-2 mb-8">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-[100px] w-full" />
        </div>

        {/* Skills Section */}
        <div className="space-y-2 mb-8">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-[100px] w-full" />
        </div>

        {/* Employment History Section */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-8 w-32" />
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="space-y-3 p-4 border rounded-md">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-[100px] w-full" />
            </div>
          ))}
        </div>

        {/* Education Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-32" />
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="space-y-3 p-4 border rounded-md">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
      </Card>
    </div>
  );
};

export default ResumeReviewSkeleton;