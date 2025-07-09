/**
 * API Configuration Utility
 * Handles API endpoints for both development and production environments
 */

// Get the base API URL from environment variables
const getApiBaseUrl = (): string => {
  // In production, use Supabase or deployed API
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE_URL || '';
  }
  
  // In development, use local server if available
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  ENDPOINTS: {
    NEWS: '/api/news',
    NEWS_SEARCH: '/api/news/search',
    NEWS_FEATURED: '/api/news/featured',
    NEWS_IMPORT: '/api/news/import',
    NEWS_IMPORT_STATUS: '/api/news/import/status',
    HERO_SECTIONS: '/api/hero-sections',
    HEALTH: '/api/health'
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  // If we're in production and no API base URL is configured, use Supabase directly
  if (import.meta.env.PROD && !import.meta.env.VITE_API_BASE_URL) {
    // Return empty string to indicate we should use Supabase client instead
    return '';
  }
  
  const baseUrl = API_CONFIG.BASE_URL;
  if (!baseUrl) {
    return '';
  }
  
  return `${baseUrl}${endpoint}`;
};

// Check if API is available
export const isApiAvailable = async (): Promise<boolean> => {
  try {
    const healthUrl = buildApiUrl(API_CONFIG.ENDPOINTS.HEALTH);
    if (!healthUrl) {
      // No API URL configured, assume we're using Supabase
      return false;
    }
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      timeout: 5000
    } as RequestInit);
    
    return response.ok;
  } catch (error) {
    console.warn('API health check failed:', error);
    return false;
  }
};

// API request wrapper with error handling
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = buildApiUrl(endpoint);
  
  if (!url) {
    throw new Error('API not configured. Please use Supabase client instead.');
  }
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };
  
  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Environment-specific configurations
export const ENV_CONFIG = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  enableLogging: import.meta.env.VITE_DEBUG_MODE === 'true' || import.meta.env.DEV
};

// Logging utility
export const apiLog = (message: string, data?: any) => {
  if (ENV_CONFIG.enableLogging) {
    console.log(`[API] ${message}`, data || '');
  }
};

export default API_CONFIG;
