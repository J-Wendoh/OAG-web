import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Scale, Shield, FileText } from 'lucide-react';

const OurMandate: React.FC = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const mandates = [
    {
      icon: Scale,
      title: 'Legal Advisory',
      description: 'Providing comprehensive legal advice to government departments and ensuring constitutional compliance in all government operations.',
      color: 'border-kenya-green-300 bg-kenya-green-50'
    },
    {
      icon: Shield,
      title: 'Constitutional Protection',
      description: 'Safeguarding the Constitution of Kenya and ensuring that all laws and policies align with constitutional principles and values.',
      color: 'border-kenya-red-300 bg-kenya-red-50'
    },
    {
      icon: FileText,
      title: 'Legal Representation',
      description: 'Representing the government in legal proceedings and protecting the public interest in courts and tribunals across Kenya.',
      color: 'border-blue-300 bg-blue-50'
    }
  ];

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-grid opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-kenya-green-900 mb-4 font-merriweather">
            {t('mandate.title')}
          </h2>
          <div className="w-24 h-1 bg-kenya-red-500 mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('mandate.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mandates.map((mandate, index) => {
            const Icon = mandate.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`bg-white rounded-2xl p-8 shadow-lg border-2 ${mandate.color} hover:shadow-xl transition-all duration-300 hover:scale-105`}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6 shadow-md">
                  <Icon className="w-8 h-8 text-kenya-green-700" />
                </div>
                <h3 className="text-xl font-bold text-kenya-green-900 mb-4">
                  {mandate.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {mandate.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurMandate;