/**
 * Performance optimization utilities
 */
import React from 'react';

// Lazy loading utility for components
export const lazyLoad = (importFunc: () => Promise<any>) => {
  return React.lazy(importFunc);
};

// Image optimization utility
export const optimizeImage = (src: string, width?: number, height?: number): string => {
  // For production, you might want to use a service like Cloudinary or ImageKit
  // For now, we'll return the original src with potential query parameters
  if (!width && !height) return src;
  
  const url = new URL(src, window.location.origin);
  if (width) url.searchParams.set('w', width.toString());
  if (height) url.searchParams.set('h', height.toString());
  
  return url.toString();
};

// Preload critical resources
export const preloadResource = (href: string, as: string = 'image'): void => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

// Preload multiple images
export const preloadImages = (urls: string[]): Promise<void[]> => {
  const promises = urls.map(url => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  });
  
  return Promise.all(promises);
};

// Debounce utility for search and other frequent operations
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle utility for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Intersection Observer utility for lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  startTiming(label: string): void {
    this.metrics.set(label, performance.now());
  }
  
  endTiming(label: string): number {
    const startTime = this.metrics.get(label);
    if (!startTime) {
      console.warn(`No start time found for label: ${label}`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    this.metrics.delete(label);
    
    // Log slow operations
    if (duration > 100) {
      console.warn(`Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }
  
  measureAsync<T>(label: string, asyncFunc: () => Promise<T>): Promise<T> {
    this.startTiming(label);
    return asyncFunc().finally(() => {
      this.endTiming(label);
    });
  }
}

// Web Vitals monitoring
export const measureWebVitals = (): void => {
  // Largest Contentful Paint
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    const lcpMs = lastEntry.startTime;
    const lcpSeconds = (lcpMs / 1000).toFixed(2);

    if (process.env.NODE_ENV === 'development') {
      console.log(`LCP: ${lcpMs.toFixed(0)}ms (${lcpSeconds}s) - ${lcpMs < 2500 ? '✅ Good' : lcpMs < 4000 ? '⚠️ Needs Improvement' : '❌ Poor'}`);
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });
  
  // First Input Delay
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      const fidMs = entry.processingStart - entry.startTime;
      if (process.env.NODE_ENV === 'development') {
        console.log(`FID: ${fidMs.toFixed(0)}ms - ${fidMs < 100 ? '✅ Good' : fidMs < 300 ? '⚠️ Needs Improvement' : '❌ Poor'}`);
      }
    });
  }).observe({ entryTypes: ['first-input'] });

  // Cumulative Layout Shift - with debounced logging to prevent console flooding
  let totalCLS = 0;
  let clsLogTimeout: NodeJS.Timeout | null = null;

  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        totalCLS += entry.value;
      }
    });

    // Debounce CLS logging to prevent console flooding
    if (clsLogTimeout) {
      clearTimeout(clsLogTimeout);
    }

    clsLogTimeout = setTimeout(() => {
      if (process.env.NODE_ENV === 'development' && totalCLS > 0) {
        console.log(`CLS: ${totalCLS.toFixed(3)} - ${totalCLS < 0.1 ? '✅ Good' : totalCLS < 0.25 ? '⚠️ Needs Improvement' : '❌ Poor'}`);
      }
    }, 1000); // Log CLS only once per second maximum
  }).observe({ entryTypes: ['layout-shift'] });
};

// Resource hints for critical resources
export const addResourceHints = (): void => {
  // Preconnect to external domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  
  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    document.head.appendChild(link);
  });
  
  // DNS prefetch for other domains
  const dnsPrefetchDomains = [
    'https://supabase.co'
  ];
  
  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
};

// Critical CSS inlining utility
export const inlineCriticalCSS = (css: string): void => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};

// Track initialization to prevent duplicates
let isInitialized = false;

// Service Worker registration for caching
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator && !navigator.serviceWorker.controller) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Initialize performance optimizations
export const initializePerformanceOptimizations = (): void => {
  // Prevent multiple initializations
  if (isInitialized) {
    return;
  }
  isInitialized = true;

  // Add resource hints
  addResourceHints();

  // Start Web Vitals monitoring
  measureWebVitals();

  // Register service worker
  registerServiceWorker();

  // Disable image preloading to improve LCP performance
  // Images will be loaded on-demand when needed
  // This prevents blocking the initial page load with large image downloads
};
