import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        about: 'About Us',
        departments: 'Departments',
        opportunities: 'Opportunities',
        records: 'Records',
        services: 'Services',
        contact: 'Contact Us',
        search: 'Search...'
      },
      hero: {
        title: 'Office of the Attorney General',
        subtitle: 'Department of Justice',
        slide1: {
          title: 'Office of the Attorney General - Department of Justice'
        },
        slide2: {
          title: 'Legal Excellence',
          subtitle: 'Protecting Constitutional Rights'
        },
        slide3: {
          title: 'Rule of Law',
          subtitle: 'Equal Justice for All'
        },
        slide4: {
          title: 'Judicial Excellence',
          subtitle: 'Upholding Constitutional Values'
        },
        slide5: {
          title: 'Transparent Communication',
          subtitle: 'Engaging with the Public'
        },
        slide6: {
          title: 'Strategic Leadership',
          subtitle: 'Driving Legal Reform'
        }
      },
      features: {
        news: 'Latest News',
        services: 'Our Services',
        contact: 'Contact Us',
        opportunities: 'Opportunities'
      },
      ag: {
        quote: 'Justice must be accessible, transparent, and inclusive — for every Kenyan. We are committed to ensuring that the rule of law serves all citizens equally, regardless of their background or circumstances.',
        name: 'Hon. Dorcas Oduor',
        position: 'Attorney General',
        firstFemale: 'Kenya\'s First Female Attorney General',
        playingAudio: 'Playing audio message...',
        playAudio: 'Click play to listen'
      },
      departments: {
        title: 'Our Departments',
        marriage: 'Marriage Department',
        legal: 'Legal Affairs Department',
        justice: 'Department of Justice',
        admin: 'Administration',
        aid: 'National Legal Aid Service',
        corruption: 'Anti-Corruption Campaign',
        seeAll: 'See All Departments',
        previous: 'Previous department',
        next: 'Next department',
        goTo: 'Go to department {{number}}',
        descriptions: {
          marriage: 'Handling all matters related to marriage registration, divorce proceedings, and family law.',
          legal: 'Providing legal advice, drafting legislation, and representing government interests.',
          justice: 'Ensuring fair administration of justice and upholding the rule of law.',
          admin: 'Managing administrative functions and organizational operations.',
          aid: 'Providing legal aid services to underserved communities across Kenya.',
          corruption: 'Leading efforts to combat corruption and promote transparency in government.'
        }
      },
      updates: {
        title: 'Most Recent Updates',
        subtitle: 'Stay informed with the latest news and developments from the Office of the Attorney General',
        featuredTitle: 'Historic Royal Engagement Celebrating Kenya\'s Legal Excellence',
        featuredExcerpt: 'Attorney General Hon. Dorcas Oduor today held consultative meetings with His Majesty King Willem-Alexander and Her Majesty Queen Maxima of the Netherlands at the Supreme Court of Kenya during their state visit to Kenya.',
        secondTitle: 'Strengthening International Legal Cooperation',
        secondExcerpt: 'The Royal Couple celebrated Kenya\'s remarkable strides in female leadership across the justice sector, recognizing the exceptional growth of women in the legal profession.',
        royalVisit: 'Royal Visit',
        internationalRelations: 'International Relations',
        featured: 'FEATURED',
        update: 'UPDATE',
        readFull: 'Read Full Story',
        checkMore: 'Check Out More News'
      },
      mandate: {
        title: 'Our Mandate',
        subtitle: 'Core functions that define our commitment to justice and the rule of law in Kenya.'
      },
      legal: {
        title: 'Featured Legal Resource'
      },
      rights: {
        title: 'Citizen Legal Rights',
        subtitle: 'Understanding your constitutional rights as guaranteed by the Constitution of Kenya 2010.'
      },
      news: {
        title: 'Latest News & Updates'
      },
      services: {
        title: 'Our Services',
        subtitle: 'Comprehensive legal services to serve the government and people of Kenya with excellence.'
      },
      contact: {
        title: 'Contact Us',
        subtitle: 'Get in touch with the Office of the Attorney General for legal assistance and information.'
      },
      careers: {
        title: 'Career Opportunities',
        apply: 'Apply Now',
        form: {
          name: 'Full Name',
          id: 'ID Number',
          phone: 'Phone Number',
          email: 'Email Address',
          address: 'Address',
          cv: 'Upload CV',
          submit: 'Submit Application'
        }
      },
      complaints: {
        title: 'File a Complaint',
        anonymous: 'Anonymous Complaint',
        contact: 'Contact Me Back',
        form: {
          name: 'Name (Optional)',
          id: 'ID Number',
          email: 'Email/Phone',
          location: 'County',
          complaint: 'Complaint Description',
          attachment: 'Attachment (Optional)',
          submit: 'Submit Complaint'
        }
      },
      bot: {
        title: 'Chat with Sheria Bot',
        greeting: 'Hi, I\'m Sheria, your legal assistant. You can ask me anything about marriage laws in Kenya.',
        placeholder: 'Ask about marriage law...',
        development: 'Our AI is still under development for other legal areas.'
      },
      footer: {
        contact: 'Contact Information',
        social: 'Follow Us',
        legal: 'Legal Disclaimer',
        back: 'Back to Top'
      }
    }
  },
  sw: {
    translation: {
      nav: {
        home: 'Nyumbani',
        about: 'Kuhusu Sisi',
        departments: 'Idara',
        opportunities: 'Fursa',
        records: 'Rekodi',
        services: 'Huduma',
        contact: 'Wasiliana Nasi',
        search: 'Tafuta...'
      },
      hero: {
        title: 'Ofisi ya Mwanasheria Mkuu',
        subtitle: 'Idara ya Haki',
        slide1: {
          title: 'Ofisi ya Mwanasheria Mkuu - Idara ya Haki'
        },
        slide2: {
          title: 'Ubora wa Kisheria',
          subtitle: 'Kulinda Haki za Kikatiba'
        },
        slide3: {
          title: 'Utawala wa Sheria',
          subtitle: 'Haki Sawa kwa Wote'
        },
        slide4: {
          title: 'Ubora wa Mahakama',
          subtitle: 'Kulinda Maadili ya Kikatiba'
        },
        slide5: {
          title: 'Mawasiliano ya Uwazi',
          subtitle: 'Kushirikiana na Umma'
        },
        slide6: {
          title: 'Uongozi wa Kimkakati',
          subtitle: 'Kuongoza Mageuzi ya Kisheria'
        }
      },
      features: {
        news: 'Habari za Hivi Karibuni',
        services: 'Huduma Zetu',
        contact: 'Wasiliana Nasi',
        opportunities: 'Opportunities'
      },
      ag: {
        quote: 'Haki lazima iwe rahisi kupatikana, uwazi, na ijumuishe kila mtu — kwa kila Mkenya. Tumejitolea kuhakikisha kwamba utawala wa sheria unatumikia raia wote kwa usawa, bila kujali asili yao au mazingira yao.',
        name: 'Mhe. Dorcas Oduor',
        position: 'Mwanasheria Mkuu',
        firstFemale: 'Mwanasheria Mkuu wa Ugu Horeysay ee Haweenka ah ee Kenya',
        playingAudio: 'Kucheza ujumbe wa sauti...',
        playAudio: 'Bonyeza kucheza ili kusikiliza'
      },
      departments: {
        title: 'Idara Zetu',
        marriage: 'Idara ya Ndoa',
        legal: 'Idara ya Mambo ya Kisheria',
        justice: 'Idara ya Haki',
        admin: 'Utawala',
        aid: 'Huduma ya Msaada wa Kisheria',
        corruption: 'Kampeni Dhidi ya Rushwa',
        seeAll: 'Ona Idara Zote',
        previous: 'Idara ya awali',
        next: 'Idara inayofuata',
        goTo: 'Nenda idara {{number}}',
        descriptions: {
          marriage: 'Kushughulikia mambo yote yanayohusiana na usajili wa ndoa, michakato ya talaka, na sheria za familia.',
          legal: 'Kutoa ushauri wa kisheria, kuandika sheria, na kuwakilisha maslahi ya serikali.',
          justice: 'Kuhakikisha utawala wa haki kwa uwazi na kulinda utawala wa sheria.',
          admin: 'Kusimamia kazi za utawala na shughuli za shirika.',
          aid: 'Kutoa huduma za msaada wa kisheria kwa jamii zisizopata huduma nchini Kenya.',
          corruption: 'Kuongoza juhudi za kupambana na rushwa na kukuza uwazi serikalini.'
        }
      },
      updates: {
        title: 'Masasisho ya Hivi Karibuni',
        subtitle: 'Jipe habari za hivi punde na maendeleo kutoka Ofisi ya Mwanasheria Mkuu',
        featuredTitle: 'Mkutano wa Kihistoria wa Kifalme Kusherehekea Ubora wa Kisheria wa Kenya',
        featuredExcerpt: 'Mwanasheria Mkuu Mhe. Dorcas Oduor leo amefanya mikutano ya mazungumzo na Mfalme Willem-Alexander na Malkia Maxima wa Uholanzi katika Mahakama Kuu ya Kenya wakati wa ziara yao ya kikazi nchini Kenya.',
        secondTitle: 'Kuimarisha Ushirikiano wa Kisheria wa Kimataifa',
        secondExcerpt: 'Wajumbe wa Kifalme walisherehekea maendeleo makubwa ya Kenya katika uongozi wa kike katika sekta ya haki, wakitambua ukuaji wa kipekee wa wanawake katika taaluma ya sheria.',
        royalVisit: 'Ziara ya Kifalme',
        internationalRelations: 'Mahusiano ya Kimataifa',
        featured: 'MAALUM',
        update: 'SASISHA',
        readFull: 'Soma Hadithi Kamili',
        checkMore: 'Angalia Habari Zaidi'
      },
      mandate: {
        title: 'Wajibu Wetu',
        subtitle: 'Kazi kuu zinazofafanua kujitolea kwetu kwa haki na utawala wa sheria nchini Kenya.'
      },
      legal: {
        title: 'Rasilimali Muhimu ya Kisheria'
      },
      rights: {
        title: 'Haki za Kiraia',
        subtitle: 'Kuelewa haki zako za kikatiba kama zinavyohakikishwa na Katiba ya Kenya 2010.'
      },
      news: {
        title: 'Habari na Masasisho ya Hivi Karibuni'
      },
      services: {
        title: 'Huduma Zetu',
        subtitle: 'Huduma kamili za kisheria kutumikia serikali na wananchi wa Kenya kwa ubora.'
      },
      contact: {
        title: 'Wasiliana Nasi',
        subtitle: 'Wasiliana na Ofisi ya Mwanasheria Mkuu kwa msaada wa kisheria na maelezo.'
      },
      careers: {
        title: 'Fursa za Ajira',
        apply: 'Omba Sasa',
        form: {
          name: 'Jina Kamili',
          id: 'Nambari ya Kitambulisho',
          phone: 'Nambari ya Simu',
          email: 'Barua Pepe',
          address: 'Anwani',
          cv: 'Pakia CV',
          submit: 'Wasilisha Ombi'
        }
      },
      complaints: {
        title: 'Wasilisha Malalamiko',
        anonymous: 'Malalamiko ya Siri',
        contact: 'Nipigie Simu',
        form: {
          name: 'Jina (Si Lazima)',
          id: 'Nambari ya Kitambulisho',
          email: 'Barua Pepe/Simu',
          location: 'Kaunti',
          complaint: 'Maelezo ya Malalamiko',
          attachment: 'Kiambatisho (Si Lazima)',
          submit: 'Wasilisha Malalamiko'
        }
      },
      bot: {
        title: 'Ongea na Sheria Bot',
        greeting: 'Hujambo, mimi ni Sheria, msaidizi wako wa kisheria. Unaweza kuniuliza chochote kuhusu sheria za ndoa nchini Kenya.',
        placeholder: 'Uliza kuhusu sheria za ndoa...',
        development: 'AI yetu bado inaendelezwa kwa maeneo mengine ya kisheria.'
      },
      footer: {
        contact: 'Maelezo ya Mawasiliano',
        social: 'Tufuate',
        legal: 'Kanusho la Kisheria',
        back: 'Rudi Juu'
      }
    }
  },
  fr: {
    translation: {
      nav: {
        home: 'Accueil',
        about: 'À Propos',
        departments: 'Départements',
        opportunities: 'Opportunités',
        records: 'Dossiers',
        services: 'Services',
        contact: 'Contactez-nous',
        search: 'Rechercher...'
      },
      hero: {
        title: 'Bureau du Procureur Général',
        subtitle: 'Département de la Justice',
        slide1: {
          title: 'Bureau du Procureur Général - Département de la Justice'
        },
        slide2: {
          title: 'Excellence Juridique',
          subtitle: 'Protection des Droits Constitutionnels'
        },
        slide3: {
          title: 'État de Droit',
          subtitle: 'Justice Égale pour Tous'
        },
        slide4: {
          title: 'Excellence Judiciaire',
          subtitle: 'Défense des Valeurs Constitutionnelles'
        },
        slide5: {
          title: 'Communication Transparente',
          subtitle: 'Engagement avec le Public'
        },
        slide6: {
          title: 'Leadership Stratégique',
          subtitle: 'Conduire la Réforme Juridique'
        }
      },
      features: {
        news: 'Dernières Nouvelles',
        services: 'Nos Services',
        contact: 'Contactez-nous',
        opportunities: 'Opportunités'
      },
      ag: {
        quote: 'La justice doit être accessible, transparente et inclusive — pour chaque Kenyan. Nous nous engageons à garantir que l\'état de droit serve tous les citoyens de manière égale.',
        name: 'Hon. Dorcas Oduor',
        position: 'Procureur Général',
        firstFemale: 'Première Femme Procureur Général du Kenya',
        playingAudio: 'Lecture du message audio...',
        playAudio: 'Cliquez pour écouter'
      },
      departments: {
        title: 'Nos Départements',
        marriage: 'Département du Mariage',
        legal: 'Département des Affaires Juridiques',
        justice: 'Département de la Justice',
        admin: 'Administration',
        aid: 'Service National d\'Aide Juridique',
        corruption: 'Campagne Anti-Corruption',
        seeAll: 'Voir Tous les Départements',
        previous: 'Département précédent',
        next: 'Département suivant',
        goTo: 'Aller au département {{number}}',
        descriptions: {
          marriage: 'Gestion de toutes les questions liées à l\'enregistrement des mariages, aux procédures de divorce et au droit de la famille.',
          legal: 'Fournir des conseils juridiques, rédiger des lois et représenter les intérêts du gouvernement.',
          justice: 'Assurer une administration équitable de la justice et maintenir l\'état de droit.',
          admin: 'Gestion des fonctions administratives et des opérations organisationnelles.',
          aid: 'Fournir des services d\'aide juridique aux communautés mal desservies à travers le Kenya.',
          corruption: 'Diriger les efforts de lutte contre la corruption et promouvoir la transparence gouvernementale.'
        }
      },
      updates: {
        title: 'Mises à Jour Récentes',
        subtitle: 'Restez informé des dernières nouvelles et développements du Bureau du Procureur Général',
        featuredTitle: 'Engagement Royal Historique Célébrant l\'Excellence Juridique du Kenya',
        featuredExcerpt: 'Le Procureur Général Hon. Dorcas Oduor a tenu aujourd\'hui des réunions consultatives avec Sa Majesté le Roi Willem-Alexander et Sa Majesté la Reine Maxima des Pays-Bas à la Cour Suprême du Kenya lors de leur visite d\'État au Kenya.',
        secondTitle: 'Renforcement de la Coopération Juridique Internationale',
        secondExcerpt: 'Le Couple Royal a célébré les progrès remarquables du Kenya dans le leadership féminin dans le secteur de la justice, reconnaissant la croissance exceptionnelle des femmes dans la profession juridique.',
        royalVisit: 'Visite Royale',
        internationalRelations: 'Relations Internationales',
        featured: 'EN VEDETTE',
        update: 'MISE À JOUR',
        readFull: 'Lire l\'Histoire Complète',
        checkMore: 'Découvrir Plus d\'Actualités'
      },
      mandate: {
        title: 'Notre Mandat',
        subtitle: 'Fonctions principales qui définissent notre engagement envers la justice et l\'état de droit au Kenya.'
      },
      legal: {
        title: 'Ressource Juridique en Vedette'
      },
      rights: {
        title: 'Droits Juridiques des Citoyens',
        subtitle: 'Comprendre vos droits constitutionnels garantis par la Constitution du Kenya 2010.'
      },
      news: {
        title: 'Dernières Nouvelles et Mises à Jour'
      },
      services: {
        title: 'Nos Services',
        subtitle: 'Services juridiques complets pour servir le gouvernement et le peuple du Kenya avec excellence.'
      },
      contact: {
        title: 'Contactez-nous',
        subtitle: 'Contactez le Bureau du Procureur Général pour une assistance juridique et des informations.'
      },
      careers: {
        title: 'Opportunités de Carrière',
        apply: 'Postuler Maintenant',
        form: {
          name: 'Nom Complet',
          id: 'Numéro d\'Identité',
          phone: 'Numéro de Téléphone',
          email: 'Adresse Email',
          address: 'Adresse',
          cv: 'Télécharger CV',
          submit: 'Soumettre la Candidature'
        }
      },
      complaints: {
        title: 'Déposer une Plainte',
        anonymous: 'Plainte Anonyme',
        contact: 'Me Recontacter',
        form: {
          name: 'Nom (Optionnel)',
          id: 'Numéro d\'Identité',
          email: 'Email/Téléphone',
          location: 'Comté',
          complaint: 'Description de la Plainte',
          attachment: 'Pièce Jointe (Optionnel)',
          submit: 'Soumettre la Plainte'
        }
      },
      bot: {
        title: 'Discuter avec Sheria Bot',
        greeting: 'Salut, je suis Sheria, votre assistant juridique. Vous pouvez me poser des questions sur les lois du mariage au Kenya.',
        placeholder: 'Demander sur le droit du mariage...',
        development: 'Notre IA est encore en développement pour d\'autres domaines juridiques.'
      },
      footer: {
        contact: 'Informations de Contact',
        social: 'Suivez-nous',
        legal: 'Avis Légal',
        back: 'Retour en Haut'
      }
    }
  },
  zh: {
    translation: {
      nav: {
        home: '首页',
        about: '关于我们',
        departments: '部门',
        opportunities: '机会',
        records: '记录',
        services: '服务',
        contact: '联系我们',
        search: '搜索...'
      },
      hero: {
        title: '总检察长办公室',
        subtitle: '司法部',
        slide1: {
          title: '总检察长办公室 - 司法部'
        },
        slide2: {
          title: '法律卓越',
          subtitle: '保护宪法权利'
        },
        slide3: {
          title: '法治',
          subtitle: '人人享有平等正义'
        },
        slide4: {
          title: '司法卓越',
          subtitle: '维护宪法价值'
        },
        slide5: {
          title: '透明沟通',
          subtitle: '与公众互动'
        },
        slide6: {
          title: '战略领导',
          subtitle: '推动法律改革'
        }
      },
      features: {
        news: '最新新闻',
        services: '我们的服务',
        contact: '联系我们',
        opportunities: '机会'
      },
      ag: {
        quote: '司法必须是可及的、透明的和包容的——为每一个肯尼亚人。我们致力于确保法治平等地为所有公民服务。',
        name: '尊敬的多卡斯·奥杜尔',
        position: '总检察长',
        firstFemale: '肯尼亚首位女性总检察长',
        playingAudio: '正在播放音频消息...',
        playAudio: '点击播放收听'
      },
      departments: {
        title: '我们的部门',
        marriage: '婚姻部',
        legal: '法律事务部',
        justice: '司法部',
        admin: '行政部',
        aid: '国家法律援助服务',
        corruption: '反腐败运动',
        seeAll: '查看所有部门',
        previous: '上一个部门',
        next: '下一个部门',
        goTo: '转到部门{{number}}',
        descriptions: {
          marriage: '处理与婚姻登记、离婚程序和家庭法相关的所有事务。',
          legal: '提供法律建议、起草立法并代表政府利益。',
          justice: '确保公正的司法管理并维护法治。',
          admin: '管理行政职能和组织运营。',
          aid: '为肯尼亚服务不足的社区提供法律援助服务。',
          corruption: '领导反腐败努力并促进政府透明度。'
        }
      },
      updates: {
        title: '最新更新',
        subtitle: '了解总检察长办公室的最新新闻和发展',
        featuredTitle: '庆祝肯尼亚法律卓越的历史性皇家接触',
        featuredExcerpt: '总检察长多卡斯·奥杜尔今天在荷兰国王威廉-亚历山大陛下和马克西玛王后陛下对肯尼亚进行国事访问期间，在肯尼亚最高法院与他们举行了咨询会议。',
        secondTitle: '加强国际法律合作',
        secondExcerpt: '皇室夫妇庆祝了肯尼亚在司法部门女性领导力方面取得的显著进步，认可了女性在法律职业中的卓越成长。',
        royalVisit: '皇室访问',
        internationalRelations: '国际关系',
        featured: '特色',
        update: '更新',
        readFull: '阅读完整故事',
        checkMore: '查看更多新闻'
      },
      mandate: {
        title: '我们的使命',
        subtitle: '定义我们对肯尼亚司法和法治承诺的核心职能。'
      },
      legal: {
        title: '特色法律资源'
      },
      rights: {
        title: '公民法律权利',
        subtitle: '了解2010年肯尼亚宪法保障的宪法权利。'
      },
      news: {
        title: '最新新闻和更新'
      },
      services: {
        title: '我们的服务',
        subtitle: '为政府和肯尼亚人民提供卓越的综合法律服务。'
      },
      contact: {
        title: '联系我们',
        subtitle: '联系总检察长办公室获取法律援助和信息。'
      },
      careers: {
        title: '职业机会',
        apply: '立即申请',
        form: {
          name: '全名',
          id: '身份证号',
          phone: '电话号码',
          email: '电子邮件地址',
          address: '地址',
          cv: '上传简历',
          submit: '提交申请'
        }
      },
      complaints: {
        title: '提交投诉',
        anonymous: '匿名投诉',
        contact: '回电给我',
        form: {
          name: '姓名（可选）',
          id: '身份证号',
          email: '电子邮件/电话',
          location: '县',
          complaint: '投诉描述',
          attachment: '附件（可选）',
          submit: '提交投诉'
        }
      },
      bot: {
        title: '与Sheria机器人聊天',
        greeting: '你好，我是Sheria，你的法律助手。你可以问我关于肯尼亚婚姻法的任何问题。',
        placeholder: '询问婚姻法...',
        development: '我们的AI仍在为其他法律领域开发中。'
      },
      footer: {
        contact: '联系信息',
        social: '关注我们',
        legal: '法律声明',
        back: '返回顶部'
      }
    }
  },
  de: {
    translation: {
      nav: {
        home: 'Startseite',
        about: 'Über uns',
        departments: 'Abteilungen',
        opportunities: 'Möglichkeiten',
        records: 'Aufzeichnungen',
        services: 'Dienstleistungen',
        contact: 'Kontakt',
        search: 'Suchen...'
      },
      hero: {
        title: 'Büro des Generalstaatsanwalts',
        subtitle: 'Justizministerium',
        slide1: {
          title: 'Büro des Generalstaatsanwalts - Justizministerium'
        },
        slide2: {
          title: 'Rechtliche Exzellenz',
          subtitle: 'Schutz der Verfassungsrechte'
        },
        slide3: {
          title: 'Rechtsstaatlichkeit',
          subtitle: 'Gleiche Gerechtigkeit für Alle'
        },
        slide4: {
          title: 'Justizielle Exzellenz',
          subtitle: 'Wahrung der Verfassungswerte'
        },
        slide5: {
          title: 'Transparente Kommunikation',
          subtitle: 'Engagement mit der Öffentlichkeit'
        },
        slide6: {
          title: 'Strategische Führung',
          subtitle: 'Rechtsreform vorantreiben'
        }
      },
      features: {
        news: 'Neueste Nachrichten',
        services: 'Unsere Dienstleistungen',
        contact: 'Kontakt',
        opportunities: 'Möglichkeiten'
      },
      ag: {
        quote: 'Gerechtigkeit muss zugänglich, transparent und inklusiv sein — für jeden Kenianer. Wir verpflichten uns, sicherzustellen, dass die Rechtsstaatlichkeit allen Bürgern gleichermaßen dient.',
        name: 'Hon. Dorcas Oduor',
        position: 'Generalstaatsanwältin',
        firstFemale: 'Kenias erste weibliche Generalstaatsanwältin',
        playingAudio: 'Audio-Nachricht wird abgespielt...',
        playAudio: 'Zum Anhören klicken'
      },
      departments: {
        title: 'Unsere Abteilungen',
        marriage: 'Ehenabteilung',
        legal: 'Rechtsabteilung',
        justice: 'Justizabteilung',
        admin: 'Verwaltung',
        aid: 'Nationaler Rechtshilfedienst',
        corruption: 'Anti-Korruptions-Kampagne',
        seeAll: 'Alle Abteilungen anzeigen',
        previous: 'Vorherige Abteilung',
        next: 'Nächste Abteilung',
        goTo: 'Zu Abteilung {{number}} gehen',
        descriptions: {
          marriage: 'Bearbeitung aller Angelegenheiten im Zusammenhang mit Eheschließung, Scheidungsverfahren und Familienrecht.',
          legal: 'Rechtsberatung, Gesetzesentwürfe und Vertretung von Regierungsinteressen.',
          justice: 'Gewährleistung einer fairen Rechtsprechung und Wahrung der Rechtsstaatlichkeit.',
          admin: 'Verwaltung von Verwaltungsfunktionen und organisatorischen Abläufen.',
          aid: 'Bereitstellung von Rechtshilfediensten für unterversorgte Gemeinden in ganz Kenia.',
          corruption: 'Führung der Bemühungen zur Korruptionsbekämpfung und Förderung der Regierungstransparenz.'
        }
      },
      updates: {
        title: 'Neueste Updates',
        subtitle: 'Bleiben Sie über die neuesten Nachrichten und Entwicklungen aus dem Büro des Generalstaatsanwalts informiert',
        featuredTitle: 'Historisches königliches Engagement zur Feier von Kenias rechtlicher Exzellenz',
        featuredExcerpt: 'Generalstaatsanwältin Hon. Dorcas Oduor führte heute Beratungsgespräche mit Seiner Majestät König Willem-Alexander und Ihrer Majestät Königin Maxima der Niederlande am Obersten Gerichtshof Kenias während ihres Staatsbesuchs in Kenia.',
        secondTitle: 'Stärkung der internationalen rechtlichen Zusammenarbeit',
        secondExcerpt: 'Das königliche Paar feierte Kenias bemerkenswerte Fortschritte bei der weiblichen Führung im Justizsektor und würdigte das außergewöhnliche Wachstum von Frauen im Rechtsberuf.',
        royalVisit: 'Königlicher Besuch',
        internationalRelations: 'Internationale Beziehungen',
        featured: 'FEATURED',
        update: 'UPDATE',
        readFull: 'Vollständige Geschichte lesen',
        checkMore: 'Mehr Nachrichten entdecken'
      },
      mandate: {
        title: 'Unser Mandat',
        subtitle: 'Kernfunktionen, die unser Engagement für Gerechtigkeit und Rechtsstaatlichkeit in Kenia definieren.'
      },
      legal: {
        title: 'Ausgewählte Rechtsressource'
      },
      rights: {
        title: 'Bürgerrechte',
        subtitle: 'Verstehen Sie Ihre verfassungsmäßigen Rechte, wie sie in der Verfassung Kenias 2010 garantiert sind.'
      },
      news: {
        title: 'Neueste Nachrichten und Updates'
      },
      services: {
        title: 'Unsere Dienstleistungen',
        subtitle: 'Umfassende Rechtsdienstleistungen für die Regierung und das Volk Kenias mit Exzellenz.'
      },
      contact: {
        title: 'Kontakt',
        subtitle: 'Kontaktieren Sie das Büro des Generalstaatsanwalts für Rechtshilfe und Informationen.'
      },
      careers: {
        title: 'Karrieremöglichkeiten',
        apply: 'Jetzt bewerben',
        form: {
          name: 'Vollständiger Name',
          id: 'Ausweisnummer',
          phone: 'Telefonnummer',
          email: 'E-Mail-Adresse',
          address: 'Adresse',
          cv: 'Lebenslauf hochladen',
          submit: 'Bewerbung einreichen'
        }
      },
      complaints: {
        title: 'Beschwerde einreichen',
        anonymous: 'Anonyme Beschwerde',
        contact: 'Rückruf anfordern',
        form: {
          name: 'Name (Optional)',
          id: 'Ausweisnummer',
          email: 'E-Mail/Telefon',
          location: 'Bezirk',
          complaint: 'Beschwerdebeschreibung',
          attachment: 'Anhang (Optional)',
          submit: 'Beschwerde einreichen'
        }
      },
      bot: {
        title: 'Chat mit Sheria Bot',
        greeting: 'Hallo, ich bin Sheria, Ihr Rechtsassistent. Sie können mich alles über Ehegesetze in Kenia fragen.',
        placeholder: 'Fragen zum Eherecht...',
        development: 'Unsere KI wird noch für andere Rechtsbereiche entwickelt.'
      },
      footer: {
        contact: 'Kontaktinformationen',
        social: 'Folgen Sie uns',
        legal: 'Rechtlicher Hinweis',
        back: 'Nach oben'
      }
    }
  },
  so: {
    translation: {
      nav: {
        home: 'Guriga',
        about: 'Naga',
        departments: 'Waaxaha',
        opportunities: 'Fursa',
        records: 'Rekodi',
        services: 'Adeegga',
        contact: 'Nala Soo Xiriir',
        search: 'Raadi...'
      },
      hero: {
        title: 'Xafiiska Xeer-ilaaliyaha Guud',
        subtitle: 'Waaxda Caddaaladda',
        slide1: {
          title: 'Xafiiska Xeer-ilaaliyaha Guud - Waaxda Caddaaladda'
        },
        slide2: {
          title: 'Heerka Sare ee Sharciga',
          subtitle: 'Ilaalinta Xuquuqda Dastuuriga'
        },
        slide3: {
          title: 'Xukuumadda Sharciga',
          subtitle: 'Caddaalad Siman oo Dhan'
        },
        slide4: {
          title: 'Heerka Sare ee Garsoorka',
          subtitle: 'Ilaalinta Qiyamka Dastuuriga'
        },
        slide5: {
          title: 'Isgaarsiinta Hufan',
          subtitle: 'La-shaqaynta Dadweynaha'
        },
        slide6: {
          title: 'Hogaaminta Istaraatiijiga ah',
          subtitle: 'Hoggaaminta Dib-u-habaynta Sharciga'
        }
      },
      features: {
        news: 'Wararka Ugu Dambeeyay',
        services: 'Adeegyadayada',
        contact: 'Nala Soo Xiriir',
        opportunities: 'Opportunities'
      },
      ag: {
        quote: 'Caddaaladdu waa inay noqotaa mid la gaari karo, hufan, oo dhammaystiran — qof kasta oo Kenyan ah. Waxaan ku dadaalnaa in aan hubinno in sharciga u adeego dhammaan muwaadiniinta si siman.',
        name: 'Mudane. Dorcas Oduor',
        position: 'Xeer-ilaaliyaha Guud',
        firstFemale: 'Xeer-ilaaliyaha Guud ee Ugu Horeysay ee Haweenka ah ee Kenya',
        playingAudio: 'Ciyaarista fariinta codka...',
        playAudio: 'Riix si aad u dhageysato'
      },
      departments: {
        title: 'Waaxyadayada',
        marriage: 'Waaxda Guurka',
        legal: 'Waaxda Arrimaha Sharciga',
        justice: 'Waaxda Caddaaladda',
        admin: 'Maamulka',
        aid: 'Adeegga Caawinta Sharciga ee Qaranka',
        corruption: 'Ololeynta Ka-hortagga Musuqmaasuqa',
        seeAll: 'Arag Dhammaan Waaxaha',
        previous: 'Waaxda hore',
        next: 'Waaxda xigta',
        goTo: 'Tag waaxda {{number}}',
        descriptions: {
          marriage: 'Maaraynta dhammaan arrimaha la xiriira diiwaangelinta guurka, habdhaqannada furriinka, iyo sharciga qoyska.',
          legal: 'Bixinta talo sharci, qorista sharci, iyo matalaadda danaha dawladda.',
          justice: 'Hubinta maamulka cadaalad ee daacadnimada leh iyo ilaalinta sharciga.',
          admin: 'Maaraynta hawlaha maamulka iyo hawlgallada ururka.',
          aid: 'Bixinta adeegyada caawinta sharciga bulshada aan adeeg helin ee dalka Kenya.',
          corruption: 'Hogaaminta dadaallada ka-hortagga musuqmaasuqa iyo horumarinta hufnaanta dawladda.'
        }
      },
      updates: {
        title: 'Cusboonaysiinta Ugu Dambeeyay',
        subtitle: 'Sii socda wararka iyo horumarrada ugu dambeeyay ee Xafiiska Xeer-ilaaliyaha Guud',
        featuredTitle: 'Kulanka Taariikhiga ah ee Boqortooyada oo Dabbaaldegaya Heerka Sare ee Sharciga Kenya',
        featuredExcerpt: 'Xeer-ilaaliyaha Guud Mudane. Dorcas Oduor ayaa maanta la yeeshay kulamo la tashi ah Boqorka Willem-Alexander iyo Boqoradda Maxima ee Netherlands ee Maxkamadda Sare ee Kenya inta lugu jiro booqashadooda rasmi ah ee Kenya.',
        secondTitle: 'Xoojinta Iskaashiga Sharciga ee Caalamiga ah',
        secondExcerpt: 'Lammaanaha Boqortooyada ayaa dabbaaldegay horumarrada cajiibka ah ee Kenya ee hogaamintooyada haweenka ee qaybta caddaaladda, iyagoo aqoonsaday kobaca gaar ah ee haweenka xirfadda sharciga.',
        royalVisit: 'Booqashada Boqortooyada',
        internationalRelations: 'Xiriirka Caalamiga ah',
        featured: 'MUUQAAL',
        update: 'CUSBOONAYSIIN',
        readFull: 'Akhri Sheekada Buuxa',
        checkMore: 'Eeg Warar Dheeraad ah'
      },
      mandate: {
        title: 'Hawlahayaga',
        subtitle: 'Hawlaha muhiimka ah ee qeexaya ballanqaadkayaga caddaaladda iyo sharciga dalka Kenya.'
      },
      legal: {
        title: 'Kheyraadka Sharciga ee Muuqda'
      },
      rights: {
        title: 'Xuquuqda Sharciga ee Muwaadiniinta',
        subtitle: 'Fahamka xuquuqdaada dastuuriga ah sida ay ku xaqiijisan yihiin Dastuurka Kenya 2010.'
      },
      news: {
        title: 'Wararka iyo Cusboonaysiinta Ugu Dambeeyay'
      },
      services: {
        title: 'Adeegyadayada',
        subtitle: 'Adeegyo sharci oo dhamaystiran si aan ugu adeegno dawladda iyo dadka Kenya si heer sare ah.'
      },
      contact: {
        title: 'Nala Soo Xiriir',
        subtitle: 'La xiriir Xafiiska Xeer-ilaaliyaha Guud caawinta sharciga iyo macluumaadka.'
      },
      careers: {
        title: 'Fursadaha Shaqada',
        apply: 'Hadda Codsii',
        form: {
          name: 'Magaca Buuxa',
          id: 'Lambarka Aqoonsiga',
          phone: 'Lambarka Telefoonka',
          email: 'Ciwaanka Iimaylka',
          address: 'Ciwaanka',
          cv: 'Soo Geli CV',
          submit: 'Gudbi Codsiga'
        }
      },
      complaints: {
        title: 'Gudbi Cabashada',
        anonymous: 'Cabashada Qarsoodi ah',
        contact: 'Dib ii Soo Wac',
        form: {
          name: 'Magaca (Ikhtiyaari)',
          id: 'Lambarka Aqoonsiga',
          email: 'Iimaylka/Telefoonka',
          location: 'Gobolka',
          complaint: 'Sharaxaada Cabashada',
          attachment: 'Lifaaq (Ikhtiyaari)',
          submit: 'Gudbi Cabashada'
        }
      },
      bot: {
        title: 'La Hadal Sheria Bot',
        greeting: 'Salaan, waxaan ahay Sheria, kaaliyahaaga sharciga. Waxaad i weydiin kartaa wax kasta oo ku saabsan sharciyada guurka Kenya.',
        placeholder: 'Weydiiso sharciga guurka...',
        development: 'AI-gayagu weli waa la horumarinayaa meelaha kale ee sharciga.'
      },
      footer: {
        contact: 'Macluumaadka Xiriirka',
        social: 'Na Raac',
        legal: 'Digniin Sharci',
        back: 'Dib u Noqo Kore'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;