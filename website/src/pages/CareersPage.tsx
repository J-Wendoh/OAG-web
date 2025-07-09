import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CareersSection from '../components/CareersSection';

const CareersPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-20">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>
      <CareersSection />
    </div>
  );
};

export default CareersPage;