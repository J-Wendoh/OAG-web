import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NewsImportPanel from '../components/NewsImportPanel';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
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

      {/* Header */}
      <div className="container mx-auto px-4 mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-kenya-green-900 mb-4">
            OAG Admin Panel
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Administrative tools for managing the Office of the Attorney General website content and data.
          </p>
        </div>
      </div>

      {/* News Import Panel */}
      <NewsImportPanel />
    </div>
  );
};

export default AdminPage;
