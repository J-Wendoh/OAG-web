import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, ArrowLeft, Calendar, Users, FileText, X, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TypewriterText from '../components/TypewriterText';
import { submitComplaint, submitAppointment, submitContactMessage } from '../lib/supabase';

// Import images - Enhanced with new professional imagery
const contactUsImage = '/Contactus.jpg'; // Contact page banner
const officeExteriorImage = '/6.png'; // Office building exterior
const receptionImage = '/1 (3).png'; // Reception area
const flagImage = '/flagkenya.jpeg'; // Kenyan flag
const coatOfArmsImage = '/courtofarms.jpeg'; // Coat of arms

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    email: '',
    subject: '',
    message: ''
  });

  const [appointmentData, setAppointmentData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    email: '',
    date: '',
    time: '',
    message: ''
  });

  const [complaintData, setComplaintData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    email: '',
    subject: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });

  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAppointmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({ ...prev, [name]: value }));
  };

  const handleComplaintChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setComplaintData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await submitContactMessage({
        first_name: formData.firstName,
        last_name: formData.lastName,
        id_number: formData.idNumber,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });

      if (error) {
        console.error('Error submitting contact message:', error);
        alert('There was an error sending your message. Please try again.');
      } else {
        alert('Message sent successfully! We will get back to you soon.');
        setFormData({ firstName: '', lastName: '', idNumber: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting contact message:', error);
      alert('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await submitAppointment({
        first_name: appointmentData.firstName,
        last_name: appointmentData.lastName,
        id_number: appointmentData.idNumber,
        email: appointmentData.email,
        date: appointmentData.date,
        time: appointmentData.time,
        message: appointmentData.message
      });

      if (error) {
        console.error('Error submitting appointment:', error);
        alert('There was an error booking your appointment. Please try again.');
      } else {
        alert('Appointment request sent successfully! We will contact you soon to confirm.');
        setAppointmentData({ firstName: '', lastName: '', idNumber: '', email: '', date: '', time: '', message: '' });
        setShowAppointmentForm(false);
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
      alert('There was an error booking your appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await submitComplaint({
        first_name: complaintData.firstName,
        last_name: complaintData.lastName,
        id_number: complaintData.idNumber,
        email: complaintData.email,
        subject: complaintData.subject,
        description: complaintData.description,
        priority: complaintData.priority
      });

      if (error) {
        console.error('Error submitting complaint:', error);
        alert('There was an error submitting your complaint. Please try again.');
      } else {
        alert('Complaint submitted successfully! We will investigate and respond within 7 business days.');
        setComplaintData({ firstName: '', lastName: '', idNumber: '', email: '', subject: '', description: '', priority: 'medium' });
        setShowComplaintForm(false);
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('There was an error submitting your complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+254 20 271 8000', '+254 20 271 8001'],
      color: 'text-kenya-green-700',
      bgColor: 'bg-kenya-green-100'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@ag.go.ke', 'support@ag.go.ke'],
      color: 'text-kenya-red-600',
      bgColor: 'bg-kenya-red-100'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: ['Sheria House, Harambee Avenue', 'Co-operative Bank House, Haile Selassie Ave'],
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: ['Monday - Friday: 8:00 AM - 5:00 PM', 'Saturday: 9:00 AM - 1:00 PM'],
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    }
  ];

  const quickActions = [
    {
      icon: FileText,
      title: 'Launch Complaint',
      description: 'File a formal complaint or concern',
      action: 'File Complaint',
      onClick: () => setShowComplaintForm(true)
    },
    {
      icon: Calendar,
      title: 'Book Appointment',
      description: 'Schedule a consultation',
      action: 'Book Now',
      onClick: () => setShowAppointmentForm(true)
    },
    {
      icon: Users,
      title: 'General Inquiry',
      description: 'Ask questions about our services',
      action: 'Contact Us',
      onClick: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 relative">
      {/* Header with Background Image and Typing Effect */}
      <div className="relative h-64 rounded-lg overflow-hidden">
        <img 
          src={contactUsImage}
          alt={t('contact.imageAlt', 'Contact Us')}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{t('contact.visitUs', 'Visit Our Office')}</h3>
          <p className="text-sm opacity-90">{t('contact.welcomeMessage', 'We welcome your visit')}</p>
        </div>
      </div>

      <div className="relative z-10">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => {
              navigate(-1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        <div className="container mx-auto px-4 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get in touch with the Office of the Attorney General for legal assistance and information.
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-kenya-green-100 rounded-full mx-auto mb-4">
                    <Icon className="w-8 h-8 text-kenya-green-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 mb-4">{action.description}</p>
                  <button 
                    onClick={action.onClick}
                    className="bg-kenya-green-700 text-white px-6 py-2 rounded-lg hover:bg-kenya-green-800 transition-colors duration-200"
                  >
                    {action.action}
                  </button>
                </div>
              );
            })}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h2>
              
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${info.bgColor} ${info.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {info.title}
                      </h3>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-gray-600">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                );
              })}

              {/* Google Map */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-8"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Our Locations
                </h3>
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8199!2d36.8208!3d-1.2852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d22c5c5555%3A0x1234567890abcdef!2sSheria%20House%2C%20Harambee%20Avenue%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1234567890123"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="AG Office Locations"
                  />
                </div>
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 text-sm text-gray-600">
                  <p><strong>Main Office:</strong> Sheria House, Harambee Avenue</p>
                  <p><strong>Branch Office:</strong> Co-operative Bank House, Haile Selassie Ave</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Enhanced Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-green-500 focus:border-kenya-green-500 transition-colors"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-green-500 focus:border-kenya-green-500 transition-colors"
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    ID Number *
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-green-500 focus:border-kenya-green-500 transition-colors"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-green-500 focus:border-kenya-green-500 transition-colors"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-green-500 focus:border-kenya-green-500 transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="legal-inquiry">Legal Inquiry</option>
                    <option value="marriage-services">Marriage Services</option>
                    <option value="legal-aid">Legal Aid Request</option>
                    <option value="general">General Information</option>
                    <option value="complaint">File a Complaint</option>
                    <option value="document-request">Document Request</option>
                    <option value="appointment">Schedule Appointment</option>
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Please describe your inquiry in detail..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-green-500 focus:border-kenya-green-500 transition-colors"
                  />
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-kenya-green-700 text-white py-3 rounded-lg hover:bg-kenya-green-800 transition-colors duration-200 font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Complaint Form Modal */}
      {showComplaintForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white/90 backdrop-blur-md rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
          >
            <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-200/50 p-6 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-kenya-red-100 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-kenya-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">File a Complaint</h2>
              </div>
              <button
                onClick={() => setShowComplaintForm(false)}
                className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleComplaintSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="complaint-firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="complaint-firstName"
                      name="firstName"
                      value={complaintData.firstName}
                      onChange={handleComplaintChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-red-500 focus:border-kenya-red-500 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="complaint-lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="complaint-lastName"
                      name="lastName"
                      value={complaintData.lastName}
                      onChange={handleComplaintChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-red-500 focus:border-kenya-red-500 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="complaint-idNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    ID Number *
                  </label>
                  <input
                    type="text"
                    id="complaint-idNumber"
                    name="idNumber"
                    value={complaintData.idNumber}
                    onChange={handleComplaintChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-red-500 focus:border-kenya-red-500 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label htmlFor="complaint-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="complaint-email"
                    name="email"
                    value={complaintData.email}
                    onChange={handleComplaintChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-red-500 focus:border-kenya-red-500 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label htmlFor="complaint-subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Complaint Subject *
                  </label>
                  <input
                    type="text"
                    id="complaint-subject"
                    name="subject"
                    value={complaintData.subject}
                    onChange={handleComplaintChange}
                    required
                    placeholder="Brief description of your complaint"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-red-500 focus:border-kenya-red-500 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label htmlFor="complaint-priority" className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    id="complaint-priority"
                    name="priority"
                    value={complaintData.priority}
                    onChange={handleComplaintChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-red-500 focus:border-kenya-red-500 bg-white/80 backdrop-blur-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="complaint-description" className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    id="complaint-description"
                    name="description"
                    value={complaintData.description}
                    onChange={handleComplaintChange}
                    required
                    rows={6}
                    placeholder="Please provide a detailed description of your complaint..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-red-500 focus:border-kenya-red-500 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowComplaintForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-kenya-red-600 text-white py-3 rounded-lg hover:bg-kenya-red-700 transition-colors duration-200 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileText className="w-5 h-5" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Complaint'}</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Appointment Form Modal */}
      {showAppointmentForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white/90 backdrop-blur-md rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
          >
            <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-200/50 p-6 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-kenya-green-100 rounded-full">
                  <Calendar className="w-5 h-5 text-kenya-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
              </div>
              <button
                onClick={() => setShowAppointmentForm(false)}
                className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleAppointmentSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="appointment-firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="appointment-firstName"
                      name="firstName"
                      value={appointmentData.firstName}
                      onChange={handleAppointmentChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-green-500 focus:border-kenya-green-500 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="appointment-lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="appointment-lastName"
                      name="lastName"
                      value={appointmentData.lastName}
                      onChange={handleAppointmentChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-green-500 focus:border-kenya-green-500 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="appointment-idNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    ID Number *
                  </label>
                  <input
                    type="text"
                    id="appointment-idNumber"
                    name="idNumber"
                    value={appointmentData.idNumber}
                    onChange={handleAppointmentChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-green-500 focus:border-kenya-green-500 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label htmlFor="appointment-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="appointment-email"
                    name="email"
                    value={appointmentData.email}
                    onChange={handleAppointmentChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-green-500 focus:border-kenya-green-500 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="appointment-date" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      id="appointment-date"
                      name="date"
                      value={appointmentData.date}
                      onChange={handleAppointmentChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-green-500 focus:border-kenya-green-500 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="appointment-time" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Time *
                    </label>
                    <select
                      id="appointment-time"
                      name="time"
                      value={appointmentData.time}
                      onChange={handleAppointmentChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-green-500 focus:border-kenya-green-500 bg-white/80 backdrop-blur-sm"
                    >
                      <option value="">Select time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="appointment-message" className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose of Appointment *
                  </label>
                  <textarea
                    id="appointment-message"
                    name="message"
                    value={appointmentData.message}
                    onChange={handleAppointmentChange}
                    required
                    rows={4}
                    placeholder="Please describe the purpose of your appointment..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-green-500 focus:border-kenya-green-500 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAppointmentForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-kenya-green-600 text-white py-3 rounded-lg hover:bg-kenya-green-700 transition-colors duration-200 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>{isSubmitting ? 'Booking...' : 'Book Appointment'}</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;