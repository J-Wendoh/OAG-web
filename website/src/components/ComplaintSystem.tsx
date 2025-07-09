import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Upload, CheckCircle, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  sanitizeText,
  validateEmail,
  validatePhone,
  validateIdNumber,
  validateName,
  validateFile,
  RateLimiter
} from '../../../shared/utils/security';

const ComplaintSystem: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    email: '',
    county: '',
    subject: '',
    complaint: '',
    attachment: null as File | null
  });
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [rateLimiter] = useState(() => new RateLimiter(3, 15 * 60 * 1000)); // 3 attempts per 15 minutes

  const kenyanCounties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
    'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
    'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
    'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
    'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
    'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
    'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ];

  const subjects = [
    t('complaints.subjects.marriage', 'Marriage Services'),
    t('complaints.subjects.legalAid', 'Legal Aid Request'),
    t('complaints.subjects.rights', 'Constitutional Rights'),
    t('complaints.subjects.government', 'Government Services'),
    t('complaints.subjects.corruption', 'Corruption Report'),
    t('complaints.subjects.consultation', 'Legal Consultation'),
    t('complaints.subjects.documents', 'Document Issues'),
    t('complaints.subjects.other', 'Other')
  ];

  const generateTicketId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    return `AG${letter}${number.toString().padStart(3, '0')}`;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate first name
    if (!validateName(formData.firstName)) {
      errors.firstName = 'Please enter a valid first name (2-50 characters, letters only)';
    }

    // Validate last name
    if (!validateName(formData.lastName)) {
      errors.lastName = 'Please enter a valid last name (2-50 characters, letters only)';
    }

    // Validate ID number
    if (!validateIdNumber(formData.idNumber)) {
      errors.idNumber = 'Please enter a valid Kenyan ID number (7-8 digits)';
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate county
    if (!formData.county) {
      errors.county = 'Please select your county';
    }

    // Validate subject
    if (!formData.subject || formData.subject.length < 5) {
      errors.subject = 'Please enter a subject (minimum 5 characters)';
    }

    // Validate complaint
    if (!formData.complaint || formData.complaint.length < 20) {
      errors.complaint = 'Please provide a detailed complaint (minimum 20 characters)';
    }

    // Validate file if provided
    if (formData.attachment) {
      const fileValidation = validateFile(formData.attachment);
      if (!fileValidation.valid) {
        errors.attachment = fileValidation.error || 'Invalid file';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Sanitize input
    const sanitizedValue = sanitizeText(value);

    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, attachment: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Validate form
    if (!validateForm()) {
      setIsSubmitting(false);
      setSubmitError('Please correct the errors above');
      return;
    }

    // Check rate limiting
    const clientId = formData.email || formData.idNumber;
    if (!rateLimiter.isAllowed(clientId)) {
      const remainingTime = Math.ceil(rateLimiter.getRemainingTime(clientId) / 60000);
      setSubmitError(`Too many attempts. Please try again in ${remainingTime} minutes.`);
      setIsSubmitting(false);
      return;
    }

    try {
      const newTicketId = generateTicketId();

      // Upload attachment if present
      let attachmentUrl = null;
      if (formData.attachment) {
        const fileExt = formData.attachment.name.split('.').pop();
        const fileName = `${newTicketId}-${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('complaint-attachments')
          .upload(fileName, formData.attachment);

        if (uploadError) {
          console.error('Upload error:', uploadError);
        } else {
          attachmentUrl = uploadData.path;
        }
      }

      // Insert complaint into database
      const { data, error } = await supabase
        .from('complaints')
        .insert([
          {
            ticket_id: newTicketId,
            first_name: formData.firstName,
            last_name: formData.lastName,
            id_number: formData.idNumber,
            email: formData.email,
            county: formData.county,
            subject: formData.subject,
            complaint: formData.complaint,
            attachment_url: attachmentUrl,
            status: 'pending',
            priority: 'medium'
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      setTicketId(newTicketId);
      setShowToast(true);

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        idNumber: '',
        email: '',
        county: '',
        subject: '',
        complaint: '',
        attachment: null
      });

      setTimeout(() => {
        setShowToast(false);
        setIsOpen(false);
        setTicketId(null);
      }, 5000);

    } catch (error) {
      console.error('Error submitting complaint:', error);
      setSubmitError('Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setTicketId(null);
    setShowToast(false);
  };

  return (
    <>
      {/* Complaint Button - Glassmorphism style */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-24 z-40 bg-gradient-to-r from-kenya-green-600/90 to-kenya-green-700/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl hover:from-kenya-green-700/90 hover:to-kenya-green-800/90 transition-all duration-300 hover:scale-110 animate-pulse border border-white/20"
        aria-label={t('complaints.buttonLabel', 'File a complaint')}
      >
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-medium hidden md:block">
            📢 {t('complaints.buttonText', 'File a Complaint with the AG')}
          </span>
        </div>
      </button>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && ticketId && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-24 right-6 z-60 bg-gradient-to-r from-green-500/90 to-green-600/90 backdrop-blur-md text-white p-4 rounded-lg shadow-2xl border border-white/20"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6" />
              <div>
                <p className="font-semibold">{t('complaints.successTitle', 'Complaint Submitted Successfully!')}</p>
                <p className="text-sm opacity-90">{t('complaints.ticketId', 'Ticket ID')}: {ticketId}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glassmorphism Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-kenya-green-900/95 to-kenya-green-800/95 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  📢 {t('complaints.title')}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                  aria-label={t('complaints.closeLabel', 'Close')}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Confidentiality Notice */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20">
                <p className="text-white/90 text-sm">
                  🔒 {t('complaints.confidentialityNotice', 'Your complaint will be confidential. Submissions are assigned tracking codes for follow-up.')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      {t('complaints.form.firstName', 'First Name')}
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-white placeholder-white/60"
                      placeholder={t('complaints.form.firstNamePlaceholder', 'Enter your first name')}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      {t('complaints.form.lastName', 'Last Name')}
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-white placeholder-white/60"
                      placeholder={t('complaints.form.lastNamePlaceholder', 'Enter your last name')}
                    />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      {t('complaints.form.idOptional', 'ID Number (Optional)')}
                    </label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-white placeholder-white/60"
                      placeholder={t('complaints.form.idPlaceholder', 'Enter your ID number')}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      {t('complaints.form.emailOptional', 'Email Address (Optional)')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-white placeholder-white/60"
                      placeholder={t('complaints.form.emailPlaceholder', 'Enter your email')}
                    />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      {t('complaints.form.county', 'County')}
                    </label>
                    <select
                      name="county"
                      value={formData.county}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-white"
                    >
                      <option value="" className="text-gray-900">{t('complaints.form.selectCounty', 'Select County')}</option>
                      {kenyanCounties.map(county => (
                        <option key={county} value={county} className="text-gray-900">{county}</option>
                      ))}
                    </select>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      {t('complaints.form.subject', 'Subject')}
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-white"
                    >
                      <option value="" className="text-gray-900">{t('complaints.form.selectSubject', 'Select Subject')}</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject} className="text-gray-900">{subject}</option>
                      ))}
                    </select>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    {t('complaints.form.description', 'Complaint Description')}
                  </label>
                  <textarea
                    name="complaint"
                    value={formData.complaint}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder={t('complaints.form.descriptionPlaceholder', 'Please describe your complaint in detail...')}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-white placeholder-white/60"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    {t('complaints.form.attachmentOptional', 'File Attachment (Optional)')}
                  </label>
                  <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/50 transition-colors bg-white/5 backdrop-blur-sm">
                    <Upload className="w-8 h-8 text-white/70 mx-auto mb-2" />
                    <p className="text-sm text-white/70 mb-2">
                      {formData.attachment ? formData.attachment.name : t('complaints.form.attachmentText', 'Upload supporting documents (PDF, DOC, DOCX, JPG, PNG)')}
                    </p>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="hidden"
                      id="attachment-upload"
                    />
                    <label
                      htmlFor="attachment-upload"
                      className="inline-block bg-white/20 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-white/30 transition-colors border border-white/20"
                    >
                      {t('complaints.form.chooseFile', 'Choose File')}
                    </label>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex space-x-4"
                >
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-white/10 backdrop-blur-sm text-white py-3 rounded-lg hover:bg-white/20 transition-all duration-200 font-semibold border border-white/20"
                  >
                    {t('complaints.form.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-white/20 to-white/30 backdrop-blur-sm text-white py-3 rounded-lg hover:from-white/30 hover:to-white/40 transition-all duration-200 font-semibold border border-white/30 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>{t('complaints.form.submit')}</span>
                      </>
                    )}
                  </button>
                </motion.div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ComplaintSystem;