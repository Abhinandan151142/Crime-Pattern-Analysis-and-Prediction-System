import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { DistrictData } from '../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DistrictChartProps {
  data: DistrictData[];
}

export default function DistrictChart({ data }: DistrictChartProps) {
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  const getColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'rgba(239, 68, 68, 0.8)';
      case 'medium': return 'rgba(245, 158, 11, 0.8)';
      case 'low': return 'rgba(16, 185, 129, 0.8)';
      default: return 'rgba(59, 130, 246, 0.8)';
    }
  };

  const chartData = {
    labels: sortedData.map(d => d.district),
    datasets: [
      {
        label: 'Crime Count',
        data: sortedData.map(d => d.count),
        backgroundColor: sortedData.map(d => getColor(d.riskLevel)),
        borderColor: sortedData.map(d => getColor(d.riskLevel).replace('0.8', '1')),
        borderWidth: 1
      }
    ]
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f9fafb',
        bodyColor: '#d1d5db',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context: any) {
            const district = sortedData[context.dataIndex];
            return [
              `Crimes: ${context.parsed.x}`,
              `Risk Level: ${district.riskLevel.toUpperCase()}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: '#9ca3af'
        }
      }
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
      <h3 className="text-white text-lg font-semibold mb-4">District Comparison</h3>
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
