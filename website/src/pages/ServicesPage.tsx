import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { Scale, FileText, Users, Shield, Heart, Gavel, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import TypewriterText from '../components/TypewriterText';

// Import images - Enhanced with new professional imagery
const servicesImage = '/Ourservices.jpg'; // Services page banner
const legalServicesImage = '/1.png'; // Legal services
const constitutionalImage = '/2.png'; // Constitutional law
const prosecutionImage = '/4.png'; // Public prosecution
const advisoryImage = '/5.png'; // Legal advice
const marriageImage = '/cons.jpg'; // Marriage and family law
const agWorkingImage = '/AG5.jpg'; // AG in professional setting

const ServicesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const services = [
    {
      icon: Scale,
      title: 'Legal Advisory Services',
      description: 'Comprehensive legal advice and consultation for government departments and public institutions.',
      features: ['Constitutional interpretation', 'Policy guidance', 'Legislative drafting', 'Legal opinions'],
      image: legalServicesImage,
      steps: [
        'Submit request through official channels',
        'Initial consultation and case assessment',
        'Legal research and analysis',
        'Draft legal opinion or advice',
        'Review and finalization',
        'Delivery of comprehensive legal guidance'
      ],
      requirements: ['Official government request', 'Relevant documentation', 'Clear scope of work'],
      timeline: '5-10 business days'
    },
    {
      icon: FileText,
      title: 'Document Drafting',
      description: 'Professional drafting of legal documents, contracts, and legislative instruments.',
      features: ['Contract preparation', 'Legal agreements', 'Policy documents', 'Regulatory frameworks'],
      image: constitutionalImage,
      steps: [
        'Request submission with specifications',
        'Initial draft preparation',
        'Stakeholder consultation',
        'Legal review and compliance check',
        'Revisions and amendments',
        'Final document delivery'
      ],
      requirements: ['Detailed specifications', 'Stakeholder input', 'Legal compliance requirements'],
      timeline: '7-14 business days'
    },
    {
      icon: Users,
      title: 'Legal Representation',
      description: 'Representing the government and public interest in legal proceedings.',
      features: ['Court representation', 'Arbitration services', 'Mediation support', 'Legal advocacy'],
      image: '/Departments.jpg',
      steps: [
        'Case evaluation and strategy development',
        'Evidence gathering and preparation',
        'Legal brief preparation',
        'Court appearance and representation',
        'Follow-up and case monitoring',
        'Final report and recommendations'
      ],
      requirements: ['Case documentation', 'Evidence materials', 'Court filing requirements'],
      timeline: 'Varies by case complexity'
    },
    {
      icon: Shield,
      title: 'Constitutional Protection',
      description: 'Safeguarding constitutional rights and ensuring adherence to the rule of law.',
      features: ['Rights protection', 'Constitutional review', 'Legal compliance', 'Judicial oversight'],
      image: '/Contactus.jpg',
      steps: [
        'Constitutional issue identification',
        'Legal precedent research',
        'Stakeholder consultation',
        'Constitutional analysis',
        'Recommendation development',
        'Implementation guidance'
      ],
      requirements: ['Constitutional question', 'Legal documentation', 'Stakeholder input'],
      timeline: '10-21 business days'
    },
    {
      icon: Heart,
      title: 'Marriage Services',
      description: 'Comprehensive marriage registration and family law services.',
      features: ['Marriage registration', 'Divorce proceedings', 'Family mediation', 'Legal counseling'],
      image: '/flagkenya.jpeg',
      steps: [
        'Application submission',
        'Document verification',
        'Legal requirements check',
        'Processing and registration',
        'Certificate issuance',
        'Follow-up support services'
      ],
      requirements: ['Valid identification', 'Required forms', 'Supporting documents'],
      timeline: '3-5 business days'
    },
    {
      icon: Gavel,
      title: 'Legal Aid',
      description: 'Providing accessible legal services to underserved communities.',
      features: ['Free legal consultation', 'Pro bono representation', 'Legal education', 'Community outreach'],
      image: '/AG.jpg',
      steps: [
        'Eligibility assessment',
        'Case evaluation',
        'Legal aid assignment',
        'Service delivery',
        'Case monitoring',
        'Outcome evaluation'
      ],
      requirements: ['Proof of need', 'Case documentation', 'Eligibility criteria'],
      timeline: '1-3 business days for initial consultation'
    }
  ];

  const handleServiceClick = (index: number) => {
    setSelectedService(selectedService === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Header with Background Image and Typing Effect */}
      <div className="relative h-64 mb-12">
        <img
          src={servicesImage}
          alt={t('services.imageAlt', 'Our Services')}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <TypewriterText 
              text="Our Services" 
              className="text-4xl md:text-5xl font-bold font-merriweather"
              speed={150}
            />
            <div className="w-24 h-1 bg-kenya-red-500 mx-auto rounded-full mt-4" />
          </div>
        </div>
      </div>

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
            Comprehensive legal services to serve the government and people of Kenya with excellence.
          </p>
        </motion.div>

        {/* Alternating Service Cards */}
        <div ref={ref} className="space-y-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isEven = index % 2 === 0;
            const isExpanded = selectedService === index;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  !isEven ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                {/* Service Content */}
                <div className={`space-y-6 ${!isEven ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
                      <Icon className="w-8 h-8 text-gray-700" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {service.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-600">
                        <CheckCircle className="w-5 h-5 text-kenya-green-600 mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handleServiceClick(index)}
                    className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-semibold"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'View Full Details'}</span>
                    <ArrowRight className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                {/* Service Image */}
                <div className={`${!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-80 object-cover rounded-2xl shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/AG.jpg';
                    }}
                  />
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="lg:col-span-2 bg-gray-50 rounded-2xl p-8 border border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Step-by-Step Process */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Process Steps</h4>
                        <ol className="space-y-3">
                          {service.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start space-x-3">
                              <span className="flex items-center justify-center w-6 h-6 bg-kenya-green-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                                {stepIndex + 1}
                              </span>
                              <span className="text-sm text-gray-700">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Requirements */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h4>
                        <ul className="space-y-2">
                          {service.requirements.map((req, reqIndex) => (
                            <li key={reqIndex} className="flex items-center text-sm text-gray-700">
                              <div className="w-2 h-2 bg-kenya-red-500 rounded-full mr-3" />
                              {req}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                          <h5 className="font-medium text-gray-900 mb-2">Timeline</h5>
                          <p className="text-sm text-gray-600">{service.timeline}</p>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Get Started</h4>
                        <div className="space-y-4">
                          <button
                            onClick={() => {
                              navigate('/contact');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full bg-kenya-green-700 text-white py-3 rounded-lg hover:bg-kenya-green-800 transition-colors duration-200 font-semibold"
                          >
                            Contact Us
                          </button>
                          <div className="text-sm text-gray-600 space-y-2">
                            <p><strong>Phone:</strong> +254 20 271 8000</p>
                            <p><strong>Email:</strong> info@ag.go.ke</p>
                            <p><strong>Office Hours:</strong> Mon-Fri 8AM-5PM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Additional Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 text-center border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need Specialized Legal Assistance?
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Our team of experienced legal professionals is ready to assist you with any legal matter. 
            Contact us today for a consultation and let us help you navigate the legal landscape with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                navigate('/contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-semibold"
            >
              Schedule Consultation
            </button>
            <button 
              onClick={() => {
                navigate('/about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-900 hover:text-white transition-colors duration-200 font-semibold"
            >
              Learn More About Us
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicesPage;