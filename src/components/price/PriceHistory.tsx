import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceHistoryProps {
  phoneId: string;
  data: {
    dates: string[];
    prices: {
      tr: number[];
      eu: number[];
      us: number[];
    };
  };
}

export function PriceHistory({ data }: PriceHistoryProps) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const chartData = {
    labels: data.dates,
    datasets: [
      {
        label: 'Türkiye',
        data: data.prices.tr,
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
      },
      {
        label: 'Avrupa',
        data: data.prices.eu,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
      },
      {
        label: 'ABD',
        data: data.prices.us,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Fiyat Geçmişi</h3>
      <Line options={options} data={chartData} />
    </div>
  );
}