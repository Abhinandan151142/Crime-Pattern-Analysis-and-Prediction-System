export default function Footer() {
  return (
    <footer className="mt-12 pt-6 border-t border-gray-800/50">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-gray-400 text-sm font-medium">
            🚀 Built with React, TypeScript, Leaflet, Chart.js & AI/ML
          </p>
          <p className="text-gray-500 text-xs mt-1">
            © 2024 CrimeWatch Analytics Platform • Designed for Public Safety
          </p>
        </div>
        <div className="flex gap-4 text-sm text-gray-400">
          <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
          <span className="text-gray-700">•</span>
          <a href="#" className="hover:text-blue-400 transition-colors">API Reference</a>
          <span className="text-gray-700">•</span>
          <a href="#" className="hover:text-blue-400 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
}
