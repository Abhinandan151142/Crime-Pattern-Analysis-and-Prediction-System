import { useEffect, useRef } from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Crime } from '../types';

interface LiveCrimeFeedProps {
  crimes: Crime[];
  onCrimeClick?: (crime: Crime) => void;
}

export default function LiveCrimeFeed({ crimes, onCrimeClick }: LiveCrimeFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);
  const recentCrimes = crimes.slice(0, 10);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [crimes]);

  // Check if crime is new (within last 10 seconds)
  const isNewCrime = (crime: Crime) => {
    const timeDiff = Date.now() - new Date(crime.timestamp).getTime();
    return timeDiff < 10000; // 10 seconds
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'high': return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'low': return 'bg-green-500/20 border-green-500/50 text-green-400';
      default: return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-white text-lg font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-500" />
          Live Crime Feed
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-gray-400 text-sm">Live</span>
        </div>
      </div>

      <div ref={feedRef} className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {recentCrimes.map((crime, index) => (
          <div
            key={`${crime.id}-${index}`}
            onClick={() => onCrimeClick?.(crime)}
            className={`bg-gray-900/50 border rounded-lg p-4 hover:bg-gray-900/80 cursor-pointer transition-all transform hover:scale-[1.02] animate-slideInRight ${
              isNewCrime(crime) 
                ? 'border-blue-500 shadow-lg shadow-blue-500/20 animate-pulse-slow' 
                : 'border-gray-700'
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${getSeverityClass(crime.severity).split(' ')[0]}`}>
                <AlertCircle className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-white font-medium">{crime.type}</h4>
                  <span className={`px-2 py-0.5 text-xs rounded-full border ${getSeverityClass(crime.severity)}`}>
                    {crime.severity}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm mb-2">{crime.location}</p>
                <p className="text-gray-500 text-xs">{crime.district} District</p>
                
                <div className="flex items-center gap-2 mt-2 text-gray-500 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>{formatDistanceToNow(new Date(crime.timestamp), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {recentCrimes.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No recent crimes to display</p>
          </div>
        )}
      </div>
    </div>
  );
}
