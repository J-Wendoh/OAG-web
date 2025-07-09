import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Enhanced translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: 'Home',
        about: 'About',
        departments: 'Departments',
        services: 'Services',
        contact: 'Contact',
        news: 'News',
        search: 'Search',
        logoTitle: 'OAG',
        logoSubtitle: 'Kenya',
        logoAlt: 'Kenya Court of Arms',
        newsTitle: 'News & Updates',
        newsTooltip: 'News & Updates',
        searchLabel: 'Search',
        playAudio: 'Play AG Message',
        stopAudio: 'Stop Audio',
        audioNotSupported: 'Your browser does not support the audio element.',
        menu: 'Menu',
        close: 'Close'
      },
      
      // Search functionality
      search: {
        title: 'Search OAG',
        placeholder: 'Search for services, departments, or information...',
        loading: 'Searching...',
        noResults: 'No results found',
        noResultsDesc: 'Try searching with different keywords or browse our services.',
        recent: 'Recent Searches',
        suggestions: 'Popular Searches',
        resultsCount: 'Found {{count}} results',
        close: 'Close search',
        category: {
          page: 'Page',
          service: 'Service',
          contact: 'Contact',
          news: 'News'
        },
        results: {
          about: 'About OAG',
          aboutDesc: 'Learn about the Office of the Attorney General and its mission',
          complaints: 'File a Complaint',
          complaintsDesc: 'Submit your complaint and track its progress',
          departments: 'Departments',
          departmentsDesc: 'Explore our various departments and their services',
          contact: 'Contact Us',
          contactDesc: 'Get in touch with our offices',
          services: 'Legal Services',
          servicesDesc: 'Access our comprehensive legal services',
          news: 'News & Updates',
          newsDesc: 'Stay updated with the latest news and announcements'
        },
        popular: {
          complaints: 'File Complaint',
          status: 'Check Status',
          contact: 'Contact Info',
          services: 'Legal Services'
        }
      },
      
      // Hero section
      hero: {
        title: 'Office of the Attorney General',
        subtitle: 'Serving Justice, Protecting Rights',
        description: 'Your gateway to legal services and justice in Kenya. File complaints, access legal resources, and stay informed about important legal matters.',
        fileComplaint: 'File a Complaint',
        checkStatus: 'Check Status',
        learnMore: 'Learn More',
        stats: {
          complaints: 'Complaints Resolved',
          departments: 'Departments',
          services: 'Legal Services',
          citizens: 'Citizens Served'
        }
      },
      
      // Common actions
      actions: {
        submit: 'Submit',
        cancel: 'Cancel',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        view: 'View',
        download: 'Download',
        upload: 'Upload',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        continue: 'Continue',
        confirm: 'Confirm',
        loading: 'Loading...',
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Information'
      },
      
      // Forms
      forms: {
        required: 'This field is required',
        emailInvalid: 'Please enter a valid email address',
        phoneInvalid: 'Please enter a valid phone number',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        message: 'Message',
        subject: 'Subject',
        category: 'Category',
        priority: 'Priority',
        status: 'Status',
        date: 'Date',
        time: 'Time',
        address: 'Address',
        city: 'City',
        county: 'County',
        description: 'Description'
      },
      
      // Footer
      footer: {
        about: 'About OAG',
        quickLinks: 'Quick Links',
        services: 'Services',
        contact: 'Contact Info',
        followUs: 'Follow Us',
        newsletter: 'Newsletter',
        subscribe: 'Subscribe',
        copyright: '© 2024 Office of the Attorney General, Kenya. All rights reserved.',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        accessibility: 'Accessibility'
      },
      
      // News section
      news: {
        title: 'Latest News & Updates',
        readMore: 'Read More',
        viewAll: 'View All News',
        category: 'Category',
        published: 'Published',
        author: 'Author',
        tags: 'Tags',
        share: 'Share',
        noNews: 'No news available at the moment'
      },
      
      // Complaints
      complaints: {
        title: 'File a Complaint',
        subtitle: 'Submit your complaint and we will address it promptly',
        form: {
          personalInfo: 'Personal Information',
          complaintDetails: 'Complaint Details',
          attachments: 'Attachments',
          review: 'Review & Submit'
        },
        status: {
          pending: 'Pending',
          inProgress: 'In Progress',
          resolved: 'Resolved',
          closed: 'Closed'
        },
        success: 'Your complaint has been submitted successfully. Reference number: {{reference}}',
        error: 'There was an error submitting your complaint. Please try again.'
      },
      
      // About page
      about: {
        title: 'About the Office of the Attorney General',
        mission: 'Our Mission',
        vision: 'Our Vision',
        values: 'Our Values',
        history: 'Our History',
        leadership: 'Leadership',
        departments: 'Our Departments',
        mandate: 'Our Mandate'
      },
      
      // Services
      services: {
        title: 'Legal Services',
        subtitle: 'Comprehensive legal services for all citizens',
        categories: {
          civil: 'Civil Law',
          criminal: 'Criminal Law',
          constitutional: 'Constitutional Law',
          administrative: 'Administrative Law',
          commercial: 'Commercial Law',
          family: 'Family Law'
        }
      },
      
      // Contact
      contact: {
        title: 'Contact Us',
        subtitle: 'Get in touch with our offices',
        office: 'Office',
        phone: 'Phone',
        email: 'Email',
        address: 'Address',
        hours: 'Office Hours',
        directions: 'Get Directions',
        form: {
          title: 'Send us a Message',
          name: 'Full Name',
          email: 'Email Address',
          subject: 'Subject',
          message: 'Message',
          send: 'Send Message'
        }
      },
      
      // Language toggle
      language: {
        english: 'English',
        swahili: 'Kiswahili',
        current: 'Current Language',
        select: 'Select Language'
      }
    }
  },
  sw: {
    translation: {
      // Navigation
      nav: {
        home: 'Nyumbani',
        about: 'Kuhusu',
        departments: 'Idara',
        services: 'Huduma',
        contact: 'Mawasiliano',
        news: 'Habari',
        search: 'Tafuta',
        logoTitle: 'OAG',
        logoSubtitle: 'Kenya',
        logoAlt: 'Nembo ya Kenya',
        newsTitle: 'Habari na Taarifa',
        newsTooltip: 'Habari na Taarifa',
        searchLabel: 'Tafuta',
        playAudio: 'Cheza Ujumbe wa AG',
        stopAudio: 'Simamisha Sauti',
        audioNotSupported: 'Kivinjari chako hakitumii kipengele cha sauti.',
        menu: 'Menyu',
        close: 'Funga'
      },
      
      // Search functionality
      search: {
        title: 'Tafuta OAG',
        placeholder: 'Tafuta huduma, idara, au taarifa...',
        loading: 'Inatafuta...',
        noResults: 'Hakuna matokeo yaliyopatikana',
        noResultsDesc: 'Jaribu kutafuta kwa maneno tofauti au vinjari huduma zetu.',
        recent: 'Utafutaji wa Hivi Karibuni',
        suggestions: 'Utafutaji Maarufu',
        resultsCount: 'Imepatikana matokeo {{count}}',
        close: 'Funga utafutaji',
        category: {
          page: 'Ukurasa',
          service: 'Huduma',
          contact: 'Mawasiliano',
          news: 'Habari'
        },
        results: {
          about: 'Kuhusu OAG',
          aboutDesc: 'Jifunze kuhusu Ofisi ya Mwanasheria Mkuu na dhamira yake',
          complaints: 'Wasilisha Malalamiko',
          complaintsDesc: 'Wasilisha malalamiko yako na ufuatilie maendeleo yake',
          departments: 'Idara',
          departmentsDesc: 'Chunguza idara zetu mbalimbali na huduma zao',
          contact: 'Wasiliana Nasi',
          contactDesc: 'Ungana na ofisi zetu',
          services: 'Huduma za Kisheria',
          servicesDesc: 'Pata huduma zetu kamili za kisheria',
          news: 'Habari na Taarifa',
          newsDesc: 'Endelea kupata habari na matangazo mapya'
        },
        popular: {
          complaints: 'Wasilisha Malalamiko',
          status: 'Angalia Hali',
          contact: 'Taarifa za Mawasiliano',
          services: 'Huduma za Kisheria'
        }
      },
      
      // Hero section
      hero: {
        title: 'Ofisi ya Mwanasheria Mkuu',
        subtitle: 'Kutumikia Haki, Kulinda Haki',
        description: 'Lango lako la huduma za kisheria na haki nchini Kenya. Wasilisha malalamiko, pata rasilimali za kisheria, na endelea kupata taarifa kuhusu mambo muhimu ya kisheria.',
        fileComplaint: 'Wasilisha Malalamiko',
        checkStatus: 'Angalia Hali',
        learnMore: 'Jifunze Zaidi',
        stats: {
          complaints: 'Malalamiko Yaliyotatuliwa',
          departments: 'Idara',
          services: 'Huduma za Kisheria',
          citizens: 'Raia Waliotumikiwa'
        }
      },
      
      // Common actions
      actions: {
        submit: 'Wasilisha',
        cancel: 'Ghairi',
        save: 'Hifadhi',
        edit: 'Hariri',
        delete: 'Futa',
        view: 'Ona',
        download: 'Pakua',
        upload: 'Pakia',
        back: 'Rudi',
        next: 'Ifuatayo',
        previous: 'Iliyotangulia',
        continue: 'Endelea',
        confirm: 'Thibitisha',
        loading: 'Inapakia...',
        success: 'Mafanikio',
        error: 'Kosa',
        warning: 'Onyo',
        info: 'Taarifa'
      },
      
      // Forms
      forms: {
        required: 'Sehemu hii inahitajika',
        emailInvalid: 'Tafadhali ingiza anwani sahihi ya barua pepe',
        phoneInvalid: 'Tafadhali ingiza nambari sahihi ya simu',
        name: 'Jina',
        email: 'Barua Pepe',
        phone: 'Simu',
        message: 'Ujumbe',
        subject: 'Mada',
        category: 'Jamii',
        priority: 'Kipaumbele',
        status: 'Hali',
        date: 'Tarehe',
        time: 'Muda',
        address: 'Anwani',
        city: 'Mji',
        county: 'Kaunti',
        description: 'Maelezo'
      },
      
      // Footer
      footer: {
        about: 'Kuhusu OAG',
        quickLinks: 'Viungo vya Haraka',
        services: 'Huduma',
        contact: 'Taarifa za Mawasiliano',
        followUs: 'Tufuate',
        newsletter: 'Jarida',
        subscribe: 'Jiandikishe',
        copyright: '© 2024 Ofisi ya Mwanasheria Mkuu, Kenya. Haki zote zimehifadhiwa.',
        privacy: 'Sera ya Faragha',
        terms: 'Masharti ya Huduma',
        accessibility: 'Ufikiaji'
      },
      
      // News section
      news: {
        title: 'Habari na Taarifa za Hivi Karibuni',
        readMore: 'Soma Zaidi',
        viewAll: 'Ona Habari Zote',
        category: 'Jamii',
        published: 'Imechapishwa',
        author: 'Mwandishi',
        tags: 'Lebo',
        share: 'Shiriki',
        noNews: 'Hakuna habari kwa sasa'
      },
      
      // Complaints
      complaints: {
        title: 'Wasilisha Malalamiko',
        subtitle: 'Wasilisha malalamiko yako na tutayashughulikia haraka',
        form: {
          personalInfo: 'Taarifa za Kibinafsi',
          complaintDetails: 'Maelezo ya Malalamiko',
          attachments: 'Viambatanisho',
          review: 'Kagua na Wasilisha'
        },
        status: {
          pending: 'Inasubiri',
          inProgress: 'Inaendelea',
          resolved: 'Imetatuliwa',
          closed: 'Imefungwa'
        },
        success: 'Malalamiko yako yamewasilishwa kwa mafanikio. Nambari ya kumbukumbu: {{reference}}',
        error: 'Kulikuwa na kosa la kuwasilisha malalamiko yako. Tafadhali jaribu tena.'
      },
      
      // About page
      about: {
        title: 'Kuhusu Ofisi ya Mwanasheria Mkuu',
        mission: 'Dhamira Yetu',
        vision: 'Maono Yetu',
        values: 'Maadili Yetu',
        history: 'Historia Yetu',
        leadership: 'Uongozi',
        departments: 'Idara Zetu',
        mandate: 'Wajibu Wetu'
      },
      
      // Services
      services: {
        title: 'Huduma za Kisheria',
        subtitle: 'Huduma kamili za kisheria kwa raia wote',
        categories: {
          civil: 'Sheria za Kiraia',
          criminal: 'Sheria za Jinai',
          constitutional: 'Sheria za Kikatiba',
          administrative: 'Sheria za Utawala',
          commercial: 'Sheria za Kibiashara',
          family: 'Sheria za Kifamilia'
        }
      },
      
      // Contact
      contact: {
        title: 'Wasiliana Nasi',
        subtitle: 'Ungana na ofisi zetu',
        office: 'Ofisi',
        phone: 'Simu',
        email: 'Barua Pepe',
        address: 'Anwani',
        hours: 'Masaa ya Ofisi',
        directions: 'Pata Mwelekeo',
        form: {
          title: 'Tutumie Ujumbe',
          name: 'Jina Kamili',
          email: 'Anwani ya Barua Pepe',
          subject: 'Mada',
          message: 'Ujumbe',
          send: 'Tuma Ujumbe'
        }
      },
      
      // Language toggle
      language: {
        english: 'Kiingereza',
        swahili: 'Kiswahili',
        current: 'Lugha ya Sasa',
        select: 'Chagua Lugha'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n; 