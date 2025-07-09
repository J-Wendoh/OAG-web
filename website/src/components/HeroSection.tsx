import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
// Using local API instead of Supabase
// import { api } from '../../../shared/utils/api';
// import { isSupabaseConfigured } from '../../../shared/utils/supabase';
import type { HeroSectionRow } from '../../../shared/types/database';

interface SlideData {
  id: number | string;
  image: string;
  alt: string;
  title: string;
  subtitle: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  showText: boolean;
  isFirstSlide?: boolean;
  isDbHero?: boolean;
}

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [heroSection, setHeroSection] = useState<HeroSectionRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set());
  const [preloadComplete, setPreloadComplete] = useState(false);

  // Fallback slides for when database is not available
  const fallbackSlides = [
    {
      id: 1,
      image: '/AG.jpg', // Use smaller, optimized image as first slide
      alt: 'Office of the Attorney General - Department of Justice',
      title: '',
      subtitle: '',
      showText: true,
      isFirstSlide: true
    },
    {
      id: 2,
      image: '/Contactus.jpg',
      alt: t('hero.slide2.title'),
      title: t('hero.slide2.title'),
      subtitle: t('hero.slide2.subtitle'),
      showText: true,
      isFirstSlide: false
    },
    {
      id: 3,
      image: '/Ourservices.jpg',
      alt: 'Media Engagement',
      title: 'Transparent Communication',
      subtitle: 'Engaging with the Public',
      showText: true,
      isFirstSlide: false
    },
    {
      id: 4,
      image: '/AG5.jpg',
      alt: 'Attorney General Leadership',
      title: 'Excellence in Legal Leadership',
      subtitle: 'Upholding Justice and Constitutional Values',
      description: 'Committed to delivering exceptional legal services and maintaining the highest standards of justice for all Kenyans.',
      showText: true,
      isFirstSlide: false
    },
    {
      id: 5,
      image: '/UN HUMAN RIGHTS STAKEHOLDERS.jpg',
      alt: 'International Human Rights Engagement',
      title: 'Global Human Rights Partnership',
      subtitle: 'Kenya\'s Commitment to International Justice',
      description: 'Strengthening international cooperation and advancing human rights through strategic partnerships and diplomatic engagement.',
      showText: true,
      isFirstSlide: false
    }
  ];

  // Optimized for LCP performance - minimal preloading
  const preloadImages = (slides: SlideData[]) => {
    // Skip preloading to improve LCP performance
    // Images will load on-demand when displayed
    setLoading(false);
    setPreloadComplete(true);

    // Mark all images as "loaded" so slideshow works immediately
    if (slides.length > 0) {
      const imageSet = new Set(slides.map(slide => slide.image));
      setImagesLoaded(imageSet);
    }
  };

  // Load hero section from database
  useEffect(() => {
    const loadHeroSection = async () => {
      // Use fallback slides since we're not using Supabase
      if (process.env.NODE_ENV === 'development') {
        console.info('📋 Using fallback hero sections - local setup');
      }
      preloadImages(fallbackSlides);
    };

    loadHeroSection();
  }, []);

  // Use fallback slides for local setup
  const slides: SlideData[] = fallbackSlides;

  // Auto-advance slides with alternating direction - faster for first slide
  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;

    const getSlideDelay = (slideIndex: number) => {
      // First slide shows for 1 second, all others show for 8 seconds
      return slideIndex === 0 ? 1000 : 8000;
    };

    const timer = setTimeout(() => {
      setCurrentSlide((prev) => {
        if (slides.length === 0) return 0;
        const nextSlide = (prev + 1) % slides.length;
        // Alternate direction based on slide number
        setSlideDirection(nextSlide % 2 === 0 ? 'left' : 'right');
        return nextSlide;
      });
    }, getSlideDelay(currentSlide));

    return () => clearTimeout(timer);
  }, [isAutoPlaying, slides.length, currentSlide]);

  const goToSlide = (index: number) => {
    // Determine direction based on current vs target slide
    setSlideDirection(index > currentSlide ? 'right' : 'left');
    setCurrentSlide(index);
    setIsAutoPlaying(false); // Stop auto-play when user interacts
  };

  // Ultra-fast slide transition variants - microsecond speed
  const slideVariants = {
    enter: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? '100%' : '-100%',
      opacity: 0,
      scale: 1
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? '-100%' : '100%',
      opacity: 0,
      scale: 1
    })
  };

  // Show loading only if no images are loaded yet and we're still in loading state
  if (loading && imagesLoaded.size === 0) {
    return (
      <section id="home" className="hero-section bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="text-white text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-lg">Loading slideshow...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Slideshow Container - Full Coverage */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait" custom={slideDirection}>
          <motion.div
            key={currentSlide}
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ 
              duration: 0.001, // Microsecond transition - virtually instant
              ease: "linear" // Linear for instant snap
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Full Coverage Image Container */}
            <div className="relative w-full h-full">
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].alt}
                className="hero-image"
                loading="eager"
                style={{
                  objectPosition: 'center center',
                  minWidth: '100%',
                  minHeight: '100%'
                }}
                onLoad={() => {
                  // Mark image as successfully loaded
                  setImagesLoaded(prev => new Set(prev).add(slides[currentSlide].image));
                }}
                onError={(e) => {
                  // Simple fallback system - only use known working images
                  const target = e.target as HTMLImageElement;
                  const currentSrc = target.src;
                  
                  // Define fallback chain with only confirmed existing images
                  const fallbacks = ['/AG.jpg', '/AG2.jpeg', '/AG3.jpg', '/cons.jpg'];
                  
                  // Find next fallback that hasn't been tried
                  const nextFallback = fallbacks.find(fallback => !currentSrc.includes(fallback.split('/').pop() || ''));
                  
                  if (nextFallback) {
                    target.src = nextFallback;
                  } else {
                    // Final fallback to a solid color background
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.style.background = 'linear-gradient(135deg, #1B4332 0%, #2D5A3D 100%)';
                    }
                  }
                }}
              />
            </div>
            
            {/* Conditional overlay gradients - lighter for first slide */}
            {slides[currentSlide].showText && (
              <div className={`absolute inset-0 ${
                slides[currentSlide].isFirstSlide 
                  ? 'bg-gradient-to-t from-black/30 via-black/10 to-transparent'
                  : 'bg-gradient-to-t from-black/50 via-black/20 to-transparent'
              }`} />
            )}
            
            {/* Mobile-specific overlay for better contrast - only when text is shown */}
            {slides[currentSlide].showText && !slides[currentSlide].isFirstSlide && (
              <div className="absolute inset-0 bg-black/20 sm:bg-black/15 md:bg-black/10 lg:bg-black/5" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Content Overlay - Show for all slides with text */}
      {slides[currentSlide].showText && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="space-y-4"
              >
                {/* First Slide - Special Content with Seal */}
                {slides[currentSlide].isFirstSlide ? (
                  <div className="flex flex-col items-center space-y-6">
                    {/* Small Seal Image */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-luxury"
                    >
                      <img 
                        src="/courtofarms.jpeg" 
                        alt="Kenya Court of Arms" 
                        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="w-full h-full bg-kenya-green-700 rounded-full flex items-center justify-center text-white font-bold text-lg">AG</div>';
                          }
                        }}
                      />
                    </motion.div>
                    
                    {/* Office Title */}
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-merriweather drop-shadow-2xl text-shadow-lg text-center leading-tight"
                    >
                      Office of the Attorney General
                    </motion.h1>
                  </div>
                ) : (
                  /* Other Slides - Regular Content or Database Hero */
                  <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-merriweather drop-shadow-2xl text-shadow-lg mb-4">
                      {slides[currentSlide].title}
                    </h1>
                    {slides[currentSlide].subtitle && (
                      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light drop-shadow-lg text-shadow mb-4">
                        {slides[currentSlide].subtitle}
                      </p>
                    )}
                    {slides[currentSlide].description && (
                      <p className="text-base sm:text-lg md:text-xl font-light drop-shadow-lg text-shadow mb-6 max-w-2xl mx-auto">
                        {slides[currentSlide].description}
                      </p>
                    )}
                    {slides[currentSlide].ctaText && slides[currentSlide].ctaLink && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      >
                        <a
                          href={slides[currentSlide].ctaLink}
                          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                          {slides[currentSlide].ctaText}
                        </a>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Slide Indicators - Interactive */}
      <div className="absolute bottom-16 sm:bottom-20 lg:bottom-24 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2 sm:space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                index === currentSlide 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Responsive Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/70 rounded-full flex justify-center"
        >
          <div className="w-1 h-2 sm:h-3 bg-white/70 rounded-full mt-1 sm:mt-2 animate-bounce" />
        </motion.div>
      </div>

      {/* Responsive corner decorations */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border-2 border-white/30 rounded-full"
        />
      </div>
      
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.2, duration: 0.5 }}
          className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 border-2 border-white/30 rounded-full"
        />
      </div>
    </section>
  );
};

export default HeroSection;