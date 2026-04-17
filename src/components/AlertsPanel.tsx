import { useEffect } from 'react';
import { X, AlertTriangle, Info, AlertCircle, Zap, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Alert } from '../types';

interface AlertsPanelProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
}

export default function AlertsPanel({ alerts, onDismiss, onClearAll }: AlertsPanelProps) {
  // Auto-dismiss info alerts after 10 seconds
  useEffect(() => {
    const timers = alerts
      .filter(alert => alert.type === 'info')
      .map(alert => {
        return setTimeout(() => {
          onDismiss(alert.id);
        }, 10000); // 10 seconds
      });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [alerts, onDismiss]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <Zap className="w-5 h-5" />;
      case 'danger': return <AlertTriangle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getAlertClass = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'danger': return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      default: return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
    }
  };

  const getSeverityBadge = (type: string) => {
    switch (type) {
      case 'critical': return 'CRITICAL';
      case 'danger': return 'HIGH';
      case 'warning': return 'MEDIUM';
      default: return 'LOW';
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-white text-lg font-semibold">System Alerts</h3>
        {alerts.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border rounded-lg p-4 ${getAlertClass(alert.type)} animate-slideInRight transition-all hover:shadow-lg`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {getAlertIcon(alert.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-medium">{alert.message}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    alert.type === 'critical' ? 'bg-red-500/30 text-red-300' :
                    alert.type === 'danger' ? 'bg-orange-500/30 text-orange-300' :
                    alert.type === 'warning' ? 'bg-yellow-500/30 text-yellow-300' :
                    'bg-blue-500/30 text-blue-300'
                  }`}>
                    {getSeverityBadge(alert.type)}
                  </span>
                </div>
                {alert.district && (
                  <p className="text-sm opacity-80 mb-1">📍 District: {alert.district}</p>
                )}
                <p className="text-xs opacity-60">
                  {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <button
                  onClick={() => onDismiss(alert.id)}
                  className="flex-shrink-0 hover:bg-green-500/20 rounded p-1 transition-colors group"
                  title="Mark as resolved"
                >
                  <CheckCircle className="w-4 h-4 text-gray-400 group-hover:text-green-400" />
                </button>
                <button
                  onClick={() => onDismiss(alert.id)}
                  className="flex-shrink-0 hover:bg-red-500/20 rounded p-1 transition-colors group"
                  title="Dismiss"
                >
                  <X className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="text-center py-8">
            <Info className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No active alerts</p>
          </div>
        )}
      </div>
    </div>
  );
}
