import DoughnutChart from '@/components/Dashboard/DoughnutChart';
import { AnimatedLayout } from '@/components/global/animated-layout';
import { LineChart } from '@/components/line-chart';
import { StatCard } from '@/components/stat-card';
import { Briefcase, Calendar, Users, FileText } from 'lucide-react';

export default function DashboardPage() {
  return (
    <AnimatedLayout>
      <main className="p-6 space-y-6 star-bg">
        <div>
          <h1 className="text-3xl font-bold tracking-tight ">Dashboard</h1>
          <p className=" mt-2">
            This is your dashboard, providing insights into your job
            applications. Track the jobs you've applied to, see how many
            opportunities are available, and stay updated on your progress.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Applied to more than"
            value="100"
            description="Jobs in the last 24 hours"
            icon={<Briefcase className="h-4 w-4" />}
            delay={0}
          />
          <StatCard
            title="Total Users"
            value="5"
            description="Active job seekers using the platform"
            icon={<Users className="h-4 w-4" />}
            delay={1}
          />
          <StatCard
            title="Available Job Listings"
            value="250"
            description="Total jobs currently available"
            icon={<FileText className="h-4 w-4" />}
            delay={2}
          />
          <StatCard
            title="Upcoming Interviews"
            value="20"
            description="Interviews scheduled this week"
            icon={<Calendar className="h-4 w-4" />}
            delay={3}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <LineChart />
          <DoughnutChart />
        </div>
      </main>
    </AnimatedLayout>
  );
}
