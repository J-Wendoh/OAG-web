import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Share2, Tag } from 'lucide-react';
import { getNewsBySlug, type NewsArticle } from '../data/processedNewsData';

const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const article = slug ? getNewsBySlug(slug) : null;

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/news')}
            className="bg-kenya-red-500 text-white px-6 py-3 rounded-lg hover:bg-kenya-red-600 transition-colors"
          >
            Back to News
          </button>
        </div>
      </div>
    );
  }

  const currentLang = i18n.language;
  const title = currentLang === 'sw' ? article.title_sw : article.title_en;
  const content = currentLang === 'sw' ? article.content_sw : article.content_en;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: article.excerpt_en,
        url: window.location.href,
      });
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Article URL copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <article className="container mx-auto px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(article.published_at)}
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                AG Communications Team
              </div>
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                {article.category}
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight font-merriweather">
              {title}
            </h1>

            {/* Share Button */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-kenya-green-100 text-kenya-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={shareArticle}
                className="flex items-center space-x-2 text-gray-600 hover:text-kenya-red-500 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </header>

          {/* Featured Image */}
          {article.featured_image_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <img
                src={article.featured_image_url}
                alt={title}
                className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover object-center rounded-2xl shadow-lg"
                loading="lazy"
              />
            </motion.div>
          )}

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="prose prose-lg max-w-none"
          >
            <div className="text-gray-800 leading-relaxed whitespace-pre-line text-lg">
              {content}
            </div>
          </motion.div>

          {/* Additional Images */}
          {article.images && article.images.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Related Images</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {article.images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${title} - Image ${index + 2}`}
                    className="w-full h-48 sm:h-52 md:h-56 object-cover object-center rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    loading="lazy"
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Back to News Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <button
              onClick={() => navigate('/news')}
              className="bg-kenya-red-500 text-white px-8 py-3 rounded-lg hover:bg-kenya-red-600 transition-colors font-medium"
            >
              Back to All News
            </button>
          </motion.div>
        </motion.div>
      </article>
    </div>
  );
};

export default NewsDetailPage;
