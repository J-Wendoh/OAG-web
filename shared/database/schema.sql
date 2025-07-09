-- OAG Web System Database Schema
-- Attorney General's Office - Kenya

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- News table
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Legal Aid', 'Marriage Law', 'Anti-Corruption', 'Royal Visit', 'Public Notice', 'Press Release')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT false,
  image_url TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Complaints table
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  id_number TEXT,
  email TEXT,
  county TEXT NOT NULL,
  subject TEXT NOT NULL,
  complaint TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  attachment_url TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Activity logs table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles (extends auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('attorney_general', 'head_of_communications', 'complaint_handler')),
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hero Section Management table
CREATE TABLE hero_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  background_image_url TEXT,
  call_to_action_text TEXT,
  call_to_action_url TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Complaint Status Updates table (for tracking status changes and replies)
CREATE TABLE complaint_status_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
  status_from TEXT,
  status_to TEXT NOT NULL,
  update_message TEXT,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Complaint access passwords table (for citizens to check status)
CREATE TABLE complaint_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
  access_password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_status_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_access ENABLE ROW LEVEL SECURITY;

-- News policies
CREATE POLICY "Public can read published news" ON news
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all news" ON news
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('attorney_general', 'head_of_communications')
    )
  );

-- Complaints policies
CREATE POLICY "Public can insert complaints" ON complaints
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read all complaints" ON complaints
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('attorney_general', 'complaint_handler')
    )
  );

CREATE POLICY "Admins can update complaints" ON complaints
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('attorney_general', 'complaint_handler')
    )
  );

-- Activity logs policies
CREATE POLICY "Users can read their own logs" ON activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all logs" ON activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'attorney_general'
    )
  );

-- User profiles policies
CREATE POLICY "Users can read their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'attorney_general'
    )
  );

-- Hero sections policies
CREATE POLICY "Public can read active hero sections" ON hero_sections
  FOR SELECT USING (is_active = true);

CREATE POLICY "Head of communications can manage hero sections" ON hero_sections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('attorney_general', 'head_of_communications')
    )
  );

-- Complaint status updates policies
CREATE POLICY "Public can read status updates for their complaints" ON complaint_status_updates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM complaint_access ca
      WHERE ca.complaint_id = complaint_status_updates.complaint_id
    )
  );

CREATE POLICY "Admins can manage status updates" ON complaint_status_updates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('attorney_general', 'complaint_handler')
    )
  );

-- Complaint access policies
CREATE POLICY "Public can read complaint access" ON complaint_access
  FOR SELECT USING (true);

CREATE POLICY "System can insert complaint access" ON complaint_access
  FOR INSERT WITH CHECK (true);

-- Update updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hero_sections_updated_at BEFORE UPDATE ON hero_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Log activity function
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_logs (user_id, action, resource_type, resource_id, details)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    )
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create activity logging triggers
CREATE TRIGGER log_news_activity AFTER INSERT OR UPDATE OR DELETE ON news
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_complaints_activity AFTER INSERT OR UPDATE OR DELETE ON complaints
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_hero_sections_activity AFTER INSERT OR UPDATE OR DELETE ON hero_sections
  FOR EACH ROW EXECUTE FUNCTION log_activity();

-- Function to generate random password for complaint access
CREATE OR REPLACE FUNCTION generate_complaint_password()
RETURNS TEXT AS $$
BEGIN
  RETURN upper(substring(md5(random()::text) from 1 for 8));
END;
$$ language 'plpgsql';

-- Trigger to create complaint access password when complaint is created
CREATE OR REPLACE FUNCTION create_complaint_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO complaint_access (complaint_id, access_password)
  VALUES (NEW.id, generate_complaint_password());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_complaint_access_trigger AFTER INSERT ON complaints
  FOR EACH ROW EXECUTE FUNCTION create_complaint_access();

-- Trigger to log status changes
CREATE OR REPLACE FUNCTION log_complaint_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status != NEW.status THEN
    INSERT INTO complaint_status_updates (complaint_id, status_from, status_to, updated_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER log_complaint_status_change_trigger AFTER UPDATE ON complaints
  FOR EACH ROW EXECUTE FUNCTION log_complaint_status_change();

-- Performance indexes
CREATE INDEX idx_news_status_published ON news(status, published_at DESC) WHERE status = 'published';
CREATE INDEX idx_news_featured ON news(featured, published_at DESC) WHERE featured = true;
CREATE INDEX idx_news_category ON news(category, created_at DESC);

CREATE INDEX idx_complaints_status ON complaints(status, created_at DESC);
CREATE INDEX idx_complaints_ticket ON complaints(ticket_id);
CREATE INDEX idx_complaints_county ON complaints(county);
CREATE INDEX idx_complaints_priority ON complaints(priority, created_at DESC);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id, created_at DESC);
CREATE INDEX idx_activity_logs_resource ON activity_logs(resource_type, resource_id, created_at DESC);

CREATE INDEX idx_hero_sections_active ON hero_sections(is_active, created_at DESC);
CREATE INDEX idx_complaint_status_updates_complaint ON complaint_status_updates(complaint_id, created_at DESC);
CREATE INDEX idx_complaint_access_complaint ON complaint_access(complaint_id);

-- Insert sample data (for testing)
INSERT INTO news (title, excerpt, content, author, category, status, featured, image_url) VALUES
(
  'Historic Royal Engagement Celebrating Kenya''s Legal Excellence',
  'Attorney General Hon. Dorcas Oduor today held consultative meetings with His Majesty King Willem-Alexander and Her Majesty Queen Maxima of the Netherlands at the Supreme Court of Kenya during their state visit to Kenya.',
  'Attorney General Hon. Dorcas Oduor today held consultative meetings with His Majesty King Willem-Alexander and Her Majesty Queen Maxima of the Netherlands at the Supreme Court of Kenya during their state visit to Kenya.\n\nThe engagement reaffirmed the strong partnership between Kenya and the Netherlands, emphasizing our shared commitment to Rule of Law, Democracy, and Good Governance. The Royal Couple celebrated Kenya''s remarkable strides in female leadership across the justice sector, recognizing the exceptional growth of women in the legal profession and their pivotal role in championing equal access to justice.',
  'Communications Department',
  'Royal Visit',
  'published',
  true,
  '/newsmarch20.png'
),
(
  'Attorney General Launches New Legal Aid Initiative',
  'A comprehensive program to provide free legal services to underserved communities across Kenya.',
  'The Attorney General''s Office is proud to announce the launch of our new Legal Aid Initiative, designed to provide comprehensive legal services to underserved communities across Kenya. This groundbreaking program will ensure that every Kenyan, regardless of their economic status, has access to quality legal representation and advice.',
  'Communications Department',
  'Legal Aid',
  'published',
  false,
  '/AG2.jpeg'
),
(
  'New Marriage Registration Guidelines Released',
  'Updated procedures for marriage registration to streamline the process for Kenyan citizens.',
  'The Attorney General''s Office has released updated guidelines for marriage registration, aimed at streamlining the process for Kenyan citizens. These new procedures will reduce processing time and improve the overall experience for couples seeking to register their marriages.',
  'Department of Marriage',
  'Marriage Law',
  'published',
  false,
  '/AG3.jpg'
);

-- Attorney General History table
CREATE TABLE attorney_general_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  period TEXT NOT NULL,
  start_year INTEGER NOT NULL,
  end_year INTEGER,
  biography TEXT,
  achievements TEXT,
  image_url TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Careers table
CREATE TABLE careers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  application_deadline DATE,
  application_form_url TEXT,
  application_email TEXT NOT NULL,
  additional_documents TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on new tables
ALTER TABLE attorney_general_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;

-- Attorney General History policies
CREATE POLICY "Public can read AG history" ON attorney_general_history
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage AG history" ON attorney_general_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('attorney_general', 'head_of_communications')
    )
  );

-- Careers policies
CREATE POLICY "Public can read active careers" ON careers
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage careers" ON careers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('attorney_general', 'head_of_communications')
    )
  );

-- Create triggers for updated_at on new tables
CREATE TRIGGER update_ag_history_updated_at BEFORE UPDATE ON attorney_general_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_careers_updated_at BEFORE UPDATE ON careers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create activity logging triggers for new tables
CREATE TRIGGER log_ag_history_activity AFTER INSERT OR UPDATE OR DELETE ON attorney_general_history
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_careers_activity AFTER INSERT OR UPDATE OR DELETE ON careers
  FOR EACH ROW EXECUTE FUNCTION log_activity();

-- Performance indexes for new tables
CREATE INDEX idx_ag_history_order ON attorney_general_history(order_index);
CREATE INDEX idx_ag_history_years ON attorney_general_history(start_year, end_year);
CREATE INDEX idx_careers_status ON careers(status, created_at DESC);
CREATE INDEX idx_careers_deadline ON careers(application_deadline) WHERE status = 'active';

-- Insert Attorney General History data
INSERT INTO attorney_general_history (name, period, start_year, end_year, biography, order_index) VALUES
('James Karugu', '1980-1981', 1980, 1981, 'First Attorney General of independent Kenya, established foundational legal frameworks.', 1),
('Joseph Kamere', '1981-1983', 1981, 1983, 'Continued legal reforms and strengthened the office during early independence years.', 2),
('Guy Muli', '1983-1991', 1983, 1991, 'Served during a critical period of constitutional development in Kenya.', 3),
('Amos Wako', '1991-2011', 1991, 2011, 'Longest serving Attorney General, oversaw major constitutional reforms including the 2010 Constitution.', 4),
('Githu Muigai', '2011-2018', 2011, 2018, 'Led constitutional implementation and legal sector reforms.', 5),
('Prof. Kihara Kariuki', '2018-2022', 2018, 2022, 'Modernized legal services and enhanced access to justice initiatives.', 6),
('Charles Mugane Njonjo', '2022-2024', 2022, 2024, 'Focused on anti-corruption efforts and legal sector digitization.', 7),
('Hon. Dorcas Oduor', '2024-Current', 2024, NULL, 'Current Attorney General, first female to hold the position, championing gender equality in the legal sector.', 8);

-- Insert default hero section
INSERT INTO hero_sections (title, subtitle, description, background_image_url, call_to_action_text, call_to_action_url, is_active) VALUES
(
  'Office of the Attorney General',
  'Republic of Kenya',
  'Championing Justice, Upholding the Rule of Law, and Serving the People of Kenya with Integrity and Excellence.',
  '/hero-bg.jpg',
  'Learn More',
  '/about',
  true
);

-- Create default admin user (you'll need to replace with actual admin credentials)
-- This would typically be done through the Supabase Auth dashboard
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, role)
-- VALUES (
--   uuid_generate_v4(),
--   'admin@ag.go.ke',
--   '$2a$10$encrypted_password_here',
--   NOW(),
--   NOW(),
--   NOW(),
--   'authenticated'
-- );

-- Note: The above user insertion would be done through Supabase Auth UI
-- Then you would insert the corresponding user profile:
-- INSERT INTO user_profiles (id, full_name, role, department) VALUES
-- (uuid_of_admin_user, 'System Administrator', 'attorney_general', 'Office of the Attorney General'); 