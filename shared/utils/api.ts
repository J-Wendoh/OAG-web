import { supabase, handleSupabaseError, generateTicketId } from './supabase'
import type { 
  Database, 
  NewsRow, 
  ComplaintRow, 
  ActivityLogRow, 
  UserProfileRow,
  HeroSectionRow,
  ComplaintStatusUpdateRow,
  ComplaintAccessRow,
  NewsInsert,
  ComplaintInsert,
  ActivityLogInsert,
  HeroSectionInsert,
  ComplaintStatusUpdateInsert,
  ComplaintFormData,
  NewsFormData,
  HeroSectionFormData,
  ComplaintStatusCheckData,
  ApiResponse,
  PaginatedResponse,
  DashboardStats,
  ComplaintStatusInfo
} from '../types/database'

// News API
export const newsApi = {
  // Get all news with pagination and filters
  async getNews(
    page: number = 1,
    limit: number = 10,
    status?: 'draft' | 'published' | 'archived',
    category?: string,
    featured?: boolean
  ): Promise<PaginatedResponse<NewsRow>> {
    try {
      let query = supabase
        .from('news_articles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      if (category) {
        query = query.eq('category', category)
      }

      if (featured !== undefined) {
        query = query.eq('featured', featured)
      }

      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error, count } = await query.range(from, to)

      if (error) throw error

      return {
        data: data || [],
        count: count || 0,
        page,
        limit,
        hasMore: (count || 0) > page * limit
      }
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Get news by ID
  async getNewsById(id: string): Promise<NewsRow> {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Create news
  async createNews(newsData: NewsFormData): Promise<NewsRow> {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .insert([{
          title: newsData.title,
          excerpt: newsData.excerpt,
          content: newsData.content,
          author: newsData.author,
          category: newsData.category,
          status: newsData.status,
          featured: newsData.featured,
          image_url: newsData.image_url
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Update news
  async updateNews(id: string, newsData: Partial<NewsFormData>): Promise<NewsRow> {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .update(newsData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Delete news
  async deleteNews(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('news_articles')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Increment views
  async incrementViews(id: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_news_views', {
        news_id: id
      })

      if (error) throw error
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Get featured news
  async getFeaturedNews(limit: number = 3): Promise<NewsRow[]> {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Get latest news
  async getLatestNews(limit: number = 5): Promise<NewsRow[]> {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }
}

// Complaints API
export const complaintsApi = {
  // Get all complaints with pagination and filters
  async getComplaints(
    page: number = 1,
    limit: number = 10,
    status?: 'pending' | 'in_progress' | 'resolved' | 'closed',
    priority?: 'low' | 'medium' | 'high' | 'urgent',
    county?: string
  ): Promise<PaginatedResponse<ComplaintRow>> {
    try {
      let query = supabase
        .from('complaints')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      if (priority) {
        query = query.eq('priority', priority)
      }

      if (county) {
        query = query.eq('county', county)
      }

      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error, count } = await query.range(from, to)

      if (error) throw error

      return {
        data: data || [],
        count: count || 0,
        page,
        limit,
        hasMore: (count || 0) > page * limit
      }
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Get complaint by ID
  async getComplaintById(id: string): Promise<ComplaintRow> {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Get complaint by ticket ID
  async getComplaintByTicketId(ticketId: string): Promise<ComplaintRow> {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('ticket_id', ticketId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Create complaint
  async createComplaint(complaintData: ComplaintFormData): Promise<{ complaint: ComplaintRow; accessPassword: string }> {
    try {
      const ticketId = generateTicketId()
      
      const { data, error } = await supabase
        .from('complaints')
        .insert([{
          ticket_id: ticketId,
          first_name: complaintData.firstName,
          last_name: complaintData.lastName,
          id_number: complaintData.idNumber,
          email: complaintData.email,
          county: complaintData.county,
          subject: complaintData.subject,
          complaint: complaintData.complaint,
          status: 'pending',
          priority: 'medium',
          attachment_url: null // Will be set after file upload
        }])
        .select()
        .single()

      if (error) throw error

      // Get the access password that was automatically created
      const { data: accessData, error: accessError } = await supabase
        .from('complaint_access')
        .select('access_password')
        .eq('complaint_id', data.id)
        .single()

      if (accessError) throw accessError

      return {
        complaint: data,
        accessPassword: accessData.access_password
      }
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Update complaint
  async updateComplaint(id: string, updates: Partial<ComplaintRow>): Promise<ComplaintRow> {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Delete complaint
  async deleteComplaint(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('complaints')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Assign complaint to user
  async assignComplaint(id: string, assignedTo: string): Promise<ComplaintRow> {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .update({ assigned_to: assignedTo })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Get complaints by status
  async getComplaintsByStatus(status: string, limit?: number): Promise<ComplaintRow[]> {
    try {
      let query = supabase
        .from('complaints')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Check complaint status with ticket ID and password
  async checkComplaintStatus(checkData: ComplaintStatusCheckData): Promise<ComplaintStatusInfo> {
    try {
      // First, get the complaint by ticket ID
      const { data: complaint, error: complaintError } = await supabase
        .from('complaints')
        .select('*')
        .eq('ticket_id', checkData.ticketId)
        .single()

      if (complaintError) throw complaintError

      // Verify the access password
      const { data: accessData, error: accessError } = await supabase
        .from('complaint_access')
        .select('access_password')
        .eq('complaint_id', complaint.id)
        .eq('access_password', checkData.accessPassword)
        .single()

      if (accessError) throw new Error('Invalid ticket ID or password')

      // Get status updates
      const { data: statusUpdates, error: statusError } = await supabase
        .from('complaint_status_updates')
        .select('*')
        .eq('complaint_id', complaint.id)
        .order('created_at', { ascending: false })

      if (statusError) throw statusError

      return {
        complaint,
        statusUpdates: statusUpdates || [],
        accessPassword: accessData.access_password
      }
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Add status update with message
  async addStatusUpdate(
    complaintId: string,
    statusTo: string,
    message?: string
  ): Promise<ComplaintStatusUpdateRow> {
    try {
      const { data, error } = await supabase
        .from('complaint_status_updates')
        .insert([{
          complaint_id: complaintId,
          status_to: statusTo,
          update_message: message
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }
}

// Hero Sections API
export const heroSectionsApi = {
  // Get active hero section
  async getActiveHeroSection(): Promise<HeroSectionRow | null> {
    try {
      const { data, error } = await supabase
        .from('hero_sections')
        .select('*')
        .eq('is_active', true)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data || null
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Get all hero sections
  async getAllHeroSections(): Promise<HeroSectionRow[]> {
    try {
      const { data, error } = await supabase
        .from('hero_sections')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Create hero section
  async createHeroSection(heroData: HeroSectionFormData): Promise<HeroSectionRow> {
    try {
      // If this is set to active, deactivate all others first
      if (heroData.is_active) {
        await supabase
          .from('hero_sections')
          .update({ is_active: false })
          .eq('is_active', true)
      }

      const { data, error } = await supabase
        .from('hero_sections')
        .insert([heroData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Update hero section
  async updateHeroSection(id: string, updates: Partial<HeroSectionFormData>): Promise<HeroSectionRow> {
    try {
      // If this is set to active, deactivate all others first
      if (updates.is_active) {
        await supabase
          .from('hero_sections')
          .update({ is_active: false })
          .eq('is_active', true)
          .neq('id', id)
      }

      const { data, error } = await supabase
        .from('hero_sections')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Delete hero section
  async deleteHeroSection(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('hero_sections')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Activate hero section
  async activateHeroSection(id: string): Promise<HeroSectionRow> {
    try {
      // Deactivate all others first
      await supabase
        .from('hero_sections')
        .update({ is_active: false })
        .eq('is_active', true)

      // Activate this one
      const { data, error } = await supabase
        .from('hero_sections')
        .update({ is_active: true })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }
}

// Activity Logs API
export const activityApi = {
  // Get activity logs with pagination
  async getActivityLogs(
    page: number = 1,
    limit: number = 20,
    userId?: string,
    action?: string,
    resourceType?: string
  ): Promise<PaginatedResponse<ActivityLogRow>> {
    try {
      let query = supabase
        .from('activity_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (userId) {
        query = query.eq('user_id', userId)
      }

      if (action) {
        query = query.eq('action', action)
      }

      if (resourceType) {
        query = query.eq('resource_type', resourceType)
      }

      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error, count } = await query.range(from, to)

      if (error) throw error

      return {
        data: data || [],
        count: count || 0,
        page,
        limit,
        hasMore: (count || 0) > page * limit
      }
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Log activity
  async logActivity(activityData: Omit<ActivityLogInsert, 'id' | 'created_at'>): Promise<ActivityLogRow> {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .insert([activityData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }
}

// User Profiles API
export const userProfilesApi = {
  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfileRow> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfileRow>): Promise<UserProfileRow> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Get all users (admin only)
  async getAllUsers(): Promise<UserProfileRow[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }
}

// Dashboard API
export const dashboardApi = {
  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [
        newsData,
        complaintsData,
        activityData
      ] = await Promise.all([
        // News statistics
        supabase
          .from('news')
          .select('status'),

        // Complaints statistics
        supabase
          .from('complaints')
          .select('status, priority'),

        // Recent activity
        supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
      ])

      const totalNews = newsData.data?.length || 0
      const publishedNews = newsData.data?.filter((n: any) => n.status === 'published').length || 0
      const totalComplaints = complaintsData.data?.length || 0
      const pendingComplaints = complaintsData.data?.filter((c: any) => c.status === 'pending').length || 0
      const resolvedComplaints = complaintsData.data?.filter((c: any) => c.status === 'resolved').length || 0
      const recentActivity = activityData.data || []

      return {
        totalNews,
        publishedNews,
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        recentActivity
      }
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }
}

// Search API
export const searchApi = {
  // Search news
  async searchNews(query: string, limit: number = 10): Promise<NewsRow[]> {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('status', 'published')
        .or(`title_en.ilike.%${query}%,title_sw.ilike.%${query}%,excerpt_en.ilike.%${query}%,excerpt_sw.ilike.%${query}%,content_en.ilike.%${query}%,content_sw.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Search complaints
  async searchComplaints(query: string, limit: number = 10): Promise<ComplaintRow[]> {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .or(`ticket_id.ilike.%${query}%,subject.ilike.%${query}%,complaint.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }
}

// Export all APIs
export const api = {
  news: newsApi,
  complaints: complaintsApi,
  heroSections: heroSectionsApi,
  activity: activityApi,
  userProfiles: userProfilesApi,
  dashboard: dashboardApi,
  search: searchApi
}

export default api 