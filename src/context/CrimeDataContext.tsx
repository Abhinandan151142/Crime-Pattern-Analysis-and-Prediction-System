import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Crime } from '../types';

const KANPUR_DISTRICTS = [
  'Kakadeo', 'Kalyanpur', 'Govind Nagar', 'Barra', 
  'Kidwai Nagar', 'Rawatpur', 'Panki'
];

const CRIME_TYPES = [
  'Theft', 'Assault', 'Burglary', 'Vandalism', 'Drug Offense', 'Vehicle Theft'
];

interface CrimeDataContextType {
  crimes: Crime[];
  addCrime: (crime: Crime) => void;
  stats: {
    totalCrimes: number;
    activeCases: number;
    arrestsMade: number;
    highRiskAreas: number;
  };
  updateStats: (newStats: Partial<CrimeDataContextType['stats']>) => void;
}

const CrimeDataContext = createContext<CrimeDataContextType | undefined>(undefined);

export const useCrimeData = () => {
  const context = useContext(CrimeDataContext);
  if (!context) {
    throw new Error('useCrimeData must be used within CrimeDataProvider');
  }
  return context;
};

interface CrimeDataProviderProps {
  children: ReactNode;
}

// Generate initial realistic crime data for Kanpur
const generateInitialCrimes = (count: number): Crime[] => {
  const crimes: Crime[] = [];
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  const streetNames = [
    'Mall Road', 'GT Road', 'Civil Lines', 'Swaroop Nagar',
    'Tilak Nagar', 'Harsh Nagar', 'Juhi', 'Armapur'
  ];

  const severities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
  const statuses: Array<'active' | 'investigating' | 'solved'> = ['active', 'investigating', 'solved'];

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(thirtyDaysAgo + Math.random() * (now - thirtyDaysAgo));
    const district = KANPUR_DISTRICTS[Math.floor(Math.random() * KANPUR_DISTRICTS.length)];
    const type = CRIME_TYPES[Math.floor(Math.random() * CRIME_TYPES.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const street = streetNames[Math.floor(Math.random() * streetNames.length)];

    crimes.push({
      id: `crime-${i}-${Date.now()}`,
      type: type,
      location: `${street}, ${district}`,
      lat: 26.40 + Math.random() * 0.10,
      lng: 80.25 + Math.random() * 0.15,
      timestamp,
      severity,
      status,
      district,
      description: `${type} incident reported in ${district}`
    });
  }

  return crimes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const CrimeDataProvider: React.FC<CrimeDataProviderProps> = ({ children }) => {
  const [crimes, setCrimes] = useState<Crime[]>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('crimeData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved crime data', e);
      }
    }
    return generateInitialCrimes(500);
  });

  const [stats, setStats] = useState({
    totalCrimes: 0,
    activeCases: 0,
    arrestsMade: 0,
    highRiskAreas: 3
  });

  // Calculate stats from crimes
  useEffect(() => {
    const now = Date.now();
    const thisMonth = now - 30 * 24 * 60 * 60 * 1000;
    const crimesThisMonth = crimes.filter(c => c.timestamp.getTime() >= thisMonth);
    const activeCases = crimes.filter(c => c.status === 'active').length;

    setStats({
      totalCrimes: crimesThisMonth.length,
      activeCases,
      arrestsMade: Math.floor(crimesThisMonth.length * 0.65),
      highRiskAreas: 3
    });
  }, [crimes]);

  // Save to localStorage when crimes change
  useEffect(() => {
    try {
      localStorage.setItem('crimeData', JSON.stringify(crimes.slice(0, 1000))); // Keep last 1000
    } catch (e) {
      console.error('Failed to save crime data', e);
    }
  }, [crimes]);

  const addCrime = (crime: Crime) => {
    setCrimes(prev => [crime, ...prev].slice(0, 1000)); // Keep max 1000 crimes
  };

  const updateStats = (newStats: Partial<CrimeDataContextType['stats']>) => {
    setStats(prev => ({ ...prev, ...newStats }));
  };

  return (
    <CrimeDataContext.Provider value={{ crimes, addCrime, stats, updateStats }}>
      {children}
    </CrimeDataContext.Provider>
  );
};
