import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface HourlyChartProps {
  data: { hour: number; count: number }[];
}

export default function HourlyChart({ data }: HourlyChartProps) {
  const getColor = (count: number) => {
    const max = Math.max(...data.map(d => d.count));
    const ratio = count / max;
    
    if (ratio < 0.3) return 'rgba(16, 185, 129, 0.8)'; // Green
    if (ratio < 0.6) return 'rgba(245, 158, 11, 0.8)'; // Orange
    return 'rgba(239, 68, 68, 0.8)'; // Red
  };

  const chartData = {
    labels: data.map(d => `${d.hour}:00`),
    datasets: [
      {
        label: 'Crime Count',
        data: data.map(d => d.count),
        backgroundColor: data.map(d => getColor(d.count)),
        borderColor: data.map(d => getColor(d.count).replace('0.8', '1')),
        borderWidth: 1
      }
    ]
  };

  const options = {
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
          title: function(context: any) {
            return `${context[0].label}`;
          },
          label: function(context: any) {
            return `Crimes: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#9ca3af',
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
      <h3 className="text-white text-lg font-semibold mb-4">Hourly Crime Distribution</h3>
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
