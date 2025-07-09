-- =====================================================
-- OAG WEB SYSTEM - QUICK DATABASE SETUP
-- =====================================================
-- Execute this in your Supabase SQL Editor to create essential tables

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ENUMS
-- =====================================================

-- News status enum
CREATE TYPE news_status AS ENUM ('draft', 'published', 'archived');

-- Complaint status enum  
CREATE TYPE complaint_status AS ENUM ('pending', 'under_review', 'resolved', 'closed');

-- Complaint priority enum
CREATE TYPE complaint_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- User roles enum
CREATE TYPE user_role AS ENUM ('attorney_general', 'head_of_communications', 'complaint_handler');

-- =====================================================
-- CORE TABLES
-- =====================================================

-- News articles table
CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en VARCHAR(255) NOT NULL,
    title_sw VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt_en TEXT,
    excerpt_sw TEXT,
    content_en TEXT NOT NULL,
    content_sw TEXT NOT NULL,
    featured_image_url TEXT,
    status news_status DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT false,
    author_id UUID,
    tags TEXT[],
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Complaints table
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    id_number VARCHAR(20),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    county VARCHAR(100) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    complaint TEXT NOT NULL,
    status complaint_status DEFAULT 'pending',
    priority complaint_priority DEFAULT 'medium',
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hero sections table
CREATE TABLE hero_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en VARCHAR(255) NOT NULL,
    title_sw VARCHAR(255) NOT NULL,
    subtitle_en TEXT,
    subtitle_sw TEXT,
    description_en TEXT,
    description_sw TEXT,
    background_image_url TEXT,
    call_to_action_text_en VARCHAR(100),
    call_to_action_text_sw VARCHAR(100),
    call_to_action_url TEXT,
    is_active BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Careers table
CREATE TABLE careers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en VARCHAR(255) NOT NULL,
    title_sw VARCHAR(255) NOT NULL,
    department_en VARCHAR(255) NOT NULL,
    department_sw VARCHAR(255) NOT NULL,
    description_en TEXT NOT NULL,
    description_sw TEXT NOT NULL,
    requirements_en TEXT[],
    requirements_sw TEXT[],
    responsibilities_en TEXT[],
    responsibilities_sw TEXT[],
    salary_range VARCHAR(100),
    application_deadline DATE,
    job_type VARCHAR(50) DEFAULT 'full-time',
    location_en VARCHAR(255),
    location_sw VARCHAR(255),
    pdf_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attorney General history table
CREATE TABLE attorney_general_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_sw VARCHAR(255) NOT NULL,
    bio_en TEXT NOT NULL,
    bio_sw TEXT NOT NULL,
    start_year INTEGER NOT NULL,
    end_year INTEGER,
    is_current BOOLEAN DEFAULT false,
    photo_url TEXT,
    achievements_en TEXT[],
    achievements_sw TEXT[],
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY,
    full_name TEXT NOT NULL,
    role user_role NOT NULL,
    department TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_news_articles_status ON news_articles(status);
CREATE INDEX idx_news_articles_published ON news_articles(status, published_at DESC) WHERE status = 'published';
CREATE INDEX idx_news_articles_featured ON news_articles(is_featured, published_at DESC) WHERE is_featured = true;
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_ticket ON complaints(ticket_id);
CREATE INDEX idx_hero_sections_active ON hero_sections(is_active);
CREATE INDEX idx_careers_active ON careers(is_active);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE attorney_general_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view published news" ON news_articles FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view active hero sections" ON hero_sections FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view AG history" ON attorney_general_history FOR SELECT USING (true);
CREATE POLICY "Public can view active careers" ON careers FOR SELECT USING (is_active = true);

-- Public insert policies
CREATE POLICY "Public can submit complaints" ON complaints FOR INSERT WITH CHECK (true);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample hero section
INSERT INTO hero_sections (
    title_en, title_sw, subtitle_en, subtitle_sw, description_en, description_sw,
    call_to_action_text_en, call_to_action_text_sw, call_to_action_url, is_active, display_order
) VALUES (
    'Office of the Attorney General',
    'Ofisi ya Mwanasheria Mkuu',
    'Upholding Justice and Rule of Law',
    'Kulinda Haki na Utawala wa Sheria',
    'Committed to ensuring equal access to justice for all Kenyans and upholding the constitutional principles that guide our nation.',
    'Tumejitolea kuhakikisha ufikiaji sawa wa haki kwa Wakenya wote na kulinda kanuni za kikatiba zinazongoza taifa letu.',
    'Learn More',
    'Jifunze Zaidi',
    '/about',
    true,
    1
);

-- Insert sample news articles
INSERT INTO news_articles (
    title_en, title_sw, slug, excerpt_en, excerpt_sw, content_en, content_sw,
    status, is_featured, tags, published_at
) VALUES
(
    'Attorney General Launches New Legal Aid Initiative',
    'Mwanasheria Mkuu Azindua Mpango Mpya wa Msaada wa Kisheria',
    'ag-launches-legal-aid-initiative',
    'The Attorney General has announced a comprehensive legal aid program to improve access to justice for all Kenyans.',
    'Mwanasheria Mkuu ametangaza mpango mkuu wa msaada wa kisheria kuboresha ufikiaji wa haki kwa Wakenya wote.',
    'The Office of the Attorney General today launched a groundbreaking legal aid initiative aimed at ensuring equal access to justice for all Kenyans, regardless of their economic status.',
    'Ofisi ya Mwanasheria Mkuu leo imeanzisha mpango wa kipekee wa msaada wa kisheria unaolenga kuhakikisha ufikiaji sawa wa haki kwa Wakenya wote.',
    'published',
    true,
    ARRAY['legal aid', 'justice', 'access'],
    NOW() - INTERVAL '2 days'
),
(
    'Constitutional Review Process Update',
    'Sasisho la Mchakato wa Mapitio ya Katiba',
    'constitutional-review-update',
    'Latest developments in the ongoing constitutional review process and public participation opportunities.',
    'Maendeleo ya hivi karibuni katika mchakato unaoendelea wa mapitio ya katiba na fursa za ushiriki wa umma.',
    'The constitutional review process continues to make significant progress with extensive public consultations being conducted across all 47 counties.',
    'Mchakato wa mapitio ya katiba unaendelea kufanya maendeleo makubwa huku mashauriano makuu ya umma yakifanywa katika kaunti zote 47.',
    'published',
    false,
    ARRAY['constitution', 'review', 'public participation'],
    NOW() - INTERVAL '1 week'
);

-- Insert sample AG history
INSERT INTO attorney_general_history (
    full_name, title_en, title_sw, bio_en, bio_sw, start_year, is_current, 
    achievements_en, achievements_sw, order_index
) VALUES (
    'Hon. Justin Muturi',
    'Attorney General',
    'Mwanasheria Mkuu',
    'Hon. Justin Muturi serves as the Attorney General of Kenya, bringing extensive legal expertise and leadership to the office.',
    'Mhe. Justin Muturi anatumikia kama Mwanasheria Mkuu wa Kenya, akileta utaalamu mkuu wa kisheria na uongozi katika ofisi hii.',
    2022,
    true,
    ARRAY['Constitutional law expert', 'Former Speaker of National Assembly', 'Legal reform champion'],
    ARRAY['Mtaalamu wa sheria ya katiba', 'Spika wa zamani wa Bunge la Kitaifa', 'Mtetezi wa mageuzi ya kisheria'],
    1
);

-- Insert sample career
INSERT INTO careers (
    title_en, title_sw, department_en, department_sw, description_en, description_sw,
    requirements_en, requirements_sw, responsibilities_en, responsibilities_sw,
    salary_range, application_deadline, location_en, location_sw, is_active
) VALUES (
    'Senior Legal Officer',
    'Afisa Mkuu wa Kisheria',
    'Legal Affairs Department',
    'Idara ya Mambo ya Kisheria',
    'We are seeking a qualified Senior Legal Officer to join our legal team.',
    'Tunatafuta Afisa Mkuu wa Kisheria mwenye sifa za kutosha kujiunga na timu yetu ya kisheria.',
    ARRAY['Bachelor of Laws (LLB) degree', 'Admission to the Kenya Bar', 'Minimum 5 years legal experience'],
    ARRAY['Shahada ya Kwanza ya Sheria (LLB)', 'Kukubaliwa katika Baa ya Kenya', 'Uzoefu wa kisheria wa miaka 5 au zaidi'],
    ARRAY['Provide legal advice and opinions', 'Draft legal documents and contracts', 'Represent the office in legal proceedings'],
    ARRAY['Kutoa ushauri na maoni ya kisheria', 'Kuandika hati za kisheria na mikataba', 'Kuwakilisha ofisi katika kesi za kisheria'],
    'KES 80,000 - 120,000',
    '2025-02-28',
    'Nairobi, Kenya',
    'Nairobi, Kenya',
    true
);
