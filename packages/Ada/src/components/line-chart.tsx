'use client';

import { ApplicationTrackerService } from '@/api/applicationTrackerService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserId } from '@/lib';
import { Chart, registerables } from 'chart.js';
import { useEffect, useRef, useState } from 'react';

// Adjust path if needed

Chart.register(...registerables);

export function LineChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [chartData, setChartData] = useState<number[]>(new Array(12).fill(0)); // Initialize with zero
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  );
  const [isLoading, setIsLoading] = useState<boolean>(true); // State to track loading

  // Fetch application data from the backend
  useEffect(() => {
    async function fetchApplicationData() {
      try {
        const userID = getUserId();
        if (!userID) {
          console.error('User ID is not available');
          return;
        }
        const data = await ApplicationTrackerService.getApplicationsForChart(
          userID
        ); // Replace with your API endpoint
        console.log('Fetched application data:', data);

        // Update the state with the counted applications per month
        setChartData(data);
        setIsLoading(false); // Data loaded, set loading to false
      } catch (error) {
        console.error('Error fetching application data:', error);
        setIsLoading(false); // Error occurred, stop loading
      }
    }

    fetchApplicationData();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ]
          .slice(currentMonth + 1) // Get months after the current month
          .concat(
            [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ].slice(0, currentMonth + 1) // Get months before and including the current month
          ), // Adjust x-axis labels to start from the current month
        datasets: [
          {
            label: 'Job Applications',
            data: [
              ...chartData.slice(currentMonth + 1),
              ...chartData.slice(0, currentMonth + 1),
            ], // Adjust the chart data accordingly
            borderColor: '#a855f7',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              callback: (value) => {
                const numValue = Number(value); // Ensure the value is treated as a number
                return !isNaN(numValue) ? numValue.toFixed(0) : value; // Apply .toFixed(0) to remove decimal places
              },
            },
            suggestedMin: 0, // Force the y-axis to start at 0
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, currentMonth]); // Recreate chart when chartData or currentMonth changes

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/40">
      <CardHeader>
        <CardTitle>Job Applications Over Time</CardTitle>
        <CardDescription>Monthly application trends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <canvas ref={chartRef} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
