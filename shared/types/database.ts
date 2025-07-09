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
          category: 'Legal Aid' | 'Marriage Law' | 'Anti-Corruption' | 'Royal Visit' | 'Public Notice' | 'Press Release'
          status: 'draft' | 'published' | 'archived'
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
          category: 'Legal Aid' | 'Marriage Law' | 'Anti-Corruption' | 'Royal Visit' | 'Public Notice' | 'Press Release'
          status?: 'draft' | 'published' | 'archived'
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
          category?: 'Legal Aid' | 'Marriage Law' | 'Anti-Corruption' | 'Royal Visit' | 'Public Notice' | 'Press Release'
          status?: 'draft' | 'published' | 'archived'
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
          status: 'pending' | 'in_progress' | 'resolved' | 'closed'
          priority: 'low' | 'medium' | 'high' | 'urgent'
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
          status?: 'pending' | 'in_progress' | 'resolved' | 'closed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
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
          status?: 'pending' | 'in_progress' | 'resolved' | 'closed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          attachment_url?: string | null
          assigned_to?: string | null
          resolution_notes?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          details: any | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          resource_type: string
          resource_id?: string | null
          details?: any | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          resource_type?: string
          resource_id?: string | null
          details?: any | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string
          role: 'attorney_general' | 'head_of_communications' | 'complaint_handler'
          department: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          role: 'attorney_general' | 'head_of_communications' | 'complaint_handler'
          department?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          role?: 'attorney_general' | 'head_of_communications' | 'complaint_handler'
          department?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      hero_sections: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          description: string | null
          background_image_url: string | null
          call_to_action_text: string | null
          call_to_action_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          description?: string | null
          background_image_url?: string | null
          call_to_action_text?: string | null
          call_to_action_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          description?: string | null
          background_image_url?: string | null
          call_to_action_text?: string | null
          call_to_action_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      complaint_status_updates: {
        Row: {
          id: string
          complaint_id: string
          status_from: string | null
          status_to: string
          update_message: string | null
          updated_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          complaint_id: string
          status_from?: string | null
          status_to: string
          update_message?: string | null
          updated_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          complaint_id?: string
          status_from?: string | null
          status_to?: string
          update_message?: string | null
          updated_by?: string | null
          created_at?: string
        }
      }
      complaint_access: {
        Row: {
          id: string
          complaint_id: string
          access_password: string
          created_at: string
        }
        Insert: {
          id?: string
          complaint_id: string
          access_password: string
          created_at?: string
        }
        Update: {
          id?: string
          complaint_id?: string
          access_password?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type NewsRow = Database['public']['Tables']['news']['Row']
export type NewsInsert = Database['public']['Tables']['news']['Insert']
export type NewsUpdate = Database['public']['Tables']['news']['Update']

export type ComplaintRow = Database['public']['Tables']['complaints']['Row']
export type ComplaintInsert = Database['public']['Tables']['complaints']['Insert']
export type ComplaintUpdate = Database['public']['Tables']['complaints']['Update']

export type ActivityLogRow = Database['public']['Tables']['activity_logs']['Row']
export type ActivityLogInsert = Database['public']['Tables']['activity_logs']['Insert']
export type ActivityLogUpdate = Database['public']['Tables']['activity_logs']['Update']

export type UserProfileRow = Database['public']['Tables']['user_profiles']['Row']
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

export type HeroSectionRow = Database['public']['Tables']['hero_sections']['Row']
export type HeroSectionInsert = Database['public']['Tables']['hero_sections']['Insert']
export type HeroSectionUpdate = Database['public']['Tables']['hero_sections']['Update']

export type ComplaintStatusUpdateRow = Database['public']['Tables']['complaint_status_updates']['Row']
export type ComplaintStatusUpdateInsert = Database['public']['Tables']['complaint_status_updates']['Insert']
export type ComplaintStatusUpdateUpdate = Database['public']['Tables']['complaint_status_updates']['Update']

export type ComplaintAccessRow = Database['public']['Tables']['complaint_access']['Row']
export type ComplaintAccessInsert = Database['public']['Tables']['complaint_access']['Insert']
export type ComplaintAccessUpdate = Database['public']['Tables']['complaint_access']['Update']

// Form types for frontend
export interface ComplaintFormData {
  firstName: string
  lastName: string
  idNumber?: string
  email?: string
  county: string
  subject: string
  complaint: string
  attachment?: File | null
}

export interface NewsFormData {
  title: string
  excerpt?: string
  content: string
  category: NewsRow['category']
  author: string
  status: NewsRow['status']
  featured: boolean
  image_url?: string
}

export interface HeroSectionFormData {
  title: string
  subtitle?: string
  description?: string
  background_image_url?: string
  call_to_action_text?: string
  call_to_action_url?: string
  is_active: boolean
}

export interface ComplaintStatusCheckData {
  ticketId: string
  accessPassword: string
}

// API response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  hasMore: boolean
}

// Dashboard statistics
export interface DashboardStats {
  totalNews: number
  publishedNews: number
  totalComplaints: number
  pendingComplaints: number
  resolvedComplaints: number
  recentActivity: ActivityLogRow[]
}

// Complaint status tracking
export interface ComplaintStatusInfo {
  complaint: ComplaintRow
  statusUpdates: ComplaintStatusUpdateRow[]
  accessPassword: string
}

// News categories with display names
export const NEWS_CATEGORIES = {
  'Legal Aid': 'Legal Aid',
  'Marriage Law': 'Marriage Law',
  'Anti-Corruption': 'Anti-Corruption',
  'Royal Visit': 'Royal Visit',
  'Public Notice': 'Public Notice',
  'Press Release': 'Press Release'
} as const

// Complaint statuses with display names and colors
export const COMPLAINT_STATUSES = {
  pending: { label: 'Pending', color: 'yellow' },
  in_progress: { label: 'In Progress', color: 'blue' },
  resolved: { label: 'Resolved', color: 'green' },
  closed: { label: 'Closed', color: 'gray' }
} as const

// Complaint priorities with display names and colors
export const COMPLAINT_PRIORITIES = {
  low: { label: 'Low', color: 'green' },
  medium: { label: 'Medium', color: 'yellow' },
  high: { label: 'High', color: 'orange' },
  urgent: { label: 'Urgent', color: 'red' }
} as const

// User roles with display names
export const USER_ROLES = {
  attorney_general: 'Attorney General',
  head_of_communications: 'Head of Communications',
  complaint_handler: 'Complaint Handler'
} as const

// Kenyan counties list
export const KENYAN_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
  'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
  'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
] as const

// Complaint subjects
export const COMPLAINT_SUBJECTS = [
  'Marriage Services',
  'Legal Aid Request',
  'Constitutional Rights',
  'Government Services',
  'Corruption Report',
  'Legal Consultation',
  'Document Issues',
  'Other'
] as const 