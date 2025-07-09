import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Users, Phone, MapPin, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'page' | 'service' | 'contact' | 'news';
  url: string;
  relevance: number;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sample search data - in a real app, this would come from an API
  const searchData: SearchResult[] = [
    {
      id: '1',
      title: t('search.results.about', 'About OAG'),
      description: t('search.results.aboutDesc', 'Learn about the Office of the Attorney General and its mission'),
      category: 'page',
      url: '/about',
      relevance: 0.9
    },
    {
      id: '2',
      title: t('search.results.complaints', 'File a Complaint'),
      description: t('search.results.complaintsDesc', 'Submit your complaint and track its progress'),
      category: 'service',
      url: '/complaints',
      relevance: 0.95
    },
    {
      id: '3',
      title: t('search.results.departments', 'Departments'),
      description: t('search.results.departmentsDesc', 'Explore our various departments and their services'),
      category: 'page',
      url: '/departments',
      relevance: 0.8
    },
    {
      id: '4',
      title: t('search.results.contact', 'Contact Us'),
      description: t('search.results.contactDesc', 'Get in touch with our offices'),
      category: 'contact',
      url: '/contact',
      relevance: 0.85
    },
    {
      id: '5',
      title: t('search.results.services', 'Legal Services'),
      description: t('search.results.servicesDesc', 'Access our comprehensive legal services'),
      category: 'service',
      url: '/services',
      relevance: 0.9
    },
    {
      id: '6',
      title: t('search.results.news', 'News & Updates'),
      description: t('search.results.newsDesc', 'Stay updated with the latest news and announcements'),
      category: 'news',
      url: '/news',
      relevance: 0.75
    }
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('oag-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      // Search database content
      const { data: newsResults, error } = await supabase
        .from('news_articles')
        .select('id, title_en, title_sw, excerpt_en, excerpt_sw, slug')
        .eq('status', 'published')
        .or(`title_en.ilike.%${searchQuery}%,title_sw.ilike.%${searchQuery}%,excerpt_en.ilike.%${searchQuery}%,excerpt_sw.ilike.%${searchQuery}%`)
        .limit(5);

      let allResults: SearchResult[] = [];

      // Add news results
      if (newsResults && !error) {
        const newsSearchResults = newsResults.map(article => ({
          id: article.id,
          title: article.title_en,
          description: article.excerpt_en || 'News article',
          category: 'news' as const,
          url: `/news/${article.slug}`,
          relevance: 0.9
        }));
        allResults = [...allResults, ...newsSearchResults];
      }

      // Add static content results (services, pages, etc.)
      const staticResults = searchData.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const descMatch = item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return titleMatch || descMatch;
      });

      allResults = [...allResults, ...staticResults];

      // Sort by relevance
      allResults.sort((a, b) => b.relevance - a.relevance);

      setResults(allResults);
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to static search
      const filtered = searchData.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const descMatch = item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return titleMatch || descMatch;
      });
      setResults(filtered);
    }

    setIsLoading(false);

    // Save to recent searches
    if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
      const newRecent = [searchQuery, ...recentSearches.slice(0, 4)];
      setRecentSearches(newRecent);
      localStorage.setItem('oag-recent-searches', JSON.stringify(newRecent));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'page':
        return <FileText className="w-4 h-4" />;
      case 'service':
        return <Users className="w-4 h-4" />;
      case 'contact':
        return <Phone className="w-4 h-4" />;
      case 'news':
        return <Clock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'page':
        return 'bg-blue-100 text-blue-800';
      case 'service':
        return 'bg-green-100 text-green-800';
      case 'contact':
        return 'bg-purple-100 text-purple-800';
      case 'news':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleResultClick = (result: SearchResult) => {
    onClose();
    // Navigation is handled by Link component
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {t('search.title', 'Search OAG')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={t('search.close', 'Close search')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search.placeholder', 'Search for services, departments, or information...')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-red-500 focus:border-transparent outline-none"
              />
            </div>
          </form>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kenya-red-500"></div>
              <span className="ml-2 text-gray-600">{t('search.loading', 'Searching...')}</span>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                {t('search.resultsCount', 'Found {{count}} results', { count: results.length })}
              </h3>
              {results.map((result) => (
                <Link
                  key={result.id}
                  to={result.url}
                  onClick={() => handleResultClick(result)}
                  className="block p-4 rounded-lg border border-gray-200 hover:border-kenya-red-300 hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(result.category)}`}>
                      {getCategoryIcon(result.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-kenya-red-600 transition-colors">
                        {result.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {result.description}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(result.category)}`}>
                          {t(`search.category.${result.category}`, result.category)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('search.noResults', 'No results found')}
              </h3>
              <p className="text-gray-600">
                {t('search.noResultsDesc', 'Try searching with different keywords or browse our services.')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    {t('search.recent', 'Recent Searches')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(search);
                          performSearch(search);
                        }}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  {t('search.suggestions', 'Popular Searches')}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    t('search.popular.complaints', 'File Complaint'),
                    t('search.popular.status', 'Check Status'),
                    t('search.popular.contact', 'Contact Info'),
                    t('search.popular.services', 'Legal Services')
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(suggestion);
                        performSearch(suggestion);
                      }}
                      className="p-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal; 