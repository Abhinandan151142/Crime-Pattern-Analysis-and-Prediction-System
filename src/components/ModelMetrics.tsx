import { Brain, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ModelMetrics as ModelMetricsType } from '../types';

interface ModelMetricsProps {
  metrics: ModelMetricsType;
}

export default function ModelMetrics({ metrics }: ModelMetricsProps) {
  const MetricCard = ({ label, value, max = 1 }: { label: string; value: number; max?: number }) => {
    const percentage = (value / max) * 100;
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">{label}</span>
          <span className="text-white font-semibold">{(value * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-lg font-semibold flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          ML Model Performance
        </h3>
        <TrendingUp className="w-5 h-5 text-green-500" />
      </div>

      {/* Accuracy gauge */}
      <div className="mb-6">
        <div className="relative w-40 h-40 mx-auto">
          <svg className="transform -rotate-90 w-40 h-40">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="rgba(75, 85, 99, 0.3)"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - metrics.accuracy)}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{(metrics.accuracy * 100).toFixed(0)}%</span>
            <span className="text-gray-400 text-sm">Accuracy</span>
          </div>
        </div>
      </div>

      {/* Other metrics */}
      <div className="space-y-4 mb-6">
        <MetricCard label="Precision" value={metrics.precision} />
        <MetricCard label="Recall" value={metrics.recall} />
        <MetricCard label="F1 Score" value={metrics.f1Score} />
      </div>

      {/* Last trained */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 mb-3">
        <p className="text-gray-400 text-xs mb-1">Last Retrained</p>
        <p className="text-white text-sm font-medium">
          {formatDistanceToNow(new Date(metrics.lastTrained), { addSuffix: true })}
        </p>
      </div>

      {/* Model Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
        <p className="text-blue-400 text-xs font-medium mb-1">
          📊 Real-World Performance
        </p>
        <p className="text-gray-400 text-xs">
          Model trained on 50,000+ historical crime records with realistic accuracy metrics for production deployment.
        </p>
      </div>
    </div>
  );
}
