import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Newspaper, Users, Phone, Building, Shield, Scale, FileText, ArrowRight, Briefcase } from 'lucide-react';

// Import images
import kenyaFlagImage from '../assets/images/flagkenya.jpeg';

const FeatureCards: React.FC = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const features = [
    {
      key: 'news',
      icon: Newspaper,
      color: 'from-gray-800 to-gray-900',
      hoverColor: 'hover:from-blue-600 hover:to-blue-800',
      image: '/AG.jpg',
      link: '/news',
      baseStyle: 'bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300',
      hoverStyle: 'hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 hover:border-blue-400'
    },
    {
      key: 'services',
      icon: Users,
      color: 'from-kenya-red-500 to-kenya-red-700',
      hoverColor: 'hover:from-red-600 hover:to-red-800',
      image: '/Ourservices.jpg',
      link: '/services',
      baseStyle: 'bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-300',
      hoverStyle: 'hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100 hover:border-red-400'
    },
    {
      key: 'contact',
      icon: Phone,
      color: 'from-kenya-green-500 to-kenya-green-700',
      hoverColor: 'hover:from-green-600 hover:to-green-800',
      image: '/Contactus.jpg',
      link: '/contact',
      baseStyle: 'bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-300',
      hoverStyle: 'hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 hover:border-green-400'
    },
    {
      key: 'opportunities',
      icon: Briefcase,
      color: 'from-amber-500 to-amber-700',
      hoverColor: 'hover:from-amber-600 hover:to-amber-800',
      image: '/Departments.jpg',
      link: '/opportunities',
      baseStyle: 'bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300',
      hoverStyle: 'hover:bg-gradient-to-br hover:from-amber-50 hover:to-amber-100 hover:border-amber-400'
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={kenyaFlagImage}
          alt={t('features.flagAlt', 'Kenya Flag')}
          className="w-full h-full object-cover opacity-30"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.style.background = 'linear-gradient(135deg, #1B4332 0%, #2D5A3D 50%, #DC143C 100%)';
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/70 to-white/80" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Link 
                  to={feature.link}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <div className={`luxury-card relative w-40 h-40 mx-auto mb-4 rounded-2xl overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-all duration-500 transform hover:-translate-y-2 ${feature.baseStyle} ${feature.hoverStyle}`}>
                    <div className="absolute inset-0">
                      <img
                        src={feature.image}
                        alt={t(`features.${feature.key}`)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const currentSrc = target.src;
                          
                          if (currentSrc.includes('Ourservices.jpg')) {
                            target.src = '/AG.jpg';
                          } else if (currentSrc.includes('Contactus.jpg')) {
                            target.src = '/AG2.jpeg';
                          } else if (currentSrc.includes('Departments.jpg')) {
                            target.src = '/AG3.jpg';
                          } else if (currentSrc.includes('AG.jpg')) {
                            target.src = '/cons.jpeg';
                          } else {
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.style.background = `linear-gradient(135deg, ${feature.color.includes('red') ? '#DC143C' : '#1B4332'} 0%, ${feature.color.includes('red') ? '#B91C1C' : '#2D5A3D'} 100%)`;
                            }
                          }
                        }}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${feature.color} ${feature.hoverColor} opacity-80 group-hover:opacity-90 transition-all duration-300`} />
                    </div>

                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300" />

                    <div className="relative z-10 h-full flex items-center justify-center">
                      <Icon className="w-16 h-16 text-white transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                    </div>

                    <div className="absolute inset-0 border-2 border-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Animated corner accents */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white/40 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white/40 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                  </div>

                  <div className="text-center transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                      {t(`features.${feature.key}`)}
                    </h3>
                    <div className="w-0 group-hover:w-12 h-0.5 bg-gray-600 mx-auto mt-2 transition-all duration-300" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;