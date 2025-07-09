import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Import images
import agImage from '../assets/images/AG.jpg';
import agMessageAudio from '/ag-message.mp4';

const AttorneyGeneralSection: React.FC = () => {
  const { t } = useTranslation();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleAudioToggle = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        audioRef.current.play().catch((error) => {
          console.log('Audio playback failed:', error);
          setIsAudioPlaying(false);
        });
        setIsAudioPlaying(true);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsAudioPlaying(false);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern-dots opacity-5" />
      
      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        preload="metadata"
        onEnded={handleAudioEnded}
        onError={() => setIsAudioPlaying(false)}
        src={agMessageAudio}
      >
        {t('audio.notSupported', 'Your browser does not support the audio element.')}
      </audio>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t('ag.title', 'Attorney General')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('ag.subtitle', 'Leading Kenya\'s legal framework with integrity, justice, and dedication to the rule of law')}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={agImage}
                  alt={t('ag.imageAlt', 'Attorney General of Kenya')}
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                
                {/* Audio Control Button */}
                <button
                  onClick={handleAudioToggle}
                  className={`absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 ${
                    isAudioPlaying ? 'animate-pulse' : ''
                  }`}
                  aria-label={isAudioPlaying ? t('ag.stopAudio', 'Stop Audio Message') : t('ag.playAudio', 'Play Audio Message')}
                >
                  {isAudioPlaying ? (
                    <VolumeX className="w-6 h-6 text-gray-800" />
                  ) : (
                    <Volume2 className="w-6 h-6 text-gray-800" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="relative">
                <Quote className="w-12 h-12 text-kenya-red-500 mb-4" />
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Welcome Message from the Hon. Attorney General of the Republic of Kenya
                  </h3>
                  <div className="text-lg text-gray-700 leading-relaxed space-y-4">
                    <p>
                      Welcome to the official website of the Office of the Attorney General and Department of Justice.
                    </p>
                    <p>
                      As the principal legal adviser to the Government, this Office is constitutionally mandated under Article 156 of the Constitution of Kenya, 2010 to uphold the rule of law, promote good governance, and act as the defender of the public interest.
                    </p>
                    <p>
                      Through this platform, we aim to enhance transparency, access to legal information, and engagement with citizens and institutions. Whether you are seeking legal resources, policy updates, or institutional contacts, we trust you will find this site informative and user-friendly.
                    </p>
                    <p>
                      We remain committed to delivering professional, principled, and people-centred legal services in support of Kenya's constitutional and democratic values.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  Hon. Dorcas A. Oduor, SC, OGW, EBS
                </h3>
                <p className="text-kenya-red-600 font-semibold">
                  Attorney General of the Republic of Kenya
                </p>
              </div>

              {/* Key Achievements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {t('ag.achievement1Title', 'Legal Reforms')}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t('ag.achievement1Desc', 'Spearheaded major constitutional and legal reforms')}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {t('ag.achievement2Title', 'Public Service')}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t('ag.achievement2Desc', '20+ years of dedicated public legal service')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AttorneyGeneralSection;