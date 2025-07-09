import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowRight, ArrowLeft, Crown, Users, Search, Filter } from 'lucide-react';
import {
  newsArticles,
  getFeaturedNews,
  getPublishedNews,
  searchNews,
  getNewsByCategory,
  type NewsArticle
} from '../data/newsData';



const NewsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      // Use static news data for better performance and reliability
      const publishedArticles = getPublishedNews();
      const featuredArticles = getFeaturedNews();

      // Set featured article (first featured article)
      setFeaturedArticle(featuredArticles[0] || null);

      // Set regular articles (non-featured articles)
      const regularArticles = publishedArticles.filter(article => !article.is_featured);
      setNewsArticles(regularArticles);

    } catch (err) {
      console.error('Error loading news:', err);
      setError('Failed to load news articles.');
      setNewsArticles([]);
      setFeaturedArticle(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-kenya-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchNews}
            className="px-4 py-2 bg-kenya-red-600 text-white rounded-lg hover:bg-kenya-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-merriweather">
            Latest News & Updates
          </h1>
          <div className="w-24 h-1 bg-kenya-red-500 mx-auto rounded-full" />
        </motion.div>

        {/* Featured Article */}
        {featuredArticle && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-r from-kenya-green-600 to-kenya-green-700 rounded-3xl overflow-hidden shadow-2xl border-4 border-yellow-400">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto">
                  {featuredArticle.featured_image_url ? (
                    <img
                      src={featuredArticle.featured_image_url}
                      alt={featuredArticle.title_en}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.style.background = 'linear-gradient(135deg, #1B4332 0%, #2D5A3D 100%)';
                          parent.style.minHeight = '256px';
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-kenya-green-600 to-kenya-green-800 flex items-center justify-center">
                      <div className="text-white text-center">
                        <Crown className="w-16 h-16 mx-auto mb-2 opacity-50" />
                        <p className="text-sm opacity-75">Featured Article</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center space-x-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                      <Crown className="w-4 h-4" />
                      <span>FEATURED</span>
                    </div>
                  </div>
                </div>
                <div className="p-8 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {featuredArticle.category}
                    </span>
                    <div className="flex items-center text-white/80 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {featuredArticle.published_at ?
                        new Date(featuredArticle.published_at).toLocaleDateString() :
                        new Date(featuredArticle.created_at).toLocaleDateString()
                      }
                    </div>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                    {featuredArticle.title_en}
                  </h2>
                  <p className="text-white/90 mb-6 leading-relaxed">
                    {featuredArticle.excerpt_en || featuredArticle.content_en.substring(0, 200) + '...'}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-white/80 text-sm">
                      <User className="w-4 h-4 mr-1" />
                      {featuredArticle.author_name || 'AG Communications Team'}
                    </div>
                    <button className="flex items-center text-white hover:text-yellow-400 font-medium transition-colors">
                      Read Full Story
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Other News Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200"
            >
              <div className="h-48 overflow-hidden">
                {article.featured_image_url ? (
                  <img
                    src={article.featured_image_url}
                    alt={article.title_en}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.style.background = 'linear-gradient(135deg, #1B4332 0%, #2D5A3D 100%)';
                        parent.style.minHeight = '192px';
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="text-gray-500 text-center">
                      <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-75">News Article</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {article.published_at ?
                      new Date(article.published_at).toLocaleDateString() :
                      new Date(article.created_at).toLocaleDateString()
                    }
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {article.title_en}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt_en || article.content_en.substring(0, 150) + '...'}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 text-sm">
                    <User className="w-4 h-4 mr-1" />
                    {article.author_name || 'AG Communications Team'}
                  </div>
                  <button className="flex items-center text-gray-700 hover:text-gray-900 font-medium">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* No articles message */}
        {newsArticles.length === 0 && !featuredArticle && (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No News Articles Yet</h3>
            <p className="text-gray-500">Check back soon for the latest updates from the Attorney General's office.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;