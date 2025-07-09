import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Bell, Search, Settings, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export default function Header({ onMobileMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'head_of_communications':
        return 'Communications Hub';
      case 'attorney_general':
        return 'Attorney General Dashboard';
      case 'complaint_handler':
        return 'Complaint Management Portal';
      default:
        return 'OAG Admin Portal';
    }
  };

  const getRoleSubtitle = (role: string) => {
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
    <header className="glass-card border-b border-white/20 px-4 lg:px-8 py-4 lg:py-6 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-xl hover:bg-white/50 transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>

          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {getRoleDisplayName(user?.role || '')}
            </h1>
            <p className="text-gray-600 text-sm lg:text-base font-medium">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 lg:space-x-6">
          {/* Search - Hidden on mobile */}
          <div className="hidden md:block relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="pl-12 pr-4 py-3 w-64 lg:w-80 bg-white/50 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
            />
          </div>
          
          {/* Notifications */}
          <button className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all duration-300 group">
            <Bell className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
              3
            </span>
          </button>
          
          {/* Settings */}
          <button className="p-3 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all duration-300 group">
            <Settings className="w-5 h-5 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
          </button>

          {/* Mobile search button */}
          <button className="md:hidden p-3 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all duration-300">
            <Search className="w-5 h-5" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/50 transition-all duration-300 group"
            >
              <div className="hidden lg:block text-right">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-600">
                  {getRoleSubtitle(user?.role || '')}
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-all duration-300" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl shadow-lg border border-white/20 py-2 z-50">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-600 capitalize">
                    {getRoleSubtitle(user?.role || '')}
                  </p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}