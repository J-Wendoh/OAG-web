import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Briefcase, MapPin, Clock, Upload, X, Download, Calendar } from 'lucide-react';
// For now, we'll use mock data until the API is set up
const mockCareers = [
  {
    id: '1',
    title_en: 'Senior Legal Counsel',
    title_sw: 'Mshauri Mkuu wa Kisheria',
    department_en: 'Legal Affairs Department',
    department_sw: 'Idara ya Mambo ya Kisheria',
    description_en: 'We are seeking an experienced Senior Legal Counsel to provide expert legal advice and representation for the Office of the Attorney General.',
    description_sw: 'Tunatafuta Mshauri Mkuu wa Kisheria mwenye uzoefu kutoa ushauri wa kitaalamu wa kisheria na uwakilishi kwa Ofisi ya Mwanasheria Mkuu.',
    requirements_en: [
      'Bachelor of Laws (LLB) degree from a recognized university',
      'Admission to the Kenya School of Law',
      'Minimum 8 years of legal practice experience',
      'Strong knowledge of constitutional law and public administration',
      'Excellent written and oral communication skills'
    ],
    requirements_sw: [
      'Shahada ya Kwanza ya Sheria (LLB) kutoka chuo kikuu kilichotambuliwa',
      'Kukubaliwa katika Shule ya Sheria ya Kenya',
      'Uzoefu wa kufanya kazi za kisheria kwa miaka 8 au zaidi',
      'Ujuzi mkuu wa sheria ya katiba na utawala wa umma',
      'Ujuzi bora wa mawasiliano ya kinywa na kiandishi'
    ],
    responsibilities_en: [
      'Provide legal advice on constitutional and administrative matters',
      'Draft and review legal documents and legislation',
      'Represent the government in legal proceedings',
      'Conduct legal research and analysis',
      'Supervise junior legal staff'
    ],
    responsibilities_sw: [
      'Kutoa ushauri wa kisheria kuhusu mambo ya kikatiba na kiutawala',
      'Kuandika na kukagua hati za kisheria na sheria',
      'Kuwakilisha serikali katika kesi za kisheria',
      'Kufanya utafiti na uchambuzi wa kisheria',
      'Kusimamia wafanyakazi wadogo wa kisheria'
    ],
    salary_range: 'KES 180,000 - 250,000 per month',
    application_deadline: '2024-02-15',
    job_type: 'Full-time',
    location_en: 'Nairobi, Kenya',
    location_sw: 'Nairobi, Kenya',
    pdf_url: '/careers/senior-legal-counsel.html',
    is_active: true
  },
  {
    id: '2',
    title_en: 'Marriage Registrar',
    title_sw: 'Msajili wa Ndoa',
    department_en: 'Department of Marriage',
    department_sw: 'Idara ya Ndoa',
    description_en: 'Join our team as a Marriage Registrar to facilitate marriage registration services and ensure compliance with marriage laws.',
    description_sw: 'Jiunge na timu yetu kama Msajili wa Ndoa ili kuwezesha huduma za usajili wa ndoa na kuhakikisha kufuata sheria za ndoa.',
    requirements_en: [
      'Bachelor\'s degree in Law, Social Sciences, or related field',
      'Certificate in Marriage Registration (preferred)',
      'Minimum 3 years of experience in public service',
      'Knowledge of marriage laws and procedures',
      'Strong interpersonal and customer service skills'
    ],
    requirements_sw: [
      'Shahada ya kwanza katika Sheria, Sayansi za Kijamii, au uwanda unaohusiana',
      'Cheti cha Usajili wa Ndoa (kinatarajiwa)',
      'Uzoefu wa miaka 3 au zaidi katika huduma za umma',
      'Ujuzi wa sheria na taratibu za ndoa',
      'Ujuzi mkuu wa mahusiano na huduma kwa wateja'
    ],
    responsibilities_en: [
      'Conduct marriage ceremonies and issue marriage certificates',
      'Maintain accurate marriage records and databases',
      'Provide guidance to couples on marriage procedures',
      'Ensure compliance with marriage laws and regulations',
      'Handle marriage-related inquiries and complaints'
    ],
    responsibilities_sw: [
      'Kuongoza sherehe za ndoa na kutoa vyeti vya ndoa',
      'Kudumisha rekodi sahihi za ndoa na hifadhidata',
      'Kutoa mwongozo kwa wanandoa kuhusu taratibu za ndoa',
      'Kuhakikisha kufuata sheria na kanuni za ndoa',
      'Kushughulikia maswali na malalamiko yanayohusiana na ndoa'
    ],
    salary_range: 'KES 80,000 - 120,000 per month',
    application_deadline: '2024-02-28',
    job_type: 'Full-time',
    location_en: 'Multiple locations across Kenya',
    location_sw: 'Maeneo mbalimbali nchini Kenya',
    pdf_url: '/careers/marriage-registrar.html',
    is_active: true
  },
  {
    id: '3',
    title_en: 'Legal Research Assistant',
    title_sw: 'Msaidizi wa Utafiti wa Kisheria',
    department_en: 'Legal Research Department',
    department_sw: 'Idara ya Utafiti wa Kisheria',
    description_en: 'Support our legal team by conducting comprehensive legal research and analysis on various constitutional and administrative matters.',
    description_sw: 'Msaada timu yetu ya kisheria kwa kufanya utafiti mkuu wa kisheria na uchambuzi kuhusu mambo mbalimbali ya kikatiba na kiutawala.',
    requirements_en: [
      'Bachelor of Laws (LLB) degree',
      'Strong research and analytical skills',
      'Proficiency in legal databases and research tools',
      'Excellent written communication skills',
      'Attention to detail and accuracy'
    ],
    requirements_sw: [
      'Shahada ya Kwanza ya Sheria (LLB)',
      'Ujuzi mkuu wa utafiti na uchambuzi',
      'Ustadi katika hifadhidata za kisheria na zana za utafiti',
      'Ujuzi bora wa mawasiliano ya kiandishi',
      'Makini na usahihi katika kazi'
    ],
    responsibilities_en: [
      'Conduct legal research on constitutional and statutory matters',
      'Prepare research reports and legal memoranda',
      'Assist in drafting legal opinions and briefs',
      'Maintain legal research databases and resources',
      'Support senior legal staff with case preparation'
    ],
    responsibilities_sw: [
      'Kufanya utafiti wa kisheria kuhusu mambo ya kikatiba na ya kisheria',
      'Kuandaa ripoti za utafiti na kumbukumbu za kisheria',
      'Kusaidia katika kuandika maoni ya kisheria na muhtasari',
      'Kudumisha hifadhidata za utafiti wa kisheria na rasilimali',
      'Kusaidia wafanyakazi wakuu wa kisheria katika maandalizi ya kesi'
    ],
    salary_range: 'KES 60,000 - 90,000 per month',
    application_deadline: '2024-03-15',
    job_type: 'Full-time',
    location_en: 'Nairobi, Kenya',
    location_sw: 'Nairobi, Kenya',
    pdf_url: '/careers/legal-research-assistant.html',
    is_active: true
  }
];

interface Career {
  id: string;
  title_en: string;
  title_sw: string;
  department_en: string;
  department_sw: string;
  description_en: string;
  description_sw: string;
  requirements_en: string[];
  requirements_sw: string[];
  responsibilities_en: string[];
  responsibilities_sw: string[];
  salary_range: string | null;
  application_deadline: string | null;
  job_type: string;
  location_en: string | null;
  location_sw: string | null;
  pdf_url: string | null;
  is_active: boolean;
}

const CareersSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    phone: '',
    email: '',
    address: '',
    cv: null as File | null
  });
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setCareers(mockCareers);
    } catch (err) {
      console.error('Error fetching careers:', err);
      setError('Failed to load career opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = (pdfUrl: string, jobTitle: string) => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${jobTitle.replace(/\s+/g, '_')}_Job_Description.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, cv: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, we'll just log the data
    console.log('Application submitted:', formData);
    // In real implementation, send to joinwindowatgmail.com
    alert('Application submitted successfully!');
    setSelectedJob(null);
    setFormData({
      fullName: '',
      idNumber: '',
      phone: '',
      email: '',
      address: '',
      cv: null
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-kenya-red-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading career opportunities...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchCareers}
              className="px-4 py-2 bg-kenya-red-600 text-white rounded-lg hover:bg-kenya-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-grid opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-kenya-green-900 mb-4 font-merriweather">
            {t('careers.title')}
          </h2>
          <div className="w-24 h-1 bg-kenya-red-500 mx-auto rounded-full" />
        </motion.div>

        {/* Job Listings */}
        <div className="grid gap-6 mb-12">
          {careers.map((career, index) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-kenya-green-100 rounded-lg flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-kenya-green-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-kenya-green-900 mb-2">
                        {i18n.language === 'sw' ? career.title_sw : career.title_en}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{i18n.language === 'sw' ? career.department_sw : career.department_en}</span>
                        </div>
                        {career.location_en && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{i18n.language === 'sw' ? career.location_sw : career.location_en}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{career.job_type}</span>
                        </div>
                        {career.application_deadline && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Deadline: {new Date(career.application_deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        {i18n.language === 'sw' ? career.description_sw : career.description_en}
                      </p>
                      {career.salary_range && (
                        <p className="text-kenya-green-700 font-semibold">
                          Salary: {career.salary_range}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                  {career.pdf_url && (
                    <button
                      onClick={() => handleDownloadPDF(career.pdf_url!, i18n.language === 'sw' ? career.title_sw : career.title_en)}
                      className="w-full lg:w-auto bg-kenya-red-600 text-white px-6 py-3 rounded-lg hover:bg-kenya-red-700 transition-colors duration-200 font-semibold flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedJob(index)}
                    className="w-full lg:w-auto bg-kenya-green-900 text-white px-6 py-3 rounded-lg hover:bg-kenya-green-800 transition-colors duration-200 font-semibold"
                  >
                    {t('careers.apply')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Application Modal */}
        {selectedJob !== null && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-kenya-green-900">
                  Apply for {i18n.language === 'sw' ? careers[selectedJob].title_sw : careers[selectedJob].title_en}
                </h3>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('careers.form.name')}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-green-500 focus:border-kenya-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('careers.form.id')}
                    </label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-green-500 focus:border-kenya-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('careers.form.phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-green-500 focus:border-kenya-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('careers.form.email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-green-500 focus:border-kenya-green-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('careers.form.address')}
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kenya-green-500 focus:border-kenya-green-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('careers.form.cv')}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-kenya-green-500 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      {formData.cv ? formData.cv.name : 'Upload your CV (PDF, DOC, DOCX)'}
                    </p>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      required
                      className="hidden"
                      id="cv-upload"
                    />
                    <label
                      htmlFor="cv-upload"
                      className="inline-block bg-kenya-green-100 text-kenya-green-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-kenya-green-200 transition-colors"
                    >
                      Choose File
                    </label>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-kenya-green-900 text-white py-3 rounded-lg hover:bg-kenya-green-800 transition-colors font-semibold"
                  >
                    {t('careers.form.submit')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CareersSection;