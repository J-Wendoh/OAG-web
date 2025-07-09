import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, FileText, Database, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TypewriterText from '../components/TypewriterText';

// Import images
import recordsImage from '../assets/images/cons.jpeg';

const RecordsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAccessDatabase = () => {
    window.open('https://data-oag.vercel.app/registries', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 relative">
      {/* Header with Background Image */}
      <div className="relative h-64 mb-12">
        <div className="relative h-64 rounded-lg overflow-hidden">
          <img 
            src={recordsImage}
            alt="Public Records at OAG"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <TypewriterText 
              text="Public Records" 
              className="text-4xl md:text-5xl font-bold font-merriweather"
              speed={150}
            />
            <div className="w-24 h-1 bg-kenya-red-500 mx-auto rounded-full mt-4" />
          </div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => {
              navigate(-1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        <div className="container mx-auto px-4 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Public Records Database
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Access comprehensive database of legal opinions, legislation, case files, and policy documents from the Office of the Attorney General.
            </p>
            
            {/* Main Access Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mb-12"
            >
              <button
                onClick={handleAccessDatabase}
                className="bg-kenya-green-600 hover:bg-kenya-green-700 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 mx-auto"
              >
                <Search className="w-8 h-8" />
                <span>Search Records Database</span>
                <ExternalLink className="w-6 h-6" />
              </button>
            </motion.div>

            {/* Database Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Legal Opinions
                </h3>
                <p className="text-gray-600">
                  Access comprehensive legal opinions and advisory documents on constitutional and legal matters.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Case Files
                </h3>
                <p className="text-gray-600">
                  Browse public case files, court proceedings, and legal judgments from various courts.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Legislation
                </h3>
                <p className="text-gray-600">
                  Find current legislation, bills, acts, and policy documents with full text search.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-gradient-to-r from-kenya-green-600 to-kenya-green-700 rounded-2xl p-8 text-center text-white"
          >
            <h2 className="text-2xl font-bold mb-4">
              Access to Information
            </h2>
            <p className="text-lg mb-6 opacity-90">
              All public records are available in accordance with the Access to Information Act. The database provides comprehensive access to legal documents and public information with advanced search capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleAccessDatabase}
                className="bg-white text-kenya-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Database className="w-5 h-5" />
                <span>Access Database</span>
                <ExternalLink className="w-4 h-4" />
              </button>
              <button className="border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-kenya-green-600 transition-colors duration-200">
                Learn About Your Rights
              </button>
            </div>
          </motion.div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              How to Use the Records Database
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Search Features</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-kenya-green-600 rounded-full mt-2 flex-shrink-0" />
                    <span>Full-text search across all documents</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-kenya-green-600 rounded-full mt-2 flex-shrink-0" />
                    <span>Filter by document type and date</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-kenya-green-600 rounded-full mt-2 flex-shrink-0" />
                    <span>Advanced boolean search operators</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-kenya-green-600 rounded-full mt-2 flex-shrink-0" />
                    <span>Download documents in PDF format</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Available Documents</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-kenya-green-600 rounded-full mt-2 flex-shrink-0" />
                    <span>Constitutional and legal opinions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-kenya-green-600 rounded-full mt-2 flex-shrink-0" />
                    <span>Legislation and policy documents</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-kenya-green-600 rounded-full mt-2 flex-shrink-0" />
                    <span>Public case files and judgments</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-kenya-green-600 rounded-full mt-2 flex-shrink-0" />
                    <span>Government circulars and guidelines</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RecordsPage; 