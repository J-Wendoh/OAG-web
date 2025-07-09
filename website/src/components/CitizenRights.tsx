import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Heart, Home, Briefcase, GraduationCap, Shield } from 'lucide-react';

const CitizenRights: React.FC = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const rights = [
    {
      icon: Users,
      title: 'Equality & Non-Discrimination',
      description: 'Every person is equal before the law and has the right to equal protection and benefit of the law.',
      article: 'Article 27'
    },
    {
      icon: Heart,
      title: 'Right to Life',
      description: 'Every person has the right to life, which begins at conception.',
      article: 'Article 26'
    },
    {
      icon: Home,
      title: 'Right to Housing',
      description: 'Every person has the right to accessible and adequate housing, and to reasonable standards of sanitation.',
      article: 'Article 43'
    },
    {
      icon: Briefcase,
      title: 'Right to Fair Labor',
      description: 'Every worker has the right to fair remuneration, reasonable working conditions, and to form trade unions.',
      article: 'Article 41'
    },
    {
      icon: GraduationCap,
      title: 'Right to Education',
      description: 'Every person has the right to education, including free and compulsory basic education.',
      article: 'Article 43'
    },
    {
      icon: Shield,
      title: 'Right to Security',
      description: 'Every person has the right to security of the person, including freedom from violence.',
      article: 'Article 29'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-kenya-green-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-circles opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-kenya-green-900 mb-4 font-merriweather">
            {t('rights.title')}
          </h2>
          <div className="w-24 h-1 bg-kenya-red-500 mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('rights.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rights.map((right, index) => {
            const Icon = right.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-kenya-green-100 hover:shadow-xl transition-all duration-300 hover:border-kenya-green-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-kenya-green-100 rounded-full">
                    <Icon className="w-6 h-6 text-kenya-green-700" />
                  </div>
                  <span className="bg-kenya-red-100 text-kenya-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    {right.article}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-kenya-green-900 mb-3">
                  {right.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {right.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-kenya-green-100 to-kenya-red-100 rounded-2xl p-8 border border-kenya-green-200">
            <h3 className="text-2xl font-bold text-kenya-green-900 mb-4">
              Know Your Rights
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Understanding your constitutional rights is essential for active citizenship. 
              If you believe your rights have been violated, seek legal assistance immediately.
            </p>
            <button className="bg-kenya-green-700 text-white px-8 py-3 rounded-lg hover:bg-kenya-green-800 transition-colors duration-200 font-semibold">
              Get Legal Help
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CitizenRights;