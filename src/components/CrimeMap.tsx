import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Layers, MapPin } from 'lucide-react';
import type { Crime } from '../types';
import 'leaflet/dist/leaflet.css';

interface CrimeMapProps {
  crimes: Crime[];
}

function MapUpdater({ crimes }: { crimes: Crime[] }) {
  const map = useMap();

  useEffect(() => {
    // Keep Kanpur centered - only adjust bounds if crimes are outside view
    if (crimes.length > 0) {
      const bounds = crimes.map(c => [c.lat, c.lng] as [number, number]);
      if (bounds.length > 0) {
        // Only fit bounds if there are many crimes, otherwise keep Kanpur center
        if (crimes.length > 50) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
        }
      }
    }
  }, [crimes.length, map]); // Changed dependency to crimes.length to avoid constant updates

  return null;
}

export default function CrimeMap({ crimes }: CrimeMapProps) {
  const [viewMode, setViewMode] = useState<'heatmap' | 'markers'>('markers');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredCrimes = selectedType === 'all' 
    ? crimes 
    : crimes.filter(c => c.type === selectedType);

  const crimeTypes = ['all', ...Array.from(new Set(crimes.map(c => c.type)))];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#3b82f6';
    }
  };

  const getRadius = (severity: string) => {
    switch (severity) {
      case 'critical': return 12;
      case 'high': return 10;
      case 'medium': return 8;
      case 'low': return 6;
      default: return 7;
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl overflow-hidden">
      {/* Map controls */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-white text-lg font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Crime Map
        </h3>
        
        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-1">
            <button
              onClick={() => setViewMode('markers')}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                viewMode === 'markers'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Markers
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                viewMode === 'heatmap'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Heatmap
            </button>
          </div>

          {/* Crime type filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg border border-gray-700 outline-none"
          >
            {crimeTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </select>

          <button className="text-gray-400 hover:text-white p-2">
            <Layers className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="h-[500px] relative">
        <MapContainer
          center={[26.4499, 80.3319]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {viewMode === 'markers' && filteredCrimes.map((crime) => (
            <CircleMarker
              key={crime.id}
              center={[crime.lat, crime.lng]}
              radius={getRadius(crime.severity)}
              fillColor={getSeverityColor(crime.severity)}
              color={getSeverityColor(crime.severity)}
              weight={2}
              opacity={0.8}
              fillOpacity={0.6}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{crime.type}</p>
                  <p className="text-gray-600">{crime.location}</p>
                  <p className="text-gray-600">{crime.district} District</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(crime.timestamp).toLocaleString()}
                  </p>
                  <span className={`inline-block mt-2 px-2 py-0.5 text-xs rounded ${
                    crime.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    crime.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    crime.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {crime.severity.toUpperCase()}
                  </span>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          <MapUpdater crimes={filteredCrimes} />
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-gray-900/95 backdrop-blur-lg border border-gray-700 rounded-lg p-3 z-[1000]">
          <p className="text-white text-sm font-semibold mb-2">Risk Level</p>
          <div className="space-y-1">
            {[
              { label: 'Critical', color: '#dc2626' },
              { label: 'High', color: '#ef4444' },
              { label: 'Medium', color: '#f59e0b' },
              { label: 'Low', color: '#10b981' }
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: color }}
                />
                <span className="text-gray-300 text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
