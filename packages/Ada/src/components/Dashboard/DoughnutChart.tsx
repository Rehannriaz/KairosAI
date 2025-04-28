'use client';

import { Skeleton } from '../ui/skeleton';
import { ApplicationTrackerService } from '@/api/applicationTrackerService';
import { getUserId } from '@/lib';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

// Register the required components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const DoughnutChart = () => {
  const [chartData, setChartData] = useState<number[]>(new Array(12).fill(0)); // Initialize with empty data
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
        );

        // Extract current month and previous two months' data
        const currentMonth = new Date().getMonth();
        const relevantData = [
          data[currentMonth],
          data[(currentMonth - 1 + 12) % 12],
          data[(currentMonth - 2 + 12) % 12],
        ];
        setChartData(relevantData);
        setIsLoading(false); // Data loaded, set loading to false
      } catch (error) {
        console.error('Error fetching application data:', error);
        setIsLoading(false); // Error occurred, stop loading
      }
    }

    fetchApplicationData();
  }, []);

  // Data for the doughnut chart
  const data: any = {
    labels: ['Current Month', 'Previous Month', 'Two Months Ago'], // Labels for each segment
    datasets: [
      {
        label: 'Monthly Data',
        data: chartData, // Data for the selected months
        backgroundColor: [
          'rgba(47, 203, 99, 1)', // Color for current month
          'rgba(75, 192, 192, 1)', // Color for previous month
          'rgba(153, 102, 255, 1)', // Color for two months ago
        ],
        borderColor: ['#2fcb63', '#4bc0c0', '#9966ff'],
        borderWidth: 0.2, // Border width for each segment
        cutout: '70%', // Cutout percentage
        offset: 10, // Offset from the center
      },
    ],
  };

  // Options for the doughnut chart
  const options: any = {
    maintainAspectRatio: false, // Allow chart to be responsive
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const, // Position of the legend
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `Value: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div>
      <div className="mt-4 w-full max-w-6xl mx-auto px-4">
        <div className="w-full flex items-center justify-center">
          {isLoading ? (
            <div className="w-[408px] h-[408px] mx-32 rounded-lg flex align-middle flex-1 items-center justify-center">
              <Skeleton className="h-full w-full rounded-3xl" />
            </div>
          ) : (
            <Doughnut data={data} options={options} width={408} height={408} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DoughnutChart;
