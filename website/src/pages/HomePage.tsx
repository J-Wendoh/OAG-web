import React from 'react';
import HeroSection from '../components/HeroSection';
import FeatureCards from '../components/FeatureCards';
import AttorneyGeneralSection from '../components/AttorneyGeneralSection';
import MostRecentUpdates from '../components/MostRecentUpdates';
import OurMandate from '../components/OurMandate';
import FeaturedLegalResource from '../components/FeaturedLegalResource';
import CitizenRights from '../components/CitizenRights';
import DepartmentsCarousel from '../components/DepartmentsCarousel';
import NewSection from '../components/NewSection';
import DatabaseStatus from '../components/DatabaseStatus';

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <FeatureCards />
      <AttorneyGeneralSection />
      <MostRecentUpdates />
      <OurMandate />
      <FeaturedLegalResource />
      <CitizenRights />
      <DepartmentsCarousel />
      <NewSection />

      {/* Database Status - Development Only */}
      {process.env.NODE_ENV === 'development' && (
        <div className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
              System Status
            </h2>
            <DatabaseStatus />
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;