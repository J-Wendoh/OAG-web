import React from 'react';
import { useTranslation } from 'react-i18next';
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
import RightsEducationVideo from '../components/RightsEducationVideo';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeroSection />
      <FeatureCards />
      <AttorneyGeneralSection />
      <MostRecentUpdates />
      <OurMandate />

      {/* Know Your Rights Video Section - Moved after Our Mandate */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('home.rightsVideo.title', 'Know Your Rights')}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('home.rightsVideo.subtitle', 'Essential legal education for every Kenyan citizen. Learn about your constitutional rights and how to access justice.')}
              </p>
            </div>

            <RightsEducationVideo
              size="large"
              showTitle={true}
              showDescription={true}
              className="mx-auto"
            />
          </div>
        </div>
      </section>

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