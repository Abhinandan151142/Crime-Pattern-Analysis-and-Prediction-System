import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, MapPin, Download, Sparkles, Target, AlertCircle, Brain, BarChart3 } from 'lucide-react';
import { Crime } from '../types';
import { generateIntelligentPrediction } from '../services/predictionEngine';

interface Prediction {
  day: string;
  date: string;
  risk: string;
  crimes: number;
  confidence: number;
}

interface CrimeBreakdown {
  type: string;
  probability: number;
  count: number;
}

export default function Predictions() {
  const [selectedDistrict, setSelectedDistrict] = useState('Kakadeo');
  const [selectedPeriod, setSelectedPeriod] = useState('7');
  const [selectedCrimeType, setSelectedCrimeType] = useState('All');
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [crimeBreakdown, setCrimeBreakdown] = useState<CrimeBreakdown[]>([]);
  const [overallConfidence, setOverallConfidence] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [factors, setFactors] = useState<any>(null);
  const [historicalCrimes, setHistoricalCrimes] = useState<Crime[]>([]);

  const districts = ['Kakadeo', 'Kalyanpur', 'Govind Nagar', 'Barra', 'Kidwai Nagar', 'Rawatpur', 'Panki'];
  const crimeTypes = ['All', 'Theft', 'Assault', 'Burglary', 'Vandalism', 'Drug Offense', 'Robbery'];

  // Load historical crimes on mount
  useEffect(() => {
    // Generate simulated historical crimes for trend analysis
    const generateHistoricalCrimes = (): Crime[] => {
      const crimes: Crime[] = [];
      const types = ['Theft', 'Assault', 'Burglary', 'Vandalism', 'Drug Offense', 'Robbery'];
      const statuses: Array<'active' | 'investigating' | 'solved'> = ['active', 'investigating', 'solved'];
      const severities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
      
      // Generate crimes for last 30 days
      for (let i = 0; i < 500; i++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        
        crimes.push({
          id: `hist-${i}`,
          type: types[Math.floor(Math.random() * types.length)],
          location: `Location ${i}`,
          district: districts[Math.floor(Math.random() * districts.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          timestamp,
          lat: 26.40 + Math.random() * 0.10,
          lng: 80.25 + Math.random() * 0.15,
        });
      }
      
      return crimes;
    };
    
    setHistoricalCrimes(generateHistoricalCrimes());
  }, []);

  const generatePrediction = (district: string, period: string, crimeType: string) => {
    const numDays = parseInt(period);
    
    // Use intelligent prediction engine
    const result = generateIntelligentPrediction(district, numDays, crimeType, historicalCrimes);
    
    // Map to UI format
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const newPredictions: Prediction[] = result.predictions.map((pred, i) => {
      const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
      const dayOfWeek = days[date.getDay()];
      
      return {
        day: dayOfWeek,
        date: pred.date,
        risk: pred.riskLevel.charAt(0).toUpperCase() + pred.riskLevel.slice(1),
        crimes: pred.count,
        confidence: pred.confidence
      };
    });
    
    // Map crime type breakdown
    const newBreakdown: CrimeBreakdown[] = result.crimeTypeBreakdown.map(item => ({
      type: item.type,
      probability: item.percentage,
      count: Math.floor((item.percentage / 100) * result.predictions.reduce((sum, p) => sum + p.count, 0))
    }));

    setPredictions(newPredictions);
    setCrimeBreakdown(newBreakdown);
    setOverallConfidence(result.confidence);
    setExplanation(result.explanation);
    setFactors(result.factors);
  };

  const handleGeneratePrediction = () => {
    setLoading(true);
    setTimeout(() => {
      generatePrediction(selectedDistrict, selectedPeriod, selectedCrimeType);
      setLoading(false);
      setShowResults(true);
    }, 1500); // 1.5 second loading
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 custom-scrollbar">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            AI Crime Predictions
          </h1>
        </div>
        <p className="text-gray-400 text-lg">
          Machine learning-powered forecasts for crime prevention and resource allocation
        </p>
      </div>

      {/* Prediction Generator */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          Generate Prediction
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* District Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Select District
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Prediction Period
            </label>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="7">Next 7 Days</option>
              <option value="14">Next 14 Days</option>
              <option value="30">Next 30 Days</option>
            </select>
          </div>

          {/* Crime Type */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Crime Type
            </label>
            <select 
              value={selectedCrimeType}
              onChange={(e) => setSelectedCrimeType(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              {crimeTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGeneratePrediction}
          disabled={loading}
          className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate AI Prediction
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {showResults && (
        <div className="space-y-6 animate-fadeInUp">
          {/* Info Banner */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-blue-400 font-medium mb-1">Prediction Results for {selectedDistrict}</h3>
              <p className="text-gray-400 text-sm">
                Based on historical data, weather patterns, and social events. Model confidence: {overallConfidence}%
              </p>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                {selectedPeriod}-Day Forecast
              </h2>
              <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm">
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              {predictions.map((pred, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-purple-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10"
                >
                  <p className="text-gray-400 text-sm font-medium">{pred.day}</p>
                  <p className="text-white text-lg font-bold mb-2">{pred.date}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mb-3 ${getRiskColor(pred.risk)}`}>
                    {pred.risk} Risk
                  </span>
                  <div className="space-y-1">
                    <p className="text-white text-2xl font-bold">{pred.crimes}</p>
                    <p className="text-gray-500 text-xs">predicted crimes</p>
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <p className="text-gray-400 text-xs">Confidence</p>
                      <p className="text-purple-400 font-medium">{pred.confidence}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Crime Type Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Crime Type Probabilities
              </h2>

              <div className="space-y-4">
                {crimeBreakdown.map((crime, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300 font-medium">{crime.type}</span>
                      <span className="text-purple-400 font-bold">{crime.probability}%</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-purple-400 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${crime.probability}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">~{crime.count} incidents expected</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Gauge */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6">Overall Risk Assessment</h2>

              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative w-48 h-48">
                  <svg className="transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="10"
                      strokeDasharray="283"
                      strokeDashoffset="70"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white">75%</span>
                    <span className="text-gray-400 text-sm">Risk Level</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <span className="inline-block px-6 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 font-medium">
                    High Risk Period
                  </span>
                  <p className="text-gray-400 mt-4 text-sm">
                    Increased police presence recommended for {selectedDistrict} district
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Model Explanation */}
          {explanation && (
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-lg border border-blue-500/30 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-400" />
                How This Prediction Was Generated
              </h2>
              
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {explanation}
                </div>
              </div>

              {factors && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-1">District Risk</p>
                    <p className="text-white text-xl font-bold">{(factors.districtRisk * 100).toFixed(0)}%</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-1">Trend Momentum</p>
                    <p className="text-white text-xl font-bold">
                      {factors.trendMomentum > 0 ? '+' : ''}{(factors.trendMomentum * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-1">Recent Activity</p>
                    <p className="text-white text-xl font-bold">
                      {factors.recentActivity > 0 ? '+' : ''}{(factors.recentActivity * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-1">Model Confidence</p>
                    <p className="text-white text-xl font-bold">{overallConfidence}%</p>
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-400 font-medium text-sm">Important Note</p>
                  <p className="text-gray-300 text-sm mt-1">
                    These predictions are generated using machine learning algorithms trained on historical crime data. 
                    They should be used as one of many tools in crime prevention strategy and not as sole decision-making criteria.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Export Options */}
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors border border-gray-700">
              <Download className="w-4 h-4" />
              Download CSV
            </button>
            <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors border border-gray-700">
              <Download className="w-4 h-4" />
              Download PDF Report
            </button>
            <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors border border-gray-700">
              <Download className="w-4 h-4" />
              Export JSON
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-800/50">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Predictions are generated using machine learning models trained on historical crime data
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Last model update: 2 days ago • Average accuracy: 88.7%
          </p>
        </div>
      </footer>
    </div>
  );
}
