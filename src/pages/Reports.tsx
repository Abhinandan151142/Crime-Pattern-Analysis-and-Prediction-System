import { useState, useMemo } from 'react';
import { FileText, Filter, Download, Calendar, MapPin, AlertTriangle, Search } from 'lucide-react';
import { useCrimeData } from '../context/CrimeDataContext';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Reports() {
  const { crimes } = useCrimeData();
  const [filterOpen, setFilterOpen] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const districts = ['All', 'Kakadeo', 'Kalyanpur', 'Govind Nagar', 'Barra', 'Kidwai Nagar', 'Rawatpur', 'Panki'];
  const crimeTypes = ['All', 'Theft', 'Assault', 'Burglary', 'Vandalism', 'Drug Offense', 'Vehicle Theft'];
  const severities = ['All', 'low', 'medium', 'high', 'critical'];

  // Filter crimes based on all criteria
  const filteredCrimes = useMemo(() => {
    return crimes.filter(crime => {
      const matchesDistrict = selectedDistrict === 'All' || crime.district === selectedDistrict;
      const matchesType = selectedType === 'All' || crime.type === selectedType;
      const matchesSeverity = selectedSeverity === 'All' || crime.severity === selectedSeverity.toLowerCase();
      const matchesSearch = !searchQuery || 
        crime.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crime.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crime.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesDateRange = true;
      if (startDate) {
        matchesDateRange = matchesDateRange && crime.timestamp >= new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchesDateRange = matchesDateRange && crime.timestamp <= end;
      }
      
      return matchesDistrict && matchesType && matchesSeverity && matchesSearch && matchesDateRange;
    });
  }, [crimes, selectedDistrict, selectedType, selectedSeverity, searchQuery, startDate, endDate]);

  // Pagination
  const totalPages = Math.ceil(filteredCrimes.length / itemsPerPage);
  const paginatedCrimes = filteredCrimes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate stats from filtered data
  const stats = useMemo(() => {
    const total = filteredCrimes.length;
    const active = filteredCrimes.filter(c => c.status === 'active').length;
    const investigating = filteredCrimes.filter(c => c.status === 'investigating').length;
    const solved = filteredCrimes.filter(c => c.status === 'solved').length;
    
    return { total, active, investigating, solved };
  }, [filteredCrimes]);

  const getSeverityColor = (severity: string) => {
    const sev = severity.toLowerCase();
    switch (sev) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'solved': return 'bg-green-500/20 text-green-400';
      case 'investigating': return 'bg-blue-500/20 text-blue-400';
      case 'active': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleExport = (format: string) => {
    if (format === 'csv') {
      exportToCSV();
    } else if (format === 'pdf') {
      exportToPDF();
    } else if (format === 'excel') {
      exportToCSV(); // Use CSV for Excel (can be opened in Excel)
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Type', 'Location', 'District', 'Severity', 'Date', 'Status'];
    const rows = filteredCrimes.map(crime => [
      crime.id,
      crime.type,
      crime.location,
      crime.district,
      crime.severity,
      format(crime.timestamp, 'yyyy-MM-dd HH:mm'),
      crime.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `crime_reports_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.setTextColor(59, 130, 246); // Blue
    doc.text('Crime Analysis Reports', 14, 20);
    
    // Subtitle
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${format(new Date(), 'MMMM dd, yyyy')}`, 14, 28);
    doc.text(`Total Records: ${filteredCrimes.length}`, 14, 34);
    
    // Table data
    const tableData = filteredCrimes.map(crime => [
      crime.id.substring(0, 8),
      crime.type,
      crime.location.substring(0, 25),
      crime.district,
      crime.severity,
      format(crime.timestamp, 'MM/dd HH:mm'),
      crime.status
    ]);

    autoTable(doc, {
      head: [['ID', 'Type', 'Location', 'District', 'Severity', 'Date', 'Status']],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 25 },
        2: { cellWidth: 45 },
        3: { cellWidth: 25 },
        4: { cellWidth: 20 },
        5: { cellWidth: 25 },
        6: { cellWidth: 20 },
      },
    });

    doc.save(`crime_reports_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const handleReset = () => {
    setSelectedDistrict('All');
    setSelectedType('All');
    setSelectedSeverity('All');
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const setQuickDateRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    setCurrentPage(1);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 custom-scrollbar">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Crime Reports
          </h1>
        </div>
        <p className="text-gray-400 text-lg">
          Comprehensive crime data analysis and reporting tools
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg p-4 hover:scale-105 transition-transform">
          <p className="text-gray-400 text-sm mb-1">Total Reports</p>
          <p className="text-white text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-lg p-4 hover:scale-105 transition-transform">
          <p className="text-gray-400 text-sm mb-1">Active</p>
          <p className="text-white text-3xl font-bold">{stats.active}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg p-4 hover:scale-105 transition-transform">
          <p className="text-gray-400 text-sm mb-1">Investigating</p>
          <p className="text-white text-3xl font-bold">{stats.investigating}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg p-4 hover:scale-105 transition-transform">
          <p className="text-gray-400 text-sm mb-1">Solved</p>
          <p className="text-white text-3xl font-bold">{stats.solved}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-400" />
            Filters & Search
          </h2>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            {filterOpen ? 'Collapse' : 'Expand'}
          </button>
        </div>

        {filterOpen && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by ID, location, or crime type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            
            {/* Date Range Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Quick Date Range Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setQuickDateRange(7)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setQuickDateRange(30)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
              >
                Last 30 Days
              </button>
              <button
                onClick={() => setQuickDateRange(90)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
              >
                Last 3 Months
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* District Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  District
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              {/* Crime Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Crime Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {crimeTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Severity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  Severity
                </label>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {severities.map(severity => (
                    <option key={severity} value={severity}>{severity}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setCurrentPage(1)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
              >
                Apply Filters
              </button>
              <button 
                onClick={handleReset}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Crime Reports Data</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
              <Download className="w-4 h-4" />
              Excel
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
              <Download className="w-4 h-4" />
              CSV
            </button>
            <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
              <Download className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">District</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {paginatedCrimes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                    No crimes found matching the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedCrimes.map((crime) => (
                  <tr key={crime.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">{crime.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{crime.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{crime.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{crime.district}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(crime.severity)}`}>
                        {crime.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {format(crime.timestamp, 'yyyy-MM-dd HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(crime.status)}`}>
                        {crime.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredCrimes.length)}-{Math.min(currentPage * itemsPerPage, filteredCrimes.length)} of {filteredCrimes.length} results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 ${page === currentPage ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'} text-white rounded-lg transition-colors`}
                >
                  {page}
                </button>
              );
            })}
            {totalPages > 5 && <span className="text-gray-400 px-2">...</span>}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-800/50">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            All crime data is aggregated from official law enforcement sources
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </footer>
    </div>
  );
}
