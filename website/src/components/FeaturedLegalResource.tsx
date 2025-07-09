import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BookOpen, Download, ExternalLink, FileText, Calendar, User } from 'lucide-react';

// Import images
const constitutionImage = '/cons.jpg';

const FeaturedLegalResource: React.FC = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const handleDownloadPDF = () => {
    window.open('https://kenyalaw.org/kl/fileadmin/pdfdownloads/TheConstitutionOfKenya.pdf', '_blank');
  };

  const handleViewOnline = () => {
    window.open('https://www.klrc.go.ke/index.php/constitution-of-kenya', '_blank');
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-dots opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-kenya-green-900 mb-4 font-merriweather">
            {t('legal.title')}
          </h2>
          <div className="w-24 h-1 bg-kenya-red-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-kenya-green-50 to-kenya-green-100 rounded-2xl p-8 border border-kenya-green-200">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-kenya-green-700 rounded-full">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-kenya-green-900">
                    The Constitution of Kenya 2010
                  </h3>
                  <p className="text-kenya-green-700">
                    Supreme Law of the Republic
                  </p>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                The Constitution of Kenya 2010 is the supreme law of the Republic of Kenya. 
                It establishes the framework for governance, protects fundamental rights and freedoms, 
                and defines the structure and powers of government institutions.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-kenya-red-500 rounded-full" />
                  <span className="text-gray-700">Bill of Rights (Chapter 4)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-kenya-red-500 rounded-full" />
                  <span className="text-gray-700">Devolved Government (Chapter 11)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-kenya-red-500 rounded-full" />
                  <span className="text-gray-700">Judiciary (Chapter 10)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-kenya-red-500 rounded-full" />
                  <span className="text-gray-700">Leadership and Integrity (Chapter 6)</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={handleDownloadPDF}
                  className="flex items-center space-x-2 bg-kenya-green-700 text-white px-6 py-3 rounded-lg hover:bg-kenya-green-800 transition-colors duration-200"
                >
                  <Download className="w-5 h-5" />
                  <span>Download PDF</span>
                </button>
                <button 
                  onClick={handleViewOnline}
                  className="flex items-center space-x-2 border-2 border-kenya-green-700 text-kenya-green-700 px-6 py-3 rounded-lg hover:bg-kenya-green-700 hover:text-white transition-colors duration-200"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>View Online</span>
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={constitutionImage}
                alt={t('legalResource.imageAlt', 'Kenya Constitution')}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-kenya-green-900/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h4 className="text-xl font-bold mb-2">
                  "We, the people of Kenya, are committed to nurturing and protecting the well-being of the individual, the family, communities and the nation."
                </h4>
                <p className="text-white/80">
                  - Preamble, Constitution of Kenya 2010
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedLegalResource;