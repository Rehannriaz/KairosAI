import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
}

export function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/40">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <CardDescription className="text-xs mt-1">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
