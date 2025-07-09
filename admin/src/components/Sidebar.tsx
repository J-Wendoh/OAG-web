import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Scale, 
  Home, 
  Newspaper, 
  FileText, 
  Activity,
  User,
  LogOut,
  ChevronRight,
  Power,
  Image
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', roles: ['head_of_communications', 'attorney_general', 'complaint_handler'] },
    { path: '/dashboard/news', icon: Newspaper, label: 'News Management', roles: ['head_of_communications'] },
    { path: '/dashboard/hero-sections', icon: Image, label: 'Hero Sections', roles: ['head_of_communications'] },
    { path: '/dashboard/complaints', icon: FileText, label: 'Complaints', roles: ['attorney_general', 'complaint_handler'] },
    { path: '/dashboard/activity', icon: Activity, label: 'Activity Logs', roles: ['head_of_communications', 'attorney_general'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'head_of_communications':
        return 'OAG Head of Communications';
      case 'attorney_general':
        return 'Attorney General';
      case 'complaint_handler':
        return 'Complaint Handler';
      default:
        return role;
    }
  };

  return (
    <div className="w-80 lg:w-72 xl:w-80 glass-card flex flex-col h-screen border-r border-white/20 relative overflow-hidden">
      {/* Header */}
      <div className="p-4 lg:p-6 xl:p-8 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center space-x-3 lg:space-x-4">
          <div className="relative flex-shrink-0">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 lg:p-3 rounded-xl shadow-lg">
              <Scale className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate">
              OAG Portal
            </h1>
            <p className="text-xs lg:text-sm text-gray-600 font-medium truncate">Government of Kenya</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 lg:py-6 xl:py-8 px-3 lg:px-4 xl:px-6 overflow-y-auto">
        <ul className="space-y-2">
          {filteredMenuItems.map((item, index) => (
            <li key={item.path} className="animate-slide-in-right" style={{ animationDelay: `${index * 0.1}s` }}>
              <Link
                to={item.path}
                className={`group flex items-center justify-between px-3 lg:px-4 py-3 lg:py-4 rounded-xl transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-white/50 hover:text-gray-900 hover:shadow-md hover:transform hover:scale-105'
                }`}
              >
                <div className="flex items-center space-x-2 lg:space-x-3 min-w-0 flex-1">
                  <item.icon className={`w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 transition-transform duration-300 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="font-medium text-sm lg:text-base truncate">{item.label}</span>
                </div>
                <ChevronRight className={`w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0 transition-all duration-300 ${isActive(item.path) ? 'opacity-100 transform rotate-90' : 'opacity-0 group-hover:opacity-100'}`} />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile & Logout - Fixed at bottom */}
      <div className="p-3 lg:p-4 xl:p-6 border-t border-white/10 space-y-3 lg:space-y-4 flex-shrink-0">
        {/* User Info */}
        <div className="glass rounded-xl lg:rounded-2xl p-3 lg:p-4">
          <div className="flex items-center space-x-2 lg:space-x-3">
            <div className="relative flex-shrink-0">
              <div className="bg-gradient-to-r from-gray-400 to-gray-600 p-2 lg:p-3 rounded-lg lg:rounded-xl">
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs lg:text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-600 truncate">
                {getRoleDisplayName(user?.role || '')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Enhanced Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-3 lg:py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg lg:rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 group text-sm lg:text-base"
        >
          <Power className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 group-hover:rotate-180 transition-transform duration-500" />
          <span className="truncate">Sign Out</span>
        </button>
      </div>
    </div>
  );
}