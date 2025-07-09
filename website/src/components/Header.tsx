import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, Volume2, Home, Users, Building, Phone, Briefcase, Zap, FileText, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import LanguageToggle from './LanguageToggle';
import SearchModal from './SearchModal';

// Import images
import courtOfArmsImage from '../assets/images/courtofarms.jpeg';
import agMessageAudio from '/ag-message.mp4';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', href: '/', icon: Home },
    { key: 'about', href: '/about', icon: Users },
    { key: 'opportunities', href: '/opportunities', icon: Briefcase },
    { key: 'records', href: '/records', icon: FileText },
    { key: 'services', href: '/services', icon: Building },
    { key: 'contact', href: '/contact', icon: Phone }
  ];

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

  // Dynamic text color based on page and scroll state
  const getTextColor = () => {
    if (isHomePage && !isScrolled) {
      return 'text-white';
    }
    return 'text-gray-900';
  };

  const getHoverColor = (itemKey: string) => {
    if (isHomePage && !isScrolled) {
      return itemKey === 'contact' ? 'hover:text-kenya-green-300' : 'hover:text-kenya-red-300';
    }
    return itemKey === 'contact' ? 'hover:text-kenya-green-600' : 'hover:text-kenya-red-600';
  };

  const getActiveColor = () => {
    if (isHomePage && !isScrolled) {
      return 'text-kenya-red-400 border-b-2 border-kenya-red-400';
    }
    return 'text-kenya-red-600 border-b-2 border-kenya-red-600';
  };

  return (
    <>
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        preload="metadata"
        onEnded={handleAudioEnded}
        onError={() => setIsAudioPlaying(false)}
        src={agMessageAudio}
      >
        {t('nav.audioNotSupported', 'Your browser does not support the audio element.')}
      </audio>

      {/* Floating Header with rounded corners */}
      <header className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 rounded-2xl ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-2xl border border-gray-200' 
          : 'bg-white/10 backdrop-blur-sm border border-white/20'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo with Court of Arms */}
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center space-x-3"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center border-2 border-kenya-red-500 bg-white">
                <img 
                  src={courtOfArmsImage} 
                  alt={t('nav.logoAlt', 'Kenya Court of Arms')}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="hidden md:block">
                <h1 className={`text-lg font-bold ${getTextColor()}`}>
                  {t('nav.logoTitle', 'OAG')}
                </h1>
                <p className={`text-sm ${getTextColor()}/90`}>
                  {t('nav.logoSubtitle', 'Kenya')}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation - Icons Only with Tooltips */}
            <nav className="hidden lg:flex items-center space-x-6 ml-auto mr-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="relative group">
                    <Link
                      to={item.href}
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                        location.pathname === item.href
                          ? 'bg-kenya-red-500 text-white shadow-lg'
                          : isHomePage && !isScrolled
                          ? 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 hover:text-kenya-red-600'
                      }`}
                      aria-label={t(`nav.${item.key}`)}
                    >
                      <Icon className="w-5 h-5" />
                    </Link>

                    {/* Tooltip */}
                    <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-sm font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 ${
                      isHomePage && !isScrolled
                        ? 'bg-white text-gray-900'
                        : 'bg-gray-900 text-white'
                    }`}>
                      {t(`nav.${item.key}`)}
                      <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-transparent ${
                        isHomePage && !isScrolled
                          ? 'border-t-4 border-t-white'
                          : 'border-t-4 border-t-gray-900'
                      }`}></div>
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Right Side Controls */}
            <div className="hidden md:flex items-center space-x-4">
              {/* News Flash Icon */}
              <Link
                to="/news"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`relative p-2 border-2 rounded-lg transition-all duration-300 group ${
                  isHomePage && !isScrolled
                    ? 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                    : 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200'
                }`}
                title={t('nav.newsTitle', 'News & Updates')}
              >
                <Zap className="w-4 h-4 animate-pulse" />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {t('nav.newsTooltip', 'News & Updates')}
                </div>
                {/* Flash indicator */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-kenya-red-500 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-kenya-red-500 rounded-full"></div>
              </Link>

              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 border-2 rounded-lg transition-all duration-300 ${
                  isHomePage && !isScrolled
                    ? 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                    : 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200'
                }`}
                aria-label={t('nav.searchLabel', 'Search')}
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Audio Speaker Button */}
              <button
                onClick={handleAudioToggle}
                className={`p-2 border-2 rounded-lg transition-all duration-300 ${
                  isAudioPlaying ? 'animate-pulse' : ''
                } ${
                  isHomePage && !isScrolled
                    ? 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                    : 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200'
                }`}
                aria-label={isAudioPlaying ? t('nav.stopAudio', 'Stop Audio') : t('nav.playAudio', 'Play AG Message')}
              >
                <Volume2 className={`w-4 h-4 ${isAudioPlaying ? 'animate-bounce' : ''}`} />
              </button>

              {/* Language Toggle */}
              <LanguageToggle />
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 ${getTextColor()}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={t('nav.mobileMenuLabel', 'Toggle mobile menu')}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 p-4">
              <nav className="flex flex-col space-y-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.key}
                      to={item.href}
                      className={`flex items-center space-x-3 font-medium py-2 transition-colors duration-200 ${
                        location.pathname === item.href
                          ? 'text-kenya-red-600'
                          : 'text-gray-900 hover:text-kenya-red-500'
                      }`}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{t(`nav.${item.key}`)}</span>
                    </Link>
                  );
                })}
                
                {/* Mobile News Link */}
                <Link
                  to="/news"
                  className="flex items-center space-x-3 font-medium py-2 text-gray-900 hover:text-kenya-red-500 transition-colors duration-200"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <Zap className="w-5 h-5" />
                  <span>{t('nav.newsUpdates', 'News & Updates')}</span>
                  <div className="w-2 h-2 bg-kenya-red-500 rounded-full animate-pulse ml-auto"></div>
                </Link>
              </nav>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <LanguageToggle />
                  </div>
                  <button
                    onClick={handleAudioToggle}
                    className={`p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors border border-kenya-red-500 ${
                      isAudioPlaying ? 'animate-pulse' : ''
                    }`}
                    aria-label={isAudioPlaying ? t('nav.stopAudio', 'Stop Audio') : t('nav.playAudio', 'Play AG Message')}
                  >
                    <Volume2 className={`w-4 h-4 ${isAudioPlaying ? 'animate-bounce' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;