import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Import images
import courtOfArmsImage from '../assets/images/courtofarms.jpeg';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 text-gray-800 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/coat-of-arms.png" 
                alt={t('footer.logoAlt', 'Kenya Court of Arms')}
                className="h-12 w-12"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{t('footer.title', 'OAG Kenya')}</h3>
                <p className="text-gray-600 text-sm">{t('footer.subtitle', 'Office of the Attorney General')}</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {t('footer.description', 'Serving justice and providing legal services to all Kenyan citizens with integrity and excellence.')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">{t('footer.quickLinks', 'Quick Links')}</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">{t('nav.home', 'Home')}</a></li>
              <li><a href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">{t('nav.about', 'About')}</a></li>
              <li><a href="/services" className="text-gray-600 hover:text-gray-900 transition-colors">{t('nav.services', 'Services')}</a></li>
              <li><a href="/opportunities" className="text-gray-600 hover:text-gray-900 transition-colors">{t('nav.opportunities', 'Opportunities')}</a></li>
              <li><a href="/records" className="text-gray-600 hover:text-gray-900 transition-colors">{t('nav.records', 'Records')}</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">{t('nav.contact', 'Contact')}</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">{t('footer.services', 'Services')}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">{t('footer.legalAdvice', 'Legal Advice')}</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">{t('footer.complaints', 'File Complaints')}</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">{t('footer.legalAid', 'Legal Aid')}</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">{t('footer.publicProsecution', 'Public Prosecution')}</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">{t('footer.civilLitigation', 'Civil Litigation')}</a></li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 pt-8 border-t border-gray-300">
          <h4 className="text-lg font-semibold mb-4 text-gray-900">{t('footer.contactUs', 'Contact Us')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">📍</span>
              <span className="text-gray-700">
                {t('footer.address', 'Sheria House, Harambee Avenue, Nairobi')}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">📞</span>
              <span className="text-gray-700">+254 20 2227461</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">✉️</span>
              <span className="text-gray-700">info@oag.go.ke</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()} {t('footer.copyright', 'Office of the Attorney General, Kenya. All rights reserved.')}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-900 transition-colors">
              {t('footer.privacy', 'Privacy Policy')}
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              {t('footer.terms', 'Terms of Service')}
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              {t('footer.accessibility', 'Accessibility')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;