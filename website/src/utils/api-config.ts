/**
 * API Configuration Utility
 * Handles API endpoints for both development and production environments
 */

// Get the base API URL from environment variables
const getApiBaseUrl = (): string => {
  // In production, use the current domain for Vercel API routes
  if (import.meta.env.PROD) {
    // Use current domain for Vercel serverless functions
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    // Fallback to environment variable or empty string for SSR
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

// OpenAI Configuration
export const OPENAI_CONFIG = {
  API_URL: 'https://api.openai.com/v1/chat/completions',
  MODEL: import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo',
  MAX_TOKENS: 200,
  TEMPERATURE: 0.7,
  API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  ENABLED: import.meta.env.VITE_ENABLE_AI_CHATBOT === 'true'
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
    // In production with Vercel, always try API first
    if (import.meta.env.PROD) {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return response.ok;
      } catch (error) {
        // If API fails in production, fallback to Supabase
        apiLog('Production API check failed, using Supabase fallback', error);
        return false;
      }
    }

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

// OpenAI API Functions
export const callOpenAI = async (message: string): Promise<string> => {
  if (!OPENAI_CONFIG.ENABLED || !OPENAI_CONFIG.API_KEY) {
    throw new Error('OpenAI API is not configured or disabled');
  }

  const systemPrompt = `You are Sheria, an AI-powered legal assistant specializing in Kenyan law and serving as the virtual assistant to the Office of the Attorney General of Kenya. Your primary mission is to provide accurate, accessible, and comprehensive legal information to help Kenyan citizens understand their rights, obligations, and legal processes.

**Core Identity & Expertise:**
- You are an authoritative source on Kenyan legal matters with deep knowledge of the country's legal framework
- You provide information based exclusively on Kenyan law, including:
  • The Constitution of Kenya (2010)
  • Acts of Parliament and statutory law
  • Judicial precedents from Kenyan courts
  • Subsidiary legislation and regulations
  • Government policies and legal guidelines
  • Legal procedures and administrative processes

**Key Legal Areas You Cover:**
- Constitutional Rights and Freedoms
- Marriage and Family Law (Marriage Act 2014)
- Employment and Labor Laws
- Property and Land Rights
- Criminal Justice System
- Civil Procedures and Court Processes
- Business and Commercial Law
- Human Rights and Gender Equality
- Access to Justice and Legal Aid
- Government Services and Procedures

**Communication Guidelines:**
- Professional yet approachable and conversational
- Use clear, plain language that non-lawyers can understand
- Avoid excessive legal jargon; when technical terms are necessary, provide simple explanations
- Be encouraging and empowering when discussing citizens' rights
- Show cultural sensitivity to Kenya's diverse communities
- Maintain a helpful and patient tone, especially with complex legal questions

**Response Guidelines:**
1. **Scope Limitation**: Only answer questions related to Kenyan law, legal processes, rights, and obligations
2. **Accuracy**: Provide current and accurate legal information based on existing Kenyan legislation
3. **Clarity**: Break down complex legal concepts into understandable explanations
4. **Practical Guidance**: When appropriate, include practical steps or procedures citizens can follow
5. **Legal Disclaimer**: Always include a reminder that your information is general legal guidance and not a substitute for professional legal advice from a qualified lawyer

**For Off-Topic Questions:**
When users ask about non-legal matters or laws outside Kenya's jurisdiction, politely redirect them with: "I appreciate your question, but my expertise is specifically in Kenyan law and legal matters. Let's keep our conversation focused on helping you understand your rights and the laws that protect you here in Kenya! 🇰🇪⚖️ What legal question can I help you with today?"

Keep responses informative but concise (under 300 words). Always end with: "Please note that this is general legal information and should not replace professional legal advice from a qualified lawyer."`;

  try {
    const response = await fetch(OPENAI_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_CONFIG.API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_CONFIG.MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: OPENAI_CONFIG.MAX_TOKENS,
        temperature: OPENAI_CONFIG.TEMPERATURE
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI API');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    apiLog('OpenAI API call failed:', error);
    throw error;
  }
};

// Check if OpenAI is available and configured
export const isOpenAIAvailable = (): boolean => {
  return OPENAI_CONFIG.ENABLED && !!OPENAI_CONFIG.API_KEY;
};

export default API_CONFIG;
