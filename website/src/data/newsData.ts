/**
 * Static News Data for OAG Web System
 * This file contains all news articles with bilingual content (English and Swahili)
 * for better performance and reliability instead of API calls
 */

export interface NewsArticle {
  id: string;
  slug: string;
  title_en: string;
  title_sw: string;
  excerpt_en: string;
  excerpt_sw: string;
  content_en: string;
  content_sw: string;
  featured_image_url?: string;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  author_id?: string;
  tags: string[];
  category: string;
  created_at: string;
  updated_at: string;
  published_at: string;
}

export const newsArticles: NewsArticle[] = [
  {
    id: '1',
    slug: 'historic-royal-engagement-celebrating-kenyas-legal-excellence',
    title_en: "Historic Royal Engagement Celebrating Kenya's Legal Excellence",
    title_sw: "Mkutano wa Kihistoria wa Kifalme Kusherehekea Ubora wa Kisheria wa Kenya",
    excerpt_en: "Attorney General Hon. Dorcas Oduor today held consultative meetings with His Majesty King Willem-Alexander and Her Majesty Queen Maxima of the Netherlands at the Supreme Court of Kenya during their state visit to Kenya.",
    excerpt_sw: "Mwanasheria Mkuu Mheshimiwa Dorcas Oduor leo ameshika mikutano ya kushauriana na Mfalme Willem-Alexander na Malkia Maxima wa Uholanzi katika Mahakama Kuu ya Kenya wakati wa ziara yao ya kikazi Kenya.",
    content_en: "In a landmark diplomatic engagement, Attorney General Hon. Dorcas Oduor today hosted Their Majesties King Willem-Alexander and Queen Maxima of the Netherlands at the Supreme Court of Kenya. The historic meeting, part of the royal couple's state visit to Kenya, focused on strengthening legal cooperation between Kenya and the Netherlands, particularly in areas of international law, trade regulations, and judicial excellence.\n\nThe Attorney General presented Kenya's significant legal reforms and constitutional developments, highlighting the country's commitment to rule of law and justice for all citizens. The discussions covered various aspects of legal collaboration, including capacity building, knowledge sharing, and best practices in constitutional governance.\n\nDuring the meeting, both parties explored opportunities for enhanced cooperation in legal education, judicial training, and the development of legal frameworks that support economic growth and social justice. The royal visitors expressed admiration for Kenya's legal system and the progressive leadership of the Office of the Attorney General.\n\nThis engagement represents a significant milestone in Kenya-Netherlands relations and underscores the international recognition of Kenya's legal expertise and constitutional governance. The meeting concluded with commitments to establish formal mechanisms for ongoing legal cooperation and knowledge exchange between the two nations.",
    content_sw: "Katika mkutano wa kidiplomasia wa kihistoria, Mwanasheria Mkuu Mheshimiwa Dorcas Oduor leo amewakaribisha Mfalme Willem-Alexander na Malkia Maxima wa Uholanzi katika Mahakama Kuu ya Kenya. Mkutano huu wa kihistoria, ambao ni sehemu ya ziara ya kikazi ya jozi la kifalme Kenya, ulilenga kuimarisha ushirikiano wa kisheria kati ya Kenya na Uholanzi, hasa katika maeneo ya sheria za kimataifa, kanuni za biashara, na ubora wa mahakama.\n\nMwanasheria Mkuu aliwasilisha mageuzi makubwa ya kisheria ya Kenya na maendeleo ya kikatiba, akisisitiza kujitolea kwa nchi katika utawala wa sheria na haki kwa raia wote. Majadiliano yaligusia vipengele mbalimbali vya ushirikiano wa kisheria, ikiwa ni pamoja na kujenga uwezo, kushiriki maarifa, na mbinu bora za utawala wa kikatiba.\n\nWakati wa mkutano, pande zote mbili zilipeleleza fursa za kuimarisha ushirikiano katika elimu ya kisheria, mafunzo ya mahakama, na maendeleo ya miundo ya kisheria inayounga mkono ukuaji wa kiuchumi na haki za kijamii. Wageni wa kifalme walionyesha kuvutiwa na mfumo wa kisheria wa Kenya na uongozi wa maendeleo wa Ofisi ya Mwanasheria Mkuu.\n\nMkutano huu unawakilisha hatua muhimu katika mahusiano ya Kenya-Uholanzi na unasisitiza utambuzi wa kimataifa wa utaalamu wa kisheria wa Kenya na utawala wa kikatiba. Mkutano uliisha kwa ahadi za kuanzisha miundo rasmi ya ushirikiano wa kisheria unaoendelea na kubadilishana maarifa kati ya mataifa hayo mawili.",
    featured_image_url: '/royal-visit.jpg',
    status: 'published',
    is_featured: true,
    tags: ['diplomacy', 'international-relations', 'legal-cooperation', 'royal-visit', 'netherlands'],
    category: 'International Relations',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    published_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    slug: 'attorney-general-advances-constitutional-implementation-framework',
    title_en: "Attorney General Advances Constitutional Implementation Framework",
    title_sw: "Mwanasheria Mkuu Anaendeleza Mfumo wa Utekelezaji wa Kikatiba",
    excerpt_en: "The Office of the Attorney General continues to lead comprehensive constitutional implementation initiatives, ensuring all government institutions align with the 2010 Constitution's provisions and principles.",
    excerpt_sw: "Ofisi ya Mwanasheria Mkuu inaendelea kuongoza mipango ya kina ya utekelezaji wa kikatiba, ikihakikisha taasisi zote za serikali zinafuata masharti na kanuni za Katiba ya 2010.",
    content_en: "The Office of the Attorney General has launched a comprehensive constitutional implementation framework designed to ensure seamless alignment of all government operations with the 2010 Constitution. This initiative includes regular constitutional audits, legal compliance assessments, and institutional capacity building programs.\n\nThe framework emphasizes transparency, accountability, and citizen participation in governance processes, reflecting the constitutional values of democracy and rule of law. Key components include the establishment of constitutional compliance units across government ministries, regular training programs for public officials, and the development of standardized procedures for constitutional interpretation.\n\nAttorney General Hon. Dorcas Oduor emphasized that this framework represents a commitment to ensuring that every government action is grounded in constitutional principles. The initiative also includes public education programs to enhance citizens' understanding of their constitutional rights and responsibilities.\n\nThe implementation framework will be rolled out in phases, with priority given to critical government functions and public service delivery mechanisms. This systematic approach ensures that constitutional governance becomes embedded in all aspects of government operations, strengthening Kenya's democratic institutions and promoting good governance.",
    content_sw: "Ofisi ya Mwanasheria Mkuu imeanzisha mfumo wa kina wa utekelezaji wa kikatiba uliobuniwa kuhakikisha mfumo wa serikali unafuata Katiba ya 2010. Mpango huu unajumuisha ukaguzi wa mara kwa mara wa kikatiba, tathmini za kufuata sheria, na mipango ya kujenga uwezo wa kitaasisi.\n\nMfumo huu unasisitiza uwazi, uwajibikaji, na ushiriki wa raia katika michakato ya utawala, ukionyesha maadili ya kikatiba ya kidemokrasia na utawala wa sheria. Vipengele muhimu ni pamoja na kuanzisha vitengo vya kufuata kikatiba katika wizara za serikali, mipango ya mafunzo ya kawaida kwa maafisa wa umma, na maendeleo ya taratibu za kawaida za kutafsiri kikatiba.\n\nMwanasheria Mkuu Mheshimiwa Dorcas Oduor alisisitiza kuwa mfumo huu unawakilisha kujitolea kuhakikisha kila kitendo cha serikali kinategemea kanuni za kikatiba. Mpango huu pia unajumuisha mipango ya elimu ya umma kuongeza uelewa wa raia wa haki na majukumu yao ya kikatiba.\n\nMfumo wa utekelezaji utatekelezwa kwa awamu, ukitoa kipaumbele kwa kazi muhimu za serikali na miundo ya utoaji wa huduma za umma. Mbinu hii ya mfumo inahakikisha utawala wa kikatiba unajengwa katika vipengele vyote vya utendaji wa serikali, ukiimarisha taasisi za kidemokrasia za Kenya na kukuza utawala mzuri.",
    featured_image_url: '/constitution-framework.jpg',
    status: 'published',
    is_featured: false,
    tags: ['constitution', 'implementation', 'governance', 'legal-framework', 'democracy'],
    category: 'Constitutional Law',
    created_at: '2024-01-14T09:00:00Z',
    updated_at: '2024-01-14T09:00:00Z',
    published_at: '2024-01-14T09:00:00Z'
  },
  {
    id: '3',
    slug: 'legal-education-initiative-empowers-kenyan-citizens',
    title_en: "Legal Education Initiative Empowers Kenyan Citizens",
    title_sw: "Mpango wa Elimu ya Kisheria Unawapa Nguvu Raia wa Kenya",
    excerpt_en: "A new comprehensive legal education program launched by the Attorney General's office aims to enhance citizens' understanding of their rights and the legal system.",
    excerpt_sw: "Mpango mpya wa kina wa elimu ya kisheria ulioanzishwa na ofisi ya Mwanasheria Mkuu unalenga kuongeza uelewa wa raia kuhusu haki zao na mfumo wa kisheria.",
    content_en: "The Office of the Attorney General has unveiled an ambitious legal education initiative designed to empower Kenyan citizens with comprehensive knowledge of their constitutional rights and legal processes. The program includes community workshops, digital resources, multilingual educational materials, and partnerships with educational institutions across the country.\n\nThis initiative represents a significant step toward achieving universal legal literacy and ensuring all Kenyans can effectively access justice and participate in democratic processes. The program covers key areas including constitutional rights, family law, employment rights, property law, and criminal justice procedures.\n\nThe educational materials have been developed in multiple languages to ensure accessibility across Kenya's diverse communities. Interactive workshops will be conducted in all 47 counties, with special emphasis on reaching marginalized communities and rural areas where access to legal information has traditionally been limited.\n\nAttorney General Hon. Dorcas Oduor noted that an informed citizenry is essential for a functioning democracy and effective rule of law. The initiative also includes the development of a comprehensive online platform where citizens can access legal information, download forms, and receive guidance on various legal procedures.",
    content_sw: "Ofisi ya Mwanasheria Mkuu imeanzisha mpango mkubwa wa elimu ya kisheria uliobuniwa kuwapa raia wa Kenya maarifa ya kina kuhusu haki zao za kikatiba na michakato ya kisheria. Mpango huu unajumuisha warsha za kijamii, rasilimali za kidijitali, vifaa vya kielimu vya lugha nyingi, na ushirikiano na taasisi za elimu nchini kote.\n\nMpango huu unawakilisha hatua muhimu katika kufikia ujuzi wa kisheria kwa wote na kuhakikisha Wakenya wote wanaweza kupata haki na kushiriki katika michakato ya kidemokrasia. Mpango unashughulikia maeneo muhimu ikiwa ni pamoja na haki za kikatiba, sheria za kifamilia, haki za ajira, sheria za mali, na taratibu za haki za jinai.\n\nVifaa vya kielimu vimetengenezwa kwa lugha nyingi kuhakikisha upatikanaji katika jamii mbalimbali za Kenya. Warsha za maingiliano zitafanywa katika kaunti zote 47, kwa msisitizo maalum wa kufikia jamii zilizotengwa na maeneo ya vijijini ambapo upatikanaji wa habari za kisheria umekuwa mdogo.\n\nMwanasheria Mkuu Mheshimiwa Dorcas Oduor alisema kuwa raia wenye maarifa ni muhimu kwa demokrasia inayofanya kazi na utawala wa sheria unaofaa. Mpango huu pia unajumuisha maendeleo ya jukwaa la kina la mtandaoni ambapo raia wanaweza kupata habari za kisheria, kupakua fomu, na kupata mwongozo wa taratibu mbalimbali za kisheria.",
    featured_image_url: '/legal-education.jpg',
    status: 'published',
    is_featured: false,
    tags: ['legal-education', 'citizen-empowerment', 'constitutional-rights', 'access-to-justice', 'community-outreach'],
    category: 'Legal Education',
    created_at: '2024-01-13T08:00:00Z',
    updated_at: '2024-01-13T08:00:00Z',
    published_at: '2024-01-13T08:00:00Z'
  },
  {
    id: '4',
    slug: 'digital-transformation-enhances-legal-service-delivery',
    title_en: "Digital Transformation Enhances Legal Service Delivery",
    title_sw: "Mabadiliko ya Kidijitali Yanaboresha Utoaji wa Huduma za Kisheria",
    excerpt_en: "The Attorney General's office introduces cutting-edge digital platforms to streamline legal processes and improve citizen access to justice.",
    excerpt_sw: "Ofisi ya Mwanasheria Mkuu inaanzisha mifumo ya kidijitali ya kisasa kurahisisha michakato ya kisheria na kuboresha upatikanaji wa haki kwa raia.",
    content_en: "The Office of the Attorney General has launched a comprehensive digital transformation initiative aimed at modernizing legal service delivery across Kenya. The new digital platforms include online legal consultation services, digital document processing, and AI-powered legal assistance through the innovative SheriaBot system.\n\nThis technological advancement ensures that all Kenyans, regardless of their location, can access quality legal services and information about their rights and obligations under the law. The digital platform features multilingual support, making legal information accessible in English, Swahili, and other local languages.\n\nKey features of the digital transformation include an online case management system, digital filing of legal documents, virtual court proceedings capabilities, and automated legal form generation. The system also includes robust security measures to protect sensitive legal information and ensure compliance with data protection regulations.\n\nThe initiative represents a significant investment in Kenya's legal infrastructure and demonstrates the government's commitment to leveraging technology for improved public service delivery. Citizens can now access legal services 24/7 through the online platform, significantly reducing barriers to justice and improving efficiency in legal processes.",
    content_sw: "Ofisi ya Mwanasheria Mkuu imeanzisha mpango mkuu wa mabadiliko ya kidijitali unaolenga kumodernisha utoaji wa huduma za kisheria nchini Kenya. Mifumo mpya ya kidijitali inajumuisha huduma za ushauri wa kisheria mtandaoni, uchakataji wa hati za kidijitali, na msaada wa kisheria unaotumia akili bandia kupitia mfumo wa SheriaBot.\n\nMaendeleo haya ya kiteknolojia yanahakikisha kwamba Wakenya wote, bila kujali mahali walipo, wanaweza kupata huduma bora za kisheria na habari kuhusu haki na majukumu yao chini ya sheria. Jukwaa la kidijitali lina uongozi wa lugha nyingi, likifanya habari za kisheria zipatikane kwa Kiingereza, Kiswahili, na lugha nyingine za ndani.\n\nVipengele muhimu vya mabadiliko ya kidijitali ni pamoja na mfumo wa usimamizi wa kesi mtandaoni, kufaili kwa kidijitali kwa hati za kisheria, uwezo wa taratibu za mahakama za kimtandao, na utengenezaji wa fomu za kisheria za kiotomatiki. Mfumo pia unajumuisha hatua kali za usalama kulinda habari nyeti za kisheria na kuhakikisha kufuata kanuni za ulinzi wa data.\n\nMpango huu unawakilisha uongozi mkubwa katika miundombinu ya kisheria ya Kenya na unaonyesha kujitolea kwa serikali kutumia teknolojia kuboresha utoaji wa huduma za umma. Raia sasa wanaweza kupata huduma za kisheria masaa 24/7 kupitia jukwaa la mtandaoni, kupunguza kwa kiasi kikubwa vizuizi vya haki na kuboresha ufanisi katika michakato ya kisheria.",
    featured_image_url: '/digital-transformation.jpg',
    status: 'published',
    is_featured: true,
    tags: ['digital-transformation', 'technology', 'legal-services', 'innovation', 'access-to-justice'],
    category: 'Technology',
    created_at: '2024-01-12T07:00:00Z',
    updated_at: '2024-01-12T07:00:00Z',
    published_at: '2024-01-12T07:00:00Z'
  },
  {
    id: '5',
    slug: 'international-legal-cooperation-strengthens-kenyas-position',
    title_en: "International Legal Cooperation Strengthens Kenya's Position",
    title_sw: "Ushirikiano wa Kisheria wa Kimataifa Unaimarisha Nafasi ya Kenya",
    excerpt_en: "Kenya's Attorney General participates in global legal forums, enhancing the country's influence in international law and diplomacy.",
    excerpt_sw: "Mwanasheria Mkuu wa Kenya anashiriki katika mikutano ya kisheria ya kimataifa, akiongeza ushawishi wa nchi katika sheria za kimataifa na udiplomasia.",
    content_en: "The Office of the Attorney General continues to strengthen Kenya's position in international legal affairs through active participation in global legal forums and bilateral cooperation agreements. Recent engagements include collaboration with international courts, participation in treaty negotiations, and sharing of best practices in constitutional law and human rights protection.\n\nThese efforts position Kenya as a leader in African legal development and contribute to the advancement of international law principles. The Attorney General's office has been instrumental in facilitating Kenya's participation in various international legal initiatives, including climate change litigation, trade law harmonization, and regional integration frameworks.\n\nKenya's expertise in constitutional law and democratic governance has been recognized internationally, with several countries seeking technical assistance and knowledge sharing opportunities. The office has established formal partnerships with legal institutions across Africa, Europe, and other regions to promote legal cooperation and capacity building.\n\nThrough these international engagements, Kenya continues to advocate for fair and equitable international legal frameworks that support developing nations' interests while promoting global justice and rule of law. The initiatives also enhance Kenya's soft power and diplomatic influence on the international stage.",
    content_sw: "Ofisi ya Mwanasheria Mkuu inaendelea kuimarisha nafasi ya Kenya katika mambo ya kisheria ya kimataifa kupitia ushiriki mkamilifu katika mikutano ya kisheria ya kimataifa na makubaliano ya ushirikiano wa kipande mbili. Mahusiano ya hivi karibuni yanajumuisha ushirikiano na mahakama za kimataifa, ushiriki katika mazungumzo ya mikataba, na kushiriki mbinu bora za sheria za kikatiba na ulinzi wa haki za binadamu.\n\nJuhudi hizi zinaiweka Kenya kama kiongozi katika maendeleo ya kisheria ya Afrika na kuchangia maendeleo ya kanuni za sheria za kimataifa. Ofisi ya Mwanasheria Mkuu imekuwa muhimu katika kuwezesha ushiriki wa Kenya katika mipango mbalimbali ya kisheria ya kimataifa, ikiwa ni pamoja na mashtaka ya mabadiliko ya tabianchi, uongozi wa sheria za biashara, na miundo ya ujumuishaji wa kikanda.\n\nUtaalamu wa Kenya katika sheria za kikatiba na utawala wa kidemokrasia umetambuliwa kimataifa, na nchi kadhaa zinatafuta msaada wa kiufundi na fursa za kushiriki maarifa. Ofisi imeanzisha ushirikiano rasmi na taasisi za kisheria katika Afrika, Ulaya, na mikoa mingine kukuza ushirikiano wa kisheria na kujenga uwezo.\n\nKupitia mahusiano haya ya kimataifa, Kenya inaendelea kutetea miundo ya kisheria ya kimataifa ya haki na usawa inayounga mkono maslahi ya mataifa yanayoendelea huku ikikuza haki za kimataifa na utawala wa sheria. Mipango hii pia inaimarisha nguvu laini za Kenya na ushawishi wa kidiplomasia katika jukwaa la kimataifa.",
    featured_image_url: '/international-cooperation.jpg',
    status: 'published',
    is_featured: false,
    tags: ['international-law', 'diplomacy', 'cooperation', 'treaties', 'global-governance'],
    category: 'International Relations',
    created_at: '2024-01-11T06:00:00Z',
    updated_at: '2024-01-11T06:00:00Z',
    published_at: '2024-01-11T06:00:00Z'
  }
];

// Helper functions for news data management
export const getFeaturedNews = (): NewsArticle[] => {
  return newsArticles.filter(article => article.is_featured && article.status === 'published');
};

export const getPublishedNews = (): NewsArticle[] => {
  return newsArticles.filter(article => article.status === 'published');
};

export const getNewsByCategory = (category: string): NewsArticle[] => {
  return newsArticles.filter(article => 
    article.category === category && article.status === 'published'
  );
};

export const getNewsByTag = (tag: string): NewsArticle[] => {
  return newsArticles.filter(article => 
    article.tags.includes(tag) && article.status === 'published'
  );
};

export const searchNews = (query: string): NewsArticle[] => {
  const searchTerm = query.toLowerCase();
  return newsArticles.filter(article => 
    article.status === 'published' && (
      article.title_en.toLowerCase().includes(searchTerm) ||
      article.title_sw.toLowerCase().includes(searchTerm) ||
      article.excerpt_en.toLowerCase().includes(searchTerm) ||
      article.excerpt_sw.toLowerCase().includes(searchTerm) ||
      article.content_en.toLowerCase().includes(searchTerm) ||
      article.content_sw.toLowerCase().includes(searchTerm) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  );
};

export const getNewsById = (id: string): NewsArticle | undefined => {
  return newsArticles.find(article => article.id === id);
};

export const getNewsBySlug = (slug: string): NewsArticle | undefined => {
  return newsArticles.find(article => article.slug === slug);
};

export default newsArticles;
