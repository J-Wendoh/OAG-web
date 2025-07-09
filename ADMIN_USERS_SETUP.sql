-- =====================================================
-- OAG WEB SYSTEM - ADMIN USERS SETUP
-- =====================================================
-- This script creates admin users and sample data
-- Run this AFTER the main schema setup

-- =====================================================
-- ADMIN USER CREATION
-- =====================================================
-- Note: These users need to be created through Supabase Auth
-- The following are the credentials to use when creating users manually:

/*
ADMIN CREDENTIALS FOR MANUAL CREATION:

1. ATTORNEY GENERAL
   Email: ag@ag.go.ke
   Password: AG2024Kenya!@#
   Role: attorney_general

2. HEAD OF COMMUNICATIONS  
   Email: communications@ag.go.ke
   Password: Comms2024Kenya!@#
   Role: head_of_communications

3. COMPLAINT HANDLER 1
   Email: complaints1@ag.go.ke
   Password: Handler2024Kenya!@#
   Role: complaint_handler

4. COMPLAINT HANDLER 2
   Email: complaints2@ag.go.ke
   Password: Handler2024Kenya!@#
   Role: complaint_handler

5. COMPLAINT HANDLER 3
   Email: complaints3@ag.go.ke
   Password: Handler2024Kenya!@#
   Role: complaint_handler

SECURITY REQUIREMENTS:
- All passwords must be changed on first login
- Enable 2FA for all admin accounts
- Set password expiry to 90 days
- Require strong passwords (min 12 chars, mixed case, numbers, symbols)
*/

-- =====================================================
-- USER PROFILES FOR ADMIN USERS
-- =====================================================
-- Insert user profiles (UUIDs will need to be updated with actual auth.users IDs)

-- This is a template - replace UUIDs with actual user IDs after creating auth users
/*
INSERT INTO user_profiles (id, full_name, role, department, is_active) VALUES
-- Attorney General
('00000000-0000-0000-0000-000000000001', 'Attorney General', 'attorney_general', 'Office of the Attorney General', true),

-- Head of Communications
('00000000-0000-0000-0000-000000000002', 'Head of Communications', 'head_of_communications', 'Communications Department', true),

-- Complaint Handlers
('00000000-0000-0000-0000-000000000003', 'Complaint Handler 1', 'complaint_handler', 'Citizen Services', true),
('00000000-0000-0000-0000-000000000004', 'Complaint Handler 2', 'complaint_handler', 'Citizen Services', true),
('00000000-0000-0000-0000-000000000005', 'Complaint Handler 3', 'complaint_handler', 'Citizen Services', true);
*/

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample Attorney General history
INSERT INTO attorney_general_history (
    full_name, title_en, title_sw, bio_en, bio_sw, start_year, end_year, is_current, 
    achievements_en, achievements_sw, order_index
) VALUES
(
    'Hon. Justin Muturi',
    'Attorney General',
    'Mwanasheria Mkuu',
    'Hon. Justin Muturi serves as the Attorney General of Kenya, bringing extensive legal expertise and leadership to the office.',
    'Mhe. Justin Muturi anatumikia kama Mwanasheria Mkuu wa Kenya, akileta utaalamu mkuu wa kisheria na uongozi katika ofisi hii.',
    2022,
    NULL,
    true,
    ARRAY[
        'Constitutional law expert',
        'Former Speaker of National Assembly',
        'Legal reform champion',
        'Public service leadership'
    ],
    ARRAY[
        'Mtaalamu wa sheria ya katiba',
        'Spika wa zamani wa Bunge la Kitaifa',
        'Mtetezi wa mageuzi ya kisheria',
        'Uongozi wa huduma za umma'
    ],
    1
);

-- Insert sample hero section
INSERT INTO hero_sections (
    title_en, title_sw, subtitle_en, subtitle_sw, description_en, description_sw,
    call_to_action_text_en, call_to_action_text_sw, call_to_action_url, is_active, display_order
) VALUES
(
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

-- Insert sample careers
INSERT INTO careers (
    title_en, title_sw, department_en, department_sw, description_en, description_sw,
    requirements_en, requirements_sw, responsibilities_en, responsibilities_sw,
    salary_range, application_deadline, job_type, location_en, location_sw, is_active
) VALUES
(
    'Senior Legal Officer',
    'Afisa Mkuu wa Kisheria',
    'Legal Affairs Department',
    'Idara ya Mambo ya Kisheria',
    'We are seeking a qualified Senior Legal Officer to join our legal team and provide expert legal advice on various matters.',
    'Tunatafuta Afisa Mkuu wa Kisheria mwenye sifa za kutosha kujiunga na timu yetu ya kisheria na kutoa ushauri wa kitaalamu wa kisheria katika mambo mbalimbali.',
    ARRAY[
        'Bachelor of Laws (LLB) degree',
        'Admission to the Kenya Bar',
        'Minimum 5 years legal experience',
        'Strong analytical and communication skills',
        'Knowledge of Kenyan legal system'
    ],
    ARRAY[
        'Shahada ya Kwanza ya Sheria (LLB)',
        'Kukubaliwa katika Baa ya Kenya',
        'Uzoefu wa kisheria wa miaka 5 au zaidi',
        'Ujuzi mkuu wa uchambuzi na mawasiliano',
        'Maarifa ya mfumo wa kisheria wa Kenya'
    ],
    ARRAY[
        'Provide legal advice and opinions',
        'Draft legal documents and contracts',
        'Represent the office in legal proceedings',
        'Conduct legal research and analysis',
        'Ensure compliance with legal requirements'
    ],
    ARRAY[
        'Kutoa ushauri na maoni ya kisheria',
        'Kuandika hati za kisheria na mikataba',
        'Kuwakilisha ofisi katika kesi za kisheria',
        'Kufanya utafiti na uchambuzi wa kisheria',
        'Kuhakikisha kufuata mahitaji ya kisheria'
    ],
    'KES 80,000 - 120,000',
    '2025-02-28',
    'full-time',
    'Nairobi, Kenya',
    'Nairobi, Kenya',
    true
),
(
    'Communications Specialist',
    'Mtaalamu wa Mawasiliano',
    'Communications Department',
    'Idara ya Mawasiliano',
    'Join our communications team to help manage public relations and information dissemination for the Office of the Attorney General.',
    'Jiunga na timu yetu ya mawasiliano kusaidia kusimamia mahusiano ya umma na usambazaji wa habari kwa Ofisi ya Mwanasheria Mkuu.',
    ARRAY[
        'Bachelor''s degree in Communications, Journalism, or related field',
        'Minimum 3 years experience in communications',
        'Excellent written and verbal communication skills',
        'Experience with digital media platforms',
        'Knowledge of government communications'
    ],
    ARRAY[
        'Shahada ya Kwanza katika Mawasiliano, Uandishi wa Habari, au uwanda unaohusiana',
        'Uzoefu wa miaka 3 au zaidi katika mawasiliano',
        'Ujuzi bora wa mawasiliano ya maandishi na mazungumzo',
        'Uzoefu wa majukwaa ya media ya kidijitali',
        'Maarifa ya mawasiliano ya kiserikali'
    ],
    ARRAY[
        'Develop communication strategies and campaigns',
        'Manage social media accounts and website content',
        'Coordinate with media and prepare press releases',
        'Support public events and stakeholder engagement',
        'Monitor public sentiment and media coverage'
    ],
    ARRAY[
        'Kuunda mikakati na kampeni za mawasiliano',
        'Kusimamia akaunti za mitandao ya kijamii na maudhui ya tovuti',
        'Kuratibu na vyombo vya habari na kuandaa taarifa za habari',
        'Kusaidia matukio ya umma na ushirikiano wa wadau',
        'Kufuatilia hisia za umma na uangalizi wa vyombo vya habari'
    ],
    'KES 60,000 - 90,000',
    '2025-03-15',
    'full-time',
    'Nairobi, Kenya',
    'Nairobi, Kenya',
    true
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
    'The Office of the Attorney General today launched a groundbreaking legal aid initiative aimed at ensuring equal access to justice for all Kenyans, regardless of their economic status. This comprehensive program will provide free legal services to vulnerable populations and establish legal aid clinics across the country.',
    'Ofisi ya Mwanasheria Mkuu leo imeanzisha mpango wa kipekee wa msaada wa kisheria unaolenga kuhakikisha ufikiaji sawa wa haki kwa Wakenya wote, bila kujali hali yao ya kiuchumi. Mpango huu mkuu utatoa huduma za kisheria bila malipo kwa vikundi vya watu walio hatarini na kuanzisha kliniki za msaada wa kisheria nchini kote.',
    'published',
    true,
    ARRAY['legal aid', 'justice', 'access', 'initiative'],
    NOW() - INTERVAL '2 days'
),
(
    'Constitutional Review Process Update',
    'Sasisho la Mchakato wa Mapitio ya Katiba',
    'constitutional-review-update',
    'Latest developments in the ongoing constitutional review process and public participation opportunities.',
    'Maendeleo ya hivi karibuni katika mchakato unaoendelea wa mapitio ya katiba na fursa za ushiriki wa umma.',
    'The constitutional review process continues to make significant progress with extensive public consultations being conducted across all 47 counties. Citizens are encouraged to participate in the upcoming forums to share their views on proposed constitutional amendments.',
    'Mchakato wa mapitio ya katiba unaendelea kufanya maendeleo makubwa huku mashauriano makuu ya umma yakifanywa katika kaunti zote 47. Raia wanahimizwa kushiriki katika mikutano ijayo ili kushiriki maoni yao kuhusu marekebisho ya katiba yanayopendekezwa.',
    'published',
    false,
    ARRAY['constitution', 'review', 'public participation'],
    NOW() - INTERVAL '1 week'
);

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions to anonymous users for public access
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON news_articles TO anon WHERE status = 'published';
GRANT SELECT ON hero_sections TO anon WHERE is_active = true;
GRANT SELECT ON attorney_general_history TO anon;
GRANT SELECT ON careers TO anon WHERE is_active = true;
GRANT INSERT ON complaints TO anon;
GRANT INSERT ON cookie_consents TO anon;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Log setup completion
INSERT INTO activity_logs (action, resource_type, details, created_at) VALUES
('database_setup', 'system', '{"message": "Production database setup completed", "version": "1.0.0"}', NOW());
