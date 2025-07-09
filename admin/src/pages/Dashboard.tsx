import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Overview from '../components/Overview';
import NewsManagement from '../components/NewsManagement';
import ComplaintManagement from '../components/ComplaintManagement';
import ActivityLogs from '../components/ActivityLogs';
import HeroSectionManagement from '../components/HeroSectionManagement';

export default function Dashboard() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="flex h-screen relative z-10">
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed lg:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:transform-none ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            isMobileMenuOpen={isMobileMenuOpen}
          />
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            <Routes>
              <Route path="/" element={<Overview />} />
              {user?.role === 'head_of_communications' && (
                <>
                  <Route path="/news" element={<NewsManagement />} />
                  <Route path="/hero-sections" element={<HeroSectionManagement />} />
                </>
              )}
              {(user?.role === 'attorney_general' || user?.role === 'complaint_handler') && (
                <Route path="/complaints" element={<ComplaintManagement />} />
              )}
              {(user?.role === 'attorney_general' || user?.role === 'head_of_communications') && (
                <Route path="/activity" element={<ActivityLogs />} />
              )}
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}