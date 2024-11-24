'use client';
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
  LineElement,
  PointElement,
  Filler,
} from 'chart.js';

// Register the required components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
  LineElement,
  PointElement
);

const LineChart = () => {
  // Data for the line chart
  const data: any = {
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
    ], // X axis labels
    datasets: [
      {
        label: 'Dataset',
        data: [150, 140, 200, 80, 168, 190, 210, 298, 350, 300, 290, 180, 199], // Y axis data (percentage of days absent)
        backgroundColor: 'rgba(47, 203, 99, 0.5)', // Fill color with transparency
        borderColor: '#2fcb63', // Line color
        borderWidth: 2, // Line width
        fill: true,
        tension: 0.4, // Adjust this value to control the curvature of the line
      },
    ],
  };

  // Options for the line chart
  const options: any = {
    maintainAspectRatio: false, // Allow chart to be responsive
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const, // Correct type for position
      },
      //   tooltip: {
      //     callbacks: {
      //       label: function (tooltipItem: any) {
      //         return `Percentage: ${tooltipItem.raw}%`;
      //       },
      //     },
      //   },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Dataset',
        },
        // ticks: {
        //   callback: function (value: number) {
        //     return `${value}%`; // Append percentage sign to y-axis ticks
        //   },
        // },
      },
    },
  };

  return (
    <div>
      <div className="mt-4 w-full max-w-6xl mx-auto px-4">
        <div className="w-full">
          <Line data={data} options={options} width={900} height={450} />
        </div>
      </div>
    </div>
  );
};

export default LineChart;
