import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { Plus, Edit3, Trash2, Eye, Calendar, User, Filter, Search, Newspaper } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import NewsEditor from './NewsEditor';

export default function NewsManagement() {
  const { newsArticles, deleteNewsArticle, logActivity } = useData();
  const { user } = useAuth();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = newsArticles.filter(article => {
    const matchesFilter = filter === 'all' || article.status === filter;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteNewsArticle(id);
      logActivity({
        userId: user?.id || '',
        userName: user?.name || '',
        action: 'News Article Deleted',
        details: 'A news article was deleted',
        type: 'news',
      });
      toast.success('Article deleted successfully');
    }
  };

  const handleEdit = (article: any) => {
    setSelectedArticle(article);
    setShowEditor(true);
  };

  const handleNewArticle = () => {
    setSelectedArticle(null);
    setShowEditor(true);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
      draft: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
      archived: 'bg-gradient-to-r from-gray-500 to-slate-500 text-white',
    };
    return styles[status as keyof typeof styles] || styles.draft;
  };

  if (showEditor) {
    return (
      <NewsEditor
        article={selectedArticle}
        onClose={() => setShowEditor(false)}
        onSave={() => {
          setShowEditor(false);
          setSelectedArticle(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            News Management
          </h1>
          <p className="text-gray-600 mt-2">Create and manage news articles for the public portal</p>
        </div>
        <button
          onClick={handleNewArticle}
          className="btn-primary flex items-center space-x-2 w-full lg:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span>Create Article</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="flex space-x-2">
              {['all', 'published', 'draft', 'archived'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    filter === status
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {filteredArticles.map((article, index) => (
          <div
            key={article.id}
            className="glass-card rounded-2xl overflow-hidden hover-lift animate-slide-in-right"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(article.status)}`}>
                  {article.status}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(article.publishDate), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{article.author}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(article)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors duration-200"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors duration-200">
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Articles Found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || filter !== 'all' 
              ? 'No articles match your current filters.' 
              : 'Get started by creating your first news article.'
            }
          </p>
          {!searchQuery && filter === 'all' && (
            <button
              onClick={handleNewArticle}
              className="btn-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Article
            </button>
          )}
        </div>
      )}
    </div>
  );
}