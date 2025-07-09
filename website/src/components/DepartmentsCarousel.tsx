import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DepartmentsCarousel: React.FC = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const departments = [
    {
      key: 'marriage',
      title: 'Department of Marriage',
      image: 'https://images.pexels.com/photos/3184431/pexels-photo-3184431.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Handling all matters related to marriage registration, divorce proceedings, and family law.',
      color: 'from-kenya-green-500 to-kenya-green-700'
    },
    {
      key: 'legal',
      title: 'Department of Legal Affairs',
      image: 'https://images.pexels.com/photos/8111764/pexels-photo-8111764.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Providing legal advice, drafting legislation, and representing government interests.',
      color: 'from-gray-800 to-gray-900'
    },
    {
      key: 'justice',
      title: 'Department of Justice',
      image: 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Ensuring fair administration of justice and upholding the rule of law.',
      color: 'from-kenya-green-600 to-kenya-green-800'
    },
    {
      key: 'admin',
      title: 'Administration',
      image: 'https://images.pexels.com/photos/8111765/pexels-photo-8111765.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Managing administrative functions and organizational operations.',
      color: 'from-gray-700 to-gray-900'
    },
    {
      key: 'aid',
      title: 'National Legal Aid Service',
      image: 'https://images.pexels.com/photos/5669602/pexels-photo-5669602.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Providing legal aid services to underserved communities across Kenya.',
      color: 'from-kenya-green-500 to-kenya-green-700'
    },
    {
      key: 'corruption',
      title: 'Anti-Corruption Campaign',
      image: 'https://images.pexels.com/photos/8111792/pexels-photo-8111792.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Leading efforts to combat corruption and promote transparency in government.',
      color: 'from-gray-800 to-gray-900'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % departments.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [departments.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % departments.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + departments.length) % departments.length);
  };

  const getVisibleDepartments = () => {
    const visible = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + departments.length) % departments.length;
      visible.push({ ...departments[index], position: i });
    }
    return visible;
  };

  return (
    <section id="departments" className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-plus opacity-5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-merriweather">
            {t('departments.title')}
          </h2>
          <div className="w-24 h-1 bg-kenya-red-500 mx-auto rounded-full" />
        </motion.div>

        {/* Mobile-First Responsive Carousel Container */}
        <div className="relative mb-8 sm:mb-12">
          {/* Mobile View - Single Card */}
          <div className="block sm:hidden">
            <div className="relative h-80 mx-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <div className="h-full bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                    <div className="h-2/3 relative">
                      <img
                        src={departments[currentIndex].image}
                        alt={departments[currentIndex].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-lg font-bold text-white mb-2 drop-shadow-lg">
                          {departments[currentIndex].title}
                        </h3>
                      </div>
                    </div>
                    <div className="h-1/3 p-4">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {departments[currentIndex].description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Tablet View - Two Cards */}
          <div className="hidden sm:block lg:hidden">
            <div className="relative h-80 mx-4">
              <div className="grid grid-cols-2 gap-4 h-full">
                {[0, 1].map((offset) => {
                  const index = (currentIndex + offset) % departments.length;
                  const dept = departments[index];
                  return (
                    <motion.div
                      key={`tablet-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200"
                    >
                      <div className="h-2/3 relative">
                        <img
                          src={dept.image}
                          alt={dept.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 right-2">
                          <h3 className="text-sm font-bold text-white mb-1 drop-shadow-lg">
                            {dept.title}
                          </h3>
                        </div>
                      </div>
                      <div className="h-1/3 p-3">
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {dept.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Desktop View - Three Cards */}
          <div className="hidden lg:block">
            <div className="relative h-96">
              <AnimatePresence>
                {getVisibleDepartments().map((dept) => (
                  <motion.div
                    key={`${dept.key}-${currentIndex}`}
                    initial={{ 
                      opacity: 0, 
                      scale: 0.8,
                      x: dept.position * 100,
                      z: dept.position === 0 ? 100 : 0
                    }}
                    animate={{ 
                      opacity: dept.position === 0 ? 1 : 0.6,
                      scale: dept.position === 0 ? 1 : 0.8,
                      x: dept.position * 320,
                      z: dept.position === 0 ? 100 : 0
                    }}
                    exit={{ 
                      opacity: 0,
                      scale: 0.6
                    }}
                    transition={{ 
                      duration: 0.5,
                      ease: "easeInOut"
                    }}
                    className={`absolute inset-0 mx-auto max-w-md ${
                      dept.position === 0 ? 'z-30' : 'z-20'
                    }`}
                    style={{
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <div className={`h-full bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 ${
                      dept.position === 0 ? 'shadow-2xl border-gray-300' : 'shadow-md'
                    }`}>
                      <div className="h-2/3 relative">
                        <img
                          src={dept.image}
                          alt={dept.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
                            {dept.title}
                          </h3>
                        </div>
                      </div>
                      <div className="h-1/3 p-6">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {dept.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Buttons - Responsive */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition-all duration-200 shadow-lg"
            aria-label={t('departments.previous')}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition-all duration-200 shadow-lg"
            aria-label={t('departments.next')}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Indicators - Responsive */}
        <div className="flex justify-center space-x-2 mb-6 sm:mb-8">
          {departments.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-gray-900' : 'bg-gray-300'
              }`}
              aria-label={t('departments.goTo', { number: index + 1 })}
            />
          ))}
        </div>

        {/* See All Departments Button - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Link 
            to="/departments"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center space-x-2 bg-gray-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base font-semibold"
          >
            <span>{t('departments.seeAll')}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default DepartmentsCarousel;