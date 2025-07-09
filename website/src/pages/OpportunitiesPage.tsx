import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Briefcase, MapPin, Clock, Calendar, FileText, ExternalLink, Users, Building, X, Download, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TypewriterText from '../components/TypewriterText';

// Import images
import opportunitiesImage from '../assets/images/Departments.jpg';

const OpportunitiesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);

  const categories = [
    { key: 'all', title: 'All Opportunities', icon: Building },
    { key: 'careers', title: 'Career Opportunities', icon: Briefcase },
    { key: 'tenders', title: 'Tenders & Procurements', icon: FileText }
  ];

  const opportunities = [
    {
      id: 1,
      category: 'careers',
      title: 'Senior Legal Counsel',
      department: 'Department of Legal Affairs',
      location: 'Nairobi',
      type: 'Full-time',
      deadline: '2025-02-15',
      description: 'Lead legal counsel responsible for providing expert legal advice on complex government matters, drafting legislation, and representing the Attorney General\'s office in high-profile cases.',
      requirements: ['LLB/JD from recognized institution', '10+ years legal experience', 'Expertise in constitutional law', 'Strong litigation skills'],
      status: 'Open',
      applicationProcess: 'Submit application through official channels',
      contactEmail: 'careers@oag.go.ke',
      applicationDocuments: ['CV/Resume', 'Cover Letter', 'Academic Certificates', 'Professional References', 'ID Copy']
    },
    {
      id: 2,
      category: 'careers',
      title: 'Research Officer',
      department: 'Department of Justice',
      location: 'Nairobi',
      type: 'Full-time',
      deadline: '2025-02-20',
      description: 'Conduct comprehensive legal research, analyze policy implications, and prepare detailed reports on various legal matters to support decision-making processes.',
      requirements: ['Masters in Law or related field', '5+ years research experience', 'Strong analytical skills', 'Excellent writing abilities'],
      status: 'Open',
      applicationProcess: 'Submit application through official channels',
      contactEmail: 'careers@oag.go.ke',
      applicationDocuments: ['CV/Resume', 'Cover Letter', 'Academic Certificates', 'Research Portfolio', 'ID Copy']
    },
    {
      id: 3,
      category: 'tenders',
      title: 'Legal Database Management System',
      department: 'ICT Department',
      location: 'Nairobi',
      type: 'Contract',
      deadline: '2025-01-30',
      description: 'Development and implementation of a comprehensive legal database management system for case tracking, document management, and legal research.',
      requirements: ['Proven experience in database development', 'Knowledge of legal systems', 'Technical certification', 'Portfolio of similar projects'],
      status: 'Open',
      applicationProcess: 'Submit tender documents through official procurement channels',
      contactEmail: 'procurement@oag.go.ke',
      applicationDocuments: ['Company Profile', 'Technical Proposal', 'Financial Proposal', 'Tax Compliance Certificate', 'Registration Documents']
    },
    {
      id: 6,
      category: 'tenders',
      title: 'Office Renovation and Modernization',
      department: 'Administration',
      location: 'Sheria House',
      type: 'Contract',
      deadline: '2025-01-25',
      description: 'Comprehensive renovation and modernization of office spaces to enhance working environment and accessibility.',
      requirements: ['Valid construction license', 'Previous government project experience', 'Insurance coverage', 'Technical expertise'],
      status: 'Open',
      applicationProcess: 'Submit tender documents through official procurement channels',
      contactEmail: 'procurement@oag.go.ke',
      applicationDocuments: ['Company Profile', 'Technical Proposal', 'Financial Proposal', 'Construction License', 'Insurance Certificate']
    }
  ];

  const filteredOpportunities = selectedCategory === 'all' 
    ? opportunities 
    : opportunities.filter(opp => opp.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-red-100 text-red-800';
      case 'Extended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'careers': return 'bg-blue-100 text-blue-800';
      case 'tenders': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLearnMore = (opportunity: any) => {
    setSelectedOpportunity(opportunity);
    setShowModal(true);
  };

  const handleDownloadForm = () => {
    // Create a simple application form as a downloadable file
    const formContent = `
OFFICE OF THE ATTORNEY GENERAL
APPLICATION FORM

Position: ${selectedOpportunity?.title}
Department: ${selectedOpportunity?.department}
Deadline: ${new Date(selectedOpportunity?.deadline).toLocaleDateString()}

PERSONAL INFORMATION:
Name: _________________________________
ID Number: _____________________________
Email: _________________________________
Phone: _________________________________
Address: _______________________________

EDUCATION:
Highest Qualification: ___________________
Institution: ____________________________
Year of Graduation: ____________________

EXPERIENCE:
Years of Experience: ____________________
Previous Positions: ______________________
____________________________________

DECLARATION:
I declare that the information provided is true and accurate.

Signature: _________________ Date: _______

SUBMISSION INSTRUCTIONS:
Email completed form and required documents to: ${selectedOpportunity?.contactEmail}
Subject: Application for ${selectedOpportunity?.title}
`;

    const blob = new Blob([formContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedOpportunity?.title.replace(/\s+/g, '_')}_Application_Form.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 relative">
      {/* Header with Background Image */}
      <div className="relative h-64 mb-12">
        <div className="relative h-64 rounded-lg overflow-hidden">
          <img 
            src={opportunitiesImage}
            alt={t('opportunities.imageAlt', 'Opportunities at OAG')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <TypewriterText 
              text="Opportunities" 
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
              Career & Business Opportunities
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore career opportunities and tenders available at the Office of the Attorney General.
            </p>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.key
                      ? 'bg-kenya-green-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{category.title}</span>
                </button>
              );
            })}
          </motion.div>

          {/* Opportunities Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {filteredOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-kenya-green-100 rounded-lg">
                      <Briefcase className="w-6 h-6 text-kenya-green-700" />
                    </div>
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(opportunity.category)}`}>
                        {opportunity.category.charAt(0).toUpperCase() + opportunity.category.slice(1)}
                      </span>
                    </div>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(opportunity.status)}`}>
                    {opportunity.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {opportunity.title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Building className="w-4 h-4" />
                    <span>{opportunity.department}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{opportunity.type}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6">
                  {opportunity.description}
                </p>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Requirements:</h4>
                  <ul className="space-y-2">
                    {opportunity.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-kenya-green-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <button className="flex-1 bg-kenya-green-600 text-white py-3 px-6 rounded-lg hover:bg-kenya-green-700 transition-colors duration-200 font-semibold flex items-center justify-center space-x-2">
                    <ExternalLink className="w-5 h-5" />
                    <span>Apply Now</span>
                  </button>
                  <button 
                    onClick={() => handleLearnMore(opportunity)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-semibold"
                  >
                    Learn More
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* No results message */}
          {filteredOpportunities.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Opportunities Found
              </h3>
              <p className="text-gray-600">
                There are currently no opportunities in this category. Please check back later or explore other categories.
              </p>
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-gradient-to-r from-kenya-green-600 to-kenya-green-700 rounded-2xl p-8 mt-16 text-center text-white"
          >
            <h2 className="text-2xl font-bold mb-4">
              Stay Updated on New Opportunities
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Subscribe to our newsletter to receive notifications about new career opportunities, tenders, and programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-kenya-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal for Learn More */}
      <AnimatePresence>
        {showModal && selectedOpportunity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedOpportunity.title}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Application Requirements */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Application Requirements
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Required Documents:</h4>
                    <ul className="space-y-1">
                      {selectedOpportunity.applicationDocuments.map((doc: string, index: number) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-kenya-green-600 rounded-full" />
                          <span className="text-gray-700 text-sm">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Download Form */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Application Form
                  </h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-gray-700 mb-4">
                      Download the official application form and fill it out completely.
                    </p>
                    <button
                      onClick={handleDownloadForm}
                      className="bg-kenya-green-600 text-white px-6 py-3 rounded-lg hover:bg-kenya-green-700 transition-colors duration-200 font-semibold flex items-center space-x-2"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Application Form</span>
                    </button>
                  </div>
                </div>

                {/* Submission Instructions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Submission Instructions
                  </h3>
                  <div className="bg-amber-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-amber-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Email Submission:</h4>
                        <p className="text-gray-700 mb-2">
                          Send your completed application form and all required documents to:
                        </p>
                        <p className="font-mono text-sm bg-white px-3 py-2 rounded border">
                          {selectedOpportunity.contactEmail}
                        </p>
                        <p className="text-gray-600 text-sm mt-2">
                          Subject: Application for {selectedOpportunity.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Process */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Application Process
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">
                      {selectedOpportunity.applicationProcess}
                    </p>
                  </div>
                </div>

                {/* Deadline */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Application Deadline:</span>
                    <span className="font-semibold text-red-600">
                      {new Date(selectedOpportunity.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OpportunitiesPage; 