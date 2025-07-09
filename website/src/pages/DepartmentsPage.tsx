import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Play, Users, Building, FileText, Scale, Shield, Heart, Briefcase, BookOpen, Globe, Zap, Search, Filter, X } from 'lucide-react';
import TypewriterText from '../components/TypewriterText';
import departmentsData from '../../../shared/data/departments.json';

// Import images
import departmentsImage from '../assets/images/Departments.jpg';

interface Department {
  id: number;
  name: string;
  brief: string;
  details: string;
  image: string;
}

interface DepartmentsData {
  departments: Department[];
  featured: {
    id: number;
    includeVideo: boolean;
    videoUrl: string;
  }[];
}

const DepartmentsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const data: DepartmentsData = departmentsData;
  const { departments, featured } = data;

  // Filter departments based on search and featured filter
  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.brief.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFeatured = !showFeaturedOnly || featured.some(f => f.id === dept.id);
    return matchesSearch && matchesFeatured;
  });

  const getFeaturedVideo = (departmentId: number) => {
    return featured.find(f => f.id === departmentId)?.videoUrl;
  };

  const getDepartmentIcon = (name: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'Civil': Users,
      'Criminal': Shield,
      'Constitutional': Scale,
      'Commercial': Briefcase,
      'Family': Heart,
      'Legal': FileText,
      'Advisory': BookOpen,
      'International': Globe,
      'Human Rights': Users,
      'Administrative': Building,
      'Public': Users,
      'Corporate': Briefcase,
      'Environmental': Globe,
      'Immigration': Globe,
      'Labour': Users,
      'Tax': FileText,
      'Intellectual Property': BookOpen,
      'Cyber': Shield,
      'Maritime': Globe,
      'Aviation': Globe,
      'Energy': Zap,
      'Healthcare': Heart,
      'Education': BookOpen,
      'Agriculture': Globe,
      'Mining': Building,
      'Tourism': Globe,
      'Sports': Users,
      'Gender': Users,
      'Youth': Users,
      'Disability': Heart,
      'Refugee': Users,
      'Anti-Corruption': Shield,
      'Financial': Briefcase
    };

    for (const [key, icon] of Object.entries(iconMap)) {
      if (name.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    return Building; // Default icon
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Header with Background Image and Typing Effect */}
      <div className="relative h-64 mb-12">
        <img
          src={departmentsImage}
          alt={t('departments.imageAlt', 'Departments')}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <TypewriterText 
              text={t('departments.title', 'Our Departments')}
              className="text-4xl md:text-5xl font-bold font-merriweather"
              speed={150}
            />
            <div className="w-24 h-1 bg-kenya-red-500 mx-auto rounded-full mt-4" />
            <p className="mt-4 text-lg opacity-90">
              {departments.length} Specialized Departments Serving Kenya
            </p>
          </div>
        </div>
      </div>

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
        {/* Search and Filter Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-red-500 focus:border-transparent bg-white text-gray-900"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors duration-200 ${
                showFeaturedOnly
                  ? 'bg-kenya-red-500 text-white border-kenya-red-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Featured Only</span>
            </button>
            <div className="text-sm text-gray-600">
              {filteredDepartments.length} of {departments.length} departments
            </div>
          </div>
        </div>

        {/* Departments Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDepartments.map((department, index) => {
            const Icon = getDepartmentIcon(department.name);
            const videoUrl = getFeaturedVideo(department.id);
            const isFeatured = !!videoUrl;
            // Use public/assets/departments/ path with department ID
            const departmentImage = `/assets/departments/department-${department.id}.jpg`;

            return (
              <motion.div
                key={department.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Department Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={departmentImage}
                    alt={department.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback to a default image if department image is not found
                      const target = e.target as HTMLImageElement;
                      target.src = '/assets/departments/default-department.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Featured Badge */}
                  {isFeatured && (
                    <div className="absolute top-3 right-3 bg-kenya-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                      <Play className="w-3 h-3" />
                      <span>Featured</span>
                    </div>
                  )}
                  
                  {/* Department Icon */}
                  <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm rounded-lg p-2">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Department Title */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold text-white mb-1">
                      {department.name}
                    </h3>
                  </div>
                </div>

                {/* Department Content */}
                <div className="p-4">
                  <p className="text-gray-700 leading-relaxed mb-4 text-sm line-clamp-3">
                    {department.brief}
                  </p>

                  {/* Learn More Button */}
                  <button
                    onClick={() => setSelectedDepartment(department)}
                    className="w-full bg-kenya-green-700 text-white py-2 rounded-lg hover:bg-kenya-green-800 transition-colors duration-200 font-semibold flex items-center justify-center space-x-2 text-sm"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
          </div>

        {/* No Results Message */}
        {filteredDepartments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg">No departments found matching your search.</p>
              <p className="text-sm">Try adjusting your search terms or filters.</p>
                    </div>
                  </div>
        )}
                    </div>

      {/* Department Detail Modal */}
      {selectedDepartment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedDepartment.name}
              </h2>
              <button
                onClick={() => setSelectedDepartment(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-500" />
                    </button>
          </div>

            <div className="p-6">
                  {/* Department Image */}
              <div className="relative h-64 rounded-lg overflow-hidden mb-6">
                <img
                  src={`/assets/departments/department-${selectedDepartment.id}.jpg`}
                  alt={selectedDepartment.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/assets/departments/default-department.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>

              {/* Featured Video */}
              {getFeaturedVideo(selectedDepartment.id) && (
                    <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Department Overview Video
                  </h3>
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden shadow-md aspect-video">
                        <iframe
                          className="absolute inset-0 w-full h-full"
                      src={getFeaturedVideo(selectedDepartment.id)}
                      title={`${selectedDepartment.name} Overview`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                          loading="lazy"
                        />
                      </div>
                    </div>
              )}

              {/* Department Description */}
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  About This Department
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedDepartment.details}
                </p>
                  </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;