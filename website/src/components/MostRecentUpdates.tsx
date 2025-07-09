import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Crown, Users } from 'lucide-react';

interface NewsArticle {
  id: string;
  title_en: string;
  title_sw: string;
  excerpt_en: string;
  excerpt_sw: string;
  featured_image_url: string | null;
  category: string;
  published_at: string;
  is_featured: boolean;
}

const MostRecentUpdates: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [recentUpdates, setRecentUpdates] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recent news from database
  useEffect(() => {
    const fetchRecentNews = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/news');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const articles = await response.json();

        // Get the 2 most recent articles
        const recentArticles = articles.slice(0, 2);
        setRecentUpdates(recentArticles);
      } catch (err) {
        console.error('Error fetching recent news:', err);
        setError(err instanceof Error ? err.message : 'Failed to load news');

        // Fallback to static content
        setRecentUpdates([
          {
            id: 'fallback-1',
            title_en: 'Attorney General Leads Constitutional Review',
            title_sw: 'Mwanasheria Mkuu Anaongoza Mapitio ya Katiba',
            excerpt_en: 'Hon. Dorcas Oduor chairs the newly formed Constitutional Review Committee to assess implementation of constitutional provisions.',
            excerpt_sw: 'Mhe. Dorcas Oduor anaongoza Kamati mpya ya Mapitio ya Katiba ili kutathmini utekelezaji wa masharti ya kikatiba.',
            featured_image_url: '/newsmarch20.png',
            category: 'Legal Affairs',
            published_at: '2025-03-20T09:00:00Z',
            is_featured: true
          },
          {
            id: 'fallback-2',
            title_en: 'Strengthening International Legal Partnerships',
            title_sw: 'Kuimarisha Ushirikiano wa Kimataifa wa Kisheria',
            excerpt_en: 'The Office continues to build strategic partnerships with international legal institutions for enhanced cooperation.',
            excerpt_sw: 'Ofisi inaendelea kujenga ushirikiano wa kimkakati na taasisi za kisheria za kimataifa kwa ushirikiano ulioboreshwa.',
            featured_image_url: '/AG5.jpg',
            category: 'International Relations',
            published_at: '2025-03-19T10:00:00Z',
            is_featured: false
          }
        ] as NewsArticle[]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentNews();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-dots opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-merriweather">
            {t('updates.title')}
          </h2>
          <div className="w-24 h-1 bg-kenya-red-500 mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('updates.subtitle')}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-luxury overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Failed to load recent updates</p>
            <p className="text-gray-600">Please check your connection and try again</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {recentUpdates.map((update, index) => {
              const isFirstArticle = index === 0;
              const title = i18n.language === 'sw' ? update.title_sw : update.title_en;
              const excerpt = i18n.language === 'sw' ? update.excerpt_sw : update.excerpt_en;
              const imageUrl = update.featured_image_url || '/AG.jpg';

              return (
                <motion.article
                  key={update.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`magazine-card bg-white rounded-2xl shadow-luxury overflow-hidden hover:shadow-luxury-lg transition-all duration-500 border border-gray-100 ${
                    isFirstArticle ? 'lg:col-span-2' : ''
                  }`}
                >
                  <div className={`grid grid-cols-1 ${isFirstArticle ? 'lg:grid-cols-2' : ''} gap-0`}>
                    <div className={`relative ${isFirstArticle ? 'h-64 lg:h-auto' : 'h-48'} overflow-hidden`}>
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const currentSrc = target.src;

                          // Fallback chain for images
                          const fallbacks = ['/AG.jpg', '/AG2.jpeg', '/AG3.jpg', '/cons.jpeg'];
                          const currentIndex = fallbacks.findIndex(fallback => currentSrc.includes(fallback.split('/').pop() || ''));
                          const nextFallback = fallbacks[currentIndex + 1];

                          if (nextFallback) {
                            target.src = nextFallback;
                          } else {
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.style.background = 'linear-gradient(135deg, #1B4332 0%, #2D5A3D 100%)';
                              parent.style.minHeight = isFirstArticle ? '256px' : '192px';
                            }
                          }
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-bold ${
                          isFirstArticle || update.is_featured
                            ? 'bg-yellow-400 text-gray-900'
                            : 'bg-kenya-green-600 text-white'
                        }`}>
                          {isFirstArticle || update.is_featured ? (
                            <>
                              <Crown className="w-4 h-4" />
                              <span>{t('updates.featured')}</span>
                            </>
                          ) : (
                            <>
                              <Users className="w-4 h-4" />
                              <span>{t('updates.update')}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                          {update.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 lg:p-8">
                      <div className="flex items-center text-gray-500 text-sm mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(update.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>

                      <h3 className={`font-bold text-gray-900 mb-4 leading-tight ${
                        isFirstArticle ? 'text-2xl lg:text-3xl' : 'text-xl'
                      }`}>
                        {title}
                      </h3>

                      <p className="text-gray-600 leading-relaxed mb-6">
                        {excerpt}
                      </p>

                      <Link
                        to="/news"
                        className="flex items-center text-kenya-green-700 hover:text-kenya-green-800 font-semibold transition-all duration-300 micro-slide"
                      >
                        {t('updates.readFull')}
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Link 
            to="/news"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center space-x-2 bg-gray-900 text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
          >
            <span>{t('updates.checkMore')}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MostRecentUpdates;