import { useState } from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [notifications] = useState(3);

  return (
    <nav className="bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-400 hover:text-white p-2"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search bar */}
          <div className="hidden md:flex items-center bg-gray-800 rounded-lg px-4 py-2 w-96">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search crimes, locations, districts..."
              className="bg-transparent border-none outline-none text-white placeholder-gray-400 w-full"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Search icon for mobile */}
          <button className="md:hidden text-gray-400 hover:text-white p-2">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className="relative text-gray-400 hover:text-white p-2">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>

          {/* User profile */}
          <div className="flex items-center gap-3 bg-gray-800 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-700 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-white text-sm font-medium">Admin User</p>
              <p className="text-gray-400 text-xs">admin@crimewatch.com</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
