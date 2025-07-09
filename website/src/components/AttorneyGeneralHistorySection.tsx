import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Award, BookOpen, ChevronRight, User, Clock, MapPin, X, Quote } from 'lucide-react';

// Import AG images from public folder
const charlesNjonjoImage = '/CHARLES NJONJO.jpg';
const jamesKaruguImage = '/JAMES KARUGU.jpg';
const josephKamereImage = '/joseph/JOSEPH KAMERE.jpg'; // Need to check if this exists
const amosWakoImage = '/AMOS WAKO.jpg';
const githuMuigaiImage = '/GITHU MUIGAI.jpg';
const dorcasOduorImage = '/D0RCAS IMG.webp';
const jbMuturiImage = '/JB Muturi.jpg'; // Need to check if this exists
const njeeImage = '/Njee/Solicitor General Njee Muturi.jpg'; // Need to check if this exists

interface AttorneyGeneral {
  id: string;
  name: string;
  period: string;
  title: string;
  achievements: string[];
  image: string;
  significance: string;
  details?: {
    fullName?: string;
    education?: string[];
    careerHighlights?: string[];
    legacyImpact?: string;
    notableQuote?: string;
  };
}

const AttorneyGeneralHistorySection: React.FC = () => {
  const { t } = useTranslation();
  const [selectedAG, setSelectedAG] = useState<AttorneyGeneral | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Attorney General History Data with enhanced information
  const attorneyGeneralHistory: AttorneyGeneral[] = [
    {
      id: 'charles-njonjo',
      name: 'Charles Njonjo',
      period: '1963-1979',
      title: 'First Attorney General of Independent Kenya',
      achievements: [
        'Established the foundation of Kenya\'s legal system post-independence',
        'Instrumental in drafting early constitutional amendments',
        'Pioneered legal reforms in the newly independent nation',
        'Set up the legal framework for the new republic'
      ],
      image: charlesNjonjoImage,
      significance: 'Set the precedent for the office and established its constitutional role',
      details: {
        fullName: 'Charles Mugane Njonjo',
        education: ['King\'s College London', 'London School of Economics'],
        careerHighlights: [
          'First African Attorney General of Kenya',
          'Served for 16 years during critical nation-building period',
          'Established legal precedents still followed today'
        ],
        legacyImpact: 'His tenure laid the foundation for Kenya\'s modern legal system and established the independence of the Attorney General\'s office.',
        notableQuote: 'The law must be supreme, and justice must be seen to be done for all Kenyans regardless of their station in life.'
      }
    },
    {
      id: 'james-karugu',
      name: 'James Karugu',
      period: '1980-1981',
      title: 'Second Attorney General',
      achievements: [
        'Maintained legal continuity during transition period',
        'Strengthened institutional frameworks',
        'Advanced legal education initiatives',
        'Promoted access to justice programs'
      ],
      image: jamesKaruguImage,
      significance: 'Ensured smooth transition and institutional stability',
      details: {
        fullName: 'James Karugu Kihoro',
        careerHighlights: [
          'Brief but impactful tenure during political transition',
          'Focused on institutional strengthening',
          'Promoted legal education and professional development'
        ],
        legacyImpact: 'Though his tenure was brief, he ensured continuity and stability during a critical transition period.',
        notableQuote: 'Justice delayed is justice denied - we must ensure swift and fair legal processes for all.'
      }
    },
    {
      id: 'joseph-kamere',
      name: 'Joseph Kamere',
      period: '1981-1983',
      title: 'Third Attorney General',
      achievements: [
        'Continued constitutional development during transition period',
        'Strengthened legal institutions and frameworks',
        'Advanced legal education and professional development',
        'Promoted rule of law principles'
      ],
      image: '/AG.jpg', // Using fallback as original not found
      significance: 'Consolidated legal reforms and institutional development',
      details: {
        fullName: 'Joseph Kamere Mbugua',
        careerHighlights: [
          'Focused on institutional consolidation',
          'Advanced legal education reforms',
          'Strengthened professional legal standards'
        ],
        legacyImpact: 'His work in institutional development created a stronger foundation for future legal reforms.',
        notableQuote: 'A strong legal system requires strong institutions and well-trained legal professionals.'
      }
    },
    {
      id: 'guy-muli',
      name: 'Matthew Guy Muli',
      period: '1983-1991',
      title: 'Fourth Attorney General',
      achievements: [
        'Navigated complex political and legal challenges',
        'Maintained judicial independence during political transitions',
        'Advanced human rights protections in legal framework',
        'Modernized legal procedures and practices'
      ],
      image: '/AG3.jpg', // Using available AG image as fallback
      significance: 'Upheld rule of law during challenging political periods',
      details: {
        fullName: 'Matthew Guy Muli',
        careerHighlights: [
          'Served during politically challenging period',
          'Maintained independence of legal institutions',
          'Advanced human rights protections'
        ],
        legacyImpact: 'His commitment to judicial independence during difficult times strengthened Kenya\'s legal institutions.',
        notableQuote: 'The law knows no politics - it serves only justice and the people of Kenya.'
      }
    },
    {
      id: 'amos-wako',
      name: 'Amos Wako',
      period: '1991-2011',
      title: 'Longest-Serving Attorney General',
      achievements: [
        'Oversaw the transition to multiparty democracy',
        'Led constitutional review and reform processes',
        'Modernized legal institutions and procedures',
        'Championed access to justice initiatives',
        'Served for 20 years - longest tenure in office'
      ],
      image: amosWakoImage,
      significance: 'Guided Kenya through democratic transition and constitutional reform',
      details: {
        fullName: 'Amos Sitswila Wako',
        education: ['University of Dar es Salaam', 'Harvard Law School'],
        careerHighlights: [
          'Longest-serving Attorney General (20 years)',
          'Led constitutional reform process',
          'Oversaw transition to multiparty democracy',
          'Established modern legal frameworks'
        ],
        legacyImpact: 'His two-decade tenure saw Kenya transform from single-party to multiparty democracy with comprehensive legal reforms.',
        notableQuote: 'Constitutional reform is not just about changing laws - it\'s about transforming society and empowering citizens.'
      }
    },
    {
      id: 'githu-muigai',
      name: 'Githu Muigai',
      period: '2011-2018',
      title: 'First Attorney General under 2010 Constitution',
      achievements: [
        'Implemented new constitutional framework',
        'Established devolved legal structures',
        'Advanced international legal cooperation',
        'Strengthened human rights protections',
        'Modernized legal service delivery'
      ],
      image: githuMuigaiImage,
      significance: 'Pioneered implementation of the new constitutional order',
      details: {
        fullName: 'Githu Muigai',
        education: ['University of Nairobi', 'Yale Law School'],
        careerHighlights: [
          'First AG under the 2010 Constitution',
          'Implemented devolution legal framework',
          'Advanced international legal cooperation',
          'Modernized legal service delivery'
        ],
        legacyImpact: 'Successfully implemented the new constitutional framework and established modern legal service delivery systems.',
        notableQuote: 'The 2010 Constitution is not just a document - it\'s a covenant with the people of Kenya for better governance.'
      }
    },
    {
      id: 'paul-kihara',
      name: 'Prof. Paul Kihara Kariuki',
      period: '2018-2022',
      title: 'Seventh Attorney General',
      achievements: [
        'Advanced constitutional implementation',
        'Strengthened legal institutions',
        'Promoted access to justice initiatives',
        'Enhanced international legal cooperation',
        'Modernized legal frameworks'
      ],
      image: '/AG5.jpg', // Using available AG image as fallback
      significance: 'Continued constitutional implementation and legal modernization',
      details: {
        fullName: 'Prof. Paul Kihara Kariuki',
        education: ['University of Nairobi', 'University of London'],
        careerHighlights: [
          'Academic and legal practitioner',
          'Advanced constitutional implementation',
          'Promoted legal education reforms',
          'Enhanced access to justice'
        ],
        legacyImpact: 'Brought academic rigor to legal reforms and advanced constitutional implementation.',
        notableQuote: 'Legal education and constitutional literacy are fundamental to a just society.'
      }
    },
    {
      id: 'dorcas-oduor',
      name: 'Hon. Dorcas A. Oduor',
      period: '2024-Current',
      title: 'First Female Attorney General of Kenya',
      achievements: [
        'Historic appointment as first female Attorney General',
        'Advancing gender equality in legal profession',
        'Modernizing legal service delivery',
        'Strengthening constitutional governance',
        'Promoting access to justice for all'
      ],
      image: dorcasOduorImage,
      significance: 'Breaking gender barriers and advancing inclusive legal leadership',
      details: {
        fullName: 'Hon. Dorcas Agik Oduor, SC, OGW, EBS',
        education: ['University of Nairobi', 'Kenya School of Law'],
        careerHighlights: [
          'First female Attorney General in Kenya\'s history',
          'Senior Counsel with distinguished legal career',
          'Former Solicitor General',
          'Champion of gender equality in law'
        ],
        legacyImpact: 'Her historic appointment represents a milestone in gender equality and brings fresh perspective to legal leadership.',
        notableQuote: 'Justice knows no gender - it serves all Kenyans equally, and I am honored to uphold this principle.'
      }
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern-dots opacity-5" />
      
      {/* Kenya Flag Colors Accent */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#DC143C] via-[#000000] to-[#006600]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('agHistory.title', 'Attorney General History')}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {t('agHistory.subtitle', 'Since Kenya\'s independence in 1963, distinguished legal minds have shaped our nation\'s legal landscape. Each Attorney General has contributed uniquely to Kenya\'s constitutional development and legal evolution.')}
            </p>
            
            {/* Timeline Indicator */}
            <div className="flex items-center justify-center mt-8 space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-kenya-red-500" />
                <span className="text-sm font-medium text-gray-700">1963 - Present</span>
              </div>
              <div className="w-2 h-2 bg-kenya-green-500 rounded-full" />
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-kenya-green-500" />
                <span className="text-sm font-medium text-gray-700">{attorneyGeneralHistory.length} Attorney Generals</span>
              </div>
            </div>
          </motion.div>

          {/* Attorney General Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {attorneyGeneralHistory.map((ag, index) => (
              <motion.div
                key={ag.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
                onMouseEnter={() => setHoveredCard(ag.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative bg-white rounded-2xl shadow-luxury overflow-hidden hover:shadow-luxury-lg transition-all duration-500 border border-gray-100 hover:border-kenya-green-200 cursor-pointer transform hover:-translate-y-2"
                     onClick={() => setSelectedAG(ag)}>

                  {/* Card Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={ag.image}
                      alt={`${ag.name} - ${ag.title}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-ag.jpg';
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Period Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-sm font-semibold text-gray-900">{ag.period}</span>
                      </div>
                    </div>

                    {/* Current AG Badge */}
                    {ag.period.includes('Current') && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-kenya-green-500 text-white px-3 py-1 rounded-full">
                          <span className="text-sm font-semibold">Current</span>
                        </div>
                      </div>
                    )}

                    {/* Name Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{ag.name}</h3>
                      <p className="text-sm text-white/90">{ag.title}</p>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    {/* Significance */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {ag.significance}
                    </p>

                    {/* Key Achievements Preview */}
                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                        <Award className="w-4 h-4 mr-2 text-kenya-red-500" />
                        Key Achievements
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {ag.achievements.slice(0, 2).map((achievement, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-kenya-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                        {ag.achievements.length > 2 && (
                          <li className="text-kenya-red-500 font-medium">
                            +{ag.achievements.length - 2} more achievements
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Learn More Button */}
                    <button className="w-full bg-gradient-to-r from-kenya-red-500 to-kenya-red-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:from-kenya-red-600 hover:to-kenya-red-700 transition-all duration-300 flex items-center justify-center group">
                      Learn More
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>

                  {/* Hover Effect Border */}
                  <div className={`absolute inset-0 border-2 border-transparent rounded-2xl transition-all duration-300 ${
                    hoveredCard === ag.id ? 'border-kenya-green-400 shadow-lg shadow-kenya-green-100' : ''
                  }`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Modal */}
      <AnimatePresence>
        {selectedAG && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAG(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative">
                <div className="h-64 overflow-hidden rounded-t-2xl">
                  <img
                    src={selectedAG.image}
                    alt={selectedAG.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-ag.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedAG(null)}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header Content */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold text-white">{selectedAG.period}</span>
                    </div>
                    {selectedAG.period.includes('Current') && (
                      <div className="bg-kenya-green-500 text-white px-3 py-1 rounded-full">
                        <span className="text-sm font-semibold">Current AG</span>
                      </div>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedAG.details?.fullName || selectedAG.name}</h2>
                  <p className="text-lg text-white/90">{selectedAG.title}</p>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                {/* Quote Section */}
                {selectedAG.details?.notableQuote && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-kenya-red-50 to-kenya-green-50 rounded-xl border-l-4 border-kenya-red-500">
                    <Quote className="w-8 h-8 text-kenya-red-500 mb-3" />
                    <blockquote className="text-lg italic text-gray-700 leading-relaxed">
                      "{selectedAG.details.notableQuote}"
                    </blockquote>
                    <cite className="text-sm text-gray-600 mt-2 block">— {selectedAG.name}</cite>
                  </div>
                )}

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Significance */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-kenya-red-500" />
                        Historical Significance
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{selectedAG.significance}</p>
                    </div>

                    {/* Education */}
                    {selectedAG.details?.education && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Education</h3>
                        <ul className="space-y-2">
                          {selectedAG.details.education.map((edu, idx) => (
                            <li key={idx} className="flex items-center text-gray-700">
                              <div className="w-2 h-2 bg-kenya-green-500 rounded-full mr-3" />
                              {edu}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Achievements */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-kenya-red-500" />
                        Key Achievements
                      </h3>
                      <ul className="space-y-3">
                        {selectedAG.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start text-gray-700">
                            <div className="w-2 h-2 bg-kenya-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Career Highlights */}
                    {selectedAG.details?.careerHighlights && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Career Highlights</h3>
                        <ul className="space-y-2">
                          {selectedAG.details.careerHighlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-start text-gray-700">
                              <div className="w-2 h-2 bg-kenya-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Legacy Impact */}
                {selectedAG.details?.legacyImpact && (
                  <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Legacy & Impact</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedAG.details.legacyImpact}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AttorneyGeneralHistorySection;
