import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n/config';
import { initializePerformanceOptimizations } from './utils/performance';
// Database tests disabled to prevent infinite loops
// import { initializeDatabaseTest } from './utils/database-test';
// import './utils/test-database-live';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import CareersPage from './pages/CareersPage';
import AboutPage from './pages/AboutPage';
import DepartmentsPage from './pages/DepartmentsPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import RecordsPage from './pages/RecordsPage';
import AdminPage from './pages/AdminPage';
import LegalEducationPage from './pages/LegalEducationPage';
import ComplaintSystem from './components/ComplaintSystem';
import ComplaintStatusCheck from './components/ComplaintStatusCheck';
import SheriaBot from './components/SheriaBot';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';

function App() {
  const { ready } = useTranslation();

  // Initialize performance optimizations only
  useEffect(() => {
    initializePerformanceOptimizations();
    // Database test disabled to prevent infinite loops
    // initializeDatabaseTest();
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-900 text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:slug" element={<NewsDetailPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/records" element={<RecordsPage />} />
            <Route path="/legal-education" element={<LegalEducationPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/complaint-status" element={<ComplaintStatusCheck />} />
          </Routes>
        </main>
        <Footer />
        <ComplaintSystem />
        <SheriaBot />
        <CookieConsent />
      </div>
    </Router>
  );
}

export default App;