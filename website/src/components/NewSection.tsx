import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Users, Globe, Heart } from 'lucide-react';

const NewSection: React.FC = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const achievements = [
    {
      icon: Award,
      number: '50+',
      title: 'Years of Service',
      description: 'Serving Kenya with dedication and excellence'
    },
    {
      icon: Users,
      number: '1000+',
      title: 'Cases Handled',
      description: 'Successfully resolved legal matters'
    },
    {
      icon: Globe,
      number: '47',
      title: 'Counties Served',
      description: 'Nationwide legal coverage and support'
    },
    {
      icon: Heart,
      number: '100%',
      title: 'Commitment',
      description: 'Dedicated to justice and equality'
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
            Our Impact & Achievements
          </h2>
          <div className="w-24 h-1 bg-kenya-red-500 mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Measuring our commitment to justice, equality, and service to the people of Kenya
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-kenya-green-100 hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-kenya-green-100 rounded-full mx-auto mb-6">
                  <Icon className="w-8 h-8 text-kenya-green-700" />
                </div>
                <h3 className="text-3xl font-bold text-kenya-green-900 mb-2">
                  {achievement.number}
                </h3>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  {achievement.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {achievement.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NewSection;