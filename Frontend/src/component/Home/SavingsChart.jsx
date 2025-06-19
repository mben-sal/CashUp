import { useState } from 'react';
import { Line } from "react-chartjs-2";
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

function SavingsChart() {
  const [chartData] = useState([
    { day: 25, amount: 400 },
    { day: 26, amount: 450 },
    { day: 27, amount: 470 },
    { day: 28, amount: 520 },
    { day: 29, amount: 550 },
    { day: 30, amount: 580 }
  ]);

  const data = {
    labels: chartData.map(item => `${item.day} Mai`),
    datasets: [
      {
        data: chartData.map(item => item.amount),
        borderColor: '#10B981', // Couleur verte pour l'épargne
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2937',
        bodyColor: '#1F2937',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        borderColor: '#E5E7EB',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].label;
          },
          label: (context) => `${context.parsed.y}€ épargnés`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f3f4f6' },
        ticks: {
          font: { size: 12 },
          color: '#6B7280',
          callback: function(value) {
            return value + '€';
          }
        }
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 12 },
          color: '#6B7280'
        }
      }
    }
  };

  return (
    <div className="h-full w-full">
      <Line data={data} options={options} />
    </div>
  );
}

export default SavingsChart;