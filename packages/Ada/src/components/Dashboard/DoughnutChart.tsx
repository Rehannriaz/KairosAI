'use client';
import React from 'react';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register the required components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DoughnutChart = () => {
  // Data for the doughnut chart
  const data: any = {
    labels: [
      'January',
      'February',
      'March',
    ], // Labels for each segment of the doughnut
    datasets: [
      {
        label: 'Monthly Data',
        data: [150, 140, 200], // Values for each segment
        backgroundColor: [
          'rgba(47, 203, 99, 1)', // Color for each segment
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderColor: [
          '#2fcb63',
          '#4bc0c0',
          '#9966ff',
          '#ff9f40',
          '#ff6384',
          '#36a2eb',
          '#f1c40f',
          '#4bc0c0',
          '#9966ff',
          '#ff9f40',
          '#ff6384',
          '#36a2eb',
        ],
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
        <div className="w-full">
          <Doughnut data={data} options={options}  width={408} height={408}/>
        </div>
      </div>
    </div>
  );
};

export default DoughnutChart;
