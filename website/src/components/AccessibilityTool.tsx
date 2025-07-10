import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Accessibility, 
  Type, 
  Eye, 
  Volume2, 
  Contrast, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  X,
  Settings
} from 'lucide-react';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  textToSpeech: boolean;
  reducedMotion: boolean;
  zoom: number;
}

const AccessibilityTool: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 100,
    highContrast: false,
    textToSpeech: false,
    reducedMotion: false,
    zoom: 100
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        applySettings(parsed);
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Apply font size
    root.style.fontSize = `${newSettings.fontSize}%`;
    
    // Apply high contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Apply reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    // Apply zoom
    document.body.style.zoom = `${newSettings.zoom}%`;
  };

  const adjustFontSize = (increment: number) => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.max(75, Math.min(150, prev.fontSize + increment))
    }));
  };

  const adjustZoom = (increment: number) => {
    setSettings(prev => ({
      ...prev,
      zoom: Math.max(75, Math.min(150, prev.zoom + increment))
    }));
  };

  const toggleHighContrast = () => {
    setSettings(prev => ({
      ...prev,
      highContrast: !prev.highContrast
    }));
  };

  const toggleTextToSpeech = () => {
    setSettings(prev => ({
      ...prev,
      textToSpeech: !prev.textToSpeech
    }));
  };

  const toggleReducedMotion = () => {
    setSettings(prev => ({
      ...prev,
      reducedMotion: !prev.reducedMotion
    }));
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      fontSize: 100,
      highContrast: false,
      textToSpeech: false,
      reducedMotion: false,
      zoom: 100
    };
    setSettings(defaultSettings);
  };

  const speakText = (text: string) => {
    if (settings.textToSpeech && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Accessibility Button */}
      <motion.button
        onClick={() => {
          setIsOpen(true);
          speakText('Accessibility options opened');
        }}
        className="bg-gradient-to-r from-kenya-red-500 to-kenya-green-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open accessibility options"
      >
        <Accessibility className="w-6 h-6" />
      </motion.button>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border-4 border-kenya-red-500"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-kenya-red-500 to-kenya-green-600 p-2 rounded-lg">
                    <Accessibility className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Accessibility Options
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close accessibility options"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Font Size Controls */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Type className="w-4 h-4 inline mr-2" />
                  Font Size: {settings.fontSize}%
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => adjustFontSize(-10)}
                    className="bg-kenya-red-500 text-white p-2 rounded-lg hover:bg-kenya-red-600 transition-colors"
                    aria-label="Decrease font size"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-kenya-red-500 to-kenya-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((settings.fontSize - 75) / 75) * 100}%` }}
                    />
                  </div>
                  <button
                    onClick={() => adjustFontSize(10)}
                    className="bg-kenya-green-600 text-white p-2 rounded-lg hover:bg-kenya-green-700 transition-colors"
                    aria-label="Increase font size"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* High Contrast Toggle */}
              <div className="mb-6">
                <button
                  onClick={toggleHighContrast}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-300 ${
                    settings.highContrast
                      ? 'bg-kenya-green-600 text-white border-kenya-green-600'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-kenya-green-600'
                  }`}
                  aria-label={`${settings.highContrast ? 'Disable' : 'Enable'} high contrast mode`}
                >
                  <div className="flex items-center space-x-3">
                    <Contrast className="w-5 h-5" />
                    <span className="font-medium">High Contrast</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    settings.highContrast ? 'bg-white border-white' : 'border-gray-400'
                  }`}>
                    {settings.highContrast && (
                      <div className="w-full h-full bg-kenya-green-600 rounded-full scale-75" />
                    )}
                  </div>
                </button>
              </div>

              {/* Text to Speech Toggle */}
              <div className="mb-6">
                <button
                  onClick={toggleTextToSpeech}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-300 ${
                    settings.textToSpeech
                      ? 'bg-kenya-red-500 text-white border-kenya-red-500'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-kenya-red-500'
                  }`}
                  aria-label={`${settings.textToSpeech ? 'Disable' : 'Enable'} text to speech`}
                >
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-5 h-5" />
                    <span className="font-medium">Text to Speech</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    settings.textToSpeech ? 'bg-white border-white' : 'border-gray-400'
                  }`}>
                    {settings.textToSpeech && (
                      <div className="w-full h-full bg-kenya-red-500 rounded-full scale-75" />
                    )}
                  </div>
                </button>
              </div>

              {/* Reset Button */}
              <button
                onClick={resetSettings}
                className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                aria-label="Reset all accessibility settings"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="font-medium">Reset to Default</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccessibilityTool;
