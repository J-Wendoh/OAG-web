-- =====================================================
-- OAG WEB SYSTEM - PRODUCTION SUPABASE SETUP
-- =====================================================
-- This script sets up the complete database schema for production
-- Run this in your Supabase SQL editor after creating a new project

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ENUMS AND TYPES
-- =====================================================

-- User roles enum
CREATE TYPE user_role AS ENUM (
    'attorney_general',
    'head_of_communications', 
    'complaint_handler'
);

-- Complaint status enum
CREATE TYPE complaint_status AS ENUM (
    'pending',
    'under_review',
    'resolved',
    'closed'
);

-- Complaint priority enum
CREATE TYPE complaint_priority AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);

-- News status enum
CREATE TYPE news_status AS ENUM (
    'draft',
    'published',
    'archived'
);

-- =====================================================
-- CORE TABLES
-- =====================================================

-- User profiles table (extends auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL,
    department TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
    author_id UUID REFERENCES auth.users(id),
    tags TEXT[],
    meta_description_en TEXT,
    meta_description_sw TEXT,
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
    assigned_to UUID REFERENCES auth.users(id),
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
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

-- Activity logs table
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Complaint status history table
CREATE TABLE complaint_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
    old_status complaint_status,
    new_status complaint_status NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cookie consents table
CREATE TABLE cookie_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    consent_given BOOLEAN NOT NULL,
    consent_types JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Password reset tokens table
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User profiles indexes
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_active ON user_profiles(is_active);

-- News articles indexes
CREATE INDEX idx_news_articles_status ON news_articles(status);
CREATE INDEX idx_news_articles_published ON news_articles(status, published_at DESC) WHERE status = 'published';
CREATE INDEX idx_news_articles_featured ON news_articles(is_featured, published_at DESC) WHERE is_featured = true;
CREATE INDEX idx_news_articles_author ON news_articles(author_id);
CREATE INDEX idx_news_articles_slug ON news_articles(slug);

-- Complaints indexes
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_priority ON complaints(priority);
CREATE INDEX idx_complaints_ticket ON complaints(ticket_id);
CREATE INDEX idx_complaints_email ON complaints(email);
CREATE INDEX idx_complaints_county ON complaints(county);
CREATE INDEX idx_complaints_assigned ON complaints(assigned_to);
CREATE INDEX idx_complaints_created ON complaints(created_at DESC);

-- Hero sections indexes
CREATE INDEX idx_hero_sections_active ON hero_sections(is_active);
CREATE INDEX idx_hero_sections_order ON hero_sections(display_order);

-- Attorney General history indexes
CREATE INDEX idx_ag_history_current ON attorney_general_history(is_current);
CREATE INDEX idx_ag_history_years ON attorney_general_history(start_year, end_year);
CREATE INDEX idx_ag_history_order ON attorney_general_history(order_index);

-- Careers indexes
CREATE INDEX idx_careers_active ON careers(is_active);
CREATE INDEX idx_careers_deadline ON careers(application_deadline) WHERE is_active = true;

-- Activity logs indexes
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id, created_at DESC);
CREATE INDEX idx_activity_logs_resource ON activity_logs(resource_type, resource_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);

-- Complaint status history indexes
CREATE INDEX idx_complaint_status_history_complaint ON complaint_status_history(complaint_id, created_at DESC);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hero_sections_updated_at BEFORE UPDATE ON hero_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ag_history_updated_at BEFORE UPDATE ON attorney_general_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_careers_updated_at BEFORE UPDATE ON careers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE attorney_general_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('attorney_general', 'head_of_communications')
        )
    );

CREATE POLICY "Admins can manage all profiles" ON user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'attorney_general'
        )
    );

-- News articles policies
CREATE POLICY "Public can view published news" ON news_articles
    FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can view their own articles" ON news_articles
    FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Communications team can manage news" ON news_articles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('attorney_general', 'head_of_communications')
        )
    );

-- Complaints policies
CREATE POLICY "Public can submit complaints" ON complaints
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view assigned complaints" ON complaints
    FOR SELECT USING (
        auth.uid() = assigned_to OR
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('attorney_general', 'head_of_communications', 'complaint_handler')
        )
    );

CREATE POLICY "Complaint handlers can update complaints" ON complaints
    FOR UPDATE USING (
        auth.uid() = assigned_to OR
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('attorney_general', 'head_of_communications', 'complaint_handler')
        )
    );

-- Hero sections policies
CREATE POLICY "Public can view active hero sections" ON hero_sections
    FOR SELECT USING (is_active = true);

CREATE POLICY "Communications team can manage hero sections" ON hero_sections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('attorney_general', 'head_of_communications')
        )
    );

-- Attorney General history policies
CREATE POLICY "Public can view AG history" ON attorney_general_history
    FOR SELECT USING (true);

CREATE POLICY "Communications team can manage AG history" ON attorney_general_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('attorney_general', 'head_of_communications')
        )
    );

-- Careers policies
CREATE POLICY "Public can view active careers" ON careers
    FOR SELECT USING (is_active = true);

CREATE POLICY "HR team can manage careers" ON careers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('attorney_general', 'head_of_communications')
        )
    );

-- Activity logs policies
CREATE POLICY "Users can view their own activity" ON activity_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity" ON activity_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('attorney_general', 'head_of_communications')
        )
    );

CREATE POLICY "System can insert activity logs" ON activity_logs
    FOR INSERT WITH CHECK (true);

-- Complaint status history policies
CREATE POLICY "Staff can view complaint history" ON complaint_status_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('attorney_general', 'head_of_communications', 'complaint_handler')
        )
    );

CREATE POLICY "Staff can insert complaint history" ON complaint_status_history
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('attorney_general', 'head_of_communications', 'complaint_handler')
        )
    );

-- Cookie consents policies
CREATE POLICY "Public can insert cookie consents" ON cookie_consents
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view cookie consents" ON cookie_consents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'attorney_general'
        )
    );

-- Password reset tokens policies
CREATE POLICY "Users can view their own reset tokens" ON password_reset_tokens
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage reset tokens" ON password_reset_tokens
    FOR ALL WITH CHECK (true);

-- =====================================================
-- STORAGE BUCKETS AND POLICIES
-- =====================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
    ('complaint-attachments', 'complaint-attachments', false),
    ('news-images', 'news-images', true),
    ('documents', 'documents', true),
    ('hero-images', 'hero-images', true),
    ('profile-photos', 'profile-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for complaint attachments
CREATE POLICY "Authenticated users can upload complaint attachments" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'complaint-attachments' AND auth.role() = 'authenticated');

CREATE POLICY "Staff can view complaint attachments" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'complaint-attachments' AND
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('attorney_general', 'head_of_communications', 'complaint_handler')
        )
    );

-- Storage policies for news images
CREATE POLICY "Public can view news images" ON storage.objects
    FOR SELECT USING (bucket_id = 'news-images');

CREATE POLICY "Communications team can manage news images" ON storage.objects
    FOR ALL USING (
        bucket_id = 'news-images' AND
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('attorney_general', 'head_of_communications')
        )
    );

-- Storage policies for documents
CREATE POLICY "Public can view documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Staff can manage documents" ON storage.objects
    FOR ALL USING (
        bucket_id = 'documents' AND
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('attorney_general', 'head_of_communications')
        )
    );

-- Storage policies for hero images
CREATE POLICY "Public can view hero images" ON storage.objects
    FOR SELECT USING (bucket_id = 'hero-images');

CREATE POLICY "Communications team can manage hero images" ON storage.objects
    FOR ALL USING (
        bucket_id = 'hero-images' AND
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('attorney_general', 'head_of_communications')
        )
    );
