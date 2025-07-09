# OAG Web System Database Schema

## Overview
This document outlines the database schema for the Office of the Attorney General (OAG) Web System, including user authentication, complaint management, news management, and system administration.

## Database Tables

### 1. Users Table (`users`)
Stores user authentication and profile information for admin panel access.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'communications', 'complaint_handler', 'attorney_general')),
    department VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
```

### 2. Complaints Table (`complaints`)
Stores citizen complaints and their processing status.

```sql
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number VARCHAR(20) UNIQUE NOT NULL,
    citizen_name VARCHAR(200) NOT NULL,
    citizen_email VARCHAR(255) NOT NULL,
    citizen_phone VARCHAR(20),
    citizen_address TEXT,
    citizen_county VARCHAR(100),
    complaint_category VARCHAR(100) NOT NULL,
    complaint_subject VARCHAR(500) NOT NULL,
    complaint_description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
    assigned_to UUID REFERENCES users(id),
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_complaints_reference ON complaints(reference_number);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_category ON complaints(complaint_category);
CREATE INDEX idx_complaints_assigned_to ON complaints(assigned_to);
CREATE INDEX idx_complaints_created_at ON complaints(created_at);
```

### 3. Complaint Attachments Table (`complaint_attachments`)
Stores file attachments for complaints.

```sql
CREATE TABLE complaint_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_complaint_attachments_complaint_id ON complaint_attachments(complaint_id);
```

### 4. News Articles Table (`news_articles`)
Stores news articles and updates.

```sql
CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(500),
    category VARCHAR(100) NOT NULL,
    tags TEXT[], -- Array of tags
    author_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_news_articles_slug ON news_articles(slug);
CREATE INDEX idx_news_articles_status ON news_articles(status);
CREATE INDEX idx_news_articles_category ON news_articles(category);
CREATE INDEX idx_news_articles_published_at ON news_articles(published_at);
CREATE INDEX idx_news_articles_author_id ON news_articles(author_id);
```

### 5. Hero Sections Table (`hero_sections`)
Stores hero section content for the website.

```sql
CREATE TABLE hero_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    subtitle VARCHAR(500),
    description TEXT,
    background_image VARCHAR(500),
    cta_primary_text VARCHAR(100),
    cta_primary_url VARCHAR(500),
    cta_secondary_text VARCHAR(100),
    cta_secondary_url VARCHAR(500),
    is_active BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_hero_sections_is_active ON hero_sections(is_active);
CREATE INDEX idx_hero_sections_display_order ON hero_sections(display_order);
```

### 6. System Settings Table (`system_settings`)
Stores system-wide configuration settings.

```sql
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_system_settings_key ON system_settings(setting_key);
CREATE INDEX idx_system_settings_is_public ON system_settings(is_public);
```

### 7. Audit Logs Table (`audit_logs`)
Stores system activity logs for security and monitoring.

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

## Initial Data Setup

### Default Admin User
```sql
-- Create default admin user (password should be hashed)
INSERT INTO users (email, password_hash, first_name, last_name, role, department, is_active)
VALUES (
    'admin@ag.go.ke',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/oGOjzQK6G', -- Password: admin123
    'System',
    'Administrator',
    'admin',
    'IT Department',
    true
);
```

### Default System Settings
```sql
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_name', 'Office of the Attorney General', 'string', 'Website name', true),
('site_description', 'Official website of the Office of the Attorney General of Kenya', 'string', 'Website description', true),
('contact_email', 'info@ag.go.ke', 'string', 'Main contact email', true),
('contact_phone', '+254-20-2227461', 'string', 'Main contact phone', true),
('office_address', 'State Law Office, Harambee Avenue, P.O. Box 40112-00100, Nairobi', 'string', 'Office address', true),
('complaints_per_page', '10', 'number', 'Number of complaints per page in admin', false),
('news_per_page', '6', 'number', 'Number of news articles per page', true),
('max_file_size', '5242880', 'number', 'Maximum file upload size in bytes (5MB)', false),
('allowed_file_types', '["pdf", "doc", "docx", "jpg", "jpeg", "png"]', 'json', 'Allowed file types for uploads', false);
```

### Default Hero Section
```sql
INSERT INTO hero_sections (title, subtitle, description, cta_primary_text, cta_primary_url, cta_secondary_text, cta_secondary_url, is_active, display_order)
VALUES (
    'Office of the Attorney General',
    'Serving Justice, Protecting Rights',
    'Your gateway to legal services and justice in Kenya. File complaints, access legal resources, and stay informed about important legal matters.',
    'File a Complaint',
    '/complaints',
    'Check Status',
    '/status',
    true,
    1
);
```

## Security Considerations

### Password Security
- All passwords must be hashed using bcrypt with a minimum of 12 rounds
- Implement password strength requirements (minimum 8 characters, mixed case, numbers, symbols)
- Store password reset tokens with expiration times

### Access Control
- Implement role-based access control (RBAC)
- Log all administrative actions in audit_logs table
- Use UUID for all primary keys to prevent enumeration attacks

### Data Protection
- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Implement proper input validation and sanitization
- Regular security audits and penetration testing

## Backup and Recovery

### Backup Strategy
- Daily automated backups of the entire database
- Weekly full backups with point-in-time recovery
- Test restore procedures monthly
- Store backups in secure, off-site location

### Recovery Procedures
- Document step-by-step recovery procedures
- Test recovery procedures quarterly
- Maintain recovery time objectives (RTO) and recovery point objectives (RPO)

## Performance Optimization

### Indexing Strategy
- Create indexes on frequently queried columns
- Monitor query performance and optimize as needed
- Use composite indexes for complex queries

### Maintenance
- Regular VACUUM and ANALYZE operations
- Monitor database size and growth
- Archive old data as needed
- Performance monitoring and alerting

## Compliance and Auditing

### Data Retention
- Implement data retention policies
- Archive old complaints and news articles
- Maintain audit trails for compliance

### Privacy Protection
- Implement data anonymization for reporting
- Ensure GDPR compliance for data protection
- Regular privacy impact assessments 