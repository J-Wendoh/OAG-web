import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Target, Eye, Award, FileText, Heart, ArrowLeft, Calendar, MapPin, Phone, Mail, Menu, X } from 'lucide-react';
import TypewriterText from '../components/TypewriterText';

// Import images - Enhanced with new professional imagery
const aboutImage = '/6.png'; // Office building exterior
const leadershipImage = '/AG7.jpeg'; // AG in ceremonial setting
const agImage = '/AG.jpg'; // Primary AG portrait
const historyImage = '/AG3.jpg'; // AG in meetings
const constitutionImage = '/cons.jpg'; // Constitutional law focus
const internationalImage = '/UN HUMAN RIGHTS STAKEHOLDERS.jpg'; // International relations
const officeInteriorImage = '/1 (1).png'; // Office interior
const meetingRoomImage = '/1 (2).png'; // Meeting rooms
const aalcImage = '/AALC 2017.jpg'; // 2017 events
const cwlmImage = '/CWLM 2014.jpg'; // 2014 events
const jlacImage = '/JLAC 2019.jpg'; // 2019 events
const flagImage = '/flagkenya.jpeg'; // Kenyan flag
const coatOfArmsImage = '/courtofarms.jpeg'; // Coat of arms

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('who-we-are');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sections = [
    { id: 'who-we-are', title: 'Who We Are', icon: Users },
    { id: 'leadership', title: 'Leadership', icon: Award },
    { id: 'attorney-general-history', title: 'Attorney General History', icon: Calendar },
    { id: 'mandate', title: 'Mandate', icon: Target },
    { id: 'vision-mission', title: 'Vision & Mission', icon: Eye },
    { id: 'history', title: 'Our History', icon: Calendar },
    { id: 'milestones', title: 'Key Milestones', icon: Award },
    { id: 'core-values', title: 'Core Values', icon: Award }
  ];

  const milestones = [
    {
      year: '1963',
      title: 'Independence Era',
      description: 'Establishment of the Office of the Attorney General at Kenya\'s independence, marking the beginning of our constitutional mandate.',
      image: flagImage
    },
    {
      year: '2010',
      title: 'New Constitution',
      description: 'Constitutional reform strengthened the AG\'s role under Article 156, enhancing our mandate to protect constitutional rights.',
      image: constitutionImage
    },
    {
      year: '2014',
      title: 'Marriage Act',
      description: 'Implementation of the comprehensive Marriage Act 2014, revolutionizing family law and marriage registration in Kenya.',
      image: cwlmImage
    },
    {
      year: '2017',
      title: 'Legal Reforms',
      description: 'Significant legal reforms and modernization of legal frameworks to serve contemporary Kenya.',
      image: aalcImage
    },
    {
      year: '2019',
      title: 'International Cooperation',
      description: 'Enhanced international legal cooperation and human rights advocacy on the global stage.',
      image: jlacImage
    },
    {
      year: '2020',
      title: 'Digital Transformation',
      description: 'Launch of digital services and online platforms to improve access to legal services across all 47 counties.',
      image: internationalImage
    },
    {
      year: '2023',
      title: 'Historic Appointment',
      description: 'Hon. Dorcas Oduor becomes Kenya\'s first female Attorney General, marking a historic milestone in gender equality.'
    }
  ];

  // Attorney General History - Enhanced with detailed timeline
  const attorneyGeneralHistory = [
    {
      name: 'Charles Njonjo',
      period: '1963-1979',
      title: 'First Attorney General of Independent Kenya',
      achievements: [
        'Established the foundation of Kenya\'s legal system post-independence',
        'Instrumental in drafting early constitutional amendments',
        'Pioneered legal reforms in the newly independent nation'
      ],
      image: flagImage,
      significance: 'Set the precedent for the office and established its constitutional role'
    },
    {
      name: 'Joseph Kamere',
      period: '1979-1983',
      title: 'Second Attorney General',
      achievements: [
        'Continued constitutional development during transition period',
        'Strengthened legal institutions and frameworks',
        'Advanced legal education and professional development'
      ],
      image: coatOfArmsImage,
      significance: 'Consolidated legal reforms and institutional development'
    },
    {
      name: 'Matthew Guy Muli',
      period: '1983-1991',
      title: 'Third Attorney General',
      achievements: [
        'Navigated complex political and legal challenges',
        'Maintained judicial independence during political transitions',
        'Advanced human rights protections in legal framework'
      ],
      image: constitutionImage,
      significance: 'Upheld rule of law during challenging political periods'
    },
    {
      name: 'Amos Wako',
      period: '1991-2011',
      title: 'Longest-Serving Attorney General',
      achievements: [
        'Oversaw the transition to multiparty democracy',
        'Led constitutional review and reform processes',
        'Modernized legal institutions and procedures',
        'Championed access to justice initiatives'
      ],
      image: historyImage,
      significance: 'Guided Kenya through democratic transition and constitutional reform'
    },
    {
      name: 'Githu Muigai',
      period: '2011-2018',
      title: 'First Attorney General under 2010 Constitution',
      achievements: [
        'Implemented new constitutional framework',
        'Established devolved legal structures',
        'Advanced international legal cooperation',
        'Strengthened human rights protections'
      ],
      image: internationalImage,
      significance: 'Pioneered implementation of the new constitutional order'
    },
    {
      name: 'Kihara Kariuki',
      period: '2018-2023',
      title: 'Modernization and Digital Transformation',
      achievements: [
        'Led digital transformation of legal services',
        'Enhanced access to justice through technology',
        'Strengthened international legal partnerships',
        'Advanced gender equality in legal profession'
      ],
      image: aalcImage,
      significance: 'Modernized the office for the digital age'
    },
    {
      name: 'Hon. Dorcas Oduor',
      period: '2023-Present',
      title: 'First Female Attorney General',
      achievements: [
        'Historic appointment breaking gender barriers',
        'Champion of inclusive legal services',
        'Advocate for constitutional rights and freedoms',
        'Leader in legal innovation and accessibility'
      ],
      image: leadershipImage,
      significance: 'Represents a new era of inclusive leadership and gender equality'
    }
  ];

  const coreValues = [
    {
      title: "Professionalism",
      description: "Upholding the highest standards of conduct and service delivery in all our actions and engagements."
    },
    {
      title: "Transparency & Accountability",
      description: "Ensuring openness, honesty, and answerability in decision-making, operations, and service to the public."
    },
    {
      title: "Efficiency & Effectiveness",
      description: "Striving for optimal use of resources and delivering timely, impactful, and quality services."
    },
    {
      title: "Equity & Fairness",
      description: "Guaranteeing just, unbiased, and impartial treatment for all persons in every matter handled."
    },
    {
      title: "Integrity",
      description: "Adhering to the highest ethical standards, promoting honesty, trustworthiness, and moral responsibility."
    },
    {
      title: "Teamwork",
      description: "Fostering collaboration, cooperation, and collective effort among departments, staff, and partners."
    },
    {
      title: "Confidentiality",
      description: "Maintaining the privacy and protection of sensitive information shared by citizens and stakeholders."
    },
    {
      title: "Courtesy & Respect for Diversity",
      description: "Treating every individual with dignity, politeness, and respect for diverse backgrounds and viewpoints."
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'who-we-are':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who We Are</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  The Office of the Attorney General is the principal legal advisor to the Government of Kenya. 
                  Established under Article 156 of the Constitution of Kenya 2010, we serve as the chief legal 
                  officer of the Republic and the principal representative of the people of Kenya in legal proceedings.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our office plays a crucial role in upholding the rule of law, protecting the Constitution, 
                  and ensuring that the government operates within the legal framework. We provide legal advice 
                  to all government departments and represent the government in legal matters.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  With over 60 years of service to the nation, we have evolved from a colonial-era institution 
                  into a modern, dynamic legal office that serves all Kenyans regardless of their background, 
                  economic status, or geographical location.
                </p>
              </div>
              <div className="space-y-4">
                {/* Main office building image */}
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <img
                    src={aboutImage}
                    alt="Office of the Attorney General building exterior"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm font-medium">Sheria House, Nairobi</p>
                  </div>
                </div>

                {/* Office interior gallery */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative h-32 rounded-lg overflow-hidden">
                    <img
                      src={officeInteriorImage}
                      alt="Office interior and workspace"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="relative h-32 rounded-lg overflow-hidden">
                    <img
                      src={meetingRoomImage}
                      alt="Conference and meeting rooms"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Core functions with visual elements */}
                <div className="bg-kenya-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <img
                      src={coatOfArmsImage}
                      alt="Kenya Coat of Arms"
                      className="w-6 h-6"
                      loading="lazy"
                    />
                    <h4 className="font-semibold text-kenya-green-900">Our Core Functions</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Legal advisory services to government</li>
                    <li>• Constitutional interpretation and compliance</li>
                    <li>• Legislative drafting and review</li>
                    <li>• Government representation in legal matters</li>
                    <li>• Marriage and family law services</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Rich History</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  The Office of the Attorney General has a distinguished history spanning over six decades, 
                  from Kenya's independence in 1963 to the present day. Our journey reflects the evolution 
                  of Kenya's legal system and our unwavering commitment to justice.
                </p>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">Historical Highlights</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-800">Colonial Era Legacy</h5>
                      <p className="text-sm text-gray-600">Inherited legal frameworks and transformed them to serve independent Kenya</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">Post-Independence Growth</h5>
                      <p className="text-sm text-gray-600">Expanded services and established regional offices across all provinces</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">Constitutional Reforms</h5>
                      <p className="text-sm text-gray-600">Adapted to constitutional changes in 2010, strengthening our mandate</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <img 
                    src={historyImage}
                    alt={t('about.history.imageAlt', 'Our History')}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'milestones':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Milestones</h2>
            
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-kenya-green-200"></div>
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative flex items-start space-x-6">
                    <div className="flex-shrink-0 w-8 h-8 bg-kenya-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                        {/* Image section */}
                        <div className="relative h-32 md:h-full">
                          <img
                            src={milestone.image}
                            alt={`${milestone.title} - ${milestone.year}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                        </div>

                        {/* Content section */}
                        <div className="md:col-span-2 p-6">
                          <div className="flex items-center space-x-4 mb-3">
                            <span className="bg-kenya-red-100 text-kenya-red-700 px-3 py-1 rounded-full text-sm font-medium">
                              {milestone.year}
                            </span>
                            <h4 className="text-lg font-semibold text-gray-900">{milestone.title}</h4>
                          </div>
                          <p className="text-gray-700">{milestone.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'leadership':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden">
                    <img
                      src={leadershipImage}
                      alt={t('about.leadership.imageAlt', 'Leadership Team')}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Hon. Dorcas Oduor</h3>
                    <p className="text-gray-700">Attorney General</p>
                    <p className="text-sm text-gray-600">Kenya's First Female Attorney General</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Hon. Dorcas Oduor serves as the Attorney General of Kenya, bringing extensive legal experience
                    and a commitment to justice and the rule of law. Under her leadership, the office continues
                    to strengthen Kenya's legal framework and ensure equal access to justice for all citizens.
                  </p>

                  <div className="bg-kenya-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-kenya-green-900 mb-2">Key Achievements</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• First female Attorney General in Kenya's history</li>
                      <li>• Champion of gender equality in the legal profession</li>
                      <li>• Advocate for accessible legal services</li>
                      <li>• Leader in constitutional law and human rights</li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => setActiveSection('attorney-general-history')}
                      className="w-full bg-kenya-red-600 text-white py-3 px-6 rounded-lg hover:bg-kenya-red-700 transition-colors duration-200 font-semibold flex items-center justify-center space-x-2"
                    >
                      <span>Learn More About Our History</span>
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-kenya-green-50 to-kenya-green-100 p-6 rounded-xl border border-kenya-green-200">
                  <h4 className="text-lg font-semibold text-kenya-green-900 mb-4">Office Structure</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Legal Departments</span>
                      <span className="font-semibold text-kenya-green-800">3 Major Divisions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Legal Professionals</span>
                      <span className="font-semibold text-kenya-green-800">500+ Staff</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Years of Service</span>
                      <span className="font-semibold text-kenya-green-800">60+ Years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Counties Served</span>
                      <span className="font-semibold text-kenya-green-800">All 47 Counties</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Leadership Excellence</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Our leadership team brings together decades of legal expertise, constitutional knowledge,
                    and commitment to public service. We are dedicated to upholding the highest standards
                    of legal practice while ensuring accessible justice for all Kenyans.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'attorney-general-history':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Attorney General History</h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              Since Kenya's independence in 1963, the Office of the Attorney General has been led by distinguished
              legal minds who have shaped our nation's legal landscape. Each Attorney General has contributed
              uniquely to Kenya's constitutional development and legal evolution.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {attorneyGeneralHistory.map((ag, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-white rounded-2xl shadow-luxury overflow-hidden hover:shadow-luxury-lg transition-all duration-500 border border-gray-100 hover:border-kenya-green-200"
                >
                  {/* Card Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={ag.image}
                      alt={`${ag.name} - ${ag.title}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/AG.jpg'; // Fallback image
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Period Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-kenya-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {ag.period}
                      </div>
                    </div>

                    {/* Order Number */}
                    <div className="absolute top-4 right-4">
                      <div className="w-10 h-10 bg-kenya-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                        {index + 1}
                      </div>
                    </div>

                    {/* Name and Title Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-lg font-bold mb-1 leading-tight">{ag.name}</h3>
                      <p className="text-sm opacity-90 leading-tight">{ag.title}</p>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    {/* Significance */}
                    <div className="mb-4">
                      <p className="text-gray-700 text-sm leading-relaxed font-medium">
                        {ag.significance}
                      </p>
                    </div>

                    {/* Achievements Preview */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-kenya-green-900 uppercase tracking-wide">
                        Key Achievements
                      </h4>
                      <div className="space-y-1">
                        {ag.achievements.slice(0, 2).map((achievement, achIndex) => (
                          <div key={achIndex} className="flex items-start space-x-2 text-xs text-gray-600">
                            <div className="flex-shrink-0 w-1.5 h-1.5 bg-kenya-green-500 rounded-full mt-1.5"></div>
                            <span className="leading-relaxed">{achievement}</span>
                          </div>
                        ))}
                        {ag.achievements.length > 2 && (
                          <p className="text-xs text-kenya-green-600 font-medium">
                            +{ag.achievements.length - 2} more achievements
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hover Overlay with Full Details */}
                  <div className="absolute inset-0 bg-gradient-to-br from-kenya-green-900/95 to-kenya-green-800/95 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center p-6 text-white">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-xl font-bold mb-2">{ag.name}</h3>
                      <p className="text-kenya-green-100 font-semibold mb-1">{ag.title}</p>
                      <p className="text-sm text-kenya-green-200 mb-4">{ag.period}</p>

                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-semibold text-kenya-green-100 uppercase tracking-wide mb-2">
                            Historical Significance
                          </h4>
                          <p className="text-sm leading-relaxed text-white/90">
                            {ag.significance}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-kenya-green-100 uppercase tracking-wide mb-2">
                            All Achievements
                          </h4>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {ag.achievements.map((achievement, achIndex) => (
                              <div key={achIndex} className="flex items-start space-x-2 text-xs">
                                <div className="flex-shrink-0 w-1.5 h-1.5 bg-kenya-green-300 rounded-full mt-1.5"></div>
                                <span className="leading-relaxed text-white/90">{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-br from-kenya-green-50 to-kenya-green-100 p-6 rounded-xl border border-kenya-green-200">
              <h4 className="text-lg font-semibold text-kenya-green-900 mb-3">Legacy of Excellence</h4>
              <p className="text-gray-700 leading-relaxed">
                Each Attorney General has built upon the foundation laid by their predecessors, creating a legacy
                of legal excellence, constitutional adherence, and public service. From the establishment of
                independent Kenya's legal framework to the implementation of the 2010 Constitution and beyond,
                our office has consistently evolved to meet the changing needs of our nation while upholding
                the highest standards of legal practice and constitutional governance.
              </p>
            </div>
          </div>
        );

      case 'mandate':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mandate</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Advisory</h3>
                <p className="text-gray-700">Providing legal advice to the government and its agencies on all matters of law.</p>
              </div>
              <div className="bg-kenya-red-50 p-6 rounded-lg border border-kenya-red-200">
                <h3 className="text-lg font-semibold text-kenya-red-700 mb-3">Legal Representation</h3>
                <p className="text-gray-700">Representing the government in legal proceedings and protecting public interest.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Legislative Drafting</h3>
                <p className="text-gray-700">Drafting and reviewing legislation to ensure constitutional compliance.</p>
              </div>
              <div className="bg-kenya-green-50 p-6 rounded-lg border border-kenya-green-200">
                <h3 className="text-lg font-semibold text-kenya-green-700 mb-3">Constitutional Protection</h3>
                <p className="text-gray-700">Safeguarding the Constitution and ensuring adherence to the rule of law.</p>
              </div>
            </div>
          </div>
        );

      case 'vision-mission':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Vision & Mission</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed">
                  To be a world-class legal institution that upholds the rule of law, promotes justice, 
                  and serves the people of Kenya with integrity, excellence, and innovation.
                </p>
              </div>
              <div className="bg-gradient-to-br from-kenya-red-50 to-kenya-red-100 p-8 rounded-2xl border border-kenya-red-200">
                <h3 className="text-2xl font-bold text-kenya-red-700 mb-4">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  To provide quality legal services, advice, and representation to the government and 
                  the people of Kenya while promoting access to justice and upholding constitutional values.
                </p>
              </div>
            </div>
          </div>
        );

      case 'core-values':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Values</h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              Our core values guide every aspect of our work and define our commitment to serving the people of Kenya 
              with the highest standards of professionalism and integrity.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coreValues.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-3 h-3 bg-kenya-green-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 bg-kenya-green-50 p-6 rounded-xl border border-kenya-green-200">
              <h4 className="text-lg font-semibold text-kenya-green-900 mb-3">Our Commitment</h4>
              <p className="text-gray-700 leading-relaxed">
                These core values are not just words on paper – they are the foundation of our daily operations, 
                guiding how we interact with citizens, make decisions, and deliver services. We are committed to 
                upholding these values in every aspect of our work, ensuring that the Office of the Attorney General 
                remains a trusted institution that serves Kenya with distinction.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {sections.find(s => s.id === activeSection)?.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Content for this section is being updated. Please check back soon for more information.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 relative">
      <div className="relative h-64 mb-12">
        <div className="relative h-64 rounded-lg overflow-hidden">
          <img 
            src={agImage}
            alt={t('about.mandate.imageAlt', 'Attorney General Office')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <TypewriterText 
              text="About Us" 
              className="text-4xl md:text-5xl font-bold font-merriweather"
              speed={150}
            />
            <div className="w-24 h-1 bg-kenya-red-500 mx-auto rounded-full mt-4" />
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border border-gray-200 text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span className="font-medium">Sections</span>
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Desktop Sidebar */}
              <div className="hidden lg:block bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Sections</h3>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-200 ${
                          activeSection === section.id
                            ? 'bg-gray-100 text-gray-900 border border-gray-300'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      navigate('/contact');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full bg-kenya-green-700 text-white py-3 rounded-lg hover:bg-kenya-green-800 transition-colors duration-200 font-semibold"
                  >
                    Contact Us Today
                  </button>
                </div>
              </div>

              {/* Mobile Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ 
                  opacity: isSidebarOpen ? 1 : 0,
                  x: isSidebarOpen ? 0 : -300
                }}
                transition={{ duration: 0.3 }}
                className={`lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-sm shadow-2xl border-r border-gray-200 transform ${
                  isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out`}
              >
                <div className="p-6 h-full overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Sections</h3>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  
                  <nav className="space-y-2">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => {
                            setActiveSection(section.id);
                            setIsSidebarOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-200 ${
                            activeSection === section.id
                              ? 'bg-gray-100 text-gray-900 border border-gray-300'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{section.title}</span>
                        </button>
                      );
                    })}
                  </nav>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        navigate('/contact');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setIsSidebarOpen(false);
                      }}
                      className="w-full bg-kenya-green-700 text-white py-3 rounded-lg hover:bg-kenya-green-800 transition-colors duration-200 font-semibold"
                    >
                      Contact Us Today
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Mobile Backdrop */}
              {isSidebarOpen && (
                <div
                  className="lg:hidden fixed inset-0 bg-black/50 z-40"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200"
              >
                {renderContent()}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;