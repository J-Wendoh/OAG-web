import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube from 'react-youtube';
import { Play, Clock, BookOpen, Users, Scale, Filter, Search, X, Volume2, Maximize } from 'lucide-react';

interface Video {
  id: string;
  title: {
    en: string;
    sw: string;
  };
  description: {
    en: string;
    sw: string;
  };
  category: string;
  duration: string;
  thumbnail?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

const LegalEducationVideoLibrary: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  // Comprehensive video library
  const videoLibrary: Video[] = [
    {
      id: 'boB0StaOD_8',
      title: {
        en: "Know Your Rights: Constitutional Rights in Kenya",
        sw: "Jua Haki Zako: Haki za Kikatiba Kenya"
      },
      description: {
        en: "Essential information about your constitutional rights as a Kenyan citizen. Learn about fundamental freedoms, bill of rights, and constitutional protections.",
        sw: "Habari muhimu kuhusu haki zako za kikatiba kama raia wa Kenya. Jifunze kuhusu uhuru wa kimsingi, muswada wa haki, na ulinzi wa kikatiba."
      },
      category: 'Constitutional Rights',
      duration: '15:30',
      level: 'Beginner',
      tags: ['constitution', 'rights', 'freedoms', 'citizenship']
    },
    {
      id: 'dQw4w9WgXcQ', // Replace with actual educational video
      title: {
        en: "Marriage Laws in Kenya: Rights and Responsibilities",
        sw: "Sheria za Ndoa Kenya: Haki na Majukumu"
      },
      description: {
        en: "Understanding the Marriage Act 2014, types of marriage, registration requirements, and your rights in marriage and divorce proceedings.",
        sw: "Kuelewa Sheria ya Ndoa 2014, aina za ndoa, mahitaji ya usajili, na haki zako katika ndoa na taratibu za talaka."
      },
      category: 'Family Law',
      duration: '12:45',
      level: 'Intermediate',
      tags: ['marriage', 'family', 'divorce', 'registration']
    },
    {
      id: 'jNQXAC9IVRw', // Replace with actual educational video
      title: {
        en: "Access to Justice: Navigating Kenya's Legal System",
        sw: "Upatikanaji wa Haki: Kutumia Mfumo wa Kisheria"
      },
      description: {
        en: "A comprehensive guide to accessing legal services, understanding court procedures, legal aid, and alternative dispute resolution mechanisms.",
        sw: "Mwongozo kamili wa kupata huduma za kisheria, kuelewa taratibu za mahakama, msaada wa kisheria, na mbinu mbadala za kutatua migogoro."
      },
      category: 'Legal Procedures',
      duration: '18:20',
      level: 'Intermediate',
      tags: ['courts', 'procedures', 'legal aid', 'justice']
    },
    {
      id: 'M7lc1UVf-VE', // Replace with actual educational video
      title: {
        en: "Employment Rights and Labor Laws in Kenya",
        sw: "Haki za Ajira na Sheria za Kazi Kenya"
      },
      description: {
        en: "Understanding your rights as an employee, labor laws, workplace safety, termination procedures, and dispute resolution in employment matters.",
        sw: "Kuelewa haki zako kama mfanyakazi, sheria za kazi, usalama kazini, taratibu za kufukuzwa, na kutatua migogoro ya ajira."
      },
      category: 'Employment Law',
      duration: '14:15',
      level: 'Intermediate',
      tags: ['employment', 'labor', 'workplace', 'rights']
    },
    {
      id: 'XxVg_s8xAms', // Replace with actual educational video
      title: {
        en: "Property Rights and Land Laws in Kenya",
        sw: "Haki za Mali na Sheria za Ardhi Kenya"
      },
      description: {
        en: "Learn about property ownership, land registration, inheritance laws, and how to protect your property rights under Kenyan law.",
        sw: "Jifunze kuhusu umiliki wa mali, usajili wa ardhi, sheria za urithi, na jinsi ya kulinda haki zako za mali chini ya sheria ya Kenya."
      },
      category: 'Property Law',
      duration: '16:50',
      level: 'Advanced',
      tags: ['property', 'land', 'inheritance', 'ownership']
    },
    {
      id: '-DX3vJiqxm4', // Replace with actual educational video
      title: {
        en: "Criminal Justice System: Your Rights When Arrested",
        sw: "Mfumo wa Haki za Jinai: Haki Zako Unapokamatiwa"
      },
      description: {
        en: "Understanding your rights during arrest, police procedures, bail, legal representation, and the criminal justice process in Kenya.",
        sw: "Kuelewa haki zako wakati wa kukamatwa, taratibu za polisi, dhamana, uwakilishi wa kisheria, na mchakato wa haki za jinai Kenya."
      },
      category: 'Criminal Law',
      duration: '13:25',
      level: 'Beginner',
      tags: ['criminal', 'arrest', 'police', 'bail', 'rights']
    }
  ];

  const categories = ['All', ...Array.from(new Set(videoLibrary.map(video => video.category)))];

  const filteredVideos = videoLibrary.filter(video => {
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      video.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.title.sw.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setIsPlaying(false);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
    setIsPlaying(false);
  };

  const opts = {
    height: '450',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      controls: 1,
      cc_load_policy: 1,
      hl: i18n.language === 'sw' ? 'sw' : 'en',
      cc_lang_pref: i18n.language === 'sw' ? 'sw' : 'en'
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('videoLibrary.title', 'Legal Education Video Library')}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {t('videoLibrary.subtitle', 'Comprehensive video resources to help you understand your legal rights and navigate Kenya\'s legal system. Available in English and Swahili.')}
            </p>
          </motion.div>

          {/* Search and Filter Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('videoLibrary.searchPlaceholder', 'Search videos...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-kenya-red-500 focus:border-kenya-red-500 transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-kenya-red-500 focus:border-kenya-red-500 transition-colors"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {t(`videoLibrary.categories.${category.toLowerCase().replace(' ', '')}`, category)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl shadow-luxury overflow-hidden hover:shadow-luxury-lg transition-all duration-500 border border-gray-100 hover:border-kenya-green-200 cursor-pointer transform hover:-translate-y-2"
                onClick={() => handleVideoSelect(video)}
              >
                {/* Video Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-kenya-red-500 to-kenya-green-600 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 text-kenya-red-600 ml-1" />
                    </div>
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{video.duration}</span>
                    </div>
                  </div>
                  
                  {/* Level Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      video.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                      video.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {video.level}
                    </div>
                  </div>
                </div>
                
                {/* Video Info */}
                <div className="p-6">
                  <div className="mb-3">
                    <span className="text-sm text-kenya-red-600 font-semibold">{video.category}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                    {video.title[i18n.language as keyof typeof video.title] || video.title.en}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {video.description[i18n.language as keyof typeof video.description] || video.description.en}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {video.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                    {video.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{video.tags.length - 3} more</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredVideos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {t('videoLibrary.noResults', 'No videos found')}
              </h3>
              <p className="text-gray-500">
                {t('videoLibrary.noResultsDesc', 'Try adjusting your search or filter criteria')}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeVideoModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {selectedVideo.title[i18n.language as keyof typeof selectedVideo.title] || selectedVideo.title.en}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Scale className="w-4 h-4" />
                      <span>{selectedVideo.category}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedVideo.duration}</span>
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      selectedVideo.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                      selectedVideo.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedVideo.level}
                    </span>
                  </div>
                </div>

                <button
                  onClick={closeVideoModal}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Video Player */}
              <div className="relative bg-black">
                <YouTube
                  videoId={selectedVideo.id}
                  opts={opts}
                  onReady={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={(error) => console.error('YouTube video error:', error)}
                  className="w-full"
                />

                {/* Play indicator */}
                {isPlaying && (
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>{t('video.playing', 'Playing')}</span>
                  </div>
                )}
              </div>

              {/* Video Description */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t('videoLibrary.aboutVideo', 'About This Video')}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {selectedVideo.description[i18n.language as keyof typeof selectedVideo.description] || selectedVideo.description.en}
                </p>

                {/* Tags */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    {t('videoLibrary.topics', 'Topics Covered')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVideo.tags.map(tag => (
                      <span key={tag} className="text-sm bg-kenya-green-100 text-kenya-green-800 px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://www.youtube.com/watch?v=${selectedVideo.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 bg-kenya-red-600 text-white px-6 py-3 rounded-lg hover:bg-kenya-red-700 transition-colors"
                  >
                    <Maximize className="w-4 h-4" />
                    <span>{t('videoLibrary.watchOnYoutube', 'Watch on YouTube')}</span>
                  </a>

                  <button
                    onClick={closeVideoModal}
                    className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <span>{t('videoLibrary.close', 'Close')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default LegalEducationVideoLibrary;
