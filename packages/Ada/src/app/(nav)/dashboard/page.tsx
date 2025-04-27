'use client';

import DoughnutChart from '@/components/Dashboard/DoughnutChart';
import { AnimatedLayout } from '@/components/global/animated-layout';
import { LineChart } from '@/components/line-chart';
import { StatCard } from '@/components/stat-card';
import { getUsername, getUserId } from '@/lib';
import { Briefcase, Calendar, Users, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UserMetaData {
  jobs_applied: number;
  available_jobs: number;
  upcoming_interviews: number;
}

export default function DashboardPage() {
  const userName = getUsername();
  const userId = getUserId(); // Get user ID from lib
  const [metaData, setMetaData] = useState<UserMetaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserMetaData = async () => {
      if (!userId) {
        console.error('No user ID available');
        setError('User identification failed');
        setLoading(false);
        return;
      }

      try {
        // Pass the userId as a query parameter
        const response = await fetch(`/api/user-meta?userId=${userId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch user meta data');
        }

        const result = await response.json();

        if (result.data && result.data.length > 0) {
          setMetaData(result.data[0]);
        } else {
          // Use fallback data if no data is returned for this user
          setMetaData({
            jobs_applied: 0,
            available_jobs: 0,
            upcoming_interviews: 0,
          });
        }
      } catch (err) {
        console.error('Error fetching user meta data:', err);
        setError('Could not load dashboard data');
        // Use fallback data on error
        setMetaData({
          jobs_applied: 0,
          available_jobs: 0,
          upcoming_interviews: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserMetaData();
  }, [userId]); // Re-fetch if userId changes

  return (
    <AnimatedLayout>
      <main className="p-6 space-y-6 star-bg">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <h1 className="text-2xl mt-2 font-bold tracking-tight">
            <span className="font-bold">
              {userName ? `Welcome, ${userName}` : ''}
            </span>
          </h1>
          <p className="mt-2">
            This is your dashboard, providing insights into your job
            applications. Track the jobs you've applied to, see how many
            opportunities are available, and stay updated on your progress.
          </p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {loading ? (
          <div className="text-center py-10">Loading dashboard data...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Applied Jobs"
              value={metaData?.jobs_applied?.toString() || '0'}
              description="Jobs you've applied to"
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
              value={metaData?.available_jobs?.toString() || '0'}
              description="Total jobs currently available"
              icon={<FileText className="h-4 w-4" />}
              delay={2}
            />
            <StatCard
              title="Upcoming Interviews"
              value={metaData?.upcoming_interviews?.toString() || '0'}
              description="Interviews scheduled this week"
              icon={<Calendar className="h-4 w-4" />}
              delay={3}
            />
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <LineChart />
          <DoughnutChart />
        </div>
      </main>
    </AnimatedLayout>
  );
}
