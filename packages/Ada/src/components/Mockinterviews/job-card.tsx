import chatServiceInstance from '@/api/chatService';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface JobCardProps {
  title?: string;
  company?: string;
  description?: string;
  location?: string;
  salary?: number;
  job_id?: string;
  chatID?: string;
  isLoading?: boolean;
}

export function JobCard({
  title,
  company,
  description,
  location,
  salary,
  job_id,
  chatID,
  isLoading = false,
}: JobCardProps) {
  const isDisabled = !job_id;
  const router = useRouter();
  if (isLoading) {
    return (
      <Card className="w-full h-[400px] flex flex-col">
        <CardHeader>
          <div className="space-y-2">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="mt-4 flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-auto">
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }
  const handleInitiateInterviewClick = async (job_id: string) => {
    try {
      const newChat = await chatServiceInstance.initateChatForSpecificJob(
        job_id
      );
      router.push(`/mock-interviews/${job_id}/${newChat.interview_id}`);
    } catch (error) {
      console.error('Error initiating chat:', error);
    }
  };

  return (
    <Card className="w-full h-[400px] flex flex-col">
      <CardHeader>
        <CardTitle>{title || 'No title available'}</CardTitle>
        <CardDescription>{company || 'Company not specified'}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <p className="text-sm text-muted-foreground">
          {description ? description : 'No job description provided.'}
        </p>
        <div className="mt-4 flex justify-between text-sm">
          <span>{location || 'Location not specified'}</span>
          <span>Salary: {salary && salary > 0 ? salary : 'N/A'}</span>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          className="w-full"
          disabled={isDisabled}
          onClick={() => job_id && handleInitiateInterviewClick(job_id)}
        >
          Start Interview Now
        </Button>
      </CardFooter>
    </Card>
  );
}
