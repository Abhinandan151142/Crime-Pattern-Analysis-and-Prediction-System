import { useState, useEffect } from 'react';
import { User, Mail, Bell, Moon, Sun, Save, Shield, Database, Download, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [showSaved, setShowSaved] = useState(false);
  
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse profile', e);
      }
    }
    return {
      name: 'Officer John Smith',
      email: 'john.smith@police.gov',
      badge: 'BADGE-5432',
      department: 'Crime Analytics Division'
    };
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notificationPreferences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse notifications', e);
      }
    }
    return {
      criticalAlerts: true,
      highRiskAlerts: true,
      mediumAlerts: true,
      lowAlerts: false,
      emailNotifications: true,
      smsNotifications: false,
      predictionUpdates: true,
      weeklyReports: true
    };
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev: typeof notifications) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profile));
    localStorage.setItem('notificationPreferences', JSON.stringify(notifications));
    
    // Show success message
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 custom-scrollbar">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          ⚙️ Settings
        </h1>
        <p className="text-gray-400 text-lg">
          Configure your preferences and account settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Profile Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Badge Number
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={profile.badge}
                      onChange={(e) => setProfile({ ...profile, badge: e.target.value })}
                      className="w-full bg-gray-900/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 hover:shadow-xl hover:shadow-purple-500/10 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
                <div>
                  <p className="text-white font-medium">Critical Alerts</p>
                  <p className="text-sm text-gray-400">Receive notifications for critical incidents</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.criticalAlerts}
                    onChange={() => handleToggle('criticalAlerts')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
                <div>
                  <p className="text-white font-medium">High Risk Alerts</p>
                  <p className="text-sm text-gray-400">High priority crime notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.highRiskAlerts}
                    onChange={() => handleToggle('highRiskAlerts')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
                <div>
                  <p className="text-white font-medium">Medium Priority Alerts</p>
                  <p className="text-sm text-gray-400">Standard incident notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.mediumAlerts}
                    onChange={() => handleToggle('mediumAlerts')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
                <div>
                  <p className="text-white font-medium">Low Priority Alerts</p>
                  <p className="text-sm text-gray-400">Minor incidents and updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.lowAlerts}
                    onChange={() => handleToggle('lowAlerts')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-400">Receive alerts via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.emailNotifications}
                    onChange={() => handleToggle('emailNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
                <div>
                  <p className="text-white font-medium">SMS Notifications</p>
                  <p className="text-sm text-gray-400">Receive alerts via text message</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.smsNotifications}
                    onChange={() => handleToggle('smsNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
                <div>
                  <p className="text-white font-medium">Prediction Updates</p>
                  <p className="text-sm text-gray-400">AI prediction model notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.predictionUpdates}
                    onChange={() => handleToggle('predictionUpdates')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-white font-medium">Weekly Reports</p>
                  <p className="text-sm text-gray-400">Receive weekly crime summary</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.weeklyReports}
                    onChange={() => handleToggle('weeklyReports')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 hover:shadow-xl hover:shadow-yellow-500/10 transition-all">
            <div className="flex items-center gap-3 mb-6">
              {theme === 'dark' ? (
                <Moon className="w-6 h-6 text-yellow-400" />
              ) : (
                <Sun className="w-6 h-6 text-yellow-400" />
              )}
              <h2 className="text-xl font-semibold text-white">Theme</h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setTheme('dark')}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-900 text-white border-2 border-blue-500'
                    : 'bg-gray-700 text-gray-300 border-2 border-transparent hover:border-gray-500'
                }`}
              >
                🌙 Dark Mode
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                  theme === 'light'
                    ? 'bg-white text-gray-900 border-2 border-blue-500'
                    : 'bg-gray-700 text-gray-300 border-2 border-transparent hover:border-gray-500'
                }`}
              >
                ☀️ Light Mode
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">
                Theme saved automatically
              </p>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 hover:shadow-xl hover:shadow-green-500/10 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Data Management</h2>
            </div>

            <div className="space-y-3">
              <button className="w-full py-3 px-4 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg font-medium hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Export User Data
              </button>
              <button className="w-full py-3 px-4 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-all">
                Clear Cache
              </button>
              <button className="w-full py-3 px-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-all">
                Reset All Settings
              </button>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save All Changes
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSaved && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-800/50">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Settings are saved locally in your browser
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </footer>
    </div>
  );
}
