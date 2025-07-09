# Dev Notes - OAG Web System

## Technical Implementation Details

### Current System Analysis - 2025-01-27

#### Admin Panel Technical Stack
- **Framework**: React 18.3.1 + TypeScript + Vite 5.4.2
- **Routing**: React Router DOM 6.26.1
- **State Management**: React Context API
- **Forms**: React Hook Form 7.47.0
- **Rich Text**: React Quill 2.0.0 + Quill 1.3.7
- **Charts**: Recharts 2.8.0
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React 0.344.0
- **Notifications**: React Hot Toast 2.4.1

#### Website Technical Stack
- **Framework**: React 18.3.1 + TypeScript + Vite 5.4.2
- **Routing**: React Router DOM 6.20.1
- **Animation**: Framer Motion 10.16.16
- **Internationalization**: React i18next 13.5.0 + i18next 23.7.16
- **Intersection Observer**: React Intersection Observer 9.5.3
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React 0.344.0

---

## Database Design & Architecture

### Supabase Configuration

#### Database Schema
```sql
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
```

#### Row Level Security Policies
```sql
-- Enable RLS on all tables
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- News policies
CREATE POLICY "Public can read published news" ON news
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all news" ON news
  FOR ALL USING (
    auth.jwt() ->> 'role' IN ('attorney_general', 'head_of_communications')
  );

-- Complaints policies
CREATE POLICY "Public can insert complaints" ON complaints
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read all complaints" ON complaints
  FOR SELECT USING (
    auth.jwt() ->> 'role' IN ('attorney_general', 'complaint_handler')
  );

CREATE POLICY "Admins can update complaints" ON complaints
  FOR UPDATE USING (
    auth.jwt() ->> 'role' IN ('attorney_general', 'complaint_handler')
  );

-- Activity logs policies
CREATE POLICY "Users can read their own logs" ON activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all logs" ON activity_logs
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'attorney_general'
  );
```

#### Database Triggers
```sql
-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Log activity on important changes
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

CREATE TRIGGER log_news_activity AFTER INSERT OR UPDATE OR DELETE ON news
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_complaints_activity AFTER INSERT OR UPDATE OR DELETE ON complaints
  FOR EACH ROW EXECUTE FUNCTION log_activity();
```

---

## Implementation Strategy

### Phase 1: Database Setup ✅

#### Supabase Project Setup
1. **Create Project**: `oag-web-system`
2. **Database URL**: `postgresql://[project-ref].supabase.co`
3. **Anon Key**: For public operations (complaint submission)
4. **Service Role Key**: For admin operations (secure)

#### Environment Variables
```env
# Admin Panel (.env)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Website (.env)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Phase 2: Frontend Integration

#### Supabase Client Configuration
```typescript
// utils/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client with service role
export const supabaseAdmin = createClient(
  supabaseUrl,
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
)
```

#### Type Definitions
```typescript
// types/database.ts
export interface Database {
  public: {
    Tables: {
      news: {
        Row: {
          id: string
          title: string
          excerpt: string | null
          content: string
          author: string
          category: string
          status: string
          featured: boolean
          image_url: string | null
          views: number
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          excerpt?: string | null
          content: string
          author: string
          category: string
          status?: string
          featured?: boolean
          image_url?: string | null
          views?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          excerpt?: string | null
          content?: string
          author?: string
          category?: string
          status?: string
          featured?: boolean
          image_url?: string | null
          views?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      complaints: {
        Row: {
          id: string
          ticket_id: string
          first_name: string
          last_name: string
          id_number: string | null
          email: string | null
          county: string
          subject: string
          complaint: string
          status: string
          priority: string
          attachment_url: string | null
          assigned_to: string | null
          resolution_notes: string | null
          created_at: string
          updated_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          ticket_id: string
          first_name: string
          last_name: string
          id_number?: string | null
          email?: string | null
          county: string
          subject: string
          complaint: string
          status?: string
          priority?: string
          attachment_url?: string | null
          assigned_to?: string | null
          resolution_notes?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          ticket_id?: string
          first_name?: string
          last_name?: string
          id_number?: string | null
          email?: string | null
          county?: string
          subject?: string
          complaint?: string
          status?: string
          priority?: string
          attachment_url?: string | null
          assigned_to?: string | null
          resolution_notes?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
      }
    }
  }
}
```

#### Service Layer Implementation
```typescript
// services/newsService.ts
import { supabase } from '../utils/supabase'
import type { Database } from '../types/database'

type NewsRow = Database['public']['Tables']['news']['Row']
type NewsInsert = Database['public']['Tables']['news']['Insert']
type NewsUpdate = Database['public']['Tables']['news']['Update']

export class NewsService {
  // Get published news for public website
  static async getPublishedNews(): Promise<NewsRow[]> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  // Get all news for admin panel
  static async getAllNews(): Promise<NewsRow[]> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  // Create news article
  static async createNews(article: NewsInsert): Promise<NewsRow> {
    const { data, error } = await supabase
      .from('news')
      .insert(article)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Update news article
  static async updateNews(id: string, updates: NewsUpdate): Promise<NewsRow> {
    const { data, error } = await supabase
      .from('news')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Delete news article
  static async deleteNews(id: string): Promise<void> {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
```

```typescript
// services/complaintService.ts
import { supabase } from '../utils/supabase'
import type { Database } from '../types/database'

type ComplaintRow = Database['public']['Tables']['complaints']['Row']
type ComplaintInsert = Database['public']['Tables']['complaints']['Insert']
type ComplaintUpdate = Database['public']['Tables']['complaints']['Update']

export class ComplaintService {
  // Submit complaint from website
  static async submitComplaint(complaint: ComplaintInsert): Promise<ComplaintRow> {
    const { data, error } = await supabase
      .from('complaints')
      .insert(complaint)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Get all complaints for admin panel
  static async getAllComplaints(): Promise<ComplaintRow[]> {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  // Update complaint status
  static async updateComplaint(id: string, updates: ComplaintUpdate): Promise<ComplaintRow> {
    const { data, error } = await supabase
      .from('complaints')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Get complaint by ticket ID
  static async getComplaintByTicket(ticketId: string): Promise<ComplaintRow | null> {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('ticket_id', ticketId)
      .single()
    
    if (error) return null
    return data
  }
}
```

### Phase 3: Real-time Implementation

#### Real-time Subscriptions
```typescript
// hooks/useRealTimeComplaints.ts
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import type { Database } from '../types/database'

type ComplaintRow = Database['public']['Tables']['complaints']['Row']

export function useRealTimeComplaints() {
  const [complaints, setComplaints] = useState<ComplaintRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial fetch
    const fetchComplaints = async () => {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching complaints:', error)
        return
      }
      
      setComplaints(data || [])
      setLoading(false)
    }

    fetchComplaints()

    // Set up real-time subscription
    const subscription = supabase
      .channel('complaints')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'complaints' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setComplaints(prev => [payload.new as ComplaintRow, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setComplaints(prev =>
              prev.map(complaint =>
                complaint.id === payload.new.id
                  ? { ...complaint, ...payload.new }
                  : complaint
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setComplaints(prev =>
              prev.filter(complaint => complaint.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { complaints, loading }
}
```

---

## Configuration & Deployment

### Environment Setup
```bash
# Install dependencies in both projects
cd admin && npm install @supabase/supabase-js
cd ../website && npm install @supabase/supabase-js

# Create environment files
touch admin/.env
touch website/.env
```

### Development Commands
```bash
# Start admin panel
cd admin && npm run dev

# Start website
cd website && npm run dev

# Build for production
cd admin && npm run build
cd website && npm run build
```

### Performance Optimizations

#### Database Indexing
```sql
-- Optimize news queries
CREATE INDEX idx_news_status_published ON news(status, published_at DESC) WHERE status = 'published';
CREATE INDEX idx_news_featured ON news(featured, published_at DESC) WHERE featured = true;

-- Optimize complaint queries
CREATE INDEX idx_complaints_status ON complaints(status, created_at DESC);
CREATE INDEX idx_complaints_ticket ON complaints(ticket_id);
CREATE INDEX idx_complaints_county ON complaints(county);
```

#### Frontend Performance
```typescript
// Implement virtual scrolling for large lists
// Use React.memo for expensive components
// Implement pagination for complaints and news
// Use Intersection Observer for lazy loading
```

---

## Security Implementation

### Authentication Flow
```typescript
// auth/authService.ts
import { supabase } from '../utils/supabase'

export class AuthService {
  static async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
}
```

### Input Validation
```typescript
// utils/validation.ts
import { z } from 'zod'

export const ComplaintSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional(),
  county: z.string().min(1, 'County is required'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  complaint: z.string().min(20, 'Complaint must be at least 20 characters'),
})

export const NewsSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().optional(),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  category: z.enum(['Legal Aid', 'Marriage Law', 'Anti-Corruption', 'Royal Visit', 'Public Notice', 'Press Release']),
  author: z.string().min(2, 'Author name is required'),
})
```

---

## Testing Strategy

### Unit Tests
```typescript
// tests/services/newsService.test.ts
import { NewsService } from '../../services/newsService'
import { supabase } from '../../utils/supabase'

jest.mock('../../utils/supabase')

describe('NewsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch published news', async () => {
    const mockData = [
      { id: '1', title: 'Test News', status: 'published' }
    ]
    
    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: mockData, error: null })
        })
      })
    })

    const result = await NewsService.getPublishedNews()
    expect(result).toEqual(mockData)
  })
})
```

### Integration Tests
```typescript
// tests/integration/complaintFlow.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ComplaintSystem } from '../../components/ComplaintSystem'
import { ComplaintService } from '../../services/complaintService'

jest.mock('../../services/complaintService')

describe('Complaint Flow', () => {
  it('should submit complaint successfully', async () => {
    const mockComplaint = {
      id: '1',
      ticket_id: 'AG001',
      first_name: 'John',
      last_name: 'Doe',
      county: 'Nairobi',
      subject: 'Test Subject',
      complaint: 'Test complaint content',
      status: 'pending'
    }
    
    ;(ComplaintService.submitComplaint as jest.Mock).mockResolvedValue(mockComplaint)
    
    render(<ComplaintSystem />)
    
    // Fill form and submit
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } })
    fireEvent.change(screen.getByLabelText(/county/i), { target: { value: 'Nairobi' } })
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'Test Subject' } })
    fireEvent.change(screen.getByLabelText(/complaint/i), { target: { value: 'Test complaint content' } })
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/AG001/)).toBeInTheDocument()
    })
  })
})
```

---

## Deployment Configuration

### Production Environment
```yaml
# docker-compose.yml
version: '3.8'
services:
  admin:
    build: ./admin
    environment:
      - VITE_SUPABASE_URL=${SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    ports:
      - "3000:3000"
  
  website:
    build: ./website
    environment:
      - VITE_SUPABASE_URL=${SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    ports:
      - "3001:3000"
```

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd admin && npm ci
        cd ../website && npm ci
    
    - name: Build projects
      run: |
        cd admin && npm run build
        cd ../website && npm run build
    
    - name: Deploy to hosting
      run: |
        # Deploy commands here
```

---

## Monitoring & Analytics

### Error Tracking
```typescript
// utils/errorReporting.ts
export class ErrorReporter {
  static reportError(error: Error, context?: any) {
    console.error('Application Error:', error, context)
    
    // Send to error tracking service
    // Sentry, LogRocket, etc.
  }
}
```

### Performance Monitoring
```typescript
// utils/performance.ts
export class PerformanceMonitor {
  static measureTime(name: string) {
    return {
      start: performance.now(),
      end: function() {
        const duration = performance.now() - this.start
        console.log(`${name}: ${duration}ms`)
        return duration
      }
    }
  }
}
``` 