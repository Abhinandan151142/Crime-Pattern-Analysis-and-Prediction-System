import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  change: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'red';
}

export default function StatsCard({ title, value, change, icon: Icon, color }: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30',
    orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
    red: 'from-red-500/20 to-red-600/20 border-red-500/30'
  };

  const iconColorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 backdrop-blur-lg hover:scale-105 transition-transform duration-300`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`${iconColorClasses[color]} p-3 rounded-lg shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center gap-1">
          {change >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {Math.abs(change)}%
          </span>
        </div>
      </div>
      <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
      <p className="text-white text-3xl font-bold">{displayValue.toLocaleString()}</p>
    </div>
  );
}
