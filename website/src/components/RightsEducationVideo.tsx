import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import YouTube from 'react-youtube';
import { Play, Volume2, VolumeX, Maximize, BookOpen, Users, Scale } from 'lucide-react';

interface RightsEducationVideoProps {
  className?: string;
  showTitle?: boolean;
  showDescription?: boolean;
  autoplay?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const RightsEducationVideo: React.FC<RightsEducationVideoProps> = ({
  className = '',
  showTitle = true,
  showDescription = true,
  autoplay = false,
  size = 'medium'
}) => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  // Educational video library with multiple videos
  const educationalVideos = [
    {
      id: 'boB0StaOD_8',
      title: {
        en: "Know Your Rights: Legal Education for Kenyan Citizens",
        sw: "Jua Haki Zako: Elimu ya Kisheria kwa Raia wa Kenya"
      },
      description: {
        en: "This educational video provides essential information about your legal rights as a Kenyan citizen. Learn about constitutional rights, legal procedures, and how to access justice in Kenya.",
        sw: "Video hii ya kielimu inatoa habari muhimu kuhusu haki zako za kisheria kama raia wa Kenya. Jifunze kuhusu haki za kikatiba, taratibu za kisheria, na jinsi ya kupata haki Kenya."
      },
      category: 'Constitutional Rights',
      duration: '15:30'
    },
    {
      id: 'dQw4w9WgXcQ', // Example video ID - replace with actual educational content
      title: {
        en: "Marriage Laws in Kenya: Your Rights and Responsibilities",
        sw: "Sheria za Ndoa Kenya: Haki na Majukumu Yako"
      },
      description: {
        en: "Understanding the Marriage Act 2014 and your rights in marriage, divorce, and family matters under Kenyan law.",
        sw: "Kuelewa Sheria ya Ndoa 2014 na haki zako katika ndoa, talaka, na mambo ya kifamilia chini ya sheria ya Kenya."
      },
      category: 'Family Law',
      duration: '12:45'
    },
    {
      id: 'jNQXAC9IVRw', // Example video ID - replace with actual educational content
      title: {
        en: "Access to Justice: How to Navigate Kenya's Legal System",
        sw: "Upatikanaji wa Haki: Jinsi ya Kutumia Mfumo wa Kisheria wa Kenya"
      },
      description: {
        en: "A comprehensive guide to accessing legal services, understanding court procedures, and getting legal aid in Kenya.",
        sw: "Mwongozo kamili wa kupata huduma za kisheria, kuelewa taratibu za mahakama, na kupata msaada wa kisheria Kenya."
      },
      category: 'Legal Procedures',
      duration: '18:20'
    }
  ];

  // Default to first video or use prop to specify which video
  const currentVideo = educationalVideos[0];
  const videoId = currentVideo.id;

  // Size configurations
  const sizeConfig = {
    small: { width: '100%', height: '200' },
    medium: { width: '100%', height: '315' },
    large: { width: '100%', height: '450' }
  };

  const opts = {
    height: sizeConfig[size].height,
    width: sizeConfig[size].width,
    playerVars: {
      autoplay: autoplay ? 1 : 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      controls: 1,
      cc_load_policy: 1, // Enable captions
      hl: i18n.language === 'sw' ? 'sw' : 'en', // Set language for captions
      cc_lang_pref: i18n.language === 'sw' ? 'sw' : 'en'
    }
  };

  const onReady = (event: any) => {
    setIsLoading(false);
    // Enable captions by default for accessibility
    try {
      event.target.setOption('captions', 'cc_load_policy', 1);
    } catch (error) {
      console.log('Captions not available for this video');
    }
  };

  const onPlay = () => {
    setIsPlaying(true);
  };

  const onPause = () => {
    setIsPlaying(false);
  };

  const onError = (error: any) => {
    console.error('YouTube video error:', error);
    setHasError(true);
    setIsLoading(false);
  };

  const videoTitle = currentVideo.title;
  const videoDescription = currentVideo.description;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 ${className}`}
    >
      {showTitle && (
        <div className="bg-gradient-to-r from-[#DC143C] via-[#000000] to-[#006600] text-white p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold">
              {videoTitle[i18n.language as keyof typeof videoTitle] || videoTitle.en}
            </h3>
          </div>
          
          {showDescription && (
            <p className="text-white/90 text-sm leading-relaxed">
              {videoDescription[i18n.language as keyof typeof videoDescription] || videoDescription.en}
            </p>
          )}
        </div>
      )}

      <div className="relative">
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#006600] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">
                {t('video.loading', 'Loading video...')}
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {hasError && (
          <div className="bg-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-red-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              {t('video.error.title', 'Video Unavailable')}
            </h4>
            <p className="text-gray-600 text-sm mb-4">
              {t('video.error.description', 'Unable to load the video. Please check your internet connection or try again later.')}
            </p>
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-[#DC143C] text-white px-4 py-2 rounded-lg hover:bg-[#B91C3C] transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>{t('video.watchOnYoutube', 'Watch on YouTube')}</span>
            </a>
          </div>
        )}

        {/* YouTube video */}
        {!hasError && (
          <div className="relative bg-black">
            <YouTube
              videoId={videoId}
              opts={opts}
              onReady={onReady}
              onPlay={onPlay}
              onPause={onPause}
              onError={onError}
              className="w-full"
            />
            
            {/* Play indicator overlay */}
            {isPlaying && (
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>{t('video.playing', 'Playing')}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Video metadata and accessibility info */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{t('video.audience', 'For all citizens')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Scale className="w-4 h-4" />
              <span>{t('video.category', 'Legal Education')}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              {t('video.accessibility', 'Captions Available')}
            </span>
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#DC143C] hover:text-[#B91C3C] font-medium"
            >
              {t('video.fullscreen', 'View Fullscreen')}
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RightsEducationVideo;
