import React, { useState, useEffect } from 'react';
import { X, Cookie, Shield, BarChart3, Target } from 'lucide-react';
import { supabase } from '../../../shared/utils/supabase';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface CookieConsentProps {
  onConsentChange?: (preferences: CookiePreferences) => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onConsentChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkConsentStatus();
  }, []);

  const checkConsentStatus = () => {
    const consent = localStorage.getItem('cookie-consent');
    const consentDate = localStorage.getItem('cookie-consent-date');
    
    if (!consent || !consentDate) {
      setIsVisible(true);
      return;
    }

    // Check if consent is older than 1 year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    if (new Date(consentDate) < oneYearAgo) {
      setIsVisible(true);
      return;
    }

    // Load existing preferences
    try {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
      onConsentChange?.(savedPreferences);
    } catch (error) {
      console.error('Error parsing saved cookie preferences:', error);
      setIsVisible(true);
    }
  };

  const generateSessionId = () => {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  };

  const saveConsentToDatabase = async (consentPreferences: CookiePreferences) => {
    try {
      const sessionId = localStorage.getItem('session-id') || generateSessionId();
      localStorage.setItem('session-id', sessionId);

      const { error } = await supabase
        .from('cookie_consents')
        .insert({
          session_id: sessionId,
          ip_address: null, // Will be handled by Supabase
          user_agent: navigator.userAgent,
          necessary_cookies: consentPreferences.necessary,
          analytics_cookies: consentPreferences.analytics,
          marketing_cookies: consentPreferences.marketing,
          functional_cookies: consentPreferences.functional
        });

      if (error) {
        console.info('Cookie consent not saved to database:', error.message);
      }
    } catch (error) {
      console.info('Database not available for cookie consent storage');
    }
  };

  const handleAcceptAll = async () => {
    setIsLoading(true);
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };

    setPreferences(allAccepted);
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    
    await saveConsentToDatabase(allAccepted);
    onConsentChange?.(allAccepted);
    
    setIsLoading(false);
    setIsVisible(false);
  };

  const handleAcceptNecessary = async () => {
    setIsLoading(true);
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };

    setPreferences(necessaryOnly);
    localStorage.setItem('cookie-consent', JSON.stringify(necessaryOnly));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    
    await saveConsentToDatabase(necessaryOnly);
    onConsentChange?.(necessaryOnly);
    
    setIsLoading(false);
    setIsVisible(false);
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    
    await saveConsentToDatabase(preferences);
    onConsentChange?.(preferences);
    
    setIsLoading(false);
    setIsVisible(false);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: key === 'necessary' ? true : value // Necessary cookies cannot be disabled
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Cookie className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Cookie Preferences</h2>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
            By clicking "Accept All", you consent to our use of cookies. You can manage your preferences below.
          </p>

          {!showDetails ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAcceptAll}
                  disabled={isLoading}
                  className="flex-1 min-w-[200px] bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Accept All Cookies'}
                </button>
                <button
                  onClick={handleAcceptNecessary}
                  disabled={isLoading}
                  className="flex-1 min-w-[200px] bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Accept Necessary Only'}
                </button>
              </div>
              <button
                onClick={() => setShowDetails(true)}
                className="w-full text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Customize Preferences
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cookie Categories */}
              <div className="space-y-4">
                {/* Necessary Cookies */}
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">Necessary Cookies</h3>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Always Active</span>
                        <div className="w-10 h-6 bg-green-500 rounded-full relative">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      These cookies are essential for the website to function and cannot be disabled.
                    </p>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">Analytics Cookies</h3>
                      <button
                        onClick={() => handlePreferenceChange('analytics', !preferences.analytics)}
                        className={`w-10 h-6 rounded-full relative transition-colors ${
                          preferences.analytics ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences.analytics ? 'translate-x-4' : 'translate-x-1'
                        }`}></div>
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Help us understand how visitors interact with our website.
                    </p>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Target className="w-5 h-5 text-purple-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">Marketing Cookies</h3>
                      <button
                        onClick={() => handlePreferenceChange('marketing', !preferences.marketing)}
                        className={`w-10 h-6 rounded-full relative transition-colors ${
                          preferences.marketing ? 'bg-purple-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences.marketing ? 'translate-x-4' : 'translate-x-1'
                        }`}></div>
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Used to track visitors across websites for advertising purposes.
                    </p>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Cookie className="w-5 h-5 text-orange-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">Functional Cookies</h3>
                      <button
                        onClick={() => handlePreferenceChange('functional', !preferences.functional)}
                        className={`w-10 h-6 rounded-full relative transition-colors ${
                          preferences.functional ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences.functional ? 'translate-x-4' : 'translate-x-1'
                        }`}></div>
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Enable enhanced functionality like language preferences and user settings.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSavePreferences}
                  disabled={isLoading}
                  className="flex-1 min-w-[200px] bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Saving Preferences...' : 'Save Preferences'}
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 min-w-[200px] bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Back to Simple View
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
          <p className="text-xs text-gray-500">
            For more information about our cookie policy, please visit our{' '}
            <a href="/privacy-policy" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </a>
            . You can change your preferences at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 