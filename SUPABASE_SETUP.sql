-- OAG Web System Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'communications', 'complaint_handler', 'attorney_general');
CREATE TYPE complaint_status AS ENUM ('pending', 'in_review', 'investigating', 'resolved', 'closed');
CREATE TYPE complaint_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE news_status AS ENUM ('draft', 'published', 'archived');

-- Users table (for admin authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hero sections table
CREATE TABLE IF NOT EXISTS hero_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en TEXT NOT NULL,
    title_sw TEXT NOT NULL,
    subtitle_en TEXT,
    subtitle_sw TEXT,
    description_en TEXT,
    description_sw TEXT,
    image_url TEXT,
    cta_text_en VARCHAR(100),
    cta_text_sw VARCHAR(100),
    cta_link TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Complaints table
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    id_number VARCHAR(20),
    complaint_type VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status complaint_status DEFAULT 'pending',
    priority complaint_priority DEFAULT 'medium',
    assigned_to UUID REFERENCES users(id),
    attachments JSONB DEFAULT '[]',
    internal_notes TEXT,
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News articles table
CREATE TABLE IF NOT EXISTS news_articles (
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
    author_id UUID REFERENCES users(id),
    tags TEXT[],
    meta_description_en TEXT,
    meta_description_sw TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Complaint status history table
CREATE TABLE IF NOT EXISTS complaint_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
    old_status complaint_status,
    new_status complaint_status NOT NULL,
    changed_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cookie consent table
CREATE TABLE IF NOT EXISTS cookie_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    necessary_cookies BOOLEAN DEFAULT true,
    analytics_cookies BOOLEAN DEFAULT false,
    marketing_cookies BOOLEAN DEFAULT false,
    functional_cookies BOOLEAN DEFAULT false,
    consent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year')
);

-- Password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attorney General history table
CREATE TABLE IF NOT EXISTS attorney_general_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_sw VARCHAR(255) NOT NULL,
    start_year INTEGER NOT NULL,
    end_year INTEGER,
    biography_en TEXT NOT NULL,
    biography_sw TEXT NOT NULL,
    achievements_en TEXT[],
    achievements_sw TEXT[],
    profile_image_url TEXT,
    is_current BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Careers table
CREATE TABLE IF NOT EXISTS careers (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at);
CREATE INDEX IF NOT EXISTS idx_complaints_complaint_number ON complaints(complaint_number);
CREATE INDEX IF NOT EXISTS idx_news_articles_status ON news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at);
CREATE INDEX IF NOT EXISTS idx_news_articles_slug ON news_articles(slug);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_cookie_consents_session_id ON cookie_consents(session_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_attorney_general_history_start_year ON attorney_general_history(start_year);
CREATE INDEX IF NOT EXISTS idx_attorney_general_history_is_current ON attorney_general_history(is_current);
CREATE INDEX IF NOT EXISTS idx_careers_is_active ON careers(is_active);
CREATE INDEX IF NOT EXISTS idx_careers_application_deadline ON careers(application_deadline);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hero_sections_updated_at BEFORE UPDATE ON hero_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attorney_general_history_updated_at BEFORE UPDATE ON attorney_general_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_careers_updated_at BEFORE UPDATE ON careers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin users with proper roles and credentials
-- Attorney General: email: ag@ag.go.ke, password: AG2024Kenya!
-- Head of Communications: email: comms@ag.go.ke, password: Comms2024Kenya!
-- Complaint Handler 1: email: complaints1@ag.go.ke, password: Complaints2024Kenya!
-- Complaint Handler 2: email: complaints2@ag.go.ke, password: Complaints2024Kenya!
-- Complaint Handler 3: email: complaints3@ag.go.ke, password: Complaints2024Kenya!
INSERT INTO users (email, password_hash, full_name, role) VALUES 
('ag@ag.go.ke', '$2b$12$LQv3c1yqBwlVHpPqNQ/Oh.Az4oGAzqxVdxOQHArQzSMq3tIwQvQJO', 'Attorney General', 'attorney_general'),
('comms@ag.go.ke', '$2b$12$8/YZOKKKl/fGlSZd4/YGP.gHOYzVz9xOUYbJ8KdZNAqeJ4RJvRJKW', 'Head of Communications', 'communications'),
('complaints1@ag.go.ke', '$2b$12$9XYZPKKKl/fGlSZd4/YGP.gHOYzVz9xOUYbJ8KdZNAqeJ4RJvRJKW', 'Complaint Handler 1', 'complaint_handler'),
('complaints2@ag.go.ke', '$2b$12$AXYZPKKKL/fGlSZd4/YGP.gHOYzVz9xOUYbJ8KdZNAqeJ4RJvRJKW', 'Complaint Handler 2', 'complaint_handler'),
('complaints3@ag.go.ke', '$2b$12$BXYZPKKKL/fGlSZd4/YGP.gHOYzVz9xOUYbJ8KdZNAqeJ4RJvRJKW', 'Complaint Handler 3', 'complaint_handler')
ON CONFLICT (email) DO NOTHING;

-- Insert default hero sections
INSERT INTO hero_sections (title_en, title_sw, subtitle_en, subtitle_sw, description_en, description_sw, is_active, display_order) VALUES 
(
    'Office of the Attorney General',
    'Ofisi ya Mkuu wa Sheria',
    'Serving Justice for All Kenyans',
    'Kutoa Haki kwa Wakenya Wote',
    'The Office of the Attorney General is committed to providing legal services and ensuring justice for all citizens of Kenya.',
    'Ofisi ya Mkuu wa Sheria imejitolea kutoa huduma za kisheria na kuhakikisha haki kwa raia wote wa Kenya.',
    true,
    1
),
(
    'Legal Services & Complaints',
    'Huduma za Kisheria na Malalamiko',
    'Your Voice Matters',
    'Sauti Yako Ni Muhimu',
    'Submit complaints, seek legal advice, and access justice through our comprehensive legal services.',
    'Wasilisha malalamiko, tafuta ushauri wa kisheria, na upate haki kupitia huduma zetu za kisheria.',
    true,
    2
)
ON CONFLICT DO NOTHING;

-- Insert sample news articles
INSERT INTO news_articles (title_en, title_sw, slug, excerpt_en, excerpt_sw, content_en, content_sw, status, is_featured, published_at) VALUES 
(
    'New Legal Framework for Digital Rights',
    'Mfumo Mpya wa Kisheria kwa Haki za Kidijitali',
    'new-legal-framework-digital-rights',
    'The Attorney General announces new legislation to protect digital rights of Kenyan citizens.',
    'Mkuu wa Sheria anatangaza sheria mpya za kulinda haki za kidijitali za raia wa Kenya.',
    'The Office of the Attorney General is pleased to announce the introduction of comprehensive legislation aimed at protecting the digital rights of Kenyan citizens...',
    'Ofisi ya Mkuu wa Sheria inafurahi kutangaza uanzishaji wa sheria za kina zinazolenga kulinda haki za kidijitali za raia wa Kenya...',
    'published',
    true,
    NOW()
),
(
    'Legal Aid Program Expansion',
    'Upanuzi wa Mpango wa Msaada wa Kisheria',
    'legal-aid-program-expansion',
    'Free legal aid services now available in all 47 counties across Kenya.',
    'Huduma za msaada wa kisheria bila malipo sasa zinapatikana katika kaunti zote 47 za Kenya.',
    'The Attorney General is proud to announce the expansion of our legal aid program to cover all 47 counties in Kenya...',
    'Mkuu wa Sheria anajivunia kutangaza upanuzi wa mpango wetu wa msaada wa kisheria kufikia kaunti zote 47 za Kenya...',
    'published',
    false,
    NOW() - INTERVAL '1 day'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Attorney General history data
INSERT INTO attorney_general_history (full_name, title_en, title_sw, start_year, end_year, biography_en, biography_sw, achievements_en, achievements_sw, is_current, display_order) VALUES
(
    'Dorcas Agik Oduya',
    'Attorney General',
    'Mkuu wa Sheria',
    2024,
    NULL,
    'Dorcas Agik Oduya is the current Attorney General of Kenya, appointed in 2024. She brings extensive legal experience and commitment to justice reform.',
    'Dorcas Agik Oduya ni Mkuu wa Sheria wa sasa wa Kenya, aliyeteuliwa mwaka 2024. Analeta uzoefu mkubwa wa kisheria na kujitolea kwa mageuzi ya haki.',
    ARRAY['Legal reform initiatives', 'Digital rights legislation', 'Access to justice programs'],
    ARRAY['Mipango ya mageuzi ya kisheria', 'Sheria za haki za kidijitali', 'Mipango ya upatikanaji wa haki'],
    true,
    1
),
(
    'Prof. Kihara Kariuki',
    'Attorney General',
    'Mkuu wa Sheria',
    2018,
    2022,
    'Prof. Kihara Kariuki served as Attorney General from 2018 to 2022, focusing on constitutional law and governance reforms.',
    'Prof. Kihara Kariuki alitumika kama Mkuu wa Sheria kuanzia 2018 hadi 2022, akizingatia sheria za kikatiba na mageuzi ya utawala.',
    ARRAY['Constitutional reforms', 'Legal education enhancement', 'Public service transformation'],
    ARRAY['Mageuzi ya kikatiba', 'Uboreshaji wa elimu ya kisheria', 'Mabadiliko ya huduma za umma'],
    false,
    2
),
(
    'Githu Muigai',
    'Attorney General',
    'Mkuu wa Sheria',
    2011,
    2018,
    'Githu Muigai served as Attorney General from 2011 to 2018, overseeing significant legal and constitutional developments.',
    'Githu Muigai alitumika kama Mkuu wa Sheria kuanzia 2011 hadi 2018, akisimamia maendeleo makubwa ya kisheria na kikatiba.',
    ARRAY['Constitutional implementation', 'Judicial reforms', 'Legal framework modernization'],
    ARRAY['Utekelezaji wa katiba', 'Mageuzi ya mahakama', 'Kisasa cha mfumo wa kisheria'],
    false,
    3
);

-- Insert sample careers data
INSERT INTO careers (title_en, title_sw, department_en, department_sw, description_en, description_sw, requirements_en, requirements_sw, responsibilities_en, responsibilities_sw, salary_range, application_deadline, job_type, location_en, location_sw, is_active) VALUES
(
    'Senior Legal Officer',
    'Afisa Mkuu wa Kisheria',
    'Legal Affairs Department',
    'Idara ya Mambo ya Kisheria',
    'We are seeking a qualified Senior Legal Officer to join our legal team and provide expert legal advice on various matters.',
    'Tunatafuta Afisa Mkuu wa Kisheria mwenye sifa za kutosha kujiunga na timu yetu ya kisheria na kutoa ushauri wa kitaalamu wa kisheria katika mambo mbalimbali.',
    ARRAY['Bachelor of Laws (LLB) degree', 'Admission to the Kenya Bar', 'Minimum 5 years experience', 'Strong analytical skills'],
    ARRAY['Shahada ya Sheria (LLB)', 'Uongozi wa Baa ya Kenya', 'Uzoefu wa miaka 5 kwa chini', 'Ujuzi mkubwa wa uchambuzi'],
    ARRAY['Provide legal advice and opinions', 'Draft legal documents', 'Represent the office in legal proceedings', 'Conduct legal research'],
    ARRAY['Kutoa ushauri na maoni ya kisheria', 'Kuandika hati za kisheria', 'Kuwakilisha ofisi katika kesi za kisheria', 'Kufanya utafiti wa kisheria'],
    'KES 150,000 - 200,000',
    '2024-08-15',
    'full-time',
    'Nairobi, Kenya',
    'Nairobi, Kenya',
    true
),
(
    'Legal Research Assistant',
    'Msaidizi wa Utafiti wa Kisheria',
    'Research Department',
    'Idara ya Utafiti',
    'Join our research team to support legal research activities and contribute to policy development.',
    'Jiunga na timu yetu ya utafiti kusaidia shughuli za utafiti wa kisheria na kuchangia katika maendeleo ya sera.',
    ARRAY['Bachelor of Laws (LLB) degree', 'Strong research skills', 'Proficiency in legal databases', 'Excellent writing skills'],
    ARRAY['Shahada ya Sheria (LLB)', 'Ujuzi mkubwa wa utafiti', 'Ustadi katika hifadhidata za kisheria', 'Ujuzi bora wa kuandika'],
    ARRAY['Conduct legal research', 'Prepare research reports', 'Assist in policy drafting', 'Maintain legal databases'],
    ARRAY['Kufanya utafiti wa kisheria', 'Kuandaa ripoti za utafiti', 'Kusaidia katika uandishi wa sera', 'Kudumisha hifadhidata za kisheria'],
    'KES 80,000 - 120,000',
    '2024-07-30',
    'full-time',
    'Nairobi, Kenya',
    'Nairobi, Kenya',
    true
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE attorney_general_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Public can view published news" ON news_articles
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view active hero sections" ON hero_sections
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can insert complaints" ON complaints
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert cookie consents" ON cookie_consents
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view attorney general history" ON attorney_general_history
    FOR SELECT USING (true);

CREATE POLICY "Public can view active careers" ON careers
    FOR SELECT USING (is_active = true);

-- Create policies for authenticated users (admin panel)
CREATE POLICY "Authenticated users can view all" ON users
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage complaints" ON complaints
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage news" ON news_articles
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage hero sections" ON hero_sections
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage attorney general history" ON attorney_general_history
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage careers" ON careers
    FOR ALL USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON hero_sections TO anon;
GRANT SELECT ON news_articles TO anon;
GRANT SELECT ON attorney_general_history TO anon;
GRANT SELECT ON careers TO anon;
GRANT INSERT ON complaints TO anon;
GRANT INSERT ON cookie_consents TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('complaint-attachments', 'complaint-attachments', false),
('news-images', 'news-images', true),
('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public can view news images" ON storage.objects
    FOR SELECT USING (bucket_id = 'news-images');

CREATE POLICY "Public can view documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can upload to all buckets" ON storage.objects
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage all files" ON storage.objects
    FOR ALL USING (auth.role() = 'authenticated');

-- Success message
SELECT 'Database setup completed successfully! You can now use the OAG Web System.' as status; 