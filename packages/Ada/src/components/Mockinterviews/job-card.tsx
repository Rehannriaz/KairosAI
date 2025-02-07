import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

interface JobCardProps {
  title: string;
  company: string;
  description: string;
  location: string;
  salary: string;
  jobID?: string;
  chatID?: string;
}

export function JobCard({
  title,
  company,
  description,
  location,
  salary,
  jobID,
  chatID,
}: JobCardProps) {
  const isDisabled = !jobID || !chatID;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{company}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 flex justify-between text-sm">
          <span>{location}</span>
          <span>{salary}</span>
        </div>
      </CardContent>
      <CardFooter>
        {isDisabled ? (
          <Button className="w-full" disabled>
            Start Interview Now
          </Button>
        ) : (
          <Link href={`/mock-interviews/${jobID}/${chatID}`}>
            <Button className="w-full">Start Interview Now</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
