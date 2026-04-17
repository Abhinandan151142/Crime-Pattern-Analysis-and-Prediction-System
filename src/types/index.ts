export interface Crime {
  id: string;
  type: string;
  location: string;
  lat: number;
  lng: number;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'investigating' | 'solved';
  district: string;
  description?: string;
}

export interface DashboardStats {
  totalCrimes: number;
  totalCrimesChange: number;
  activeCases: number;
  activeCasesChange: number;
  arrestsMade: number;
  arrestsMadeChange: number;
  highRiskAreas: number;
  highRiskAreasChange: number;
}

export interface MonthlyData {
  month: string;
  theft: number;
  assault: number;
  burglary: number;
  vandalism: number;
  total: number;
}

export interface CrimeTypeData {
  type: string;
  count: number;
  percentage: number;
}

export interface DistrictData {
  district: string;
  count: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Prediction {
  date: string;
  district: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  confidence: number;
  predictedCrimes: {
    type: string;
    count: number;
  }[];
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'danger' | 'critical';
  message: string;
  timestamp: Date;
  district?: string;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastTrained: Date;
}
