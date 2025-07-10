import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BookOpen, Play, Users, Scale, Award, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import RightsEducationVideo from '../components/RightsEducationVideo';

const LegalEducationPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const educationStats = [
    {
      icon: Play,
      number: '6+',
      label: 'Educational Videos',
      description: 'Comprehensive video library covering all aspects of Kenyan law'
    },
    {
      icon: Users,
      number: '50K+',
      label: 'Citizens Educated',
      description: 'Kenyans who have accessed our legal education resources'
    },
    {
      icon: BookOpen,
      number: '12',
      label: 'Legal Topics',
      description: 'Key areas of law covered in our educational content'
    },
    {
      icon: Scale,
      number: '2',
      label: 'Languages',
      description: 'Available in English and Swahili for accessibility'
    }
  ];

  const legalTopics = [
    {
      title: 'Constitutional Rights',
      description: 'Understanding your fundamental rights and freedoms under the 2010 Constitution',
      icon: Scale,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Family & Marriage Law',
      description: 'Marriage Act 2014, divorce procedures, and family legal matters',
      icon: Users,
      color: 'from-pink-500 to-pink-600'
    },
    {
      title: 'Employment Rights',
      description: 'Labor laws, workplace rights, and employment dispute resolution',
      icon: Award,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Property & Land Rights',
      description: 'Land ownership, property registration, and inheritance laws',
      icon: BookOpen,
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative py-20 bg-gradient-to-br from-kenya-red-600 via-kenya-red-700 to-kenya-green-600 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pattern-dots opacity-10" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Back Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              onClick={() => navigate(-1)}
              className="inline-flex items-center space-x-2 text-white/80 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t('common.back', 'Back')}</span>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                {t('legalEducation.title', 'Legal Education Center')}
              </h1>
              
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed mb-8">
                {t('legalEducation.subtitle', 'Empowering Kenyan citizens with knowledge of their legal rights and the justice system through comprehensive educational resources.')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="#video-library"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-kenya-red-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>{t('legalEducation.watchVideos', 'Watch Educational Videos')}</span>
                </motion.a>
                
                <motion.a
                  href="#topics"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-kenya-red-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>{t('legalEducation.browseTopics', 'Browse Topics')}</span>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {educationStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-kenya-red-500 to-kenya-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-lg font-semibold text-gray-700 mb-2">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.description}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Video Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {t('legalEducation.featured.title', 'Featured: Know Your Rights')}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t('legalEducation.featured.description', 'Start your legal education journey with this comprehensive introduction to your constitutional rights as a Kenyan citizen.')}
              </p>
            </motion.div>

            <RightsEducationVideo
              size="large"
              showTitle={true}
              showDescription={true}
              className="mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Legal Topics Overview */}
      <section id="topics" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {t('legalEducation.topics.title', 'Key Legal Topics')}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t('legalEducation.topics.description', 'Explore essential areas of Kenyan law that affect your daily life and understand your rights and responsibilities.')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {legalTopics.map((topic, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className={`h-2 bg-gradient-to-r ${topic.color}`} />
                  <div className="p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${topic.color} rounded-lg flex items-center justify-center`}>
                        <topic.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{topic.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{topic.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-kenya-green-600 to-kenya-green-700 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                {t('legalEducation.cta.title', 'Have Legal Questions?')}
              </h2>
              <p className="text-xl text-white/90 mb-8">
                {t('legalEducation.cta.description', 'Our AI-powered legal assistant Sheria is available 24/7 to help answer your questions about Kenyan law.')}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-kenya-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                onClick={() => {
                  // This will trigger the SheriaBot to open
                  const sheriaButton = document.querySelector('[aria-label="Chat with Sheria Bot"]') as HTMLButtonElement;
                  if (sheriaButton) sheriaButton.click();
                }}
              >
                {t('legalEducation.cta.button', 'Chat with Sheria Bot')}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalEducationPage;
